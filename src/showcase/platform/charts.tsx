import { useState, type ReactNode } from "react";

// Small SVG charts drawn to the data-viz rules: bars at most 24px with a 4px
// rounded tip and a square base, 2px lines, end dots with a 2px surface ring,
// a 10% wash under an area, hairline grid, text in text colours only, a legend
// once there are two series, and a tooltip on hover.

const GRID = "var(--pv-border)";

function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  const step =
    [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((s) => n <= s) ?? 10;
  return step * p;
}

function barPath(x: number, y: number, w: number, h: number, r = 4) {
  const rr = Math.min(r, h, w / 2);
  return `M${x},${y + h} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h} Z`;
}

function Tip({
  x,
  y,
  children,
  w,
}: {
  x: number;
  y: number;
  children: ReactNode;
  w: number;
}) {
  const left = Math.min(Math.max(x, 70), w - 70);
  return (
    <div
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-[#0b1020] px-2.5 py-1.5 text-[11.5px] leading-snug text-white shadow-lg"
      style={{ left, top: y - 8 }}
    >
      {children}
    </div>
  );
}

export function Spark({
  data,
  w = 76,
  h = 26,
  color = "var(--pv-chart-1)",
}: {
  data: number[];
  w?: number;
  h?: number;
  color?: string;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [
    2 + (i / (data.length - 1)) * (w - 6),
    3 + (1 - (v - min) / span) * (h - 6),
  ]);
  const last = pts[pts.length - 1];
  return (
    <svg width={w} height={h} className="shrink-0 overflow-visible">
      <polyline
        points={pts.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke={color}
        strokeOpacity={0.45}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={last[0]}
        cy={last[1]}
        r={2.75}
        fill={color}
        stroke="#fff"
        strokeWidth={1.5}
      />
    </svg>
  );
}

export interface Bar {
  label: string;
  v: number;
  tone?: "accent" | "muted" | "bad";
  note?: string;
}

export function Columns({
  data,
  w,
  h = 150,
  fmt = (v: number) => v.toLocaleString("en-GB"),
  color = "var(--pv-chart-1)",
  label = "last",
  yTicks = 4,
}: {
  data: Bar[];
  w: number;
  h?: number;
  fmt?: (v: number) => string;
  color?: string;
  label?: "last" | "max" | "none";
  yTicks?: number;
}) {
  const [hi, setHi] = useState<number | null>(null);
  const L = 44;
  const R = 6;
  const T = 16;
  const B = 22;
  const iw = w - L - R;
  const ih = h - T - B;
  const max = niceMax(Math.max(...data.map((d) => d.v)));
  const band = iw / data.length;
  const bw = Math.min(24, band * 0.62);
  const labelled =
    label === "last"
      ? data.length - 1
      : label === "max"
        ? data.reduce((m, d, i) => (d.v > data[m].v ? i : m), 0)
        : -1;
  const sparse = data.some((d) => d.label === "");
  const every = sparse
    ? 1
    : Math.ceil(data.length / Math.max(1, Math.floor(iw / 46)));
  return (
    <div className="relative" style={{ width: w, height: h }}>
      <svg width={w} height={h} className="overflow-visible">
        {Array.from({ length: yTicks + 1 }, (_, i) => {
          const v = (max / yTicks) * i;
          const y = T + ih - (v / max) * ih;
          return (
            <g key={i}>
              <line
                x1={L}
                x2={w - R}
                y1={y}
                y2={y}
                stroke={GRID}
                strokeWidth={1}
              />
              <text
                x={L - 8}
                y={y + 3.5}
                textAnchor="end"
                className="fill-[var(--pv-muted)] text-[10.5px]"
              >
                {fmt(v)}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const bh = (d.v / max) * ih;
          const x = L + band * i + (band - bw) / 2;
          const y = T + ih - bh;
          const fill =
            d.tone === "accent"
              ? "var(--pv-chart-2)"
              : d.tone === "muted"
                ? "var(--pv-faint)"
                : d.tone === "bad"
                  ? "var(--pv-bad)"
                  : color;
          return (
            <g key={d.label + i}>
              {bh > 0 ? (
                <path
                  d={barPath(x, y, bw, bh)}
                  fill={fill}
                  opacity={hi === null || hi === i ? 1 : 0.55}
                />
              ) : null}
              {i === labelled ? (
                <text
                  x={x + bw / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="fill-[var(--pv-ink)] text-[10.5px] font-semibold"
                >
                  {fmt(d.v)}
                </text>
              ) : null}
              {d.label &&
              (i % every === 0 || i === data.length - 1 || sparse) ? (
                <text
                  x={x + bw / 2}
                  y={h - 6}
                  textAnchor={sparse ? "start" : "middle"}
                  className="fill-[var(--pv-muted)] text-[10.5px]"
                >
                  {d.label}
                </text>
              ) : null}
              <rect
                x={L + band * i}
                y={T}
                width={band}
                height={ih}
                fill="transparent"
                onMouseEnter={() => setHi(i)}
                onMouseLeave={() => setHi(null)}
              />
            </g>
          );
        })}
      </svg>
      {hi !== null ? (
        <Tip
          x={L + band * hi + band / 2}
          y={T + ih - (data[hi].v / max) * ih}
          w={w}
        >
          <span className="font-semibold">{data[hi].label}</span>{" "}
          {fmt(data[hi].v)}
          {data[hi].note ? (
            <span className="block text-white/70">{data[hi].note}</span>
          ) : null}
        </Tip>
      ) : null}
    </div>
  );
}

export interface Series {
  name: string;
  data: (number | null)[];
  color: string;
  area?: boolean;
  dashed?: boolean;
}

export function LineChart({
  labels,
  series,
  w,
  h = 160,
  fmt = (v: number) => v.toLocaleString("en-GB"),
  yTicks = 4,
  legend = true,
}: {
  labels: string[];
  series: Series[];
  w: number;
  h?: number;
  fmt?: (v: number) => string;
  yTicks?: number;
  legend?: boolean;
}) {
  const [hi, setHi] = useState<number | null>(null);
  const L = 44;
  const R = 10;
  const T = 12;
  const B = 22;
  const iw = w - L - R;
  const ih = h - T - B;
  const max = niceMax(
    Math.max(
      ...series.flatMap((s) => s.data.filter((v): v is number => v !== null)),
    ),
  );
  const xAt = (i: number) =>
    L + (labels.length === 1 ? iw / 2 : (i / (labels.length - 1)) * iw);
  const yAt = (v: number) => T + ih - (v / max) * ih;
  const every = Math.ceil(labels.length / Math.max(1, Math.floor(iw / 52)));
  return (
    <div>
      {legend && series.length > 1 ? (
        <div className="mb-2 flex flex-wrap items-center gap-4 text-[11.5px] text-[var(--pv-text2)]">
          {series.map((s) => (
            <span key={s.name} className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-[2px] w-3.5 rounded"
                style={{ background: s.color, opacity: s.dashed ? 0.6 : 1 }}
              />
              {s.name}
            </span>
          ))}
        </div>
      ) : null}
      <div className="relative" style={{ width: w, height: h }}>
        <svg width={w} height={h} className="overflow-visible">
          {Array.from({ length: yTicks + 1 }, (_, i) => {
            const v = (max / yTicks) * i;
            return (
              <g key={i}>
                <line
                  x1={L}
                  x2={w - R}
                  y1={yAt(v)}
                  y2={yAt(v)}
                  stroke={GRID}
                  strokeWidth={1}
                />
                <text
                  x={L - 8}
                  y={yAt(v) + 3.5}
                  textAnchor="end"
                  className="fill-[var(--pv-muted)] text-[10.5px]"
                >
                  {fmt(v)}
                </text>
              </g>
            );
          })}
          {labels.map((l, i) =>
            i % every === 0 || i === labels.length - 1 ? (
              <text
                key={l + i}
                x={xAt(i)}
                y={h - 6}
                textAnchor="middle"
                className="fill-[var(--pv-muted)] text-[10.5px]"
              >
                {l}
              </text>
            ) : null,
          )}
          {series.map((s) => {
            const known = s.data
              .map((v, i) => [i, v] as const)
              .filter((p): p is readonly [number, number] => p[1] !== null);
            const pts = known.map(([i, v]) => `${xAt(i)},${yAt(v)}`).join(" ");
            const [li, lv] = known[known.length - 1];
            return (
              <g key={s.name}>
                {s.area ? (
                  <polygon
                    points={`${xAt(known[0][0])},${yAt(0)} ${pts} ${xAt(li)},${yAt(0)}`}
                    fill={s.color}
                    opacity={0.1}
                  />
                ) : null}
                <polyline
                  points={pts}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeDasharray={s.dashed ? "4 4" : undefined}
                  opacity={s.dashed ? 0.7 : 1}
                />
                <circle
                  cx={xAt(li)}
                  cy={yAt(lv)}
                  r={4}
                  fill={s.color}
                  stroke="#fff"
                  strokeWidth={2}
                />
              </g>
            );
          })}
          {hi !== null ? (
            <g>
              <line
                x1={xAt(hi)}
                x2={xAt(hi)}
                y1={T}
                y2={T + ih}
                stroke="var(--pv-faint)"
                strokeWidth={1}
              />
              {series.map((s) =>
                s.data[hi] === null ? null : (
                  <circle
                    key={s.name}
                    cx={xAt(hi)}
                    cy={yAt(s.data[hi] as number)}
                    r={4}
                    fill={s.color}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ),
              )}
            </g>
          ) : null}
          {labels.map((l, i) => (
            <rect
              key={"hit" + l + i}
              x={xAt(i) - iw / Math.max(1, labels.length - 1) / 2}
              y={T}
              width={iw / Math.max(1, labels.length - 1)}
              height={ih}
              fill="transparent"
              onMouseEnter={() => setHi(i)}
              onMouseLeave={() => setHi(null)}
            />
          ))}
        </svg>
        {hi !== null ? (
          <Tip
            x={xAt(hi)}
            y={Math.min(...series.map((s) => yAt(s.data[hi] ?? 0)))}
            w={w}
          >
            <span className="block font-semibold">{labels[hi]}</span>
            {series.map((s) => (
              <span key={s.name} className="flex items-center gap-1.5">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: s.color }}
                />
                {s.name} {s.data[hi] === null ? "–" : fmt(s.data[hi] as number)}
              </span>
            ))}
          </Tip>
        ) : null}
      </div>
    </div>
  );
}

export function Segments({
  parts,
  h = 8,
}: {
  parts: { label: string; v: number; color: string }[];
  h?: number;
}) {
  const total = parts.reduce((a, p) => a + p.v, 0) || 1;
  return (
    <div
      className="flex w-full gap-[2px] overflow-hidden rounded-full"
      style={{ height: h }}
    >
      {parts
        .filter((p) => p.v > 0)
        .map((p) => (
          <span
            key={p.label}
            title={`${p.label}: ${p.v}`}
            className="block h-full first:rounded-l-full last:rounded-r-full"
            style={{ width: `${(p.v / total) * 100}%`, background: p.color }}
          />
        ))}
    </div>
  );
}

export function Legend({
  items,
}: {
  items: { label: ReactNode; color: string }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-[var(--pv-text2)]">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-[2px]"
            style={{ background: it.color }}
          />
          {it.label}
        </span>
      ))}
    </div>
  );
}
