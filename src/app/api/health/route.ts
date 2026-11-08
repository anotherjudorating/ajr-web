import { connection } from "next/server";

import { client } from "@/lib/data-client";

// GET /api/health: the data client's state (lib/data-client.ts) — the breaker, calls in
// flight and waiting, outcomes since the start, latencies — for monitoring. 503 while
// the breaker is open. Rendered on each request, never at build.
export async function GET(): Promise<Response> {
  await connection();
  const state = client.snapshot();
  return Response.json(state, {
    status: state.state === "open" ? 503 : 200,
    headers: { "cache-control": "no-store" },
  });
}
