import { redirect } from "next/navigation";

import { DEFAULT_WEIGHT } from "@/lib/weights";

export default function Rankings() {
  redirect(`/rankings/${DEFAULT_WEIGHT.slug}`);
}
