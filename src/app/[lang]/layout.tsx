import "flag-icons/css/flag-icons.min.css";
import type { Metadata } from "next";
import { IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import { Suspense } from "react";

import { Footer } from "@/components/Footer";
import { CurrentHeader, Header } from "@/components/Header";
import { LanguageRedirect } from "@/components/LanguageRedirect";
import "../globals.css";
import { type Lang, LANGS, localeOf, PUBLISHED } from "@/i18n/locales";
import { LocaleGate } from "@/i18n/LocaleGate";
import { currentLang, dict } from "@/i18n/server";
import { NOINDEX, SITE } from "@/lib/seo";

// The fonts, in two cuts: the Latin one for English, preloaded as before, and one
// with the Cyrillic and the Latin extensions for the other languages. The second is
// not preloaded (next/font preloads every subset it is given, to every visitor): its
// files come by unicode-range, when a page shows those letters. The loader wants the
// subset lists written out.
const serif = Source_Serif_4({ variable: "--font-source-serif", subsets: ["latin"] });
const sans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const serifAll = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  preload: false,
});
const sansAll = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});
const FONTS: Record<Lang, string> = {
  en: `${serif.variable} ${sans.variable}`,
  ru: `${serifAll.variable} ${sansAll.variable}`,
};

// The language is the root parameter (/ru/...; English has no prefix: src/proxy.ts
// rewrites its paths to /en/... inside). Every page is prerendered once a language.
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await currentLang();
  const d = await dict();
  const locale = localeOf(lang);
  const others = PUBLISHED.filter((l) => l.code !== lang).map((l) => l.ogLocale);
  return {
    metadataBase: new URL(SITE),
    // no " | Another Judo Rating" after each title: Google writes the site's name over the
    // address itself (the WebSite data on the home page)
    title: d.site.name,
    description: d.meta.site,
    // the canonical address: each page's own, from lib/seo.ts alternatesFor (a relative
    // "./" here would resolve to the rewritten /en/... path)
    openGraph: {
      siteName: d.site.name,
      type: "website",
      locale: locale.ogLocale,
      ...(others.length ? { alternateLocale: others } : {}),
    },
    twitter: { card: "summary_large_image" },
    // a language not published yet renders for checking, out of the index
    ...(locale.published ? {} : { robots: NOINDEX }),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const lang = await currentLang();
  return (
    <html lang={localeOf(lang).htmlLang} data-scroll-behavior="smooth" className={`${FONTS[lang]} antialiased`}>
      <head>
        {/* Icons used by the design (search, close, download, arrows). "block": an icon
            font must not show its ligature names ("search") while loading. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="bg-paper font-sans text-ink antialiased min-h-screen flex flex-col selection:bg-claret selection:text-white">
        <LocaleGate lang={lang}>
          <Suspense fallback={<Header pathname="" />}>
            <CurrentHeader />
          </Suspense>
          <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-[37.75px] md:pt-[53.25px] flex-1">
            {/* below md the sections are a second fixed row (36px) under the header;
                the paddings are the prototype's (its script sets them) */}
            <div className="md:hidden h-9" />
            <LanguageRedirect />
            {children}
          </main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </LocaleGate>
      </body>
    </html>
  );
}
