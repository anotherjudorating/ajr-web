import { redirectTo } from "@/i18n/server";

export default async function Explore() {
  await redirectTo("/explore/tournaments");
}
