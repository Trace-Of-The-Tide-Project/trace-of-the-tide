"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "tott-color-scheme";

function readStored(): "light" | "dark" | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    /* ignore */
  }
  return null;
}

function readSystem(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyDomTheme(scheme: "light" | "dark") {
  document.documentElement.dataset.theme = scheme;
  document.documentElement.style.colorScheme = scheme === "dark" ? "dark" : "light";
}

export type ThemeScheme = "light" | "dark";

type ThemeContextValue = {
  scheme: ThemeScheme;
  isDark: boolean;
  toggleScheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [scheme, setSchemeState] = useState<ThemeScheme>(() => readStored() ?? readSystem());

  useEffect(() => {
    applyDomTheme(scheme);
  }, [scheme]);

  useEffect(() => {
    if (readStored()) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readStored()) return;
      const next = mq.matches ? "dark" : "light";
      setSchemeState(next);
      applyDomTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggleScheme = useCallback(() => {
    const next = scheme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    setSchemeState(next);
    applyDomTheme(next);
  }, [scheme]);

  const value = useMemo(
    () => ({
      scheme,
      isDark: scheme === "dark",
      toggleScheme,
    }),
    [scheme, toggleScheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
