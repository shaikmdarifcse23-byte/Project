import { Loader2, Mic, Pause, Trash2 } from "lucide-react";

export default function ChatInput({
  value,
  onChange,
  onSend,
  onClear,
  onMic,
  isRecording,
  isLoading
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSend();
      }}
      className="glass rounded-2xl p-3"
    >
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ask about loans, KYC, cards, fraud alerts, accounts..."
          rows={1}
          className="max-h-36 min-h-12 flex-1 resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 dark:border-white/10 dark:bg-slate-900"
        />
        <button
          type="button"
          onClick={onMic}
          className={`grid size-12 place-items-center rounded-xl transition ${
            isRecording ? "bg-rose-500 text-white" : "bg-slate-900 text-white hover:bg-emerald-700 dark:bg-white dark:text-slate-950"
          }`}
          title={isRecording ? "Stop recording" : "Record voice"}
        >
          {isRecording ? <Pause size={18} /> : <Mic size={18} />}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="grid size-12 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
          title="Clear chat"
        >
          <Trash2 size={18} />
        </button>
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="h-12 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          title="Send"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Send"}
        </button>
      </div>
    </form>
  );
}
