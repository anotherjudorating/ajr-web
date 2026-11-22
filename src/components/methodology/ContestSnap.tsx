"use client";

import Link from "@/components/Link";

import { Flag } from "@/components/Flag";
import { useI18n } from "@/i18n/client";

export type SnapSide = {
  name: string;
  country: string | null;
  chance: number; // before the contest
  note?: string; // e.g. "#1 in our table", "IJF seed 1"
  change?: number; // the rating's change in the contest
};

// A chance in whole percent, as a reader quotes it: under 1% and over 99% kept apart.
export const pct = (p: number) => (p < 0.01 ? "<1%" : p > 0.99 ? ">99%" : `${Math.round(p * 100)}%`);
const signed = (v: number) => (Math.round(v) === 0 ? "±0" : `${v > 0 ? "+" : "−"}${Math.abs(Math.round(v))}`);

// A contest in miniature, as the site's lists show one: the two athletes, each one's
// chance before it, the bar of the left one's chance, who won, what it did to the
// ratings, and where it was. Instead of a sentence about who beat whom at what odds.
// `compact`: one line and the bar (lists: a bracket, the upsets).
export function ContestSnap({ left, right, leftWon, where, href, hideResult = false, compact = false }: {
  left: SnapSide;
  right: SnapSide;
  leftWon: boolean;
  where?: string;
  href?: string;
  hideResult?: boolean; // the result held back (a quiz, a reveal)
  compact?: boolean;
}) {
  const { d, t } = useI18n();
  const won = (isLeft: boolean) => !hideResult && leftWon === isLeft;
  const bar = (
    <div className="h-2 w-full flex border border-ink overflow-hidden" aria-hidden>
      <div className={`h-full ${hideResult ? "bg-ink/70" : leftWon ? "bg-gain" : "bg-ink/25"}`} style={{ width: `${left.chance * 100}%` }} />
      <div className={`h-full flex-1 ${hideResult ? "" : !leftWon ? "bg-gain" : "bg-ink/25"}`} />
    </div>
  );
  if (compact)
    return (
      <div className="py-2">
        <div className="flex items-center gap-2 text-[13px]">
          {left.country && <Flag ioc={left.country} />}
          <span className={`truncate ${won(true) ? "font-semibold text-ink" : "text-muted"}`}>{left.name}</span>
          <span className={`tabular-nums ${won(true) ? "font-semibold text-gain" : "text-muted"}`}>{pct(left.chance)}</span>
          <span className="flex-1" />
          <span className={`tabular-nums ${won(false) ? "font-semibold text-gain" : "text-muted"}`}>{pct(right.chance)}</span>
          <span className={`truncate text-right ${won(false) ? "font-semibold text-ink" : "text-muted"}`}>{right.name}</span>
          {right.country && <Flag ioc={right.country} />}
        </div>
        <div className="mt-1">{bar}</div>
        {where && <div className="mt-1 text-[11px] text-muted truncate">{where}</div>}
      </div>
    );
  const side = (s: SnapSide, isLeft: boolean) => (
    <div className={`min-w-0 flex-1 ${isLeft ? "" : "text-right"}`}>
      <div className={`flex items-center gap-1.5 ${isLeft ? "" : "flex-row-reverse"}`}>
        <Flag ioc={s.country} />
        <span className={`truncate font-semibold ${hideResult || won(isLeft) ? "text-ink" : "text-muted"}`}>{s.name}</span>
      </div>
      <div className={`mt-0.5 font-serif text-[26px] leading-8 font-bold tabular-nums ${won(isLeft) ? "text-gain" : "text-ink"}`}>{pct(s.chance)}</div>
      {s.note && <div className="text-[12px] leading-4 text-muted">{s.note}</div>}
      {!hideResult && (
        <div className="mt-1 text-[12px] font-semibold uppercase tracking-wider">
          {won(isLeft) ? <span className="text-gain">{d.methodology.snap.won}</span> : <span className="text-muted">{d.methodology.snap.lost}</span>}
          {s.change !== undefined && (
            <span className={`ml-2 normal-case tracking-normal tabular-nums ${Math.round(s.change) > 0 ? "text-gain" : Math.round(s.change) < 0 ? "text-claret" : "text-muted"}`}>
              {t(d.methodology.snap.ratingChange, { change: signed(s.change) })}
            </span>
          )}
        </div>
      )}
    </div>
  );
  const body = (
    <>
      <div className="flex items-start gap-4">
        {side(left, true)}
        {side(right, false)}
      </div>
      <div className="mt-2">{bar}</div>
      {where && <div className="mt-1.5 text-[12px] text-muted">{where}</div>}
    </>
  );
  return href ? (
    <Link href={href} className="block border border-rule bg-paper p-3 hover:border-ink transition-colors">
      {body}
    </Link>
  ) : (
    <div className="border border-rule bg-paper p-3">{body}</div>
  );
}
