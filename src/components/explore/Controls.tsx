import { Icon } from "@/components/Icon";
import { CONTROL } from "@/components/rankings/TableParts";

// The parts of the Explore toolbars, as in the prototype (the rankings toolbar's look).

// `inPage`: under a section's title in a page (as the athlete's contests), closer to it.
export function ToolbarRow({ children, inPage = false }: { children: React.ReactNode; inPage?: boolean }) {
  return <div className={`${inPage ? "mt-3" : "mt-6"} border-b-2 border-ink pb-2 flex flex-col lg:flex-row lg:items-center gap-2`}>{children}</div>;
}

export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative w-full md:w-72 lg:w-56 shrink-0">
      <Icon size={16} name="search" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-8 pl-8 pr-2.5 bg-paper border border-rule text-[12px] placeholder:text-muted focus:outline-none focus:border-ink"
      />
    </div>
  );
}

export function Select({
  value,
  onChange,
  options,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; group?: string }[];
  className?: string;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`${CONTROL} ${className}`}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function CsvButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full md:w-auto shrink-0 h-8 px-3 inline-flex items-center justify-center gap-1.5 border border-rule text-[12px] text-ink hover:border-ink"
    >
      <Icon size={16} name="download" className="text-muted" />
      Export CSV
    </button>
  );
}

// The page's title and lead under the Explore tabs.
export function ExploreTitle({ title, lead }: { title: string; lead: string }) {
  return (
    <>
      <h1 className="mt-6 font-serif text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold text-ink tracking-[-0.015em]">
        {title}
      </h1>
      <p className="mt-1.5 text-[14px] text-muted">{lead}</p>
    </>
  );
}
