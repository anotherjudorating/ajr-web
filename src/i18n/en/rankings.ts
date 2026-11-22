// The rankings: the weights, pound for pound, the nations, their tables and the panel.

export const rankings = {
  teams: "Teams",
  // WeightSwitcher: the small labels before the rows (a language may abbreviate)
  switcher: { men: "Men", women: "Women", teams: "Teams" },
  breadcrumb: "Rankings",
  // "−73 kg": a weight in a list or a column
  weightKg: "{label} kg",
  // the <title> of a past day's table
  pastTitle: "{title} on {date}",
  loading: "Loading…",
  // a weight's table (app/[lang]/rankings/[weight])
  weight: {
    title: "{weight} judo world ranking",
    strongest: "The strongest {weight} judoka",
    strongestOn: "The strongest {weight} judoka on {date}",
    description: "{strongest}: {leaders}.",
    descriptionShort: "{strongest}.",
  },
  // pound for pound (app/[lang]/rankings/p4p/[gender])
  p4p: {
    title: "{gender} pound for pound judo ranking",
    description: "The best {gender} judoka across all weights: how far each stands above the rest of their category.",
    breadcrumb: "{gender} pound for pound",
  },
  // the nations (app/[lang]/rankings/teams/[kind])
  nations: {
    title: "Judo nations ranking, {who}",
    who: { men: "men", women: "women", mixed: "men and women" },
    description: "Which country has the strongest judo team: each nation rated by its best athlete in every weight.",
    descriptionTop: "{description} {top}.",
    breadcrumb: "{gender} nations",
  },
  // TableParts: the toolbar over a table and the pages under it
  toolbar: {
    searchAthlete: "Search athlete",
    searchNation: "Search nation",
    allCountries: "All countries",
    asOf: "Ranking as of this date",
    exportCsv: "Export CSV",
  },
  pagination: {
    range: "{from}–{to} of {count}", // "1–50 of 625 athletes"
    show: "Show",
  },
  sorts: {
    ratingDesc: "Sort: rating ↓",
    ratingAsc: "Sort: rating ↑",
    d90Desc: "Sort: +/− 90 days ↓",
    d90Asc: "Sort: +/− 90 days ↑",
    d6mDesc: "Sort: +/− 6 months ↓",
    d6mAsc: "Sort: +/− 6 months ↑",
    ledDesc: "Sort: top 1 ↓",
    top8Desc: "Sort: top 8 ↓",
    leadDesc: "Sort: lead ↓",
    leadAsc: "Sort: lead ↑",
  },
  // the tables' header cells
  columns: {
    athlete: "Athlete",
    nat: "NAT",
    country: "Country",
    weight: "Weight",
    rating: "Rating",
    age: "Age",
    last: "Last",
    trend: "Trend",
    d90: "90d",
    m6: "6m",
    change6m: "+/- 6m",
    lead: "Lead",
    nation: "Nation",
    top1: "Top 1",
    top8: "Top 8",
    leadersAvg: "Leaders avg",
    leadersRatingAvg: "Leaders rating avg",
  },
  // what the header cells say on hover
  tips: {
    rank90: "Rank change, last 90 days",
    rating90: "Rating change, last 90 days",
    rank6m: "Rank change, last 182 days",
    rating6m: "Rating change, last 182 days",
    ijf: "Place in the IJF World Ranking List",
    ijfDifference: "IJF place compared with ours: ↓ lower in IJF, ↑ higher",
    lead: "Points ahead of the average of the next 7 in own weight",
    top1: "Weights where the nation has the best athlete of all nations",
    top8: "Weights where the nation's best athlete is among the 8 best nations",
    leadersAvg:
      "Average rating of the nation's best athlete in each of the {weights} weights; a weight without one counts as that table's last place",
  },
  // the rating cell's tip: how the shown rating is made
  score: {
    glicko: "Glicko-2 rating",
    minusRd: "− RD ({rd})",
  },
  showLast90: "Show last 90 days",
  noAthletes: "No athletes match these filters.",
  noNations: "No nations match these filters.",
  // Changes: an athlete not in the table back then
  changes: {
    new: "NEW",
    returning: "RE",
  },
  // AthletePanel: the expanded row
  panel: {
    ijf: "IJF World Ranking",
    last90: "Last 90 days",
    failed: "Could not load the contests.",
    none: "No contests in the last 90 days.",
    upset: "Upset",
    won: "W",
    lost: "L",
    contest: "The contest",
  },
  // Medal: the aria-label
  medal: {
    gold: "gold",
    silver: "silver",
    bronze: "bronze",
    predicted: "Predicted {kind}",
  },
  // chart.tsx: the names of a line's points and its tips
  chart: {
    today: "Today",
    weekOf: "Week of {date}",
    quarter: "Q{n} {year}",
    inactive: "inactive",
    rank: "Rank",
    peak: "Peak {score}",
  },
};
