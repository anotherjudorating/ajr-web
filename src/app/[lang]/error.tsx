"use client";

import { ErrorPage } from "@/components/ErrorPage";
import { useDict } from "@/i18n/client";

// A page that failed to render (most often the database briefly overloaded, e.g.
// while the rating is recomputed): the site's layout stays, with a way to try again.
export default function Error({ retry }: { error: unknown; retry: () => void }) {
  const d = useDict();
  return (
    <ErrorPage
      big="500"
      title={d.site.errors.errorTitle}
      lead={d.site.errors.errorLead}
      action={
        <button
          type="button"
          onClick={() => retry()}
          className="h-[44px] px-6 bg-ink text-paper text-sm font-semibold hover:bg-ink/85 transition-colors"
        >
          {d.site.errors.tryAgain}
        </button>
      }
    />
  );
}
