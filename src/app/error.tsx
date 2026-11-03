"use client";

import { ErrorPage } from "@/components/ErrorPage";

// A page that failed to render (most often the database briefly overloaded, e.g.
// while the rating is recomputed): the site's layout stays, with a way to try again.
export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return (
    <ErrorPage
      big="500"
      title="Matte."
      lead="This page could not be loaded. It is usually back in a minute."
      action={
        <button
          type="button"
          onClick={() => retry()}
          className="h-[44px] px-6 bg-ink text-paper text-sm font-semibold hover:bg-ink/85 transition-colors"
        >
          Try again
        </button>
      }
    />
  );
}
