// The site's search, in the browser: the index of every rated athlete, tournament
// and nation (api.search_index, served by /api/search-index from the cache and the
// CDN) is fetched once, on the first focus of a search box, and searched here, so a
// search never reaches the database.

// As api.search_index sends them: lists of arrays, each in the order the search shows.
type IndexDocument = {
  athletes: [number, string | null, string | null, string | null, string | null, string | null, number | null, number | null][];
  tournaments: [number, string, string | null, string, string | null][];
  nations: [string, string][];
};

export type SearchHit = {
  kind: "athlete" | "tournament" | "nation";
  id: number | null;
  name: string | null;
  family_name: string | null;
  given_name: string | null;
  country: string | null;
  gender: string | null;
  weight: string | null;
  date_from: string | null;
  date_to: string | null;
};

export type AthleteHit = {
  id: number;
  family_name: string | null;
  given_name: string | null;
  country: string | null;
  gender: string | null;
  weight: string | null;
  place: number | null; // today, in the weight's table; null when not in one
  score: number | null;
};

type Entry<T> = { words: string[]; hit: T };
export type SearchIndex = {
  athletes: Entry<AthleteHit>[];
  tournaments: Entry<SearchHit>[];
  nations: Entry<SearchHit>[];
};

// Lower case without accents: "Gonçalves" is found by "goncalves".
function fold(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

// The words a search can start: "TIENTCHEU KEUMAHA" -> tientcheu, keumaha.
function words(...texts: (string | null)[]): string[] {
  return texts.flatMap((text) => fold(text ?? "").split(/[\s-]+/)).filter(Boolean);
}

// Every word of the question starts a word of the entry.
function matches(entry: { words: string[] }, question: string[]): boolean {
  return question.every((q) => entry.words.some((word) => word.startsWith(q)));
}

let loading: Promise<SearchIndex> | null = null;

export function loadSearchIndex(): Promise<SearchIndex> {
  if (loading) return loading;
  loading = fetch("/api/search-index")
    .then((response) => {
      if (!response.ok) throw new Error(`/api/search-index: HTTP ${response.status}`);
      return response.json() as Promise<IndexDocument>;
    })
    .then((doc): SearchIndex => ({
      athletes: doc.athletes.map(([id, family, given, country, gender, weight, place, score]) => ({
        words: words(family, given),
        hit: { id, family_name: family, given_name: given, country, gender, weight, place, score },
      })),
      tournaments: doc.tournaments.map(([id, name, country, from, to]) => ({
        words: words(name),
        hit: { kind: "tournament" as const, id, name, family_name: null, given_name: null, country, gender: null, weight: null, date_from: from, date_to: to },
      })),
      nations: doc.nations.map(([ioc, name]) => ({
        words: [...words(name), ioc.toLowerCase()],
        hit: { kind: "nation" as const, id: null, name, family_name: null, given_name: null, country: ioc, gender: null, weight: null, date_from: null, date_to: null },
      })),
    }))
    .catch((error) => {
      loading = null; // try again on the next focus
      throw error;
    });
  return loading;
}

function question(q: string): string[] {
  return words(q).slice(0, 6);
}

// The header's search: up to 5 athletes (those in a table first, by score), 3
// tournaments (the coming ones first) and 3 nations (the most athletes first).
export function searchSite(index: SearchIndex, q: string): SearchHit[] {
  const asked = question(q);
  if (asked.length === 0) return [];
  const athletes = index.athletes
    .filter((entry) => matches(entry, asked))
    .slice(0, 5)
    .map(({ hit }): SearchHit => ({ kind: "athlete", id: hit.id, name: null, family_name: hit.family_name, given_name: hit.given_name, country: hit.country, gender: hit.gender, weight: hit.weight, date_from: null, date_to: null }));
  const pick = (list: Entry<SearchHit>[]) => list.filter((entry) => matches(entry, asked)).slice(0, 3).map((entry) => entry.hit);
  return [...athletes, ...pick(index.tournaments), ...pick(index.nations)];
}

// The head-to-head's athlete boxes: every rated athlete; the weight picked orders
// them: its table first by place, then the athletes of other tables by score, then
// the rest.
export function searchAthletes(index: SearchIndex, q: string, weight: string | null, top = 6): AthleteHit[] {
  const asked = question(q);
  if (asked.length === 0) return [];
  const found = index.athletes.filter((entry) => matches(entry, asked)).map((entry) => entry.hit);
  const own = found.filter((hit) => weight && hit.weight === weight && hit.place !== null);
  own.sort((a, b) => a.place! - b.place!);
  return [...own, ...found.filter((hit) => !own.includes(hit))].slice(0, top);
}
