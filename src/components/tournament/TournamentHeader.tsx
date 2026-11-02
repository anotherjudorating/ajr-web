import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Flag } from "@/components/Flag";
import type { Competition } from "@/lib/api";
import { shortCompetition } from "@/lib/format";
import { MEN, WOMEN, type Weight, weightTitle } from "@/lib/weights";

const TAB = "px-1 py-1.5 sm:px-2 whitespace-nowrap";
const ACTIVE = `${TAB} font-bold text-ink border-b-2 border-claret`;
const IDLE = `${TAB} tabular-nums text-muted hover:text-ink`;

// "Baku World Senior Championships 2026 Individuals" -> without "Individuals"
export function tournamentName(name: string): string {
  return name.replace(/\s+Individuals?$/i, "");
}

// The way back to Explore, the name, the place and the weights: All (the overview),
// then every weight fought, men and women on their own rows.
export function TournamentHeader({ competition: c, weight }: { competition: Competition; weight?: Weight }) {
  const rows = [
    { label: "Men", weights: MEN },
    { label: "Women", weights: WOMEN },
  ]
    .map((row) => ({ ...row, weights: row.weights.filter((w) => c.weights.includes(w.api)) }))
    .filter((row) => row.weights.length > 0);
  const short = shortCompetition(c.name);

  return (
    <>
      <Breadcrumbs
        className="pt-[33.25px] sm:pt-[41.25px] md:pt-[42.75px]"
        trail={[
          { href: "/explore/tournaments", label: "Tournaments" },
          ...(weight ? [{ href: `/tournaments/${c.id}`, label: short }] : []),
        ]}
        current={weight ? weightTitle(weight) : short}
      />
      <h1 className="font-serif mt-3 text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">
        {tournamentName(c.name)}
      </h1>
      <div className="mt-2 flex items-center text-[14px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Flag ioc={c.country} />
          <span className="text-ink">{[c.city, c.country].filter(Boolean).join(", ")}</span>
        </span>
      </div>
      <nav className="mt-6 flex flex-col gap-1 sm:max-w-[560px]" aria-label="Weight categories">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center">
            <span className="w-14 shrink-0 text-[11px] font-bold uppercase tracking-wider text-muted">{row.label}</span>
            <div className="flex flex-1 items-center justify-between sm:justify-start sm:gap-2 text-[13px] sm:text-[15px]">
              <Link href={`/tournaments/${c.id}`} className={weight ? IDLE : ACTIVE}>
                All
              </Link>
              {row.weights.map((w) => (
                <Link key={w.slug} href={`/tournaments/${c.id}/${w.slug}`} className={w === weight ? ACTIVE : IDLE}>
                  {w.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </>
  );
}
