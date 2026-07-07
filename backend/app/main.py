import asyncio
import threading
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.rag.pipeline import RAGPipeline
from app.schemas import ChatRequest, ChatResponse, HealthResponse

pipeline: RAGPipeline | None = None
_pipeline_lock = threading.Lock()
_pipeline_ready = False


def get_pipeline() -> RAGPipeline:
    global pipeline, _pipeline_ready
    if pipeline is None:
        with _pipeline_lock:
            if pipeline is None:
                pipeline = RAGPipeline()
                _pipeline_ready = True
    return pipeline


async def warm_up_pipeline() -> None:
    try:
        await asyncio.to_thread(get_pipeline)
    except Exception as exc:
        print(f"Background model warm-up failed: {exc}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(warm_up_pipeline())
    yield
    task.cancel()


app = FastAPI(
    title="Mental Health RAG API",
    description="Retrieval-augmented generation API for multilingual mental health education.",
    version="1.0.0",
    lifespan=lifespan,
)

_cors_origins = settings.cors_origin_list
_allow_all = _cors_origins == ["*"] or "*" in _cors_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if _allow_all else _cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

@app.get("/")
async def root():
    return {
        "message": "MindRAG API is running",
        "health": "/health",
        "ready": "/ready",
        "docs": "/docs",
        "chat": "POST /chat",
    }


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        embedding_model=settings.embedding_model,
        llm_model=settings.gemini_model,
        index_name=settings.pinecone_index_name,
    )


@app.get("/ready")
async def ready():
    return {"ready": _pipeline_ready or pipeline is not None}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    try:
        active_pipeline = await asyncio.to_thread(get_pipeline)
        result = await asyncio.to_thread(active_pipeline.ask, request.query.strip())
        return ChatResponse(**result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
