import type { NextRequest } from "next/server";

import { leaderboard } from "@/lib/api";
import { answer, badRequest } from "@/lib/routes";
import { WEIGHTS } from "@/lib/weights";

const DAY = /^\d{4}-\d{2}-\d{2}$/;

// /api/leaderboard?weight=-73[&day=2025-03-03]: a weight's whole table, for the rows
// past the first page (the page itself is sent with the first ones only). From the
// same cache as the page (a past day: R2, then the database), so no extra read.
export function GET(request: NextRequest) {
  const weight = request.nextUrl.searchParams.get("weight") ?? "";
  const day = request.nextUrl.searchParams.get("day") ?? undefined;
  if (!WEIGHTS.some((w) => w.api === weight)) return badRequest("no such weight");
  if (day !== undefined && !DAY.test(day)) return badRequest("a day is YYYY-MM-DD");
  return answer(() => leaderboard(weight, day));
}
