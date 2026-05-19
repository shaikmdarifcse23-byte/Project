import { useCallback, useMemo, useRef, useState } from "react";

export function useSpeechRecorder({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const chunksRef = useRef([]);

  const supported = useMemo(() => Boolean(navigator.mediaDevices?.getUserMedia), []);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop?.();
    mediaRecorderRef.current?.stop?.();
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(async (languageCode = "en") => {
    if (!supported) throw new Error("Voice recording is not supported in this browser");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];
    setAudioBlob(null);
    setLiveTranscript("");

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioBlob(blob);
      stream.getTracks().forEach((track) => track.stop());
    };
    recorder.start();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = languageCode;
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0]?.transcript || "")
          .join(" ")
          .trim();
        setLiveTranscript(transcript);
        onTranscript?.(transcript);
      };
      recognitionRef.current = recognition;
      recognition.start();
    }

    setIsRecording(true);
  }, [onTranscript, supported]);

  return { audioBlob, isRecording, liveTranscript, startRecording, stopRecording, supported };
}
