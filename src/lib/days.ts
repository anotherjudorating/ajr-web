import { lastUpdate } from "@/lib/api";

const DAY = /^\d{4}-\d{2}-\d{2}$/;

// The day a rankings table is shown for: `?date=` when it is a past day, else the day
// of the latest rating run ("today": the data is not newer than that).
export async function tableDay(date: string | string[] | undefined) {
  const latest = ((await lastUpdate()) ?? "1970-01-01").slice(0, 10);
  const day = typeof date === "string" && DAY.test(date) ? date : undefined;
  const asOf = day && day < latest ? day : latest;
  const past = asOf === latest ? undefined : asOf; // for the api: undefined is today
  return { asOf, latest, past, query: past ? `?date=${past}` : "" };
}
