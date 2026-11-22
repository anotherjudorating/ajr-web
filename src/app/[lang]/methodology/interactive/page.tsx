import { permanentRedirect } from "next/navigation";

// Only a redirect, from the query of the request: nothing to prerender.
export const instant = false;

// The methodology is one page now; the old interactive page's links (a contest's
// "How ratings work", with its athletes in the query) open the calculator.
export default async function MethodologyInteractive({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) if (typeof value === "string") params.set(key, value);
  const query = params.toString();
  permanentRedirect(`/methodology${query ? `?${query}` : ""}#calc`);
}
