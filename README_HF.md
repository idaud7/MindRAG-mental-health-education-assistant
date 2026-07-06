---
title: MindRAG API
emoji: 🧠
colorFrom: cyan
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
---

FastAPI backend for the MindRAG mental health education assistant.

Set these secrets in **Settings → Repository secrets**:
- `PINECONE_API_KEY`
- `PINECONE_INDEX_NAME` (`e5`)
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (`gemini-2.5-flash`)
- `EMBEDDING_MODEL` (`intfloat/multilingual-e5-large-instruct`)
- `CORS_ORIGINS` (your Vercel URL)
