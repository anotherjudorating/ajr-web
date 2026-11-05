import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The data cache's version (lib/api.ts). It is in every "use cache" key instead of
  // the build's id, so a deploy keeps the cached data and does not send every page
  // to the database again; the data itself is refreshed when the backend says it
  // changed (/api/revalidate). Raise it when a cached function's output changes
  // shape without its name or arguments changing. (It also stands for the
  // deployment in Next's version-skew checks; Vercel's skew protection, a paid
  // feature, is not used.)
  deploymentId: "data-1",
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
