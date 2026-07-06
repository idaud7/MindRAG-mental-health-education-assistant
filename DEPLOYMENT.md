# Deployment Checklist

## Before pushing to GitHub

- [ ] Confirm `.env` is **not** tracked (check with `git status`)
- [ ] Rotate any API keys that were ever shared or committed
- [ ] Update `NEXT_PUBLIC_API_URL` in production environment
- [ ] Test chat with all suggested questions on `frontend/lib/suggested-prompts.ts`

## GitHub

```bash
git init
git add .
git commit -m "MindRAG: mental health education assistant"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mindrag.git
git push -u origin main
```

## Vercel (frontend)

1. Sign in at [vercel.com](https://vercel.com) with GitHub
2. Import repository
3. Root directory: `frontend`
4. Environment variable:
   - `NEXT_PUBLIC_API_URL` = your Hugging Face Space URL
5. Deploy

## Hugging Face Spaces (backend)

1. Create new **Docker** Space
2. Connect GitHub repo
3. Add secrets:
   - `PINECONE_API_KEY`
   - `PINECONE_INDEX_NAME`
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL`
   - `EMBEDDING_MODEL`
   - `CORS_ORIGINS` (your Vercel URL, e.g. `https://mindrag.vercel.app`)
4. Wait for build to complete
5. Test: `https://YOUR-SPACE.hf.space/health`

## After deployment

1. Open live site and test all 4 suggested questions
2. Confirm crisis banner and safety page are visible
3. Add live URL to your GitHub profile or client materials
