import { signed } from "@/lib/format";

// Places moved up (▲2), down (▼1), unchanged (–), or NEW when the athlete was
// not in the table back then.
export function RankChange({ placesUp }: { placesUp: number | null }) {
  if (placesUp === null) return <span className="text-[11px] font-bold text-claret">NEW</span>;
  if (placesUp > 0) return <span className="text-gain">▲{placesUp}</span>;
  if (placesUp < 0) return <span className="text-drop">▼{-placesUp}</span>;
  return <span className="text-muted">–</span>;
}

// Score change: teal up, red down.
export function ScoreChange({ value }: { value: number | null }) {
  if (value === null) return <span className="text-muted">–</span>;
  const color = value > 0 ? "text-gain" : value < 0 ? "text-drop" : "text-muted";
  return <span className={color}>{signed(value)}</span>;
}
