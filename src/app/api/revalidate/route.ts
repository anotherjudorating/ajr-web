import { revalidateTag } from "next/cache";

import { DATA_TAG } from "@/lib/api";

// POST /api/revalidate, with "Authorization: Bearer <REVALIDATE_SECRET>": the backend's
// update job calls it after a run that changed what the site shows. Everything read
// from the database expires: each page is built anew on its next visit, which waits
// for it, so the database still sees only the pages people open, spread over time.
// (Marked stale instead, a visit got the cached version once more while the new one
// was built, and each cache of a page — its HTML, its data for a link followed on the
// site, the database's rows under them — only on its own next visit: a tournament's
// page followed from Explore showed its first day two days on.)
export function POST(request: Request): Response {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "not allowed" }, { status: 401 });
  }
  revalidateTag(DATA_TAG, { expire: 0 });
  return Response.json({ revalidated: DATA_TAG });
}
