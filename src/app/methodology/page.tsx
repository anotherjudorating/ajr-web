import type { Metadata } from "next";

import { NotBuilt } from "@/components/ErrorPage";

export const metadata: Metadata = { title: "Methodology", robots: { index: false } };

export default function Page() {
  return <NotBuilt section="Methodology" />;
}
