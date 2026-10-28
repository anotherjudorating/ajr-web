// A Material Symbols icon, as in the prototype ("search", "close", "download"…).
// The size is set inline: the icon font's own stylesheet would override a class.
export function Icon({ name, size, className = "" }: { name: string; size: number; className?: string }) {
  return (
    <span aria-hidden style={{ fontSize: size }} className={`material-symbols-outlined select-none ${className}`}>
      {name}
    </span>
  );
}
