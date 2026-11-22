// The /contact page's text, one file a language (en.tsx, ru.tsx).

import type { ReactNode } from "react";

export const EMAIL = "info@anotherjudorating.com";
export const DATA = "data@anotherjudorating.com";
export const ISSUES = "https://github.com/anotherjudorating/ajr-web/issues";
export const LINK = "underline hover:text-ink";

export type ContactProse = {
  meta: { title: string; description: string };
  title: string;
  questions: ReactNode;
  issues: ReactNode;
  dataset: ReactNode;
};
