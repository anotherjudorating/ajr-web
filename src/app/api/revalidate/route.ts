import { revalidateTag } from "next/cache";

import { DATA_TAG } from "@/lib/api";

// POST /api/revalidate, with "Authorization: Bearer <REVALIDATE_SECRET>": the backend's
// update job calls it after a run that changed what the site shows. Everything read
// from the database is marked stale: each page is refreshed on its next visit (it
// shows the cached version once more meanwhile), so the database sees the pages
// people open, spread over time, not all of them at once.
export function POST(request: Request): Response {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "not allowed" }, { status: 401 });
  }
  revalidateTag(DATA_TAG, "max");
  return Response.json({ revalidated: DATA_TAG });
}
