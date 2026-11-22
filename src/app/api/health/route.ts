import { connection } from "next/server";

import { client } from "@/lib/data-client";
import { languageStats } from "@/lib/languages";
import { pageLimitStats } from "@/lib/page-limit";

// GET /api/health: the data client's state (lib/data-client.ts) — the breaker, calls in
// flight and waiting, outcomes since the start, latencies — and the pages refused by the
// limit per IP (lib/page-limit.ts) and the visitors' languages (lib/languages.ts), for monitoring. 503 while
// the breaker is open. Rendered on each request, never at build.
export async function GET(): Promise<Response> {
  await connection();
  const state = client.snapshot();
  return Response.json(
    { ...state, page_limit: pageLimitStats(), languages: languageStats() },
    {
      status: state.state === "open" ? 503 : 200,
      headers: { "cache-control": "no-store" },
    },
  );
}
