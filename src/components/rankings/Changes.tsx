import { signed } from "@/lib/format";

// Places moved: ↑2 teal, ↓1 red, – unchanged, NEW when not in the table back then.
export function placesText(placesUp: number | null): { text: string; color: string } {
  if (placesUp === null) return { text: "NEW", color: "text-claret text-[11px] font-bold" };
  if (placesUp > 0) return { text: `↑${placesUp}`, color: "text-gain" };
  if (placesUp < 0) return { text: `↓${-placesUp}`, color: "text-drop" };
  return { text: "–", color: "" };
}

// Rating change: +21 teal, −14 red, – when none.
export function changeText(value: number | null): { text: string; color: string } {
  if (value === null || value === 0) return { text: "–", color: "" };
  return { text: signed(value), color: value > 0 ? "text-gain" : "text-drop" };
}

// IJF place compared with ours: we are 1st, IJF has them 2nd -> "↓1" (lower in IJF).
export function ijfDifference(ourPlace: number, ijfPlace: number | null): string {
  if (ijfPlace === null) return "";
  if (ijfPlace > ourPlace) return `↓${ijfPlace - ourPlace}`;
  if (ijfPlace < ourPlace) return `↑${ourPlace - ijfPlace}`;
  return "–";
}
