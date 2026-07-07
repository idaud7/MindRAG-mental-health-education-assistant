---
title: MindRAG
emoji: 🧠
colorFrom: cyan
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
short_description: Mental health education assistant API
---

# MindRAG

Professional mental health education assistant with multilingual support (English & Italian).

MindRAG helps users access reliable mental health information through a secure chat interface, with answers grounded in verified documents and responsible AI safety guardrails.

## Features

- Multilingual chat (English & Italian)
- Document-grounded answers via retrieval-augmented generation
- Crisis detection and helpline signposting
- Privacy-first: chat history stored locally in the browser
- Professional web interface built with Next.js

## Project structure

```text
mindrag/
├── backend/          # FastAPI RAG API
├── frontend/         # Next.js web application
├── data/             # PDF source documents (not committed)
├── notebooks/        # Research notebooks
└── .env.example      # Environment template
```

## Local development

### 1. Configure environment

```bash
cp .env.example .env
```

Set `PINECONE_API_KEY`, `GEMINI_API_KEY`, and other values in `.env`.

### 2. Install dependencies

```bash
# Backend
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cd ..

# Frontend + root
cd frontend && npm install && cd ..
npm install
```

### 3. Run

```bash
npm run dev
```

- Web app: http://localhost:3000
- API: http://127.0.0.1:8000

## Deployment

### Frontend (Vercel)

1. Push this repository to GitHub
2. Import the repo on [Vercel](https://vercel.com) (sign in with GitHub)
3. Set **Root Directory** to `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url`
5. Deploy

### Backend (Hugging Face Spaces)

1. Create a **Docker Space** on [Hugging Face](https://huggingface.co/spaces)
2. Connect this GitHub repository
3. Uses the root `Dockerfile`
4. Add secrets from `.env.example`
5. Set `CORS_ORIGINS` to your Vercel frontend URL

## Safety notice

MindRAG is for **educational purposes only**. It is not medical advice and must not be used for diagnosis, treatment, or emergency mental health support.

## Verifying suggested prompts

Before adding new default questions, verify retrieval quality:

```bash
cd backend
$env:PYTHONPATH="."
python scripts/test_prompts.py
```

Only prompts marked `GOOD` should be added to `frontend/lib/suggested-prompts.ts`.
