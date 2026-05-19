from fastapi import APIRouter, File, Form, UploadFile

from backend.models.schemas import SpeechToTextResponse
from backend.services.speech_service import transcribe_audio

router = APIRouter(tags=["speech"])


@router.post("/speech-to-text", response_model=SpeechToTextResponse)
async def speech_to_text(file: UploadFile = File(...), language: str = Form("auto")):
    result = await transcribe_audio(file, language)
    return SpeechToTextResponse(
        text=result.get("text", ""),
        detected_language=result.get("detected_language", "unknown"),
        duration=result.get("duration"),
    )
