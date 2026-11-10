// The levels of a tournament, most important first, and which judobase levels
// (competition.rank_name) each holds: the athlete page's Results and its contests'
// level filter.
export const LEVELS: { title: string; holds: (rank: string) => boolean }[] = [
  { title: "Olympic Games", holds: (r) => r === "Olympic Games" },
  { title: "World Championships", holds: (r) => r.startsWith("World Championships") },
  { title: "Continental Championships", holds: (r) => r.endsWith("Championships") },
  { title: "Masters", holds: (r) => r === "Masters" },
  { title: "Grand Slam", holds: (r) => r === "Grand Slam" },
  { title: "Grand Prix", holds: (r) => r === "Grand Prix" },
  { title: "Continental Opens & Cups", holds: (r) => r.endsWith("Open") || r.endsWith("Cup") },
  { title: "Other", holds: () => true },
];

// The level a judobase rank_name belongs to.
export const levelOf = (rank: string | null) => LEVELS.find((l) => l.holds(rank ?? ""))!.title;
