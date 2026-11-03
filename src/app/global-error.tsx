"use client";

import "./globals.css";

// The root layout itself failed: it replaces the whole document, so no header,
// footer or fonts, only the message and a way to try again.
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink antialiased min-h-screen px-4 sm:px-8">
        <div className="max-w-[640px] pt-16 sm:pt-24 pb-16">
          <div className="text-[96px] font-bold leading-none tabular-nums mb-4">500</div>
          <h1 className="text-[30px] leading-[36px] font-bold mb-4">Matte.</h1>
          <p className="text-base text-muted leading-relaxed mb-8">
            The site could not be loaded. It is usually back in a minute.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            className="h-[44px] px-6 bg-ink text-paper text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
