from typing import Literal, Optional

from pydantic import BaseModel, Field


class ChatTurn(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2500)
    language: str = Field(default="en", pattern="^(en|hi|te|ta|kn|ml|mr|bn|gu|pa|ur|or|as)$")
    conversation_id: str = Field(default="default", max_length=120)
    history: list[ChatTurn] = Field(default_factory=list, max_length=20)


class ChatResponse(BaseModel):
    response: str
    detected_language: str
    language: str
    provider: str
    sources: list[str] = Field(default_factory=list)


class TranslateRequest(BaseModel):
    text: str = Field(min_length=1, max_length=4000)
    source: Optional[str] = "auto"
    target: str = Field(default="en", pattern="^(en|hi|te|ta|kn|ml|mr|bn|gu|pa|ur|or|as)$")


class TranslateResponse(BaseModel):
    translated_text: str
    source: str
    target: str


class SpeechToTextResponse(BaseModel):
    text: str
    detected_language: str
    duration: Optional[float] = None
