// English left in a translated site: opens the typical pages of a language on a
// local server and looks for English words of the interface in the text and in the
// aria-label, placeholder and title attributes. Names of athletes, tournaments and
// nations come from the data in Latin letters by decision, so the text of links to
// their pages and the names themselves are not looked at. Fails (exit 1) on a find.
//
//   node scripts/i18n-check.mjs --lang ru [--site http://localhost:3000] [--words Rankings,Updated]
//
// Meaningful once the language's dictionary is translated: while ru.ts still holds the
// English strings (stage 1a), every page fails, which is the point of the check.

const arg = (name, fallback) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > 0 ? process.argv[at + 1] : fallback;
};
const SITE = arg("site", "http://localhost:3000").replace(/\/$/, "");
const LANG = arg("lang", "ru");
// Words of the interface that cannot be part of a Latin-script name.
const WORDS = arg(
  "words",
  [
    "Rankings", "Explore", "Head-to-head", "Records", "Methodology", "Contact", "Export", "Search",
    "Updated", "updated", "Source", "Upcoming", "Biggest", "movers", "Upsets", "upsets", "Final", "Semi-final",
    "contests", "contest", "medals", "medal", "weeks", "week", "points", "rating", "Rating", "chance", "Show",
    "Showing", "Shown", "Athletes", "Tournaments", "Nations", "Men", "Women", "Mixed", "Teams", "Gold", "Silver",
    "Bronze", "results", "Results", "Download", "Filter", "Sort", "Page", "Next", "Previous", "Open", "Close",
  ].join(","),
).split(",");
const WORD_RE = new RegExp(`(^|[^\\p{L}])(${WORDS.join("|")})(?=$|[^\\p{L}])`, "u");
// Not words of the interface: the site's name, a file's name, a tournament's name
// (its level in English: "Taipei Asian Open 2026") outside a link, a judobase level.
const NOT_WORDS = [
  /Another Judo Rating(, rating history)?/g,
  /\S+\.(?:csv|gz|md|json)\b/g,
  /\b(?:[A-Z][\w'.-]+ )+(?:Grand Slam|Grand Prix|Open|Cup|Masters|Championships|Games|Mixed Teams)\b(?: Mixed Teams)?( \d{4})?/g,
  /(?<=\p{Script=Cyrillic}\.? )Open\b/gu, // a level's name kept in Latin ("континентальные Open", "Конт. Open")
  /rating deviation/g, // RD spelled out
];
const ALL = process.argv.includes("--all");

const prefix = LANG === "en" ? "" : `/${LANG}`;
const text = async (path) => {
  const response = await fetch(`${SITE}${path}`, { headers: { accept: "text/html" } });
  if (!response.ok) throw new Error(`${path}: ${response.status}`);
  return response.text();
};
const first = (html, re) => html.match(re)?.[1];

// The pages: the home, every table, the records, the lists, the long pages, one
// athlete, one tournament (both from the home page's links), one nation.
async function pages() {
  const home = await text(`${prefix}/`);
  const athlete = first(home, /href="(?:\/[a-z]{2})?(\/athletes\/\d+)"/);
  const tournament = first(home, /href="(?:\/[a-z]{2})?(\/tournaments\/\d+)"/);
  const weights = ["men-60", "men-66", "men-73", "men-81", "men-90", "men-100", "men-plus-100", "women-48", "women-52", "women-57", "women-63", "women-70", "women-78", "women-plus-78"];
  return [
    "/",
    ...weights.map((w) => `/rankings/${w}`),
    "/rankings/p4p/men",
    "/rankings/p4p/women",
    "/rankings/teams/mixed",
    "/records",
    "/records/highest-rating",
    "/records/most-medals",
    "/explore/tournaments",
    "/explore/athletes",
    "/explore/contests",
    "/explore/nations",
    "/head-to-head",
    "/methodology",
    "/data",
    "/contact",
    "/countries/jpn",
    ...(athlete ? [athlete] : []),
    ...(tournament ? [tournament] : []),
  ].map((path) => `${prefix}${path === "/" ? "" : path}` || "/");
}

// The page's words: the text outside scripts and styles, without the text of the
// links to athletes, tournaments and nations, plus the attributes read aloud or shown.
function strings(html) {
  let body = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<a\b[^>]*href="(?:\/[a-z]{2})?\/(?:athletes|tournaments|countries)\/[^"]*"[^>]*>[\s\S]*?<\/a>/g, " ");
  const found = [];
  for (const m of body.matchAll(/\b(?:aria-label|placeholder|title|alt)="([^"]*)"/g)) found.push(m[1]);
  for (const m of body.replace(/<[^>]+>/g, "\n").matchAll(/[^\n]+/g)) {
    const line = m[0].replace(/&[a-z#0-9]+;/g, " ").trim();
    if (line) found.push(line);
  }
  return found;
}

const list = await pages();
let failures = 0;
for (const path of list) {
  try {
    const hits = strings(await text(path)).filter((s) => WORD_RE.test(NOT_WORDS.reduce((rest, re) => rest.replace(re, " "), s)));
    if (hits.length) {
      failures++;
      console.log(`${path}: ${hits.length} English strings, e.g. ${JSON.stringify(ALL ? hits : hits.slice(0, 3))}`);
    } else {
      console.log(`${path}: clean`);
    }
  } catch (error) {
    failures++;
    console.log(`${path}: ${error.message}`);
  }
}
console.log(failures ? `${failures} of ${list.length} pages with English left` : `${list.length} pages clean`);
process.exit(failures ? 1 : 0);
