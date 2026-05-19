export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-900">
      {[0, 1, 2].map((item) => (
        <span
          key={item}
          className="size-2 animate-bounce rounded-full bg-emerald-500"
          style={{ animationDelay: `${item * 120}ms` }}
        />
      ))}
    </div>
  );
}
