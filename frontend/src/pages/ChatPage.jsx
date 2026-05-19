import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BadgeCheck, Clock, LockKeyhole, Menu } from "lucide-react";
import ChatInput from "../components/ChatInput.jsx";
import ChatMessage from "../components/ChatMessage.jsx";
import LanguageSelector from "../components/LanguageSelector.jsx";
import TypingIndicator from "../components/TypingIndicator.jsx";
import { sendChat } from "../services/api.js";
import { useSpeechRecorder } from "../hooks/useSpeechRecorder.js";
import { DEFAULT_LANGUAGE, LANGUAGES } from "../utils/languages.js";

const sidebarPrompts = {
  Loans: "what are the documents required for loan",
  "Fraud Awareness": "what documents are needed to report bank fraud",
  "KYC Help": "what documents are needed for KYC"
};

function now() {
  return new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

const welcomeMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello, I am FinAssist AI. Ask me about loans, KYC, account opening, fraud disputes, card issues, or required banking documents. Please do not share OTP, PIN, CVV, passwords, or full account/card numbers.",
  timestamp: now()
};

export default function ChatPage({ activeSection, sidebarAction, onSelectSection }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("finassist-chat");
    return saved ? JSON.parse(saved) : [welcomeMessage];
  });
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const scrollRef = useRef(null);
  const handledActionRef = useRef(0);

  const { isRecording, startRecording, stopRecording, supported } = useSpeechRecorder({
    onTranscript: setInput
  });

  const selectedLanguage = useMemo(() => LANGUAGES.find((item) => item.code === language), [language]);

  useEffect(() => {
    localStorage.setItem("finassist-chat", JSON.stringify(messages.slice(-40)));
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([{ ...welcomeMessage, timestamp: now() }]);
    toast.success("Chat cleared");
  }, []);

  const submitMessage = useCallback(
    async (text = input) => {
      const content = text.trim();
      if (!content || isLoading) return;

      const userMessage = { id: crypto.randomUUID(), role: "user", content, timestamp: now() };
      const assistantId = crypto.randomUUID();
      const history = [...messages, userMessage].slice(-12);

      setMessages((current) => [...current, userMessage, { id: assistantId, role: "assistant", content: "", timestamp: now() }]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await sendChat({
          message: content,
          language,
          conversation_id: "local-session",
          history: history.map(({ role, content: itemContent }) => ({ role, content: itemContent }))
        });
        setMessages((current) => current.map((item) => (item.id === assistantId ? { ...item, content: response.response } : item)));
      } catch (error) {
        const message =
          error.response?.data?.detail ||
          error.message ||
          "Unable to reach the banking assistant. Please check that the API server is running.";
        setMessages((current) =>
          current.map((item) =>
            item.id === assistantId
              ? {
                  ...item,
                  content: `I could not get a response right now. ${message}`
                }
              : item
          )
        );
        toast.error("Chat request failed");
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, language, messages]
  );

  useEffect(() => {
    if (!sidebarAction?.id) return;
    if (handledActionRef.current === sidebarAction.id) return;
    handledActionRef.current = sidebarAction.id;
    if (sidebarAction.label === "New Chat") {
      clearChat();
      return;
    }
    const prompt = sidebarPrompts[sidebarAction.label];
    if (prompt) submitMessage(prompt);
  }, [clearChat, sidebarAction, submitMessage]);

  const handleMic = async () => {
    try {
      if (isRecording) {
        stopRecording();
        toast.success("Recording stopped");
      } else {
        await startRecording(language);
        toast.success("Listening now");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const mobileItems = ["New Chat", "Loans", "Fraud Awareness", "KYC Help"];

  return (
    <section className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileNavOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900"
            title="Menu"
          >
            <Menu size={18} />
          </button>
          {isMobileNavOpen && (
            <div className="absolute left-4 top-20 z-30 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft dark:border-white/10 dark:bg-slate-900">
              {mobileItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    onSelectSection(item);
                    setMobileNavOpen(false);
                  }}
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-emerald-50 dark:hover:bg-white/10"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
        <LanguageSelector language={language} onChange={setLanguage} />
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-slate-600 shadow-sm dark:bg-white/10 dark:text-slate-200">
            <LockKeyhole size={14} /> Secure guidance
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-slate-600 shadow-sm dark:bg-white/10 dark:text-slate-200">
            <Clock size={14} /> 24/7 assistant
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-slate-600 shadow-sm dark:bg-white/10 dark:text-slate-200">
            <BadgeCheck size={14} /> {selectedLanguage?.label}
          </span>
        </div>
      </div>

      <div className="glass flex min-h-[72vh] flex-1 flex-col rounded-3xl">
        <div className="scrollbar-thin flex-1 space-y-5 overflow-y-auto p-4 sm:p-5">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && messages.at(-1)?.role !== "assistant" && <TypingIndicator />}
          <div ref={scrollRef} />
        </div>
        <div className="p-4 sm:p-5">
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => submitMessage()}
            onClear={clearChat}
            onMic={handleMic}
            isRecording={isRecording}
            isLoading={isLoading}
          />
          {!supported && <p className="mt-2 text-xs text-rose-500">Voice recording is unavailable in this browser.</p>}
        </div>
      </div>
    </section>
  );
}
