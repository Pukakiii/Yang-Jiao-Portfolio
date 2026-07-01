"use client";

import { ThemeProvider } from "next-themes";
import { useEffect } from "react";

function ThemeStorageMigration() {
  useEffect(() => {
    try {
      if (localStorage.getItem("theme") === "dark") {
        localStorage.setItem("theme", "pink");
      }
    } catch {
      // ignore private browsing / blocked storage
    }
  }, []);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      themes={["light", "pink"]}
      enableSystem={false}
      defaultTheme="light"
    >
      <ThemeStorageMigration />
      {children}
    </ThemeProvider>
  );
}
