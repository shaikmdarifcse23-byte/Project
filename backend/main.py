from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers.chat import router as chat_router
from backend.routers.speech import router as speech_router
from backend.routers.translate import router as translate_router
from backend.utils.config import settings

app = FastAPI(
    title="FinAssist AI Banking Assistant",
    version="1.0.0",
    description="AI multilingual banking assistant with chat, translation, and speech-to-text APIs.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1):\d+$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")
app.include_router(speech_router, prefix="/api")
app.include_router(translate_router, prefix="/api")


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "finassist-ai", "provider": settings.llm_provider}
