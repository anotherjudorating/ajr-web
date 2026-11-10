"use client";

import { useState } from "react";

import { AthleteHeader } from "@/components/athlete/AthleteHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Contests } from "@/components/athlete/Contests";
import { FrequentOpponents, NextTournaments, Standouts } from "@/components/athlete/Lists";
import { Medals } from "@/components/athlete/Medals";
import { type Competition, RatingChart } from "@/components/athlete/RatingChart";
import type { Athlete, HistoryRow } from "@/lib/api";
import { shortName } from "@/lib/format";
import { lastRating } from "@/lib/inactive";
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
  const inactive = lastRating(history, today);

  return (
    <>
      <Breadcrumbs
        className="mb-4 pt-2 sm:pt-0"
        trail={[
          { href: "/rankings", label: "Rankings" },
          ...(current
            ? [{ href: `/rankings/${current.slug}`, label: `${current.gender === "men" ? "Men" : "Women"} ${current.label} kg` }]
            : []),
        ]}
        current={shortName(athlete.family_name, athlete.given_name)}
      />

      <AthleteHeader athlete={athlete} weight={weight} onWeight={pickWeight} today={today} inactive={inactive} />
      <RatingChart athlete={athlete} history={history} today={today} inactive={inactive} onCompetition={pickCompetition} />
      <Medals history={history} />
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
