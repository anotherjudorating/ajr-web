import { redirect } from "next/navigation";

// The home page (leaders of every weight, movers, upsets) comes later.
export default function Home() {
  redirect("/rankings");
}
