import { motion } from "framer-motion";
import { BadgeHelp, CreditCard, Landmark, MessageSquarePlus, ShieldAlert } from "lucide-react";

const items = [
  { label: "New Chat", icon: MessageSquarePlus },
  { label: "Loans", icon: Landmark },
  { label: "Fraud Awareness", icon: ShieldAlert },
  { label: "KYC Help", icon: BadgeHelp }
];

export default function Sidebar({ activeSection, onSelect }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/45 bg-white/70 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 lg:block">
      <div className="mb-7 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 p-5 text-white shadow-soft">
        <div className="mb-4 grid size-11 place-items-center rounded-xl bg-white/18">
          <CreditCard size={23} />
        </div>
        <p className="text-xl font-bold">FinAssist AI</p>
        <p className="mt-2 text-sm text-emerald-50">Secure multilingual guidance for everyday banking decisions.</p>
      </div>
      <nav className="space-y-2">
        {items.map(({ label, icon: Icon }) => {
          const active = activeSection === label;
          return (
            <motion.button
              key={label}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(label)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                active
                  ? "bg-emerald-600 text-white shadow-soft"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </motion.button>
          );
        })}
      </nav>
      <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 text-sm text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100">
        <p className="font-bold">Security reminder</p>
        <p className="mt-1">Never share OTP, PIN, CVV, passwords, or full card numbers in chat.</p>
      </div>
    </aside>
  );
}
