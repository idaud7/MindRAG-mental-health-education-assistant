from dataclasses import dataclass

import torch
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer

from app.config import settings


@dataclass
class RetrievedChunk:
    text: str
    score: float
    filename: str
    chunk_index: int


class Retriever:
    def __init__(self) -> None:
        if not settings.pinecone_api_key:
            raise ValueError("PINECONE_API_KEY is not set")

        device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = SentenceTransformer(settings.embedding_model, device=device)
        pc = Pinecone(api_key=settings.pinecone_api_key)
        self.index = pc.Index(settings.pinecone_index_name)

    def embed_query(self, query: str) -> list[float]:
        prefixed = f"query: {query}"
        return self.model.encode(prefixed).tolist()

    def retrieve(
        self,
        query: str,
        top_k: int | None = None,
        min_score: float | None = None,
    ) -> list[RetrievedChunk]:
        top_k = top_k or settings.rag_top_k
        min_score = min_score if min_score is not None else settings.rag_min_score

        response = self.index.query(
            vector=self.embed_query(query),
            top_k=top_k,
            include_metadata=True,
        )

        chunks: list[RetrievedChunk] = []
        for match in response.get("matches", []):
            score = match.get("score", 0.0)
            if score < min_score:
                continue

            metadata = match.get("metadata") or {}
            text = metadata.get("full_text") or metadata.get("text") or ""
            if not text:
                continue

            chunks.append(
                RetrievedChunk(
                    text=text,
                    score=score,
                    filename=str(metadata.get("filename", "unknown")),
                    chunk_index=int(metadata.get("chunk_index", 0)),
                )
            )

        # Fallback: if threshold filters everything out, use top matches anyway.
        if not chunks:
            for match in response.get("matches", [])[:3]:
                metadata = match.get("metadata") or {}
                text = metadata.get("full_text") or metadata.get("text") or ""
                if not text:
                    continue
                chunks.append(
                    RetrievedChunk(
                        text=text,
                        score=float(match.get("score", 0.0)),
                        filename=str(metadata.get("filename", "unknown")),
                        chunk_index=int(metadata.get("chunk_index", 0)),
                    )
                )

        return chunks
