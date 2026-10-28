import { redirect } from "next/navigation";

import { DEFAULT_WEIGHT } from "@/lib/weights";

// The home page (leaders of every weight, movers, upsets) comes later.
export default function Home() {
  redirect(`/rankings/${DEFAULT_WEIGHT.slug}`);
}
