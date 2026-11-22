// The levels of a tournament, most important first, and which judobase levels
// (competition.rank_name) each holds: the athlete page's Results and its contests'
// level filter, a nation's tournaments. A level is an id; its name is in the
// dictionary (d.common.levels[id]), its short form for a phone in d.athlete.results.short.
export type LevelId = "olympics" | "worlds" | "continental" | "masters" | "grandSlam" | "grandPrix" | "opens" | "other";

export const LEVELS: { id: LevelId; holds: (rank: string) => boolean }[] = [
  { id: "olympics", holds: (r) => r === "Olympic Games" },
  { id: "worlds", holds: (r) => r.startsWith("World Championships") },
  { id: "continental", holds: (r) => r.endsWith("Championships") },
  { id: "masters", holds: (r) => r === "Masters" },
  { id: "grandSlam", holds: (r) => r === "Grand Slam" },
  { id: "grandPrix", holds: (r) => r === "Grand Prix" },
  { id: "opens", holds: (r) => r.endsWith("Open") || r.endsWith("Cup") },
  { id: "other", holds: () => true },
];

// The level a judobase rank_name belongs to.
export const levelOf = (rank: string | null): LevelId => LEVELS.find((l) => l.holds(rank ?? ""))!.id;
