from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
import torch

from app.config import settings

CANDIDATE_PROMPTS = [
    "Can mental health problems affect physical health?",
    "How does social media affect teenage mental health?",
    "How does sleep affect mental health?",
    "Why is mental health important for public health policy?",
    "Perché la salute mentale è importante per le politiche sanitarie?",
    "What is the link between depression and physical illness?",
    "How can communities support mental health?",
    "What are common myths about mental illness?",
]

pc = Pinecone(api_key=settings.pinecone_api_key)
idx = pc.Index(settings.pinecone_index_name)
device = "cuda" if torch.cuda.is_available() else "cpu"
model = SentenceTransformer(settings.embedding_model, device=device)

print("index:", settings.pinecone_index_name)
print("total_vectors:", idx.describe_index_stats().get("total_vector_count", 0))
print()

for query in CANDIDATE_PROMPTS:
    vec = model.encode("query: " + query).tolist()
    res = idx.query(vector=vec, top_k=3, include_metadata=True)
    matches = res.get("matches", [])
    top = matches[0].get("score", 0) if matches else 0
    above = sum(1 for m in matches if m.get("score", 0) >= 0.65)
    status = "GOOD" if top >= 0.78 and above >= 2 else "WEAK" if top >= 0.65 else "SKIP"
    print(f"[{status}] top={top:.3f} | {query}")
