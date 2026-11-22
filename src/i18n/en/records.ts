// The records: the overview, each record page, the columns. The records themselves
// (slugs, backend names, kinds, views) are in lib/records.ts; their text is here, by
// the record's slug, and components/records/text.ts joins the two.

// One record's text. `breakAfter`: the title breaks after these words on phones, as in
// the design, so it belongs to the title's language. `views`: by the view's key; the
// first view's description is the record's and is left out.
export type RecordText = {
  title: string;
  breakAfter?: string;
  description: string;
  noun: string; // "1–20 of 312 athletes"
  sortLabel: string; // "Sort: peak ↓"
  views?: Record<string, { label: string; description?: string }>;
};

// Marks a record's text, so that every entry has the one type (a translation may
// break a title where English does not).
const record = (text: RecordText): RecordText => text;

export const records = {
  meta: {
    title: "All-time judo records",
    description: "All-time judo records: highest ratings, longest reigns at #1, most medals, biggest upsets and more.",
  },
  // "Highest rating, judo record": a record page's title tag
  pageTitle: "{title}, judo record",
  title: "Records",
  // {judobase} is the link to the IJF database, with the text below.
  lead: "All-time bests, based only on contests available in the {judobase}, from 2009.",
  judobase: "IJF judobase",
  howRatingsWork: "How ratings work",
  // The tabs of /records.
  groups: {
    ratings: "Ratings",
    medals: "Medals",
    contests: "Contests",
    rivalries: "Rivalries",
    tournaments: "Tournaments",
    nations: "Nations",
  },
  // /records (components/records/RecordsOverview.tsx).
  overview: {
    label: "Records", // before the group tabs
    groupsLabel: "Record groups", // the tabs' aria-label
    athletes: "Athletes", // before the Men/Women filter
    all: "All",
    fullList: "Full list",
  },
  viewSwitch: {
    label: "View",
  },
  // A record's full list (components/records/RecordBrowser.tsx).
  browser: {
    // The search box, by what one row is about.
    search: {
      athlete: "Search athlete",
      tournament: "Search tournament",
      nation: "Search nation",
    },
    menAndWomen: "Men and women",
    allWeights: "All weights",
    sortValueDesc: "Sort: {label} ↓",
    sortValueAsc: "Sort: {label} ↑",
    sortDateDesc: "Sort: date ↓",
    sortDateAsc: "Sort: date ↑",
    exportCsv: "Export CSV",
    empty: "No {noun} match these filters.",
  },
  // The headers of the records' tables (components/records/columns.tsx).
  columns: {
    athlete: "Athlete",
    nat: "Nat",
    weight: "Weight",
    // "Men −73": a row's weight without the unit
    weightName: "{gender} {label}",
    peak: "Peak",
    date: "Date",
    weeks: "Weeks",
    until: "Until",
    lead: "Lead",
    age: "Age",
    total: "Total",
    inARow: "In a row",
    period: "Period",
    tournament: "Tournament",
    wins: "Wins",
    avgChance: "Avg chance",
    overNo1: "Over #1",
    upsetWins: "Upset wins",
    winnerLoser: "Winner / loser",
    chance: "Chance",
    avgRating: "Avg rating",
    avg: "Avg", // the same header on phones
    avgRatingTip: "Average rating of the entrants",
    nations: "Nations",
    nationsTip: "Nations with at least one medal",
    upsets: "Upsets",
    upsetsTip: "Contests the rating favourite lost",
    favWon: "Fav. won",
    favWonTip: "Contests won by the rating favourite",
    rating: "Rating",
    golds: "Golds",
    medals: "Medals",
    years: "Years",
    finals: "Finals",
    won: "Won",
    wonShare: "Won %",
    contests: "Contests",
    time: "Time",
    athletes: "Athletes",
    meetings: "Meetings",
    score: "Score",
    nemesisOpponent: "Nemesis / opponent",
    weights: "Weights",
    inTop10: "In top 10",
    nation: "Nation",
  },
  // Each record's text, by its slug (lib/records.ts).
  list: {
    "highest-rating": record({
      title: "Highest rating",
      description: "The highest rating each athlete reached since 2011, one row per athlete.",
      noun: "athletes",
      sortLabel: "peak",
    }),
    "longest-at-1": record({
      title: "Longest at #1",
      description: "Weeks at #1 of a weight's ranking since 2011, in total; the weight is the one with the most weeks.",
      noun: "athletes",
      sortLabel: "weeks",
      views: {
        total: { label: "Total" },
        "in-a-row": { label: "In a row", description: "The longest unbroken run at #1 of a weight's ranking since 2011." },
      },
    }),
    "most-weeks-in-the-top-8": record({
      title: "Most weeks in the top 8",
      breakAfter: "Most weeks",
      description:
        "Weeks in the top 8 of a weight's ranking (the seeds of a World Championships or an Olympics) since 2011, in total; a week counts once even if the athlete stood in two weights.",
      noun: "athletes",
      sortLabel: "weeks",
      views: {
        total: { label: "Total" },
        "in-a-row": { label: "In a row", description: "The longest unbroken run in the top 8 of a weight's ranking since 2011." },
      },
    }),
    "longest-at-p4p-1": record({
      title: "Longest at P4P #1",
      breakAfter: "Longest",
      description: "Weeks at #1 of the pound-for-pound ranking, men and women apart, since 2011, in total.",
      noun: "athletes",
      sortLabel: "weeks",
      views: {
        total: { label: "Total" },
        "in-a-row": {
          label: "In a row",
          description: "The longest unbroken run at #1 of the pound-for-pound ranking, men and women apart, since 2011.",
        },
      },
    }),
    "biggest-p4p-lead": record({
      title: "Biggest P4P lead",
      description: "The biggest lead of a pound-for-pound #1 over the 7 best others of their weight, since 2011.",
      noun: "athletes",
      sortLabel: "lead",
    }),
    "youngest-1": record({
      title: "Youngest #1",
      description: "The youngest athletes to reach #1 of a weight's ranking since 2011. Age by the year of birth.",
      noun: "athletes",
      sortLabel: "age",
    }),
    "most-world-tour-medals": record({
      title: "Most World Tour medals",
      breakAfter: "Most",
      description: "Medals at IJF World Tour events and the Olympic Games, one row per athlete.",
      noun: "athletes",
      sortLabel: "medals",
      views: {
        total: { label: "Total" },
        gold: { label: "Gold", description: "Gold medals at IJF World Tour events and the Olympic Games, one row per athlete." },
      },
    }),
    "most-medals-in-a-row": record({
      title: "Most medals in a row",
      description: "IJF World Tour events and Olympic Games in a row finished with a medal.",
      noun: "athletes",
      sortLabel: "in a row",
      views: {
        total: { label: "Total" },
        gold: { label: "Gold", description: "IJF World Tour events and Olympic Games won in a row." },
      },
    }),
    "youngest-grand-slam-medal": record({
      title: "Youngest Grand Slam medal",
      breakAfter: "Youngest",
      description: "The youngest athletes to win a Grand Slam medal. Age by the year of birth.",
      noun: "athletes",
      sortLabel: "age",
      views: {
        any: { label: "Any medal" },
        gold: { label: "Gold", description: "The youngest Grand Slam champions. Age by the year of birth." },
      },
    }),
    "longest-medal-span": record({
      title: "Longest medal span",
      description: "The most years between an athlete's first and last medal at IJF World Tour events and the Olympic Games.",
      noun: "athletes",
      sortLabel: "years",
    }),
    "best-finals-record": record({
      title: "Best finals record",
      description: "The share of finals won at IJF World Tour events and the Olympic Games, for athletes with at least 10 finals.",
      noun: "athletes",
      sortLabel: "won",
    }),
    "least-likely-champion": record({
      title: "Least likely champion",
      breakAfter: "Least likely",
      description: "World Tour champions the rating gave the smallest chance of winning every contest of their bracket, since 2011.",
      noun: "titles",
      sortLabel: "chance",
    }),
    "longest-winning-streak": record({
      title: "Longest winning streak",
      description: "Contests won in a row.",
      noun: "athletes",
      sortLabel: "wins",
    }),
    "biggest-upsets": record({
      title: "Biggest upsets",
      description: "Wins over an athlete in the top 10 of the weight that the rating gave the smallest chance before the contest, since 2011.",
      noun: "contests",
      sortLabel: "chance",
    }),
    "giant-killer": record({
      title: "Giant killer",
      description: "Wins as the underdog over athletes in the top 10 of the weight at the time, since 2011.",
      noun: "athletes",
      sortLabel: "upset wins",
    }),
    "golden-score-king": record({
      title: "Golden score king",
      description: "Contests won in golden score, since 2017.",
      noun: "athletes",
      sortLabel: "golden score wins",
    }),
    "longest-contest": record({
      title: "Longest contest",
      description: "The longest World Tour contests, golden score included.",
      noun: "contests",
      sortLabel: "time",
    }),
    "greatest-rivalry": record({
      title: "Greatest rivalry",
      description:
        "The pairs who met most often at the top and most evenly. Each meeting scores by the weaker athlete's rating before it, from 0 at 1900 to 1 at 2500; the sum is reduced for a one-sided head-to-head: Σ min(1, max(0, (rating − 1900) / 600)) × (1 − ((wins − losses) / meetings)²).",
      noun: "rivalries",
      sortLabel: "score",
    }),
    "longest-rivalry": record({
      title: "Longest rivalry",
      description:
        "The most years between a pair's first and last meeting. A pair that met only a few times counts for less: years × (meetings − 1) / (meetings + 1).",
      noun: "rivalries",
      sortLabel: "score",
    }),
    nemesis: record({
      title: "Nemesis",
      description:
        "Athletes who kept beating a stronger opponent. Only the meetings where the rating made them the underdog count: each adds the win beyond the chance they were given, more the stronger the opponent was: Σ (won − chance) × min(1, max(0, (opponent's rating − 1900) / 600)).",
      noun: "pairs",
      sortLabel: "score",
    }),
    "strongest-tournament": record({
      title: "Strongest tournament",
      description: "The average rating, before the tournament, of the 8 best entrants of each weight; since 2011.",
      noun: "tournaments",
      sortLabel: "avg rating",
    }),
    "most-nations-on-the-podium": record({
      title: "Most nations on the podium",
      description: "Tournaments whose medals went to the most nations.",
      noun: "tournaments",
      sortLabel: "nations",
    }),
    "most-unpredictable-tournament": record({
      title: "Most unpredictable tournament",
      breakAfter: "Most",
      description: "Tournaments whose contests the rating predicted worst (the highest log loss), since 2011.",
      noun: "tournaments",
      sortLabel: "log loss",
    }),
    "highest-team-rating": record({
      title: "Highest team rating",
      description: "The highest team rating each nation reached since 2011.",
      noun: "nations",
      sortLabel: "rating",
    }),
    "most-medals": record({
      title: "Most medals",
      description: "Medals at IJF World Tour events and the Olympic Games, by nation.",
      noun: "nations",
      sortLabel: "medals",
    }),
    "deepest-team": record({
      title: "Deepest team",
      description: "The most athletes of one nation in the top 10 of their weights on one day, since 2011.",
      noun: "nations",
      sortLabel: "athletes",
    }),
  },
};
