# FinAssist AI - Multilingual Banking Assistant

A full-stack AI banking chatbot built with React, Tailwind CSS, Framer Motion, and FastAPI. It supports text chat, browser voice input, audio upload transcription, multilingual responses, streaming answers, chat history, quick banking workflows, and a production-style fintech dashboard UI.

## Features

- ChatGPT-style banking assistant for loans, KYC, ATM/card issues, fraud awareness, account opening, insurance, savings, and FAQs
- English, Hindi, Telugu, and Tamil language selection
- Streaming `/chat/stream` responses with `/chat` fallback
- Browser microphone recording with live Web Speech API transcription
- Audio upload endpoint backed by Faster-Whisper
- Translation layer with language detection
- OpenAI or Groq integration through environment variables
- Rule-based banking fallback so the demo works without paid API keys
- Responsive premium fintech UI with dark/light mode, sidebar, quick actions, toasts, and local chat history

## Project Structure

```text
backend/
  main.py
  routers/
  services/
  models/
  utils/
  audio/
  vectorstore/
frontend/
  src/
    components/
    components/ui/
    hooks/
    pages/
    services/
    utils/
    assets/
```

## Setup

1. Install frontend dependencies:

```bash
npm install
```

2. Create and activate a Python virtual environment, then install backend dependencies:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

3. Copy environment values:

```bash
copy .env.example .env
```

Set `LLM_PROVIDER=openrouter` with `OPENROUTER_API_KEY`, `LLM_PROVIDER=openai` with `OPENAI_API_KEY`, or `LLM_PROVIDER=groq` with `GROQ_API_KEY`. Leave `LLM_PROVIDER=fallback` for an offline demo response engine.

Banking knowledge is retrieved from files in `backend/knowledge`. Add `.md`, `.txt`, `.pdf`, or `.docx` files there and restart the API. The included `banking_required_documents.md` file contains the required-document checklists used by the chatbot.

Recommended OpenRouter setup:

```env
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct
```

For stronger reasoning, switch `OPENROUTER_MODEL` to `openai/gpt-4o-mini` or another model available in your OpenRouter account.

4. Run the backend:

```bash
npm run api
```

5. Run the frontend in another terminal:

```bash
npm run dev
```

Open `http://127.0.0.1:5173`. The frontend uses `/api` through the Vite proxy. The API runs on `http://127.0.0.1:8002` by default to avoid common local FastAPI port conflicts.

## API Endpoints

- `GET /api/health`
- `POST /api/chat`
- `POST /api/chat/stream`
- `POST /api/speech-to-text`
- `POST /api/translate`

## Notes

Faster-Whisper downloads a model the first time speech transcription runs. If you only need the live browser transcript, the frontend microphone flow works through the Web Speech API without waiting for Whisper.
