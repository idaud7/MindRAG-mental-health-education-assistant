from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
import torch

from app.config import settings

pc = Pinecone(api_key=settings.pinecone_api_key)
idx = pc.Index(settings.pinecone_index_name)
stats = idx.describe_index_stats()
print("index:", settings.pinecone_index_name)
print("total_vectors:", stats.get("total_vector_count", 0))

device = "cuda" if torch.cuda.is_available() else "cpu"
model = SentenceTransformer(settings.embedding_model, device=device)
for query in [
    "How does sleep affect mental health?",
    "Perché la salute mentale è importante per le politiche sanitarie?",
    "What is anxiety?",
]:
    vec = model.encode("query: " + query).tolist()
    res = idx.query(vector=vec, top_k=5, include_metadata=True)
    matches = res.get("matches", [])
    above = sum(1 for m in matches if m.get("score", 0) >= 0.75)
    top = matches[0].get("score", 0) if matches else 0
    print(f"\nquery: {query[:60]}...")
    print(f"  top_score={top:.4f}, above_0.75={above}/5")
