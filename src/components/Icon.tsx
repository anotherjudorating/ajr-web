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

// The chevron at the end of a row (or a card) that opens a page: as far from the edge
// as the cells' text (8px, 12px from sm: the glyph sits 5px inside its 18px box), and
// nudged right when the row is hovered (the row carries `group`).
export const CHEVRON_CELL = "w-8 sm:w-10 py-0 pl-1 pr-[3px] sm:pr-[7px] align-middle text-right text-muted";
export function RowChevron({ className = "" }: { className?: string }) {
  return <Icon size={18} name="chevron_right" className={`align-middle transition-transform group-hover:translate-x-0.5 ${className}`} />;
}
