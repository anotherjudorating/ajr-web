import { LANG_COOKIE, localePath, PUBLISHED } from "@/i18n/locales";
import { currentLang } from "@/i18n/server";

// The home page only: a visitor who chose a language (the cookie) and typed the
// domain lands on their language before the first paint, with no flash. A link from
// a search result opens in the language it was clicked in. Bots have no cookie; the
// server reads none either (the page is one for everyone at the edge). Nothing is
// rendered while there is no other language to jump to.
export async function LangJump() {
  if (PUBLISHED.length < 2) return null;
  const lang = await currentLang();
  const targets = Object.fromEntries(PUBLISHED.filter((l) => l.code !== lang).map((l) => [l.code, localePath(l.code, "/")]));
  const script = `(function(){try{var m=document.cookie.match(/(?:^|;\\s*)${LANG_COOKIE}=([a-z]{2})/),t=${JSON.stringify(targets)};if(m&&t[m[1]])location.replace(t[m[1]])}catch(e){}})()`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
