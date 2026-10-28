import Link from "next/link";

import { MEN, WOMEN, type Weight } from "@/lib/weights";

// Two rows of weight categories; the current one is bold with a claret underline.
export function WeightSwitcher({ current, basePath }: { current: Weight; basePath: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {[
        { title: "Men", weights: MEN },
        { title: "Women", weights: WOMEN },
      ].map(({ title, weights }) => (
        <div key={title} className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1">
          <span className="w-14 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
            {title}
          </span>
          {weights.map((w) => (
            <Link
              key={w.slug}
              href={`${basePath}/${w.slug}`}
              className={`tnum text-[14px] pb-0.5 border-b-2 ${
                w.slug === current.slug
                  ? "font-bold text-ink border-claret"
                  : "text-muted hover:text-ink border-transparent"
              }`}
            >
              {w.label}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
