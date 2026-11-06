// The all-time records: their groups (tabs of /records), titles and page texts.
// `name` is the backend's record name, `slug` the URL part of its full list.

export const GROUPS = [
  { key: "ratings", title: "Ratings" },
  { key: "medals", title: "Medals" },
  { key: "contests", title: "Contests" },
  { key: "rivalries", title: "Rivalries" },
  { key: "tournaments", title: "Tournaments" },
  { key: "nations", title: "Nations" },
] as const;
export type Group = (typeof GROUPS)[number]["key"];

// Another view of a record, switched to on its card and page (?view=in-a-row): a
// record of the backend of its own, with its own places.
export type RecordView = {
  key: string; // in the URL; the first view is the record itself
  label: string; // the switch, e.g. "In a row"
  name: string; // the backend's record
  description: string;
};

export type RecordInfo = {
  name: string;
  slug: string;
  group: Group;
  title: string;
  breakAfter?: string; // the title breaks after these words on phones, as in the design
  description: string;
  methodology?: boolean; // link "How ratings work" after the description
  subject: "athlete" | "pair" | "tournament" | "nation"; // what one row is about
  noun: string; // "1–20 of 312 athletes"
  weights?: boolean; // rows have a weight (the athlete's main one where the record has none): the full list can be filtered by it
  ascending?: boolean; // the best value is the smallest (youngest, least likely)
  sortLabel: string; // "Sort: peak ↓"
  views?: RecordView[]; // the first is the record itself
};

// "Total" and "In a row" of the records of weeks.
function weeks(name: string, total: string, run: string): RecordView[] {
  return [
    { key: "total", label: "Total", name, description: total },
    { key: "in-a-row", label: "In a row", name: `${name}_run`, description: run },
  ];
}

const STRENGTH = "min(1, max(0, (rating − 1900) / 600))";

