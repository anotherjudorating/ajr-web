"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { WeightSwitcher } from "@/components/WeightSwitcher";

// The switcher with the open table marked and its date kept. The URL is runtime
// data: it streams in under a Suspense whose fallback is the switcher unmarked.
export function CurrentWeightSwitcher() {
  const date = useSearchParams().get("date");
  return <WeightSwitcher current={usePathname()} query={date ? `?date=${date}` : ""} />;
}
