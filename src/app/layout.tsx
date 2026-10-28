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
      <body className="min-h-screen flex flex-col bg-paper text-ink font-sans">
        <Header />
        {/* below md the fixed header has two rows: 48px + 40px */}
        <main className="flex-1 w-full pt-[88px] md:pt-16">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-6 sm:pt-8">
            {children}
          </div>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
