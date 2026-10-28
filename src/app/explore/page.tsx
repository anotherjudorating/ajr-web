import type { Metadata } from "next";

import { NotBuilt } from "@/components/ErrorPage";

export const metadata: Metadata = { title: "Explore", robots: { index: false } };

export default function Page() {
  return <NotBuilt section="Explore" />;
}
