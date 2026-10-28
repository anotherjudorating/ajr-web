// The prototype's 404 layout: a big word, a headline, a lead and a search box.
// Used for "not found" and for sections that are not built yet.
export function ErrorPage({
  big,
  title,
  lead,
  compact = false,
}: {
  big: string;
  title: string;
  lead: string;
  compact?: boolean; // under other content (e.g. the weight switcher): less space above
}) {
  return (
    <div className={`max-w-[640px] ${compact ? "pt-4" : "pt-16 sm:pt-24 lg:pt-[120px]"} pb-16`}>
      <div className="font-serif text-[96px] sm:text-[120px] font-bold leading-none text-ink tabular-nums tracking-tight mb-4 select-none">
        {big}
      </div>
      <h1 className="font-serif text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em] text-ink mb-4">
        {title}
      </h1>
      <p className="text-base sm:text-lg text-muted leading-relaxed mb-8">{lead}</p>
      <div className="w-full mb-8">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted">
            <svg aria-hidden className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input
            type="search"
            placeholder="Search athletes or tournaments"
            className="w-full h-[44px] pl-11 pr-4 text-sm sm:text-base bg-paper border border-rule rounded-none text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors"
          />
        </div>
        <p className="text-xs sm:text-sm text-muted mt-2">Try the surname only, e.g. “Tasoev”.</p>
      </div>
    </div>
  );
}

// A section that exists in the design but is not built yet.
export function NotBuilt({ section, compact = false }: { section: string; compact?: boolean }) {
  return (
    <ErrorPage
      compact={compact}
      big="Soon"
      title={`${section} is on its way.`}
      lead="This part of the site is not built yet. The rankings are live."
    />
  );
}
