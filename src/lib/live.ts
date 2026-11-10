import type { CompetitionResult } from "@/lib/api";

// Weights fought at least once but not over: under way.
export function liveWeights(results: CompetitionResult[]): Set<string> {
  const over = new Set(results.filter((r) => r.result === "gold").map((r) => r.weight));
  return new Set(results.map((r) => r.weight).filter((w) => !over.has(w)));
}
