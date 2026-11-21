import type { ReactNode } from "react";

// A figure of the methodology: a panel with its toy or chart and a caption under it.
export function Figure({ title, caption, children }: { title: string; caption?: ReactNode; children: ReactNode }) {
  return (
    <figure className="my-8 border border-rule bg-panel/40">
      <div className="px-4 sm:px-5 pt-3.5 pb-3 border-b border-rule font-serif text-[18px] leading-[24px] sm:text-[19px] font-bold text-ink">{title}</div>
      <div className="p-4 sm:p-5">{children}</div>
      {caption && <figcaption className="px-4 sm:px-5 pb-4 text-[14px] sm:text-[15px] leading-relaxed text-ink/80">{caption}</figcaption>}
    </figure>
  );
}

// A labelled range input, its value shown next to it (keyboard and screen readers work).
export function Slider({ label, value, min, max, step, onChange, format }: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
}) {
  return (
    <label className="flex items-center gap-3 text-[13px]">
      <span className="text-muted shrink-0 w-24">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-[#990f3d] cursor-pointer"
      />
      <span className="w-14 text-right font-semibold tabular-nums text-ink">{format ? format(value) : value}</span>
    </label>
  );
}
