// The site's /api routes: the browser's reads, answered from the server's cache.

// The CDN keeps an answer as long as the data cache (cacheLife "data" in
// next.config.ts): the backend refreshes the database every 15 minutes.
const CACHE = "public, s-maxage=300, stale-while-revalidate=900";

export async function answer<T>(read: () => Promise<T>): Promise<Response> {
  try {
    return Response.json(await read(), { headers: { "Cache-Control": CACHE } });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "the data is not available right now" }, { status: 502 });
  }
}

export function badRequest(why: string): Response {
  return Response.json({ error: why }, { status: 400 });
}
