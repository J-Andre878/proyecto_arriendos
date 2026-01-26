"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-200 to-cyan-200 dark:from-gray-700 dark:to-gray-600 hover:from-purple-300 hover:to-cyan-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 shadow-md hover:shadow-lg border border-purple-300 dark:border-purple-700"
      title={`Cambiar a tema ${theme === "dark" ? "claro" : "oscuro"}`}
      aria-label="Toggle theme"
    >
      {/* Moon icon - visible in light mode */}
      <svg
        className={`absolute w-5 h-5 text-purple-600 dark:text-transparent transition-opacity duration-300 ${
          theme === "light" ? "opacity-100" : "opacity-0"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>

      {/* Sun icon - visible in dark mode */}
      <svg
        className={`absolute w-5 h-5 text-amber-400 dark:text-amber-300 transition-opacity duration-300 ${
          theme === "dark" ? "opacity-100" : "opacity-0"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.293 1.707a1 1 0 011.414-1.414l.707.707a1 1 0 11-1.414 1.414l-.707-.707zm2 2a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707zM10 18a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm4.293-1.293a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707zm2-2a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707zM10 5a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 100 6 3 3 0 000-6z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
