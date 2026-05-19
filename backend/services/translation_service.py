from deep_translator import GoogleTranslator
from langdetect import LangDetectException, detect

SUPPORTED_LANGUAGES = {
    "en": "english",
    "hi": "hindi",
    "te": "telugu",
    "ta": "tamil",
    "kn": "kannada",
    "ml": "malayalam",
    "mr": "marathi",
    "bn": "bengali",
    "gu": "gujarati",
    "pa": "punjabi",
    "ur": "urdu",
    "or": "odia",
    "as": "assamese",
}

ROMANIZED_LANGUAGE_HINTS = {
    "te": {"kosam", "kavali", "emi", "em", "cheppandi", "telugu", "loan kosam"},
    "hi": {"ke liye", "kya", "chahiye", "batao", "kaise", "hindi"},
    "ta": {"enna", "venum", "eppadi", "tamil", "vendum"},
    "kn": {"beku", "enu", "hege", "kannada"},
    "ml": {"venam", "entha", "engane", "malayalam"},
}


def detect_language(text: str, fallback: str = "en") -> str:
    lowered = text.lower()
    for language, hints in ROMANIZED_LANGUAGE_HINTS.items():
        if any(hint in lowered for hint in hints):
            return language
    if fallback in SUPPORTED_LANGUAGES and fallback != "en" and not text.isascii():
        return fallback
    try:
        detected = detect(text)
        return detected if detected in SUPPORTED_LANGUAGES else fallback
    except LangDetectException:
        return fallback


def translate_text(text: str, target: str, source: str = "auto") -> str:
    if not text.strip() or target == source:
        return text
    try:
        return GoogleTranslator(source=source, target=target).translate(text)
    except Exception:
        return text
