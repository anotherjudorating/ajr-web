import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ContestView } from "@/components/contest/ContestView";
import { UpcomingContest } from "@/components/contest/UpcomingContest";
import { athleteHistory, contest, contestContext, upcomingContest } from "@/lib/api";
import { shortName } from "@/lib/format";
import { alternatesFor, NOINDEX } from "@/lib/seo";
import { currentLang, i18n } from "@/i18n/server";

export async function generateMetadata({ params }: PageProps<"/[lang]/contests/[id]">): Promise<Metadata> {
  const id = Number((await params).id);
  const found = Number.isInteger(id) ? ((await contest(id)) ?? (await upcomingContest(id))) : null;
  if (!found || !found.white_id || !found.blue_id) notFound(); // a crawler is sent the head first: only here does a 404 get its status
  const { d, f, t } = await i18n();
  const names = t(d.contest.meta.names, { white: shortName(found.white_family_name, found.white_given_name), blue: shortName(found.blue_family_name, found.blue_given_name) });
  // 230 thousand of them: closed to crawlers (robots.ts), not indexed
  return {
    title: t(d.contest.meta.title, { names, round: found.round ? f.roundTitle(found.round) : d.contest.meta.noRound, competition: found.competition }),
    alternates: alternatesFor(await currentLang(), `/contests/${id}`, { indexed: false }),
    robots: NOINDEX,
  };
}

export default function ContestPage({ params }: PageProps<"/[lang]/contests/[id]">) {
  return (
    <div className="w-full bg-paper pb-8">
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Contest params={params} />
      </Suspense>
    </div>
  );
}

async function Contest({ params }: { params: PageProps<"/[lang]/contests/[id]">["params"] }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const found = await contest(id);
  if (!found || !found.white_id || !found.blue_id) {
    // a contest of a draw not fought yet: what each result would do
    const upcoming = await upcomingContest(id);
    if (!upcoming) notFound();
    // the road and the meetings from both histories, as a fought contest's
    const [white, blue] = await Promise.all([athleteHistory(upcoming.white_id), athleteHistory(upcoming.blue_id)]);
    return <UpcomingContest contest={upcoming} whiteHistory={white} blueHistory={blue} />;
  }
  // the parts of both histories the page shows (not the whole histories)
  const rows = await contestContext(id);
  const side = (name: "white" | "blue") => {
    const seen = new Set<number>();
    return rows.filter((row) => row.side === name && !seen.has(row.contest_id) && seen.add(row.contest_id));
  };
  return <ContestView contest={found} whiteHistory={side("white")} blueHistory={side("blue")} />;
}
