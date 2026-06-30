"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("service-saja-theme") as "light" | "dark" | null;
    const theme = savedTheme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme = isDark ? "light" : "dark";
    localStorage.setItem("service-saja-theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="secondary-button inline-flex h-11 w-11 items-center justify-center rounded-lg shadow-sm transition hover:-translate-y-0.5"
      aria-label="Toggle theme"
    >
      <Moon className="dark:hidden" size={20} />
      <Sun className="hidden dark:block" size={20} />
    </button>
  );
}
