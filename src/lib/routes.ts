// The site's /api routes: the browser's reads, answered from the server's cache.

// The CDN keeps an answer briefly: unlike the data cache behind it (lib/api.ts), it is
// not told when the data changes. Its refetches are answered from the data cache.
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
