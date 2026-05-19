import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Moon, Sun } from "lucide-react";
import ChatPage from "./pages/ChatPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { getInitialTheme, setThemeMode } from "./utils/theme.js";

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [activeSection, setActiveSection] = useState("New Chat");
  const [sidebarAction, setSidebarAction] = useState({ label: "New Chat", id: 0 });

  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  const themeIcon = useMemo(() => (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />), [theme]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_30%)]" />
      <div className="relative flex min-h-screen">
        <Sidebar
          activeSection={activeSection}
          onSelect={(label) => {
            setActiveSection(label);
            setSidebarAction({ label, id: Date.now() });
          }}
        />
        <main className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/40 bg-white/75 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75 lg:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-soft">
                  <Building2 size={21} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-emerald-700 dark:text-emerald-300">FinAssist AI</p>
                  <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">Multilingual Banking Assistant</h1>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
                className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  <motion.span key={theme} initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }}>
                    {themeIcon}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>
          </header>
          <ChatPage
            activeSection={activeSection}
            sidebarAction={sidebarAction}
            onSelectSection={(label) => {
              setActiveSection(label);
              setSidebarAction({ label, id: Date.now() });
            }}
          />
        </main>
      </div>
    </div>
  );
}
