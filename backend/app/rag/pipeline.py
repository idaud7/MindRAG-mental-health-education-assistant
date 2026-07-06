from app.rag.generator import Generator
from app.rag.prompts import DISCLAIMER
from app.rag.retriever import Retriever, RetrievedChunk


class RAGPipeline:
    def __init__(self) -> None:
        self.retriever = Retriever()
        self.generator = Generator()

    def ask(self, query: str) -> dict:
        chunks = self.retriever.retrieve(query)
        answer = self.generator.generate(query, [chunk.text for chunk in chunks])

        return {
            "query": query,
            "answer": answer,
            "disclaimer": DISCLAIMER,
            "sources": [
                {
                    "filename": chunk.filename,
                    "chunk_index": chunk.chunk_index,
                    "score": round(chunk.score, 4),
                    "excerpt": chunk.text[:280] + ("..." if len(chunk.text) > 280 else ""),
                }
                for chunk in chunks
            ],
        }
