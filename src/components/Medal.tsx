export type MedalKind = "gold" | "silver" | "bronze";

// A medal on its claret and oxford ribbon; `predicted`: faded, for a medal not won yet.
export function Medal({ kind, className = "w-4 h-5", predicted = false }: { kind: MedalKind; className?: string; predicted?: boolean }) {
  const [fill, ring] = { gold: ["#D4AF37", "#8A6A00"], silver: ["#B4BCC2", "#5F6B73"], bronze: ["#C2834F", "#8A4F2A"] }[kind];
  return (
    <svg className={`shrink-0 ${predicted ? "opacity-40" : ""} ${className}`} viewBox="0 0 16 20" role="img" aria-label={predicted ? `Predicted ${kind}` : kind}>
      <path d="M3 0h4l2 7H5z" fill="#990F3D" />
      <path d="M9 0h4l-2 7H7z" fill="#0F5499" />
      <circle cx="8" cy="13" r="6" fill={fill} />
      <circle cx="8" cy="13" r="4" fill="none" stroke={ring} strokeWidth="1" />
    </svg>
  );
}
