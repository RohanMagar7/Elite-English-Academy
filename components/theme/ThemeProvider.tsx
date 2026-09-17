"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "elite-theme";

const ThemeContext = createContext<{
  theme: Theme;
  isDark: boolean;
  setTheme: (t: Theme) => void;
}>({ theme: "system", isDark: false, setTheme: () => {} });

function applyTheme(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  return dark;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializers read the values the inline init script already applied
  // before hydration. Nothing theme-dependent is rendered before mount
  // (ThemeToggle gates on `useMounted`), so SSR output always matches.
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    try {
      return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
    } catch {
      return "system";
    }
  });
  const [isDark, setIsDark] = useState<boolean>(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );

  // Keep the DOM in sync with the stored preference (external system write).
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Follow OS preference while in "system" mode (event-driven setState).
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setIsDark(applyTheme("system"));
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* private mode */
    }
    setThemeState(t);
    setIsDark(applyTheme(t));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
