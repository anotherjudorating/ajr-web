import type { NextRequest } from "next/server";

import { searchAthletes, searchKey } from "@/lib/api";
import { answer, badRequest } from "@/lib/routes";
import { WEIGHTS } from "@/lib/weights";

// /api/search-athletes?q=abe&weight=-73: the head-to-head's athlete boxes.
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const q = searchKey(params.get("q") ?? "");
  const weight = params.get("weight");
  if (weight && !WEIGHTS.some((w) => w.api === weight)) return badRequest("no such weight");
  return answer(() => (q ? searchAthletes(q, weight) : Promise.resolve([])));
}
