import { redirectTo } from "@/i18n/server";

// The rankings open on the nations, men and women together.
export default async function Rankings() {
  await redirectTo("/rankings/teams/mixed");
}
