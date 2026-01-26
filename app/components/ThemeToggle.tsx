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
      onClick={() => setTheme("dark")}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 hover:from-violet-600 hover:to-cyan-500 transition-all duration-300 shadow-md hover:shadow-lg border border-cyan-300"
      title="Modo oscuro"
      aria-label="Dark mode"
    >
      {/* Sun icon */}
      <svg
        className="w-5 h-5 text-amber-200 transition-opacity duration-300"
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
