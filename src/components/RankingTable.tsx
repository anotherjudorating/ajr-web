import { RankChange, ScoreChange } from "@/components/Change";
import type { LeaderboardRow } from "@/lib/api";
import { formatDate, shortName } from "@/lib/format";

const TH = "h-9 px-2 sm:px-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted";
const TD = "h-10 sm:h-11 px-2 sm:px-3";

export function RankingTable({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <table className="w-full border-collapse text-[13px] sm:text-[14px] tnum">
      <thead>
        <tr className="bg-panel border-b border-rule">
          <th className={`${TH} w-10 text-right`}>#</th>
          <th className={`${TH} w-12 text-right`} title="Places moved in the last 90 days">↑↓</th>
          <th className={`${TH} text-left`}>Athlete</th>
          <th className={`${TH} w-20 text-right`} title="Rating minus 3 × uncertainty">Rating</th>
          <th className={`${TH} w-16 text-right`} title="Rating change, last 90 days">+/−</th>
          <th className={`${TH} hidden sm:table-cell w-16 text-right`} title="Rating change, last 6 months">6m</th>
          <th className={`${TH} hidden md:table-cell w-16 text-right`} title="IJF World Ranking List">IJF</th>
          <th className={`${TH} hidden lg:table-cell w-28 text-right`}>Last contest</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.athlete_id} className="border-b border-rule hover:bg-panel/40">
            <td className={`${TD} text-right font-semibold`}>{row.place}</td>
            <td className={`${TD} text-right text-[12px]`}>
              <RankChange placesUp={row.places_up_90d} />
            </td>
            <td className={TD}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-8 shrink-0 text-[11px] font-bold tracking-wide text-muted">
                  {row.country ?? ""}
                </span>
                <span className="font-medium truncate">{shortName(row.family_name, row.given_name)}</span>
              </div>
            </td>
            <td className={`${TD} text-right font-serif text-[15px] font-bold`}>{row.score}</td>
            <td className={`${TD} text-right`}>
              <ScoreChange value={row.score_change_90d} />
            </td>
            <td className={`${TD} hidden sm:table-cell text-right`}>
              <ScoreChange value={row.score_change_6m} />
            </td>
            <td className={`${TD} hidden md:table-cell text-right text-muted`}>{row.wrl_place ?? "–"}</td>
            <td className={`${TD} hidden lg:table-cell text-right text-muted`}>{formatDate(row.last_contest)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
