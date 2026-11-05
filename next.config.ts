import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
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
