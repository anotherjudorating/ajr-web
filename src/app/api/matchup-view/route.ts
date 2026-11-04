import { countMatchup } from "@/lib/api";
import { badRequest } from "@/lib/routes";

// POST /api/matchup-view {a, b}: one more opening of a head-to-head pair (orders the
// popular matchups), sent by the head-to-head page once per pair and browser session.
export async function POST(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => null)) as { a?: unknown; b?: unknown } | null;
  const a = Number(body?.a);
  const b = Number(body?.b);
  const athlete = (id: number) => Number.isInteger(id) && id > 0 && id < 1e7;
  if (!athlete(a) || !athlete(b) || a === b) return badRequest("two different athletes");
  try {
    await countMatchup(a, b);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "not counted" }, { status: 502 });
  }
  return new Response(null, { status: 204 });
}
