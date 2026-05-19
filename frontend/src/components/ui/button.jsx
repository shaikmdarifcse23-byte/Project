import { cn } from "../../utils/cn.js";

export function Button({ className = "", variant = "primary", size = "md", ...props }) {
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    secondary: "border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100",
    ghost: "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-white/10"
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    icon: "size-10"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
