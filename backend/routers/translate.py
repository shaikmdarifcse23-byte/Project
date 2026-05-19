from fastapi import APIRouter

from backend.models.schemas import TranslateRequest, TranslateResponse
from backend.services.translation_service import detect_language, translate_text

router = APIRouter(tags=["translate"])


@router.post("/translate", response_model=TranslateResponse)
async def translate(request: TranslateRequest):
    source = detect_language(request.text) if request.source == "auto" else request.source
    translated = translate_text(request.text, target=request.target, source=source)
    return TranslateResponse(translated_text=translated, source=source or "auto", target=request.target)
