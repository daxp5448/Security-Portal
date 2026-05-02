from app.core.config import settings
from .base import AIProvider
from .mock_provider import MockAIProvider
from .openai_provider import OpenAIProvider
from .gemini_provider import GeminiProvider

def get_ai_provider() -> AIProvider:
    if settings.OPENAI_API_KEY:
        return OpenAIProvider()
    elif settings.GEMINI_API_KEY:
        return GeminiProvider()
    return MockAIProvider()
