// Head-to-head: the form, the comparison, the chart.

export const h2h = {
  meta: {
    title: "Judo head-to-head, compare two judoka",
    description: "Compare any two judoka: their ratings over time, the chance of each to win today and every contest between them.",
    pairTitle: "{a} vs {b}",
    pairDescription: "Head-to-head: their ratings, the chance of each to win today and every contest between them.",
  },
  title: "Head-to-head",
  lead: "Compare two athletes: ratings, win chance and every meeting.",
  form: {
    weightCategory: "Weight category",
    chooseWeight: "Choose weight",
    athlete: "Athlete {n}", // Athlete 1, Athlete 2
    clear: "Clear",
    searchAthlete: "Search athlete",
    noAthletes: "No athletes found",
  },
  popular: {
    title: "Popular matchups",
    athletes: "Athletes",
    score: "Score",
    lastMeeting: "Last meeting",
  },
  comparison: {
    currentChances: "Current chances",
    howRatingsWork: "How ratings work",
    athlete: "Athlete",
    rank: "Rank",
    rating: "Rating",
    skill: "Skill",
    rd: "RD",
    days90: "90 days",
    winsLosses12m: "W–L 12m",
    chance: "Chance",
    note: "Chance from the ratings. Rating = skill − RD.",
    notMet: "They have not met in IJF events yet.",
    // the meetings' heading
    noMeetings: "No meetings yet",
    level: "Level at {a}–{b}",
    leads: "{name} leads {high}–{low}",
    // the meetings table's heads, for screen readers
    date: "Date",
    tournament: "Tournament",
    round: "Round",
    winner: "Winner",
    winnersChance: "Winner's chance",
    upset: "Upset",
    theContest: "The contest",
  },
  chart: {
    rating: "Rating",
    // the chart's aria-label
    label: "Rating of {a} and {b}, {from} to {to}",
  },
};
