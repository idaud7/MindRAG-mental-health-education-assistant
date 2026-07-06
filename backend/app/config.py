from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = ROOT_DIR / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    pinecone_api_key: str = ""
    pinecone_index_name: str = "e5"
    embedding_model: str = "intfloat/multilingual-e5-large-instruct"

    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"

    rag_top_k: int = 10
    rag_min_score: float = 0.65
    rag_max_context_words: int = 600

    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
