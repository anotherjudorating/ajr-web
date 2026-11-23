"use client";

// The Spanish dictionary for the browser: a chunk of its own, loaded on Spanish pages only.

import type { ReactNode } from "react";

import { LocaleProvider } from "@/i18n/client";
import { es } from "@/i18n/es";

export default function EsProvider({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider lang="es" dict={es}>
      {children}
    </LocaleProvider>
  );
}
