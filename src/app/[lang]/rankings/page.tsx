import { redirect } from "next/navigation";

// The rankings open on the nations, men and women together.
export default function Rankings() {
  redirect("/rankings/teams/mixed");
}
