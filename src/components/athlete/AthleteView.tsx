"use client";

import Link from "next/link";
import { useState } from "react";

import { AthleteHeader } from "@/components/athlete/AthleteHeader";
import { Contests } from "@/components/athlete/Contests";
import { FrequentOpponents, NextTournaments, Standouts } from "@/components/athlete/Lists";
import { type Competition, RatingChart } from "@/components/athlete/RatingChart";
import type { Athlete, HistoryRow } from "@/lib/api";
import { shortName } from "@/lib/format";
import { WEIGHTS } from "@/lib/weights";

// The athlete page. The weight tabs pick whose contests are listed; the rating is one
// for all weights, so the header and the chart stay the same.
export function AthleteView({
  athlete,
  history,
  today,
}: {
  athlete: Athlete;
  history: HistoryRow[];
  today: string; // YYYY-MM-DD
}) {
  const [weight, setWeight] = useState(athlete.weight ?? athlete.weights[0] ?? null);
  // a competition picked on the chart: the table shows only its contests
  const [competition, setCompetition] = useState<Competition | null>(null);
  const contests = history.filter((contest) => contest.weight === weight);

  const pickWeight = (w: string) => {
    setWeight(w);
    setCompetition(null);
  };
  const pickCompetition = (picked: Competition) => {
    if (picked.weight) setWeight(picked.weight);
    setCompetition(picked);
    document.getElementById("contests")?.scrollIntoView({ behavior: "smooth" });
  };
  const current = WEIGHTS.find((w) => w.api === athlete.weight);

  return (
    <>
      <nav className="text-[12px] text-muted mb-4 flex items-center gap-1.5 pt-2 sm:pt-0">
        <Link href="/rankings" className="hover:text-ink transition-colors">
          Rankings
        </Link>
        {current && (
          <>
            <span>›</span>
            <Link href={`/rankings/${current.slug}`} className="hover:text-ink transition-colors">
              {current.gender === "men" ? "Men" : "Women"} {current.label} kg
            </Link>
          </>
        )}
        <span>›</span>
        <span className="text-ink font-medium">{shortName(athlete.family_name, athlete.given_name)}</span>
      </nav>

      <AthleteHeader athlete={athlete} weight={weight} onWeight={pickWeight} today={today} />
      <RatingChart athlete={athlete} history={history} today={today} onCompetition={pickCompetition} />
      <Contests
        key={weight}
        contests={contests}
        competition={competition}
        onClearCompetition={() => setCompetition(null)}
        fileName={`ajr-${athlete.id}-${weight ?? "all"}.csv`}
      />
      <Standouts contests={contests} />
      <section className="mt-14 md:mt-16 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-24 gap-y-14">
        <FrequentOpponents contests={contests} />
        <NextTournaments />
      </section>
    </>
  );
}
