import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { stateOf, TournamentSkeleton, tournamentName } from "@/components/tournament/TournamentHeader";
import { WeightView } from "@/components/tournament/WeightView";
import { competition, competitionChances, competitionContests, competitionResults, competitions, competitionSlots, lastUpdate } from "@/lib/api";
import { WEIGHTS, weightBySlug } from "@/lib/weights";
import { alternatesFor, NOINDEX } from "@/lib/seo";
import { shortName } from "@/lib/format";
import { currentLang, i18n } from "@/i18n/server";

const MEDALS = ["gold", "silver", "bronze"] as const;

const MAJOR = ["Olympic Games", "World Championships", "Masters", "Grand Slam"];

// One weight of one tournament is built ahead (more would load the database at every
// deploy); any other is built on its first visit, then served whole from the cache
// until the data changes (ISR).
export async function generateStaticParams() {
  // the latest with contests (those to come are listed too, without weights)
  const [latest] = (await competitions(null)).filter((c) => c.contests !== null);
  const found = latest ? await competition(latest.id) : null;
  const weight = WEIGHTS.find((w) => w.api === found?.weights[0]);
  return found && weight ? [{ id: String(found.id), weight: weight.slug }] : [];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/tournaments/[id]/[weight]">): Promise<Metadata> {
  const { id, weight: slug } = await params;
  const weight = weightBySlug(slug);
  const found = Number.isInteger(Number(id)) && weight ? await competition(Number(id)) : null;
  if (!found || !weight || !(found.weights.includes(weight.api) || (await underWay(found)))) notFound(); // a crawler is sent the head first: only here does a 404 get its status
  const name = tournamentName(found.name);
  const { d, f, t } = await i18n();
  // its medallists, once there are: "gold Fawaz M. (FRA), silver …"
  const results = (await competitionResults(found.id)).filter((r) => r.weight === weight.api);
  const medals = MEDALS.flatMap((medal) =>
    results
      .filter((r) => r.result === medal)
      .map((r) => {
        const vars = { medal: d.tournament.medal[medal], name: shortName(r.family_name, r.given_name) };
        return r.country ? t(d.tournament.meta.medallistOf, { ...vars, country: r.country }) : t(d.tournament.meta.medallist, vars);
      }),
  );
  const indexed = MAJOR.includes(found.rank_name ?? "");
  const vars = { weight: f.weightTitle(weight), name };
  return {
    title: t(d.tournament.meta.weightTitle, vars),
    description: medals.length
      ? t(d.tournament.meta.weightDescriptionMedallists, { ...vars, medallists: medals.join(", ") })
      : t(d.tournament.meta.weightDescription, vars),
    alternates: alternatesFor(await currentLang(), `/tournaments/${id}/${slug}`, { indexed }),
    // the weights of the events people search for; the others reachable, not indexed
    ...(indexed ? {} : { robots: NOINDEX }),
  };
}

export default function TournamentWeightPage({ params }: PageProps<"/[lang]/tournaments/[id]/[weight]">) {
  return (
    <Suspense fallback={<TournamentSkeleton />}>
      <TournamentWeight params={params} />
    </Suspense>
  );
}

async function TournamentWeight({ params }: { params: PageProps<"/[lang]/tournaments/[id]/[weight]">["params"] }) {
  const { id: raw, weight: slug } = await params;
  const id = Number(raw);
  const weight = weightBySlug(slug);
  if (!Number.isInteger(id) || !weight) notFound();
  const [found, results, contests, chances, places, updated] = await Promise.all([
    competition(id),
    competitionResults(id),
    competitionContests(id, weight.api),
    competitionChances(id),
    competitionSlots(id, weight.api),
    lastUpdate(),
  ]);
  if (!found) notFound();
  const weightChances = chances.filter((c) => c.weight === weight.api);
  if (!found.weights.includes(weight.api) && !weightChances.length) {
    // a weight of a tournament not over that has not started: the header stays, and this
    if (stateOf(found, (updated ?? "1970-01-01").slice(0, 10)) === "over") notFound();
    const { d, f, t } = await i18n();
    return (
      <div className="mt-10 lg:mt-12 border-t-2 border-ink pt-6 max-w-2xl">
        <h2 className="font-serif text-[20px] leading-[24px] sm:text-[24px] sm:leading-[28px] font-bold tracking-tight">
          {t(d.tournament.weightNotStarted.title, { weight: f.weightTitle(weight) })}
        </h2>
        <p className="mt-2 text-[14px] text-muted">{d.tournament.weightNotStarted.lead}</p>
      </div>
    );
  }
  return (
    <>
      <WeightView
        results={results.filter((r) => r.weight === weight.api)}
        contests={contests}
        chances={weightChances}
        bracket={places}
      />
    </>
  );
}

// Not over yet (by the latest rating run's day): every weight has a page.
async function underWay(found: Awaited<ReturnType<typeof competition>> & object) {
  return stateOf(found, ((await lastUpdate()) ?? "1970-01-01").slice(0, 10)) !== "over";
}
