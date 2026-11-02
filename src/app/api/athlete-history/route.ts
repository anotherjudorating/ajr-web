import type { NextRequest } from "next/server";

import { athleteHistory } from "@/lib/api";
import { answer, badRequest } from "@/lib/routes";

// /api/athlete-history?id=13028: an athlete's contests, for a row opened in a table.
export function GET(request: NextRequest) {
  const id = Number(request.nextUrl.searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) return badRequest("no such athlete");
  return answer(() => athleteHistory(id));
}
