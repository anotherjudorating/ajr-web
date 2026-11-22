import type { Metadata } from "next";

import type { Dict } from "@/i18n/en";
import { notFound } from "next/navigation";
import { i18n, permanentRedirectTo } from "@/i18n/server";
import { Suspense } from "react";

import { AthleteView } from "@/components/athlete/AthleteView";
import { athletePlaces } from "@/lib/tables";
import { athlete, athleteChances, athleteHistory, canonicalAthlete, homeLeaders, lastUpdate } from "@/lib/api";
import { fullName, ijfProfile } from "@/lib/format";
import type { Athlete } from "@/lib/api";
import { alternatesFor, indexableAthlete, NOINDEX, SITE } from "@/lib/seo";
import { WEIGHTS } from "@/lib/weights";

// One athlete is built ahead (more would load the database at every deploy); any
// other is built on its first visit, then served whole from the cache until the
// data changes (ISR).
export async function generateStaticParams() {
  const leaders = await homeLeaders();
  return leaders.slice(0, 1).map((row) => ({ id: String(row.athlete_id) }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/athletes/[id]">): Promise<Metadata> {
  const id = Number((await params).id);
  const [found, updated, { lang, d, f, t }] = await Promise.all([Number.isInteger(id) ? athlete(id) : null, lastUpdate(), i18n()]);
  if (!found || found.rating === null) return missing(id); // a crawler is sent the head first: only here does a 404 get its status
  const name = fullName(found.family_name, found.given_name);
  const today = (updated ?? "1970-01-01").slice(0, 10);
  const indexed = indexableAthlete(found.contests, found.last_contest, today);
  return {
    title: t(d.athlete.meta.title, { name }),
    description: athleteSummary(found, d.athlete.meta, f, t),
    alternates: alternatesFor(lang, `/athletes/${id}`, { indexed }),
    // a few contests long ago: reachable, not indexed (lib/seo.ts)
    ...(indexed ? {} : { robots: NOINDEX }),
  };
}

type I18n = Awaited<ReturnType<typeof i18n>>;

// The athlete in a sentence or two, from the data: for search results and previews.
function athleteSummary(a: Athlete, words: Dict["athlete"]["meta"], f: I18n["f"], t: I18n["t"]): string {
  const name = fullName(a.family_name, a.given_name);
  const who = [a.country_name, a.birth_year ? t(words.born, { year: a.birth_year }) : null].filter(Boolean).join(", ");
  const weight = WEIGHTS.find((w) => w.api === a.weight);
  const where = weight ? f.weightTitle(weight).toLowerCase() : words.judo;
  const standing =
    a.place !== null
      ? t(words.ranked, { place: a.place, where, score: a.score ?? 0 })
      : t(words.unranked, { where });
  const peak = a.peak_score && a.peak_on ? t(words.peak, { score: a.peak_score, month: f.monthYear(a.peak_on) }) : "";
  return t(who ? words.summary : words.summaryNoWho, { name, who, standing, peak });
}

// No rated athlete under this id: an athlete's second id goes to their main page for
// good (308), anything else is a 404.
async function missing(id: number): Promise<never> {
  // a failed lookup is only a missed redirect: the page is still a 404
  const main = Number.isInteger(id) ? await canonicalAthlete(id).catch(() => null) : null;
  if (main) await permanentRedirectTo(`/athletes/${main}`);
  notFound();
}

export default function AthletePage({ params }: PageProps<"/[lang]/athletes/[id]">) {
  return (
    <div className="w-full bg-paper pt-[25.25px] sm:pt-[41.25px] md:pt-[42.75px] pb-8">
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Athlete params={params} />
      </Suspense>
    </div>
  );
}

async function Athlete({ params }: { params: PageProps<"/[lang]/athletes/[id]">["params"] }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [found, history, updated, places, chances] = await Promise.all([
    athlete(id),
    athleteHistory(id),
    lastUpdate(),
    athletePlaces(id),
    athleteChances(id),
  ]);
  if (!found || found.rating === null) return missing(id);
  // "today" is the day of the latest rating run, as on the rankings page
  return (
    <>
      <PersonData athlete={found} />
      <AthleteView athlete={found} history={history} places={places} chances={chances} today={(updated ?? "1970-01-01").slice(0, 10)} />
    </>
  );
}

// schema.org Person, with the IJF profile as sameAs: search engines tie this page
// to the athlete's official one.
function PersonData({ athlete: a }: { athlete: Athlete }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fullName(a.family_name, a.given_name),
    url: `${SITE}/athletes/${a.id}`,
    sameAs: [ijfProfile(a.id)],
    ...(a.gender ? { gender: a.gender === "female" ? "Female" : "Male" } : {}),
    ...(a.country_name ? { nationality: { "@type": "Country", name: a.country_name } } : {}),
    knowsAbout: "Judo",
  };
  return (
    <script
      type="application/ld+json"
      // "<" escaped, so that a name cannot close the script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }}
    />
  );
}
