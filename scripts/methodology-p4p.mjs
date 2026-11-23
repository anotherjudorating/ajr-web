// The methodology's pound-for-pound and nations snapshots (src/data/methodology.json,
// keys "p4p" and "nations"): every weight's top eight on a day, and the top eight
// nations with their best athlete in every weight, read from the local copy of
// production (the Docker container ajr-bench, schema ajr, read-only).
//
//   node scripts/methodology-p4p.mjs [--day 2026-11-13] [--container ajr-bench] [--check]
//
// The formulas are the backend's (ajr-backend/migrations/versions):
// - ajr.board_at(weight, day), 71f3c9a0b5e8 and b5d1f7a3e940: a weight's table on a
//   day, score = rating − RD, the site's "rating";
// - ajr.p4p_full(gender, day), b5d1f7a3e940 (api.p4p of 4ae485321e30 before): the
//   candidates are the top 3 of every weight, each set against the average score of
//   the 7 best OTHER athletes of their weight (for the leader, places 2 to 8), gap =
//   score − that average, ranked by gap, an athlete on two weights' tables once, with
//   the bigger gap;
// - ajr.teams_full(kind, day), 71f3c9a0b5e8 (api.teams of 4ae485321e30 before): a
//   nation's rating is the average over the weights of its best athlete's score, a
//   weight with nobody counting as the last place of that weight's table; also the
//   weights it leads among the nations and the weights where it is in the top 8.
//
// The script computes both orders from the snapshot it writes and compares them with
// the functions' (the --check flag only compares, writes nothing). The top eight of a
// weight is enough for the P4P gap: a candidate's 7 best others are all in the top 8.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const arg = (name, fallback) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > 0 ? process.argv[at + 1] : fallback;
};
const CONTAINER = arg("container", "ajr-bench");
const CHECK_ONLY = process.argv.includes("--check");
const FILE = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "methodology.json");

const MEN = ["-60", "-66", "-73", "-81", "-90", "-100", "+100"];
const WOMEN = ["-48", "-52", "-57", "-63", "-70", "-78", "+78"];

function sql(query) {
  const out = execFileSync("docker", ["exec", CONTAINER, "psql", "-U", "postgres", "-At", "-c", query], { encoding: "utf8" });
  return out.trim();
}
const literal = (s) => `'${s.replace(/'/g, "''")}'`;
const weightsArray = (weights) => `array[${weights.map(literal).join(", ")}]`;

const DAY = arg("day", sql("select max(fought_on) from ajr.rating_change"));

// Every weight's top eight on the day: id, names, nation, score (rounded) and place.
function boards(weights) {
  return JSON.parse(
    sql(`
      with w as (select weight, ord from unnest(${weightsArray(weights)}) with ordinality w(weight, ord))
      select json_agg(json_build_object('weight', w.weight, 'athletes', (
          select json_agg(json_build_object(
              'id', b.athlete_id, 'family', a.family_name, 'given', a.given_name, 'ioc', co.ioc,
              'rating', round(b.score)::integer, 'place', b.place) order by b.place)
          from (select * from ajr.board_at(w.weight, date ${literal(DAY)}) order by place limit 8) b
          join ajr.athlete a on a.id = b.athlete_id
          left join ajr.country co on co.id = a.country_id
      )) order by w.ord)
      from w`),
  );
}

// The pound-for-pound order from a snapshot, the backend's rule (see the header).
function p4pFrom(columns) {
  const byAthlete = new Map();
  for (const c of columns) {
    for (const a of c.athletes.slice(0, 3)) {
      const others = c.athletes.filter((o) => o.id !== a.id).slice(0, 7);
      if (!others.length) continue;
      const gap = a.rating - others.reduce((s, o) => s + o.rating, 0) / others.length;
      const seen = byAthlete.get(a.id);
      if (!seen || seen.gap < gap) byAthlete.set(a.id, { id: a.id, weight: c.weight, gap });
    }
  }
  return [...byAthlete.values()].sort((x, y) => y.gap - x.gap);
}

// The top eight nations and, for each, its best athlete in every weight (null for none).
function nations(kind, weights) {
  return JSON.parse(
    sql(`
      with w as (select weight, ord from unnest(${weightsArray(weights)}) with ordinality w(weight, ord)),
      boards as (
          select w.weight, b.athlete_id, b.score
          from w cross join lateral ajr.board_at(w.weight, date ${literal(DAY)}) b
      ),
      best as (
          select distinct on (b.weight, a.country_id) b.weight, a.country_id, b.athlete_id, b.score, a.family_name, a.given_name
          from boards b join ajr.athlete a on a.id = b.athlete_id
          where a.country_id is not null
          order by b.weight, a.country_id, b.score desc
      ),
      ranked as (select *, rank() over (partition by weight order by score desc) as nation_place from best),
      last as (select weight, round(min(score))::integer as score from boards group by weight),
      top as (select * from ajr.teams_full(${literal(kind)}, date ${literal(DAY)}) where place <= 8)
      select json_build_object(
          'weights', (select json_agg(json_build_object('weight', w.weight, 'last', l.score) order by w.ord) from w join last l using (weight)),
          'rows', (
              select json_agg(json_build_object(
                  'place', t.place, 'ioc', t.country, 'name', t.country_name, 'rating', t.rating,
                  'led', t.weights_led, 'top8', t.weights_top8,
                  'cells', (
                      select json_agg(case when r.athlete_id is null then null else json_build_object(
                          'id', r.athlete_id, 'family', r.family_name, 'given', r.given_name,
                          'rating', round(r.score)::integer, 'nationPlace', r.nation_place) end order by w.ord)
                      from w left join ranked r on r.weight = w.weight and r.country_id = co.id
                  )) order by t.place)
              from top t join ajr.country co on co.ioc = t.country
          ))`),
  );
}

