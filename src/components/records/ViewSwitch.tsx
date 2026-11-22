"use client";

import { viewText } from "@/components/records/text";
import { useDict } from "@/i18n/client";
import type { RecordInfo } from "@/lib/records";

const ACTIVE = "font-bold text-ink border-claret";
const INACTIVE = "text-muted hover:text-ink border-transparent";

// Total / In a row, Gold / Total…: the views of a record. Renders nothing for a
// record of one view. `href` makes links (the full list's URL), else buttons.
export function ViewSwitch({ info, current, onPick, href }: {
  info: RecordInfo;
  current: string;
  onPick?: (key: string) => void;
  href?: (key: string) => string;
}) {
  const d = useDict();
  if (!info.views) return null;
  return (
    <div className="flex items-center gap-3 text-[12px] sm:text-[13px]" role="group" aria-label={d.records.viewSwitch.label}>
      {info.views.map((v) => {
        const className = `px-1 pb-0.5 border-b-2 whitespace-nowrap ${v.key === current ? ACTIVE : INACTIVE}`;
        const { label } = viewText(d, info, v);
        return href ? (
          <a key={v.key} href={href(v.key)} className={className} aria-current={v.key === current ? "true" : undefined}>
            {label}
          </a>
        ) : (
          <button key={v.key} type="button" onClick={() => onPick?.(v.key)} className={`${className} cursor-pointer`}
                  aria-pressed={v.key === current}>
            {label}
          </button>
        );
      })}
    </div>
  );
}
