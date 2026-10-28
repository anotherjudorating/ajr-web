import { FLAG_CODES } from "@/lib/flags";

// A 16×12 flag by IOC code. Athletes without a country flag (neutral athletes,
// refugee team, countries that no longer exist) get a plain outlined box.
export function Flag({ ioc, className = "" }: { ioc: string | null; className?: string }) {
  const code = ioc ? FLAG_CODES[ioc] : undefined;
  if (!code) {
    return (
      <span
        aria-label={ioc ?? undefined}
        className={`inline-block w-4 h-3 shrink-0 align-middle border border-muted bg-white ${className}`}
      />
    );
  }
  return (
    <span
      role="img"
      aria-label={ioc ?? undefined}
      className={`fi fi-${code} !w-4 !h-3 shrink-0 !bg-cover align-middle ${className}`}
    />
  );
}
