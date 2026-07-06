---
title: MindRAG Backend
emoji: 🧠
colorFrom: cyan
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
license: mit
---

# MindRAG RAG API

FastAPI backend for the MindRAG mental health chatbot.

Set these secrets in the Space settings:
- `PINECONE_API_KEY`
- `PINECONE_INDEX_NAME`
- `GEMINI_API_KEY`
- `EMBEDDING_MODEL`
- `GEMINI_MODEL`
- `CORS_ORIGINS` (your frontend URL)
