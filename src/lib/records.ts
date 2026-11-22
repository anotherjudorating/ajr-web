// The all-time records: their groups (tabs of /records), their kinds and views.
// `name` is the backend's record name, `slug` the URL part of its full list and the
// key of its text in the dictionary (i18n/en/records.ts, joined in
// components/records/text.ts): no words here.

export const GROUPS = ["ratings", "medals", "contests", "rivalries", "tournaments", "nations"] as const;
export type Group = (typeof GROUPS)[number];

// Another view of a record, switched to on its card and page (?view=in-a-row): a
// record of the backend of its own, with its own places.
export type RecordView = {
  key: string; // in the URL and in the dictionary; the first view is the record itself
  name: string; // the backend's record
};

export type RecordInfo = {
  name: string;
  slug: string;
  group: Group;
  methodology?: boolean; // link "How ratings work" after the description
  subject: "athlete" | "pair" | "tournament" | "nation"; // what one row is about
  weights?: boolean; // rows have a weight (the athlete's main one where the record has none): the full list can be filtered by it
  ascending?: boolean; // the best value is the smallest (youngest, least likely)
  views?: RecordView[]; // the first is the record itself
};

// Total and In a row of the records of weeks.
function weeks(name: string): RecordView[] {
  return [
    { key: "total", name },
    { key: "in-a-row", name: `${name}_run` },
  ];
}

export const RECORDS: RecordInfo[] = [
  {
    name: "highest_rating",
    slug: "highest-rating",
    group: "ratings",
    methodology: true,
    subject: "athlete",
    weights: true,
  },
  {
    name: "longest_at_1",
    slug: "longest-at-1",
    group: "ratings",
    methodology: true,
    subject: "athlete",
    weights: true,
    views: weeks("longest_at_1"),
  },
  {
    name: "most_weeks_in_top_8",
    slug: "most-weeks-in-the-top-8",
    group: "ratings",
    methodology: true,
    subject: "athlete",
    weights: true,
    views: weeks("most_weeks_in_top_8"),
  },
  {
    name: "longest_p4p_1",
    slug: "longest-at-p4p-1",
    group: "ratings",
    methodology: true,
    subject: "athlete",
    weights: true,
    views: weeks("longest_p4p_1"),
  },
  {
    name: "biggest_p4p_lead",
    slug: "biggest-p4p-lead",
    group: "ratings",
    methodology: true,
    subject: "athlete",
    weights: true,
  },
  {
    name: "youngest_1",
    slug: "youngest-1",
    group: "ratings",
    methodology: true,
    subject: "athlete",
    weights: true,
    ascending: true,
  },
  {
    name: "most_world_tour_medals",
    slug: "most-world-tour-medals",
    group: "medals",
    subject: "athlete",
    weights: true,
    views: [
      { key: "total", name: "most_world_tour_medals" },
      { key: "gold", name: "most_world_tour_golds" },
    ],
  },
  {
    name: "most_medals_in_row",
    slug: "most-medals-in-a-row",
    group: "medals",
    subject: "athlete",
    weights: true,
    views: [
      { key: "total", name: "most_medals_in_row" },
      { key: "gold", name: "most_golds_in_row" },
    ],
  },
  {
    name: "youngest_grand_slam_medal",
    slug: "youngest-grand-slam-medal",
    group: "medals",
    subject: "athlete",
    weights: true,
    ascending: true,
    views: [
      { key: "any", name: "youngest_grand_slam_medal" },
      { key: "gold", name: "youngest_grand_slam_gold" },
    ],
  },
  {
    name: "longest_medal_span",
    slug: "longest-medal-span",
    group: "medals",
    subject: "athlete",
    weights: true,
  },
  {
    name: "best_finals_record",
    slug: "best-finals-record",
    group: "medals",
    subject: "athlete",
    weights: true,
  },
  {
    name: "least_likely_champion",
    slug: "least-likely-champion",
    group: "medals",
    methodology: true,
    subject: "athlete",
    weights: true,
    ascending: true,
  },
  {
    name: "longest_winning_streak",
    slug: "longest-winning-streak",
    group: "contests",
    subject: "athlete",
    weights: true,
  },
  {
    name: "biggest_upsets",
    slug: "biggest-upsets",
    group: "contests",
    methodology: true,
    subject: "pair",
    weights: true,
    ascending: true,
  },
  {
    name: "giant_killer",
    slug: "giant-killer",
    group: "contests",
    methodology: true,
    subject: "athlete",
    weights: true,
  },
  {
    name: "golden_score_king",
    slug: "golden-score-king",
    group: "contests",
    subject: "athlete",
    weights: true,
  },
  {
    name: "longest_contest",
    slug: "longest-contest",
    group: "contests",
    subject: "pair",
    weights: true,
  },
  {
    name: "greatest_rivalry",
    slug: "greatest-rivalry",
    group: "rivalries",
    methodology: true,
    subject: "pair",
    weights: true,
  },
  {
    name: "longest_rivalry",
    slug: "longest-rivalry",
    group: "rivalries",
    subject: "pair",
    weights: true,
  },
  {
    name: "nemesis",
    slug: "nemesis",
    group: "rivalries",
    methodology: true,
    subject: "pair",
    weights: true,
  },
  {
    name: "strongest_tournament",
    slug: "strongest-tournament",
    group: "tournaments",
    methodology: true,
    subject: "tournament",
  },
  {
    name: "most_nations_on_podium",
    slug: "most-nations-on-the-podium",
    group: "tournaments",
    subject: "tournament",
  },
  {
    name: "most_unpredictable_tournament",
    slug: "most-unpredictable-tournament",
    group: "tournaments",
    methodology: true,
    subject: "tournament",
  },
  {
    name: "highest_team_rating",
    slug: "highest-team-rating",
    group: "nations",
    methodology: true,
    subject: "nation",
  },
  {
    name: "most_medals_nation",
    slug: "most-medals",
    group: "nations",
    subject: "nation",
  },
  {
    name: "deepest_team",
    slug: "deepest-team",
    group: "nations",
    methodology: true,
    subject: "nation",
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
  "most-weeks-in-the-top-10": "most-weeks-in-the-top-8",
};

// The view of a record picked by ?view= (the first when none or unknown).
export function recordView(info: RecordInfo, key?: string): RecordView {
  const views = info.views ?? [{ key: "", name: info.name }];
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
