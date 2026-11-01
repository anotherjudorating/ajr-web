// The all-time records: their groups (tabs of /records), titles and page texts.
// `name` is the backend's record name, `slug` the URL part of its full list.

export const GROUPS = [
  { key: "ratings", title: "Ratings" },
  { key: "medals", title: "Medals" },
  { key: "contests", title: "Contests" },
  { key: "tournaments", title: "Tournaments" },
  { key: "nations", title: "Nations" },
] as const;
export type Group = (typeof GROUPS)[number]["key"];

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
  weights?: boolean; // rows have a weight: the full list can be filtered by it
  ascending?: boolean; // the best value is the smallest (youngest, least likely)
  sortLabel: string; // "Sort: peak ↓"
};

export const RECORDS: RecordInfo[] = [
  {
    name: "highest_rating",
    slug: "highest-rating",
    group: "ratings",
    title: "Highest rating",
    description: "The highest rating each athlete ever reached, one row per athlete.",
    methodology: true,
    subject: "athlete",
    noun: "athletes",
    weights: true,
    sortLabel: "peak",
  },
  {
    name: "biggest_lead",
    slug: "biggest-lead-at-1",
    group: "ratings",
    title: "Biggest lead at #1",
    description: "The biggest lead of a #1 over the #2 of the same week, one row per athlete.",
    methodology: true,
    subject: "athlete",
    noun: "athletes",
    weights: true,
    sortLabel: "lead",
  },
  {
    name: "longest_at_1",
    slug: "longest-at-1",
    group: "ratings",
    title: "Longest at #1",
    description: "Weeks at #1 of a weight's ranking, in total; the weight is the one with the most weeks.",
    methodology: true,
    subject: "athlete",
    noun: "athletes",
    weights: true,
    sortLabel: "weeks",
  },
  {
    name: "youngest_1",
    slug: "youngest-1",
    group: "ratings",
    title: "Youngest #1",
    description: "The youngest athletes to reach #1 of a weight's ranking. Age by the year of birth.",
    methodology: true,
    subject: "athlete",
    noun: "athletes",
    weights: true,
    ascending: true,
    sortLabel: "age",
  },
  {
    name: "biggest_tournament_gain",
    slug: "biggest-gain-at-one-tournament",
    group: "ratings",
    title: "Biggest gain at one tournament",
    description: "The most rating points an athlete gained at one tournament.",
    methodology: true,
    subject: "athlete",
    noun: "results",
    weights: true,
    sortLabel: "gain",
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
    sortLabel: "medals",
  },
  {
    name: "most_medals_in_row",
    slug: "most-medals-in-a-row",
    group: "medals",
    title: "Most medals in a row",
    description: "IJF World Tour events and Olympic Games in a row finished with a medal.",
    subject: "athlete",
    noun: "athletes",
    sortLabel: "in a row",
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
  },
  {
    name: "longest_winning_streak",
    slug: "longest-winning-streak",
    group: "contests",
    title: "Longest winning streak",
    description: "Contests won in a row.",
    subject: "athlete",
    noun: "athletes",
    sortLabel: "wins",
  },
  {
    name: "biggest_upsets",
    slug: "biggest-upsets",
    group: "contests",
    title: "Biggest upsets",
    description: "Wins the rating gave the smallest chance before the contest.",
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
    description: "Wins with a chance of 30% or less before the contest.",
    methodology: true,
    subject: "athlete",
    noun: "athletes",
    sortLabel: "upset wins",
  },
  {
    name: "most_frequent_rivalry",
    slug: "most-frequent-rivalry",
    group: "contests",
    title: "Most frequent rivalry",
    description: "The pairs of athletes who met most often.",
    subject: "pair",
    noun: "rivalries",
    sortLabel: "contests",
  },
  {
    name: "strongest_tournament",
    slug: "strongest-tournament",
    group: "tournaments",
    title: "Strongest tournament",
    description: "The average rating, before the tournament, of the 8 best entrants of each weight.",
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
    description: "Tournaments whose contests the rating predicted worst (the highest log loss).",
    methodology: true,
    subject: "tournament",
    noun: "tournaments",
    sortLabel: "log loss",
  },
  {
    name: "most_predictable_tournament",
    slug: "most-predictable-tournament",
    group: "tournaments",
    title: "Most predictable tournament",
    description: "Tournaments whose contests the rating predicted best (the lowest log loss).",
    methodology: true,
    subject: "tournament",
    noun: "tournaments",
    ascending: true,
    sortLabel: "log loss",
  },
  {
    name: "highest_team_rating",
    slug: "highest-team-rating",
    group: "nations",
    title: "Highest team rating",
    description: "The highest team rating each nation reached.",
    methodology: true,
    subject: "nation",
    noun: "nations",
    sortLabel: "rating",
  },
  {
    name: "longest_at_1_nation",
    slug: "longest-at-1-nation",
    group: "nations",
    title: "Longest at #1 nation",
    breakAfter: "Longest",
    description: "Weeks at #1 of the team ranking, in total.",
    methodology: true,
    subject: "nation",
    noun: "nations",
    sortLabel: "weeks",
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
    name: "most_medals_one_tournament",
    slug: "most-medals-at-one-tournament",
    group: "nations",
    title: "Most medals at one tournament",
    breakAfter: "Most medals",
    description: "The most medals one nation won at one tournament.",
    subject: "nation",
    noun: "results",
    sortLabel: "medals",
  },
];

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
