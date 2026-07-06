import google.generativeai as genai

from app.config import settings
from app.rag.prompts import CRISIS_KEYWORDS, CRISIS_RESPONSE, NO_CONTEXT_PROMPT, SYSTEM_PROMPT


def _validate_gemini_api_key(api_key: str) -> None:
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set")
    if api_key.startswith("AQ."):
        raise ValueError(
            "GEMINI_API_KEY looks like an OAuth/access token (starts with AQ.), not a Gemini API key. "
            "Create a key at https://aistudio.google.com/apikey — it should start with AIza."
        )
    if not api_key.startswith("AIza"):
        raise ValueError(
            "GEMINI_API_KEY does not look valid. Get a key from https://aistudio.google.com/apikey "
            "(it should start with AIza)."
        )


class Generator:
    def __init__(self) -> None:
        _validate_gemini_api_key(settings.gemini_api_key)
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel(settings.gemini_model)

    @staticmethod
    def is_crisis_query(query: str) -> bool:
        lowered = query.lower()
        return any(keyword in lowered for keyword in CRISIS_KEYWORDS)

    @staticmethod
    def build_context(chunks: list[str], max_words: int) -> str:
        context_parts: list[str] = []
        word_count = 0

        for chunk in chunks:
            chunk_words = len(chunk.split())
            if word_count + chunk_words > max_words:
                break
            context_parts.append(chunk)
            word_count += chunk_words

        return "\n\n".join(context_parts)

    def generate(self, query: str, context_chunks: list[str]) -> str:
        if self.is_crisis_query(query):
            return CRISIS_RESPONSE

        context = self.build_context(context_chunks, settings.rag_max_context_words)

        if context:
            prompt = (
                f"{SYSTEM_PROMPT}\n\n"
                f"Question: {query}\n\n"
                f"Context:\n{context}\n\n"
                "Answer:"
            )
        else:
            prompt = (
                f"{NO_CONTEXT_PROMPT}\n\n"
                f"Question: {query}\n\n"
                "Answer:"
            )

        response = self.model.generate_content(prompt)
        return (response.text or "").strip()
