import { notFound } from "next/navigation";

import { lastUpdate } from "@/lib/api";
import { DAY } from "@/lib/day-path";

// The day a rankings table is shown for: the path's last part when it is a past day
// ("/rankings/men-73/2024-06-01"), else the day of the latest rating run ("today":
// the data is not newer than that). Today's tables have no day in the path, so they
// are built ahead and served whole from the cache.
export async function tableDay(day: string[] | undefined) {
  if (day && (day.length !== 1 || !DAY.test(day[0]))) notFound();
  const latest = ((await lastUpdate()) ?? "1970-01-01").slice(0, 10);
  const asOf = day && day[0] < latest ? day[0] : latest;
  const past = asOf === latest ? undefined : asOf; // for the api: undefined is today
  return { asOf, latest, past };
}
