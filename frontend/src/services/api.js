import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
});

export async function sendChat(payload) {
  const { data } = await api.post("/chat", payload);
  return data;
}

export async function streamChat(payload, onToken) {
  const response = await fetch(`${API_BASE_URL}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok || !response.body) {
    throw new Error("Streaming response failed");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    fullText += chunk;
    onToken(fullText);
  }

  return fullText;
}

export async function speechToText(audioBlob, language) {
  const formData = new FormData();
  formData.append("file", audioBlob, "voice-input.webm");
  formData.append("language", language);
  const { data } = await api.post("/speech-to-text", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 90000
  });
  return data;
}

export async function translateText(payload) {
  const { data } = await api.post("/translate", payload);
  return data;
}
