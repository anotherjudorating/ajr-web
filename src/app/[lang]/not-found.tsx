import { ErrorPage } from "@/components/ErrorPage";
import { dict } from "@/i18n/server";

export default async function NotFound() {
  const d = await dict();
  return <ErrorPage big="404" title={d.site.errors.notFoundTitle} lead={d.site.errors.notFoundLead} />;
}
