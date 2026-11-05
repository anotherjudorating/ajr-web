import Link from "next/link";

import { Flag } from "@/components/Flag";
import { Icon } from "@/components/Icon";
import { changeText, placesText } from "@/components/rankings/Changes";
import type { HomeRow } from "@/lib/api";
import { shortName } from "@/lib/format";

// One athlete line of the home page's lists: the weight or place, the name, (on wider
// screens) the nation, the change of place and score over 90 days and the score.
export function HomeAthlete({
  row,
  lead,
  nation = false,
  score = false,
}: {
  row: HomeRow;
  lead?: string;
  nation?: boolean; // the flag and code in a column of their own from sm; before the name below
  score?: boolean;
}) {
  const places = placesText(row.places_up_90d);
  const change = changeText(row.score_change_90d);
  return (
    // a real link (not a click handler), so that crawlers find the athletes from here
    <Link
      href={`/athletes/${row.athlete_id}`}
      className="h-10 sm:h-11 py-0 border-b border-rule flex items-center justify-between text-[14px] hover:bg-panel/30 transition-colors px-1 cursor-pointer group"
    >
      <div className="min-w-0 pr-2 flex items-baseline">
        {lead !== undefined && <span className="w-12 shrink-0 tabular-nums text-muted text-[13px]">{lead}</span>}
        <Flag ioc={row.country} className={`mr-1.5 self-center ${nation ? "sm:!hidden" : ""}`} />
        <span className="font-medium text-ink truncate group-hover:underline">{shortName(row.family_name, row.given_name)}</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 tabular-nums">
        {nation && (
          <span className="hidden sm:inline-flex w-16 items-center gap-1.5 text-[13px] text-ink">
            <Flag ioc={row.country} />
            <span>{row.country}</span>
          </span>
        )}
        <span className={`text-xs w-6 text-right font-medium ${places.color || "text-muted"}`}>{places.text}</span>
        <span className={`font-medium w-12 text-right ${change.color || "text-muted"}`}>{change.text}</span>
        {score && <span className="text-ink w-12 text-right">{row.score}</span>}
        <Icon size={18} name="chevron_right" className="text-muted align-middle shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