// The snapshot's P4P order against ajr.p4p_full, the nations' ratings against
// ajr.teams_full (the function's values are in the snapshot, the averages recomputed).
function check(gender, columns, table) {
  const ours = p4pFrom(columns);
  const theirs = sql(`select athlete_id, weight, gap from ajr.p4p_full(${literal(gender)}, date ${literal(DAY)}) order by place, family_name`)
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split("|"))
    .map(([id, weight, gap]) => ({ id: Number(id), weight, gap: Number(gap) }));
  const n = Math.min(ours.length, theirs.length);
  let ok = ours.length === theirs.length;
  for (let i = 0; i < n; i++) {
    const a = ours[i];
    const b = theirs[i];
    // rounded scores (and the function's rounded gap) can move a gap by 1.5 and swap two neighbours a point apart
    const same = a.id === b.id && a.weight === b.weight && Math.abs(a.gap - b.gap) <= 1.5;
    const swapped = i + 1 < n && a.id === theirs[i + 1].id && ours[i + 1].id === b.id && Math.abs(a.gap - ours[i + 1].gap) <= 3;
    if (!same && !swapped) {
      ok = false;
      console.error(`${gender} P4P #${i + 1}: snapshot ${a.id} ${a.weight} gap ${a.gap.toFixed(1)}, ajr.p4p_full ${b.id} ${b.weight} gap ${b.gap}`);
    }
  }
  console.log(`${gender} P4P: ${ours.length} candidates, ${ok ? "same order as" : "DIFFERS from"} ajr.p4p_full; #1 ${ours[0].id} at ${ours[0].weight}, gap ${ours[0].gap.toFixed(1)}`);

  let teamsOk = true;
  table.rows.forEach((r, i) => {
    const avg = r.cells.reduce((s, c, j) => s + (c ? c.rating : table.weights[j].last), 0) / table.weights.length;
    const led = r.cells.filter((c) => c && c.nationPlace === 1).length;
    const top8 = r.cells.filter((c) => c && c.nationPlace <= 8).length;
    if (Math.abs(avg - r.rating) > 1 || led !== r.led || top8 !== r.top8 || r.place !== i + 1) {
      teamsOk = false;
      console.error(`${gender} nations #${r.place} ${r.ioc}: snapshot average ${avg.toFixed(1)}, led ${led}, top 8 ${top8}; ajr.teams_full ${r.rating}, ${r.led}, ${r.top8}`);
    }
  });
  console.log(`${gender} nations: ${table.rows.length} rows, ${teamsOk ? "averages match" : "DIFFER from"} ajr.teams_full; #1 ${table.rows[0].ioc} ${table.rows[0].rating}`);
  return ok && teamsOk;
}

const men = boards(MEN);
const women = boards(WOMEN);
const menNations = nations("men", MEN);
const womenNations = nations("women", WOMEN);
const fine = check("men", men, menNations) && check("women", women, womenNations);
if (!fine) process.exit(1);
if (CHECK_ONLY) process.exit(0);

// The P4P place of every candidate, into the snapshot (the widget's readout).
for (const columns of [men, women]) {
  const places = new Map(p4pFrom(columns).map((c, i) => [`${c.id}@${c.weight}`, i + 1]));
  for (const c of columns) for (const a of c.athletes) {
    const place = places.get(`${a.id}@${c.weight}`);
    if (place) a.p4p = place;
  }
}

// The file as Python's json.dumps writes it (the other keys' generator): one line, a
// space after every comma and colon.
function dumps(value) {
  if (Array.isArray(value)) return `[${value.map(dumps).join(", ")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value).map(([k, v]) => `${JSON.stringify(k)}: ${dumps(v)}`).join(", ")}}`;
  return JSON.stringify(value);
}

const data = JSON.parse(readFileSync(FILE, "utf8"));
data.p4p = { day: DAY, men, women };
data.nations = { day: DAY, men: menNations, women: womenNations };
writeFileSync(FILE, dumps(data));
console.log(`wrote ${FILE}: p4p and nations as of ${DAY}`);
