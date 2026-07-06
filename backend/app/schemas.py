from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)


class SourceItem(BaseModel):
    filename: str
    chunk_index: int
    score: float
    excerpt: str


class ChatResponse(BaseModel):
    query: str
    answer: str
    disclaimer: str
    sources: list[SourceItem]


class HealthResponse(BaseModel):
    status: str
    embedding_model: str
    llm_model: str
    index_name: str
