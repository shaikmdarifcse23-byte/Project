from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    openai_api_key: str = ""
    groq_api_key: str = ""
    openrouter_api_key: str = ""
    llm_provider: str = "fallback"
    llm_model: str = "gpt-4o-mini"
    groq_model: str = "llama-3.1-8b-instant"
    openrouter_model: str = "meta-llama/llama-3.1-8b-instruct"
    openrouter_site_url: str = "http://127.0.0.1:5173"
    openrouter_app_name: str = "FinAssist AI"
    frontend_origin: str = "http://127.0.0.1:5173"
    whisper_model: str = "base"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def allowed_origins(self) -> List[str]:
        return [self.frontend_origin, "http://localhost:5173", "http://127.0.0.1:5173"]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
