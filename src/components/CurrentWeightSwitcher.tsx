"use client";

import { usePathname } from "next/navigation";

import { WeightSwitcher } from "@/components/WeightSwitcher";
import { splitDay } from "@/lib/day-path";

// The switcher with the open table marked and its day kept. The URL is runtime
// data: it streams in under a Suspense whose fallback is the switcher unmarked.
export function CurrentWeightSwitcher() {
  const { table, day } = splitDay(usePathname());
  return <WeightSwitcher current={table} query={day} />;
}