export const RECORDS: RecordInfo[] = [
  {
    name: "highest_rating",
    slug: "highest-rating",
    group: "ratings",
    title: "Highest rating",
    description: "The highest rating each athlete reached since 2011, one row per athlete.",
    methodology: true,
    subject: "athlete",
    noun: "athletes",
    weights: true,
    sortLabel: "peak",
  },
  {
    name: "longest_at_1",
    slug: "longest-at-1",
    group: "ratings",
    title: "Longest at #1",
    description: "Weeks at #1 of a weight's ranking since 2011, in total; the weight is the one with the most weeks.",
    methodology: true,
    subject: "athlete",
    noun: "athletes",
    weights: true,
    sortLabel: "weeks",
    views: weeks(
      "longest_at_1",
      "Weeks at #1 of a weight's ranking since 2011, in total; the weight is the one with the most weeks.",
      "The longest unbroken run at #1 of a weight's ranking since 2011.",
    ),
  },
  {
    name: "most_weeks_in_top_10",
    slug: "most-weeks-in-the-top-10",
    group: "ratings",
    title: "Most weeks in the top 10",
    breakAfter: "Most weeks",
    description: "Weeks in the top 10 of a weight's ranking since 2011, in total; a week counts once even if the athlete stood in two weights.",
    methodology: true,
    subject: "athlete",
    noun: "athletes",
    weights: true,
    sortLabel: "weeks",
    views: weeks(
      "most_weeks_in_top_10",
      "Weeks in the top 10 of a weight's ranking since 2011, in total; a week counts once even if the athlete stood in two weights.",
      "The longest unbroken run in the top 10 of a weight's ranking since 2011.",
    ),
  },
  {
    name: "longest_p4p_1",
    slug: "longest-at-p4p-1",
    group: "ratings",
    title: "Longest at P4P #1",
    breakAfter: "Longest",
    description: "Weeks at #1 of the pound-for-pound ranking, men and women apart, since 2011, in total.",
    methodology: true,
    subject: "athlete",
    noun: "athletes",
    weights: true,
    sortLabel: "weeks",
    views: weeks(
      "longest_p4p_1",
      "Weeks at #1 of the pound-for-pound ranking, men and women apart, since 2011, in total.",
      "The longest unbroken run at #1 of the pound-for-pound ranking, men and women apart, since 2011.",
    ),
  },
  {
    name: "biggest_p4p_lead",
    slug: "biggest-p4p-lead",
    group: "ratings",
    title: "Biggest P4P lead",
    description: "The biggest lead of a pound-for-pound #1 over the 7 best others of their weight, since 2011.",
    methodology: true,
    subject: "athlete",
    noun: "athletes",
    weights: true,
    sortLabel: "lead",
  },
  {
    name: "youngest_1",
    slug: "youngest-1",
    group: "ratings",
    title: "Youngest #1",
    description: "The youngest athletes to reach #1 of a weight's ranking since 2011. Age by the year of birth.",
    methodology: true,
    subject: "athlete",
    noun: "athletes",
    weights: true,
    ascending: true,
    sortLabel: "age",
  },
  {
    name: "most_world_tour_medals",
    slug: "most-world-tour-medals",
    group: "medals",
    title: "Most World Tour medals",
    breakAfter: "Most",
    description: "Medals at IJF World Tour events and the Olympic Games, one row per athlete.",
    subject: "athlete",
    noun: "athletes",
    weights: true,
    sortLabel: "medals",
    views: [
      { key: "total", label: "Total", name: "most_world_tour_medals", description: "Medals at IJF World Tour events and the Olympic Games, one row per athlete." },
      { key: "gold", label: "Gold", name: "most_world_tour_golds", description: "Gold medals at IJF World Tour events and the Olympic Games, one row per athlete." },
    ],
  },
  {
    name: "most_medals_in_row",
    slug: "most-medals-in-a-row",
    group: "medals",
    title: "Most medals in a row",
    description: "IJF World Tour events and Olympic Games in a row finished with a medal.",
    subject: "athlete",
    noun: "athletes",
    weights: true,
    sortLabel: "in a row",
    views: [
      { key: "total", label: "Total", name: "most_medals_in_row", description: "IJF World Tour events and Olympic Games in a row finished with a medal." },
      { key: "gold", label: "Gold", name: "most_golds_in_row", description: "IJF World Tour events and Olympic Games won in a row." },
    ],
  },
  {
    name: "youngest_grand_slam_medal",
    slug: "youngest-grand-slam-medal",
    group: "medals",
    title: "Youngest Grand Slam medal",
    breakAfter: "Youngest",
    description: "The youngest athletes to win a Grand Slam medal. Age by the year of birth.",
    subject: "athlete",
    noun: "athletes",
    weights: true,
    ascending: true,
    sortLabel: "age",
    views: [
      { key: "any", label: "Any medal", name: "youngest_grand_slam_medal", description: "The youngest athletes to win a Grand Slam medal. Age by the year of birth." },
      { key: "gold", label: "Gold", name: "youngest_grand_slam_gold", description: "The youngest Grand Slam champions. Age by the year of birth." },
    ],
  },
  {
    name: "longest_medal_span",
    slug: "longest-medal-span",
    group: "medals",
    title: "Longest medal span",
    description: "The most years between an athlete's first and last medal at IJF World Tour events and the Olympic Games.",
    subject: "athlete",
    noun: "athletes",
    weights: true,
    sortLabel: "years",
  },
  {
    name: "best_finals_record",
    slug: "best-finals-record",
    group: "medals",
    title: "Best finals record",
    description: "The share of finals won at IJF World Tour events and the Olympic Games, for athletes with at least 10 finals.",
    subject: "athlete",
    noun: "athletes",
    weights: true,
    sortLabel: "won",
  },
  {
    name: "least_likely_champion",
    slug: "least-likely-champion",
    group: "medals",
    title: "Least likely champion",
    breakAfter: "Least likely",
    description: "World Tour champions the rating gave the smallest chance of winning every contest of their bracket, since 2011.",
    methodology: true,
    subject: "athlete",
    noun: "titles",
    weights: true,
    ascending: true,
    sortLabel: "chance",
  },
  {
    name: "longest_winning_streak",
    slug: "longest-winning-streak",
    group: "contests",
    title: "Longest winning streak",
    description: "Contests won in a row.",
    subject: "athlete",
    noun: "athletes",
    weights: true,
    sortLabel: "wins",
  },
  {
    name: "biggest_upsets",
    slug: "biggest-upsets",
    group: "contests",
    title: "Biggest upsets",
    description: "Wins over an athlete in the top 10 of the weight that the rating gave the smallest chance before the contest, since 2011.",
    methodology: true,
    subject: "pair",
    noun: "contests",
    weights: true,
    ascending: true,
    sortLabel: "chance",
  },
  {
    name: "giant_killer",
    slug: "giant-killer",
    group: "contests",
    title: "Giant killer",
    description: "Wins as the underdog over athletes in the top 10 of the weight at the time, since 2011.",
    methodology: true,
    subject: "athlete",
    noun: "athletes",
    weights: true,
    sortLabel: "upset wins",
  },
  {
    name: "golden_score_king",
    slug: "golden-score-king",
    group: "contests",
    title: "Golden score king",
    description: "Contests won in golden score, since 2017.",
    subject: "athlete",
    noun: "athletes",
    weights: true,
    sortLabel: "golden score wins",
  },
  {
    name: "longest_contest",
    slug: "longest-contest",
    group: "contests",
    title: "Longest contest",
    description: "The longest World Tour contests, golden score included.",
    subject: "pair",
    noun: "contests",
    weights: true,
    sortLabel: "time",
  },
  {
    name: "greatest_rivalry",
    slug: "greatest-rivalry",
    group: "rivalries",
    title: "Greatest rivalry",
    description: `The pairs who met most often at the top and most evenly. Each meeting scores by the weaker athlete's rating before it, from 0 at 1900 to 1 at 2500; the sum is reduced for a one-sided head-to-head: Σ ${STRENGTH} × (1 − ((wins − losses) / meetings)²).`,
    methodology: true,
    subject: "pair",
    noun: "rivalries",
    weights: true,
    sortLabel: "score",
  },
  {
    name: "longest_rivalry",
    slug: "longest-rivalry",
    group: "rivalries",
    title: "Longest rivalry",
    description: "The most years between a pair's first and last meeting. A pair that met only a few times counts for less: years × (meetings − 1) / (meetings + 1).",
    subject: "pair",
    noun: "rivalries",
    weights: true,
    sortLabel: "score",
  },
  {
    name: "nemesis",
    slug: "nemesis",
    group: "rivalries",
    title: "Nemesis",
    description: `Athletes who kept beating a stronger opponent. Only the meetings where the rating made them the underdog count: each adds the win beyond the chance they were given, more the stronger the opponent was: Σ (won − chance) × ${STRENGTH.replace("rating", "opponent's rating")}.`,
    methodology: true,
    subject: "pair",
    noun: "pairs",
    weights: true,
    sortLabel: "score",
  },
  {
    name: "strongest_tournament",
    slug: "strongest-tournament",
    group: "tournaments",
    title: "Strongest tournament",
    description: "The average rating, before the tournament, of the 8 best entrants of each weight; since 2011.",
    methodology: true,
    subject: "tournament",
    noun: "tournaments",
    sortLabel: "avg rating",
  },
  {
    name: "most_nations_on_podium",
    slug: "most-nations-on-the-podium",
    group: "tournaments",
    title: "Most nations on the podium",
    description: "Tournaments whose medals went to the most nations.",
    subject: "tournament",
    noun: "tournaments",
    sortLabel: "nations",
  },
  {
    name: "most_unpredictable_tournament",
    slug: "most-unpredictable-tournament",
    group: "tournaments",
    title: "Most unpredictable tournament",
    breakAfter: "Most",
    description: "Tournaments whose contests the rating predicted worst (the highest log loss), since 2011.",
    methodology: true,
    subject: "tournament",
    noun: "tournaments",
    sortLabel: "log loss",
  },
  {
    name: "highest_team_rating",
    slug: "highest-team-rating",
    group: "nations",
    title: "Highest team rating",
    description: "The highest team rating each nation reached since 2011.",
    methodology: true,
    subject: "nation",
    noun: "nations",
    sortLabel: "rating",
  },
  {
    name: "most_medals_nation",
    slug: "most-medals",
    group: "nations",
    title: "Most medals",
    description: "Medals at IJF World Tour events and the Olympic Games, by nation.",
    subject: "nation",
    noun: "nations",
    sortLabel: "medals",
  },
  {
    name: "deepest_team",
    slug: "deepest-team",
    group: "nations",
    title: "Deepest team",
    description: "The most athletes of one nation in the top 10 of their weights on one day, since 2011.",
    methodology: true,
    subject: "nation",
    noun: "nations",
    sortLabel: "athletes",
  },
];

// The full lists of records that were renamed or dropped: their old addresses lead here.
export const MOVED: Record<string, string> = {
  "most-frequent-rivalry": "greatest-rivalry",
  "youngest-p4p-1": "youngest-1",
  "biggest-gain-at-one-tournament": "least-likely-champion",
  "most-predictable-tournament": "most-unpredictable-tournament",
  "longest-at-1-nation": "highest-team-rating",
  "most-medals-at-one-tournament": "most-medals",
};

// The view of a record picked by ?view= (the first when none or unknown).
export function recordView(info: RecordInfo, key?: string): RecordView {
  const views = info.views ?? [{ key: "", label: "", name: info.name, description: info.description }];
  return views.find((v) => v.key === key) ?? views[0];
}

export function recordBySlug(slug: string): RecordInfo | undefined {
  return RECORDS.find((r) => r.slug === slug);
}

// Places 1, 2, 2, 4… by value in the order the rows come: after the gender or the
// weight filter the backend's places have gaps (a woman 2nd of all is 1st of women).
export function places(rows: { value: number }[]): number[] {
  const result: number[] = [];
  rows.forEach((row, i) => {
    result.push(i > 0 && row.value === rows[i - 1].value ? result[i - 1] : i + 1);
  });
  return result;
}
