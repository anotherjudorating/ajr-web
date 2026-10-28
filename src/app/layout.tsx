import "flag-icons/css/flag-icons.min.css";
import type { Metadata } from "next";
import { IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import { Suspense } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const serif = Source_Serif_4({ variable: "--font-source-serif", subsets: ["latin"] });
const sans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: { default: "Another Judo Rating", template: "%s | Another Judo Rating" },
  description:
    "Independent Glicko-2 judo rating: the strongest judoka in every weight, built from every IJF contest.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} antialiased`}>
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
        <Header />
        <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-[37.75px] md:pt-[53.25px] flex-1">
          {/* below md the sections are a second fixed row (36px) under the header;
              the paddings are the prototype's (its script sets them) */}
          <div className="md:hidden h-9" />
          {children}
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
