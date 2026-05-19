from pathlib import Path
from functools import lru_cache

from fastapi import UploadFile

from backend.utils.config import settings


@lru_cache(maxsize=1)
def _whisper_model():
    from faster_whisper import WhisperModel

    return WhisperModel(settings.whisper_model, device="cpu", compute_type="int8")


async def transcribe_audio(file: UploadFile, language: str | None = None) -> dict:
    audio_dir = Path("backend/audio")
    audio_dir.mkdir(parents=True, exist_ok=True)
    file_path = audio_dir / f"upload_{file.filename or 'audio.webm'}"
    file_path.write_bytes(await file.read())

    try:
        model = _whisper_model()
        segments, info = model.transcribe(str(file_path), language=None if language == "auto" else language)
        text = " ".join(segment.text.strip() for segment in segments).strip()
        return {
            "text": text,
            "detected_language": getattr(info, "language", language or "unknown"),
            "duration": getattr(info, "duration", None),
        }
    except Exception as exc:
        return {
            "text": "",
            "detected_language": language or "unknown",
            "duration": None,
            "error": f"Speech model unavailable: {exc}",
        }
