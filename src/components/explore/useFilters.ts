"use client";

import { useRouter } from "next/navigation";

// A list whose filters live in the URL (the server reads them and fetches the page):
// setting one goes back to the first page.
export function useFilters(path: string, current: Record<string, string>) {
  const router = useRouter();
  return (changes: Record<string, string>) => {
    const next = { ...current, ...changes };
    if (!("page" in changes)) delete next.page;
    const query = new URLSearchParams(Object.entries(next).filter(([, value]) => value !== ""));
    router.push(query.size ? `${path}?${query}` : path, { scroll: false });
  };
}
