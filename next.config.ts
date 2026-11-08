import type { NextConfig } from "next";
// Next's own list of the crawlers it sends the whole <head> before the page
import { HTML_LIMITED_BOT_UA_RE } from "next/dist/shared/lib/router/utils/html-bots";

const nextConfig: NextConfig = {
  // Googlebot too: it is otherwise sent the page's static shell with a 200 before the
  // page finds its athlete (tournament, …) missing, and a missing one gets only a
  // noindex; waiting for the head lets notFound() in generateMetadata send a 404.
  htmlLimitedBots: new RegExp(`${HTML_LIMITED_BOT_UA_RE.source}|Googlebot`, "i"),
  cacheComponents: true,
  partialPrefetching: true,
  // The two in-memory caches of a self-hosted server, each of this size (on Vercel both
  // were outside the process): the rendered pages (each is on disk too, under .next, so
  // this one only saves a read) and the "use cache" data of lib/api.ts (the "remote"
  // handler falls back to the built-in in-memory one). The page cache counts a page's
  // HTML in characters, but the string takes two bytes a character once it holds a "—"
  // or "↑", so the default 50 MB of pages held ~75 MB. 32 MB: ~150 pages and ~1,700
  // data entries, enough for the hot ones. The rest of the instance's memory budget:
  // instrumentation.ts (what a cached Buffer really holds) and the start script in
  // package.json (the JS heap's size, which Node otherwise sets at half the instance,
  // leaving nothing for these caches' Buffers and the binary).
  cacheMaxMemorySize: 32 * 1024 * 1024,
  cacheLife: {
    // Everything read from the database (lib/api.ts): kept until the backend's update
    // job says the data changed (/api/revalidate, tag "data"). The week is only a
    // safety net, should a call be missed.
    data: {
      stale: 5 * 60,
      revalidate: 7 * 24 * 60 * 60,
      expire: 30 * 24 * 60 * 60,
    },
    // The head-to-head pairs people open most, counted as they open them.
    counts: {
      stale: 5 * 60,
      revalidate: 60 * 60,
      expire: 24 * 60 * 60,
    },
  },
  experimental: {
    // "use cache" keys hold a hash of the cached function's code instead of the
    // build's id, so a deploy keeps the cached data (lib/api.ts) and does not send
    // every page to the database again; an entry is read anew when its function
    // changes, and the data itself is refreshed when the backend says it changed
    // (/api/revalidate). (A fixed deploymentId did the same, but Vercel wants a new
    // one for each deploy.)
    durableUseCacheEntries: true,
    // Build workers, each rendering pages that read the database: Render's builder
    // started 30 at once, and on 2026-11-07 a build during the update job's publish
    // failed on the Data API's 3-second limit (api.nations). Four keep the database's
    // load of a build small.
    cpus: 4,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
