"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import CheckTermsProvider from "./CheckTermsProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="havela-theme">
      <SessionProvider>
        <CheckTermsProvider>
          {children}
        </CheckTermsProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
