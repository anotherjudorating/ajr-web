import type { Metadata } from "next";

import { NotBuilt } from "@/components/ErrorPage";

export const metadata: Metadata = { title: "How the rating works", robots: { index: false } }; // until it is written

export default function Page() {
  return <NotBuilt section="Methodology" />;
}
