// A contest's page.

export const contest = {
  meta: {
    names: "{white} vs {blue}",
    title: "{names} — {round}, {competition}",
    noRound: "contest", // a contest whose stage is not known
  },
  tournaments: "Tournaments", // the breadcrumb
  contest: "Contest", // the breadcrumb's last step when the stage is not known
  heading: "{white} vs {blue} — {round}, {weight}, {competition}",
  result: {
    title: "Contest result",
    athlete: "Athlete",
    // the scores: ippon, waza-ari, yuko
    ippon: "I",
    wazaari: "W",
    yuko: "Y",
    shido: "Shido",
    result: "Result",
    win: "Win",
    notFoughtYet: "Not fought yet",
    walkover: "Walkover",
    notRated: "not rated",
    time: "Time",
    goldenScore: "GS",
  },
  walkover: {
    title: "Rating change",
    howRatingsWork: "How ratings work",
    fusen: "A walkover: {name} did not come out to fight (Fusen-Gachi).",
    nothingFought: "A walkover: nothing was fought, no clock and no score.",
    noChange: "A win without a fight says nothing about who is stronger, so it changes neither rating.",
  },
  ratingChange: {
    title: "Rating change",
    ifWins: "If this athlete wins",
    wins: "{name} wins", // the button that picks the winner of a contest to come
    howRatingsWork: "How ratings work",
    athlete: "Athlete",
    chance: "Chance",
    skill: "Skill",
    rd: "RD",
    rating: "Rating",
    formula: "Rating = skill − RD. Lower RD, higher rating.",
    picked: "Not fought yet: what the result picked would do.",
  },
  road: {
    title: "Road to the {round}", // the stage in lower case
    titleContest: "Road to the contest",
    first: "First contest of the tournament.",
    upset: "Upset",
    theContest: "The contest",
  },
  meetings: {
    title: "Earlier meetings",
    level: "Level at {white}–{blue}",
    leads: "{name} leads {more}–{fewer}",
    headToHead: "Head-to-head",
    first: "Their first meeting.",
    firstBefore: "Their first meeting: none before this one.",
  },
};
