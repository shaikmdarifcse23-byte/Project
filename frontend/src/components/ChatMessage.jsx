import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="mt-1 grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
          <Bot size={18} />
        </div>
      )}
      <div className={`max-w-[86%] sm:max-w-[74%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
            isUser
              ? "rounded-br-md bg-emerald-600 text-white"
              : "rounded-bl-md border border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className={`mt-1 text-xs text-slate-400 ${isUser ? "text-right" : "text-left"}`}>{message.timestamp}</p>
      </div>
      {isUser && (
        <div className="mt-1 grid size-9 shrink-0 place-items-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950">
          <User size={18} />
        </div>
      )}
    </motion.div>
  );
}
