export function getInitialTheme() {
  const saved = localStorage.getItem("finassist-theme");
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function setThemeMode(theme) {
  localStorage.setItem("finassist-theme", theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
}
