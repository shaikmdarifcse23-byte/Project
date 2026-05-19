from __future__ import annotations

import re
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path


KNOWLEDGE_DIR = Path("backend/knowledge")
SUPPORTED_EXTENSIONS = {".md", ".txt", ".pdf", ".docx"}
STOP_WORDS = {
    "a",
    "an",
    "and",
    "are",
    "for",
    "from",
    "how",
    "is",
    "me",
    "of",
    "or",
    "the",
    "to",
    "what",
    "which",
    "with",
}


@dataclass(frozen=True)
class DocumentChunk:
    source: str
    title: str
    text: str


def _read_pdf(path: Path) -> str:
    try:
        from pypdf import PdfReader

        reader = PdfReader(str(path))
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    except Exception:
        return ""


def _read_docx(path: Path) -> str:
    try:
        from docx import Document

        document = Document(str(path))
        return "\n".join(paragraph.text for paragraph in document.paragraphs)
    except Exception:
        return ""


def _read_document(path: Path) -> str:
    if path.suffix.lower() in {".md", ".txt"}:
        return path.read_text(encoding="utf-8", errors="ignore")
    if path.suffix.lower() == ".pdf":
        return _read_pdf(path)
    if path.suffix.lower() == ".docx":
        return _read_docx(path)
    return ""


def _chunk_text(source: str, text: str) -> list[DocumentChunk]:
    sections = re.split(r"\n(?=#{1,3}\s)", text)
    chunks: list[DocumentChunk] = []

    for section in sections:
        clean = section.strip()
        if not clean:
            continue
        heading_match = re.match(r"#{1,3}\s+(.+)", clean)
        title = heading_match.group(1).strip() if heading_match else source
        if len(clean) > 1800:
            paragraphs = [item.strip() for item in clean.split("\n\n") if item.strip()]
            buffer = ""
            for paragraph in paragraphs:
                if len(buffer) + len(paragraph) > 1600 and buffer:
                    chunks.append(DocumentChunk(source=source, title=title, text=buffer.strip()))
                    buffer = ""
                buffer += f"\n\n{paragraph}"
            if buffer:
                chunks.append(DocumentChunk(source=source, title=title, text=buffer.strip()))
        else:
            chunks.append(DocumentChunk(source=source, title=title, text=clean))

    return chunks


def _tokens(text: str) -> set[str]:
    words = re.findall(r"[a-zA-Z0-9]+", text.lower())
    return {word for word in words if len(word) > 2 and word not in STOP_WORDS}


@lru_cache(maxsize=1)
def load_document_chunks() -> list[DocumentChunk]:
    KNOWLEDGE_DIR.mkdir(parents=True, exist_ok=True)
    chunks: list[DocumentChunk] = []
    for path in sorted(KNOWLEDGE_DIR.iterdir()):
        if path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue
        text = _read_document(path)
        chunks.extend(_chunk_text(path.name, text))
    return chunks


def retrieve_document_context(query: str, limit: int = 4) -> tuple[str, list[str]]:
    query_tokens = _tokens(query)
    if not query_tokens:
        return "", []

    scored: list[tuple[int, DocumentChunk]] = []
    for chunk in load_document_chunks():
        score = len(query_tokens.intersection(_tokens(chunk.text + " " + chunk.title)))
        if score:
            scored.append((score, chunk))

    scored.sort(key=lambda item: item[0], reverse=True)
    selected = [chunk for _, chunk in scored[:limit]]
    context = "\n\n".join(f"Source: {chunk.source} - {chunk.title}\n{chunk.text}" for chunk in selected)
    sources = [f"{chunk.source}: {chunk.title}" for chunk in selected]
    return context, sources
