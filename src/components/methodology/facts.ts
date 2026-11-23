// The facts the page and its figures share (plain values: the page is a server
// component, the figures run in the browser).

// Paris 2024, women −52 kg, the round of 16 (contest 784746): both athletes before and
// after it.
export const PARIS = {
  abe: { name: "Abe U.", country: "JPN", skill: 2824.889, rd: 176.676, volatility: 0.059966, rating: 2648, after: { skill: 2671, rd: 173, rating: 2498 } },
  keldiyorova: { name: "Keldiyorova D.", country: "UZB", skill: 2301.903, rd: 107.213, volatility: 0.060006, rating: 2195, after: { skill: 2355, rd: 107, rating: 2249 } },
  next: 2360, // Buchard, second in our table
  abeChance: 0.8987,
  contest: 784746,
};

// Play the rating with this contest loaded (the interactive page's #play).
export function parisPlay() {
  const { abe, keldiyorova } = PARIS;
  const query = new URLSearchParams({
    a: `${abe.skill},${abe.rd},${abe.volatility}`,
    b: `${keldiyorova.skill},${keldiyorova.rd},${keldiyorova.volatility}`,
    an: abe.name,
    bn: keldiyorova.name,
    won: "b",
    contest: String(PARIS.contest),
  });
  return `/methodology?${query}#calc`;
}

// What the rating does not know (both pages' last chapter).
export const LIMITS = [
  "How a contest was won: an ippon in ten seconds counts the same as a win on shido, by hansoku-make or in golden score.",
  "Anything outside the senior individual contests the IJF judobase publishes: kata, juniors, cadets, veterans and team events (a junior world champion starts at 1500 like anyone), and a few World Championships of 2009 to 2011 are missing.",
  "Injuries, illness, a new coach, home crowds, a long day of contests, styles and grips: invisible until the results show them.",
  "How much a change of weight really costs a given athlete: the step is a flat 5% of the skill, once per move however far, the same for every weight, men and women.",
  "Results the IJF judobase has not published yet: a contest reaches the rating within about 20 minutes of appearing there.",
];

// Where a rating sits: the average of each place across the weights (11 November 2026).
export const SCALE_NOTE = "For scale: a #1 in a weight stands around 2400, a #10 around 2050, a #30 around 1830, a #50 around 1710.";

