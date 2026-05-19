import { motion } from "framer-motion";
import { BadgeCheck, CircleDollarSign, CreditCard, PiggyBank, ShieldCheck } from "lucide-react";

const cards = [
  { title: "Loans", desc: "Eligibility, EMI, documents", icon: CircleDollarSign, prompt: "Check loan eligibility" },
  { title: "Cards", desc: "Blocked cards and limits", icon: CreditCard, prompt: "ATM card blocked" },
  { title: "Insurance", desc: "Coverage and claims", icon: BadgeCheck, prompt: "Explain bank insurance options" },
  { title: "Savings", desc: "Accounts and deposits", icon: PiggyBank, prompt: "Open savings account" },
  { title: "Fraud Protection", desc: "Report suspicious activity", icon: ShieldCheck, prompt: "Report fraud" }
];

export default function QuickActionCards({ onPrompt }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map(({ title, desc, icon: Icon, prompt }, index) => (
        <motion.button
          key={title}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          onClick={() => onPrompt(prompt)}
          className="glass rounded-2xl p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-300"
        >
          <div className="mb-4 grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">
            <Icon size={20} />
          </div>
          <p className="font-bold">{title}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{desc}</p>
        </motion.button>
      ))}
    </div>
  );
}
