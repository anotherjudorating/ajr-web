import type { NextRequest } from "next/server";

import { search, searchKey } from "@/lib/api";
import { answer } from "@/lib/routes";

// /api/search?q=abe: the header's search.
export function GET(request: NextRequest) {
  const q = searchKey(request.nextUrl.searchParams.get("q") ?? "");
  return answer(() => (q.length < 2 ? Promise.resolve([]) : search(q)));
}
