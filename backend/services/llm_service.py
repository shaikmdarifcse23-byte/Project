import re
from functools import lru_cache
from typing import Iterable

from backend.models.schemas import ChatTurn
from backend.services.banking_knowledge import SYSTEM_PROMPT, fallback_answer, retrieve_banking_context
from backend.services.document_retrieval_service import retrieve_document_context
from backend.utils.config import settings


@lru_cache(maxsize=1)
def _openai_client():
    from openai import AsyncOpenAI

    return AsyncOpenAI(api_key=settings.openai_api_key, timeout=20)


@lru_cache(maxsize=1)
def _openrouter_client():
    from openai import AsyncOpenAI

    return AsyncOpenAI(
        api_key=settings.openrouter_api_key,
        base_url="https://openrouter.ai/api/v1",
        default_headers={
            "HTTP-Referer": settings.openrouter_site_url,
            "X-Title": settings.openrouter_app_name,
        },
        timeout=20,
    )


@lru_cache(maxsize=1)
def _groq_client():
    from groq import AsyncGroq

    return AsyncGroq(api_key=settings.groq_api_key, timeout=20)


def _messages(message: str, history: list[ChatTurn], document_context: str = "") -> list[dict[str, str]]:
    context = retrieve_banking_context(message)
    prompt = (
        f"{SYSTEM_PROMPT}\n\n"
        "Use the retrieved banking documents first when they are relevant. "
        "If the documents do not contain the answer, say what general banking guidance applies and recommend official bank confirmation. "
        "Do not mention internal filenames, source labels, markdown file names, or where the data was retrieved from in the final answer.\n\n"
        f"Banking FAQ context:\n{context}"
    )
    if document_context:
        prompt += f"\n\nRetrieved document context:\n{document_context}"
    messages = [{"role": "system", "content": prompt}]
    messages.extend({"role": turn.role, "content": turn.content} for turn in history[-8:] if turn.role != "system")
    messages.append({"role": "user", "content": message})
    return messages


def _public_document_text(document_context: str) -> str:
    without_sources = re.sub(r"(?m)^Source: .+\n", "", document_context)
    without_headings = re.sub(r"(?m)^#{1,3}\s*", "", without_sources)
    return without_headings.strip()


async def generate_banking_response(message: str, history: list[ChatTurn]) -> tuple[str, str, list[str]]:
    provider = settings.llm_provider.lower()
    document_context, sources = retrieve_document_context(message)

    if provider == "openai" and settings.openai_api_key:
        try:
            client = _openai_client()
            completion = await client.chat.completions.create(
                model=settings.llm_model,
                messages=_messages(message, history, document_context),
                temperature=0.3,
            )
            return completion.choices[0].message.content or fallback_answer(message), "openai", sources
        except Exception as exc:
            return f"{fallback_answer(message)}\n\nLLM note: OpenAI request failed, so I used local document guidance. Error: {exc}", "fallback", sources

    if provider == "openrouter" and settings.openrouter_api_key:
        try:
            client = _openrouter_client()
            completion = await client.chat.completions.create(
                model=settings.openrouter_model,
                messages=_messages(message, history, document_context),
                temperature=0.25,
            )
            return completion.choices[0].message.content or fallback_answer(message), "openrouter", sources
        except Exception as exc:
            return f"{fallback_answer(message)}\n\nLLM note: OpenRouter request failed, so I used local document guidance. Error: {exc}", "fallback", sources

    if provider == "groq" and settings.groq_api_key:
        try:
            client = _groq_client()
            completion = await client.chat.completions.create(
                model=settings.groq_model,
                messages=_messages(message, history, document_context),
                temperature=0.3,
            )
            return completion.choices[0].message.content or fallback_answer(message), "groq", sources
        except Exception as exc:
            return f"{fallback_answer(message)}\n\nLLM note: Groq request failed, so I used local document guidance. Error: {exc}", "fallback", sources

    answer = fallback_answer(message)
    if document_context:
        public_context = _public_document_text(document_context)
        answer = (
            "Based on the banking documents I found:\n\n"
            f"{public_context[:1800]}\n\n"
            "Recommended next step: confirm the final checklist with your bank's official app, website, branch, or verified helpline."
        )
    return answer, "fallback", sources


async def stream_tokens(text: str) -> Iterable[str]:
    words = text.split(" ")
    for index, word in enumerate(words):
        yield word if index == 0 else f" {word}"
