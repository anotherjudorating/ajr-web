import { searchIndex } from "@/lib/api";
import { answer } from "@/lib/routes";

// /api/search-index: what the search boxes search in the browser (lib/search-index.ts).
// About 1.6 MB (a third compressed): kept by the CDN, not in the shared data cache.
export function GET() {
  return answer(searchIndex);
}
