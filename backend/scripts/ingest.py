"""PDF ingestion pipeline: chunk, embed with E5, upsert to Pinecone."""

import argparse
import os
import uuid

import nltk
import torch
from pinecone import Pinecone, ServerlessSpec
from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

nltk.download("punkt", quiet=True)
nltk.download("punkt_tab", quiet=True)


def load_settings():
    from pathlib import Path

    from dotenv import load_dotenv

    root = Path(__file__).resolve().parents[2]
    load_dotenv(root / ".env")
    return {
        "api_key": os.getenv("PINECONE_API_KEY", ""),
        "index_name": os.getenv("PINECONE_INDEX_NAME", "e5"),
        "embedding_model": os.getenv("EMBEDDING_MODEL", "intfloat/multilingual-e5-large-instruct"),
    }


def extract_text_from_pdf(pdf_path: str) -> str:
    text = ""
    with open(pdf_path, "rb") as file:
        reader = PdfReader(file)
        for page in reader.pages:
            page_text = page.extract_text() or ""
            text += page_text + "\n"
    return text.strip()


def chunk_fixed_length(text: str, chunk_size: int = 1000, chunk_overlap: int = 100) -> list[str]:
    if len(text) <= chunk_size:
        return [text]

    chunks: list[str] = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        if end >= len(text):
            chunks.append(text[start:])
            break

        while end > start + chunk_size - 100 and end < len(text) and text[end] != " ":
            end -= 1
        if end == start + chunk_size - 100:
            end = start + chunk_size

        chunks.append(text[start:end])
        start = end - chunk_overlap

    return chunks


def setup_pinecone_index(api_key: str, index_name: str, dimension: int):
    pc = Pinecone(api_key=api_key)
    if not pc.has_index(name=index_name):
        pc.create_index(
            name=index_name,
            dimension=dimension,
            metric="dotproduct",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )
        print(f"Created Pinecone index: {index_name}")
    else:
        print(f"Using existing Pinecone index: {index_name}")

    return pc.Index(name=index_name)


def ingest_pdfs(pdf_dir: str, index, model: SentenceTransformer, chunk_size: int = 1000) -> None:
    pdf_files = [f for f in os.listdir(pdf_dir) if f.lower().endswith(".pdf")]
    if not pdf_files:
        print(f"No PDF files found in {pdf_dir}")
        return

    batch: list[dict] = []
    batch_size = 100

    for pdf_file in pdf_files:
        pdf_path = os.path.join(pdf_dir, pdf_file)
        print(f"Processing {pdf_file}...")
        text = extract_text_from_pdf(pdf_path)
        if not text:
            print(f"Skipping {pdf_file} - no text extracted")
            continue

        chunks = chunk_fixed_length(text, chunk_size=chunk_size)
        print(f"Split {pdf_file} into {len(chunks)} chunks")

        for i, chunk in enumerate(tqdm(chunks, desc=f"Embedding {pdf_file}")):
            embedding = model.encode(f"passage: {chunk}").tolist()
            batch.append(
                {
                    "id": f"{pdf_file.replace('.pdf', '')}_{i}_{uuid.uuid4()}",
                    "values": embedding,
                    "metadata": {
                        "filename": pdf_file,
                        "chunk_index": i,
                        "text": chunk[:1000],
                        "full_text": chunk,
                    },
                }
            )

            if len(batch) >= batch_size:
                index.upsert(vectors=batch)
                batch = []

    if batch:
        index.upsert(vectors=batch)

    stats = index.describe_index_stats()
    print(f"Total vectors in index: {stats.get('total_vector_count', 0)}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Ingest PDFs into Pinecone for RAG")
    parser.add_argument("--pdf_dir", type=str, required=True, help="Directory with PDF files")
    parser.add_argument("--chunk_size", type=int, default=1000)
    args = parser.parse_args()

    cfg = load_settings()
    if not cfg["api_key"]:
        raise SystemExit("PINECONE_API_KEY is not set")

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")

    model = SentenceTransformer(cfg["embedding_model"], device=device)
    dimension = model.get_sentence_embedding_dimension()
    index = setup_pinecone_index(cfg["api_key"], cfg["index_name"], dimension)

    ingest_pdfs(args.pdf_dir, index, model, chunk_size=args.chunk_size)


if __name__ == "__main__":
    main()
