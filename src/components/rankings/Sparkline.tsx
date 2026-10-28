// The score over the last five months, 80×20: a line and a claret dot today.
export function Sparkline({ values }: { values: (number | null)[] }) {
  const points = values
    .map((value, index) => ({ value, x: 4 + index * 14 }))
    .filter((point): point is { value: number; x: number } => point.value !== null);
  if (points.length === 0) return null;

  const min = Math.min(...points.map((p) => p.value));
  const max = Math.max(...points.map((p) => p.value));
  // higher score = higher on the chart (smaller y), between y=4 and y=16
  const y = (value: number) => (max === min ? 10 : 16 - ((value - min) / (max - min)) * 12);
  const last = points[points.length - 1];

  return (
    <svg className="inline-block" width="80" height="20" viewBox="0 0 80 20">
      <polyline
        fill="none"
        stroke="#33302E"
        strokeWidth="1.5"
        points={points.map((p) => `${p.x},${y(p.value).toFixed(1)}`).join(" ")}
      />
      <circle cx={last.x} cy={y(last.value).toFixed(1)} r="2.5" fill="#990F3D" />
    </svg>
  );
}
