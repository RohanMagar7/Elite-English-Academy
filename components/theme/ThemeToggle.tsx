"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useMounted } from "@/hooks/useMounted";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const mounted = useMounted();
  const { isDark, setTheme } = useTheme();

  // SSR-safe: render a neutral placeholder until mounted (no hydration mismatch).
  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={
        `inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 active:scale-90 ` +
        `border-slate-200/70 bg-white/70 text-slate-700 hover:border-brand-blue/30 hover:text-brand-blue ` +
        `dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-brand-gold/40 dark:hover:text-brand-gold ` +
        className
      }
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
