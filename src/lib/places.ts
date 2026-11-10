// An athlete's place every Monday, from the tables job's places/<version>/athletes/<id>.json in R2
// (lib/tables.ts athletePlaces): the first week, then a week a row — the place in the
// weight's table, the weight, the place pound for pound (null outside the top) — null
// for a week outside every table.
export type Places = { from: string; weeks: ([number, string, number | null] | null)[] };

// The place on a day: the table of the Monday on or after it (a Monday's table holds
// the weekend before), or null when not in a table (or no file).
export function placeOn(places: Places | null, day: number): { place: number; weight: string; p4p: number | null } | null {
  if (!places) return null;
  const date = new Date(day);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + ((8 - date.getUTCDay()) % 7));
  const index = Math.round((date.getTime() - new Date(`${places.from}T00:00:00Z`).getTime()) / (7 * 86400e3));
  const week = places.weeks[index];
  return week ? { place: week[0], weight: week[1], p4p: week[2] } : null;
}
