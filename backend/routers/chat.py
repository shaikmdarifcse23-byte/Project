import asyncio

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from backend.models.schemas import ChatRequest, ChatResponse
from backend.services.llm_service import generate_banking_response, stream_tokens
from backend.services.translation_service import detect_language, translate_text

router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    detected = detect_language(request.message, fallback=request.language)
    response_language = request.language if request.language != "en" else detected
    internal_message = translate_text(request.message, target="en", source=detected) if detected != "en" else request.message
    answer, provider, sources = await generate_banking_response(internal_message, request.history)
    localized = translate_text(answer, target=response_language, source="en") if response_language != "en" else answer
    return ChatResponse(response=localized, detected_language=detected, language=response_language, provider=provider, sources=sources)


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    detected = detect_language(request.message, fallback=request.language)
    response_language = request.language if request.language != "en" else detected
    internal_message = translate_text(request.message, target="en", source=detected) if detected != "en" else request.message
    answer, _provider, _sources = await generate_banking_response(internal_message, request.history)
    localized = translate_text(answer, target=response_language, source="en") if response_language != "en" else answer

    async def event_stream():
      async for token in stream_tokens(localized):
          yield token
          await asyncio.sleep(0.018)

    return StreamingResponse(event_stream(), media_type="text/plain")
