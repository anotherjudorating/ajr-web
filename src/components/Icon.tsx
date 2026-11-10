// A Material Symbols icon, as in the prototype ("search", "close", "download"…).
// The size is set inline: the icon font's own stylesheet would override a class.
// Its box is the icon's size from the first paint: until the font has loaded the
// name shows as plain text ("chevron_right"), which would widen a table past a
// phone's screen; clipped to the box, it cannot.
export function Icon({ name, size, className = "" }: { name: string; size: number; className?: string }) {
  return (
    <span
      aria-hidden
      style={{ fontSize: size, width: size, height: size, lineHeight: 1, display: "inline-block", overflow: "hidden" }}
      className={`material-symbols-outlined select-none ${className}`}
    >
      {name}
    </span>
  );
}

// "before › after" between two numbers (a rating, a deviation): the chevron, as on
// the chart's earlier-peak hint.
export function Arrow() {
  return <Icon size={14} name="chevron_right" className="align-[-2px] text-muted" />;
}
