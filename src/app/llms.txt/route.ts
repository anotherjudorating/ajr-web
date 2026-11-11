import { homeLeaders, lastUpdate } from "@/lib/api";
import { fullName } from "@/lib/format";
import { SITE } from "@/lib/seo";
import { WEIGHTS, weightTitle } from "@/lib/weights";

// /llms.txt: the site in a few lines of Markdown for language models and AI agents
// (https://llmstxt.org): what the rating is, how to read it, where things are, and
// today's leaders as sentences they can quote with the date. From the cached data,
// refreshed with it.
export async function GET(): Promise<Response> {
  const [leaders, updated] = await Promise.all([homeLeaders(), lastUpdate()]);
  const day = (updated ?? "").slice(0, 10);
  const firsts = WEIGHTS.flatMap((w) => {
    const row = leaders.find((r) => r.weight === w.api && r.place === 1);
    return row
      ? [`- ${weightTitle(w)}: ${fullName(row.family_name, row.given_name)} (${row.country ?? "—"}), score ${row.score} — ${SITE}/rankings/${w.slug}`]
      : [];
  });
  const text = `# Another Judo Rating

> An independent rating of every IJF World Tour judoka (Glicko-2, from every IJF contest in judobase since 2009), updated every 15 minutes. It answers "who is the strongest judoka right now?" per weight, pound for pound and by nation, with each athlete's history, every contest's win chances and tournament medal chances.

How to read it:
- Score = rating − RD (the rating's uncertainty): an athlete with few contests needs to prove more. Tables order by score, and the chance of a win is computed from it.
- An athlete without a contest for 365 days leaves the tables (comes back with the next contest).
- Independent of the IJF World Ranking List (points for results); both are shown.
- Data: IJF judobase. Ratings updated ${day || "every 15 minutes during tournaments"}.

## Today's #1 in every weight (as of ${day || "the latest update"})

${firsts.join("\n")}

## Rankings

- [Weight tables](${SITE}/rankings/men-73): the 14 senior categories, men -60 to +100 kg, women -48 to +78 kg (/rankings/<men|women>-<kg>, e.g. /rankings/women-57, /rankings/men-plus-100)
- [Pound for pound](${SITE}/rankings/p4p/men): the best across weights (/rankings/p4p/men, /rankings/p4p/women)
- [Nations](${SITE}/rankings/teams/mixed): countries by their best athlete in every weight
- [Records](${SITE}/records): highest ratings, longest at #1, biggest upsets, streaks, the greatest rivalries

## Pages

- Athletes: ${SITE}/athletes/<id> — rating, place, peak, every contest with win chance and rating change
- Tournaments: ${SITE}/tournaments/<id> — medallists, upsets, rating changes; before a tournament, medal chances from simulating the draw
- Nations: ${SITE}/countries/<ioc> (e.g. /countries/jpn)
- Head-to-head: ${SITE}/head-to-head — two athletes compared, win chance, every meeting
- Lists: ${SITE}/explore/athletes, ${SITE}/explore/tournaments, ${SITE}/explore/contests

## Data

- [Full dataset](${SITE}/data): every rating change since 2009 as CSV (contest, athletes, day, weight, win chance, rating, RD and volatility before and after), plus athletes and competitions; CC BY 4.0, versioned by the rating settings, with a README of every column. Results originate from IJF judobase; the ratings are ours.
`;
  return new Response(text, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
    },
  });
}
