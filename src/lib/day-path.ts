// A rankings table's day in its path, readable in the browser too.

export const DAY = /^\d{4}-\d{2}-\d{2}$/;

// "/rankings/men-73/2024-06-01" -> the table's path and the day's part ("/2024-06-01").
export function splitDay(path: string): { table: string; day: string } {
  const parts = path.split("/");
  return DAY.test(parts.at(-1) ?? "")
    ? { table: parts.slice(0, -1).join("/"), day: `/${parts.at(-1)}` }
    : { table: path, day: "" };
}
