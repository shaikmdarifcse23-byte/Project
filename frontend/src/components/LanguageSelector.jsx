import { LANGUAGES } from "../utils/languages.js";

export default function LanguageSelector({ language, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={language}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 min-w-40 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none transition focus:border-emerald-400 dark:border-white/10 dark:bg-slate-900"
        aria-label="Select language"
      >
        {LANGUAGES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
