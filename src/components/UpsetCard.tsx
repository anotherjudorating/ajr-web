import Link from "next/link";

import { Flag } from "@/components/Flag";
import { RowChevron } from "@/components/Icon";
import { formatChance, roundCode, shortName } from "@/lib/format";

type UpsetSide = { family: string | null; country: string | null; chance: number; score: number };

// "Final" written out, the other stages as codes (1/2, 1/4, 1/8…).
const upsetRound = (round: string | null) => (roundCode(round) === "F" ? "Final" : roundCode(round));

// A least likely win: the winner and their chance on the left, the beaten favourite
// on the right, the bar of the winner's chance, and below where it happened and the
// gap between their scores.
export function UpsetCard({
  href,
  winner,
  loser,
  where,
  round,
}: {
  href: string;
  winner: UpsetSide;
  loser: UpsetSide;
  where: string; // the weight, or the tournament
  round: string | null;
}) {
  return (
    <Link href={href} className="block hover:bg-panel/40 py-3 border-b border-rule transition-colors group">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <Flag ioc={winner.country} />
          <span className="font-semibold text-ink truncate">{shortName(winner.family, null)}</span>
          <span className="text-gain font-semibold tabular-nums ml-2">{formatChance(winner.chance)}</span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-muted tabular-nums mr-2">{formatChance(loser.chance)}</span>
          <span className="text-muted truncate">{shortName(loser.family, null)}</span>
          <Flag ioc={loser.country} />
          <RowChevron className="text-muted ml-1 mr-[3px] sm:mr-[7px]" />
        </div>
      </div>
      <div className="mt-1.5">
        <div className="h-1.5 w-full flex border border-ink overflow-hidden bg-transparent">
          <div className="bg-gain h-full" style={{ width: `${Math.round(winner.chance * 100)}%` }} />
        </div>
      </div>
      <div className="mt-1.5 text-[12px] text-muted flex items-center justify-between gap-3">
        <span>
          {where}
          <span className="inline-block w-px h-3 bg-rule mx-2 align-middle" />
          {upsetRound(round)}
        </span>
        <span className="tabular-nums">Rating gap {Math.abs(loser.score - winner.score)} points</span>
      </div>
    </Link>
  );
}
