// The languages visitors' browsers ask for (the first tag of Accept-Language, its
// language only: "ru-RU,ru;q=0.9,en" counts as "ru"), to choose which translations come
// first (docs/audits/2026-11-21-i18n-plan-v2.md, stage 0). Requests and distinct IPs per
// language since the process started, the IPs only as a count. Only the requests that
// reach the server: Cloudflare answers repeated page views from its cache, Next's
// navigations come through.

const MAX_IPS = 50_000; // past this, IPs are no longer told apart (requests still count)

type Tally = { requests: number; ips: Set<string> };
const state = globalThis as unknown as { languages?: Map<string, Tally> };
const tallies = (state.languages ??= new Map());
let tracked = 0;

export function noteLanguage(acceptLanguage: string | null, ip: string | null) {
  const first = (acceptLanguage ?? "").split(",")[0].trim().split(";")[0];
  const language = /^[a-z]{2,3}(-|$)/i.test(first) ? first.split("-")[0].toLowerCase() : "none";
  const tally = tallies.get(language) ?? { requests: 0, ips: new Set<string>() };
  tally.requests++;
  if (ip && tracked < MAX_IPS && !tally.ips.has(ip)) {
    tally.ips.add(ip);
    tracked++;
  }
  tallies.set(language, tally);
}

/** For /api/health: per language, requests and distinct IPs, the most requested first. */
export const languageStats = () =>
  Object.fromEntries(
    [...tallies]
      .sort(([, a], [, b]) => b.requests - a.requests)
      .map(([language, t]) => [language, { requests: t.requests, ips: t.ips.size }]),
  );
