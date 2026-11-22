import "flag-icons/css/flag-icons.min.css";
import type { Metadata } from "next";
import { IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import { Suspense } from "react";

import { ErrorPage } from "@/components/ErrorPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";
import { en } from "@/i18n/en";
import EnProvider from "@/i18n/providers/en";
import { SITE } from "@/lib/seo";

// An address that is no route of the site at all ("/nonexistent", "/ru/nonexistent"):
// Next answers with this page and a 404, without rendering a layout. The root layout
// lives under [lang] (the language is a root parameter), so no layout could stand for
// every unmatched address; this page is the layout's frame again, in English, with the
// 404 of app/[lang]/not-found.tsx (which still serves the notFound() of a page: an
// athlete that does not exist). The fonts are the layout's Latin cut.
const serif = Source_Serif_4({ variable: "--font-source-serif", subsets: ["latin"] });
const sans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: en.site.name,
  description: en.meta.site,
  openGraph: { siteName: en.site.name, type: "website", locale: "en_GB" },
  twitter: { card: "summary_large_image" },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${serif.variable} ${sans.variable} antialiased`}>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="bg-paper font-sans text-ink antialiased min-h-screen flex flex-col selection:bg-claret selection:text-white">
        <EnProvider>
          <Header pathname="" />
          <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-[37.75px] md:pt-[53.25px] flex-1">
            <div className="md:hidden h-9" />
            <ErrorPage big="404" title={en.site.errors.notFoundTitle} lead={en.site.errors.notFoundLead} />
          </main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </EnProvider>
      </body>
    </html>
  );
}
