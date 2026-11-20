import { createContext, useContext, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Search } from "lucide-react";
import { Spark } from "./charts";

// The building blocks every platform screen is made of. Colours come from the
// brand's CSS variables (platform.css), so one kit draws both platforms.
// Nothing here is focusable: a platform view is a picture of a screen.

export type Brand = "avolon" | "glo";
export const BrandCtx = createContext<Brand>("avolon");
export const useBrand = () => useContext(BrandCtx);

export type Tone = "neutral" | "brand" | "good" | "warn" | "bad";

const TONE: Record<Tone, string> = {
  neutral: "bg-[var(--pv-surface)] text-[var(--pv-text2)]",
  brand: "bg-[var(--pv-primary-tint)] text-[var(--pv-primary-strong)]",
  good: "bg-[var(--pv-good-tint)] text-[var(--pv-good)]",
  warn: "bg-[var(--pv-warn-tint)] text-[var(--pv-warn)]",
  bad: "bg-[var(--pv-bad-tint)] text-[var(--pv-bad)]",
};
const DOT: Record<Tone, string> = {
  neutral: "bg-[var(--pv-faint)]",
  brand: "bg-[var(--pv-dot)]",
  good: "bg-[var(--pv-good)]",
  warn: "bg-[var(--pv-warn)]",
  bad: "bg-[var(--pv-bad)]",
};
export const toneText: Record<Tone, string> = {
  neutral: "text-[var(--pv-text2)]",
  brand: "text-[var(--pv-primary-strong)]",
  good: "text-[var(--pv-good)]",
  warn: "text-[var(--pv-warn)]",
  bad: "text-[var(--pv-bad)]",
};

export function Badge({
  tone = "neutral",
  dot,
  children,
  className = "",
}: {
  tone?: Tone;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-px text-[11.5px] font-medium leading-[19px] ${TONE[tone]} ${className}`}
    >
      {dot ? (
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT[tone]}`} />
      ) : null}
      {children}
    </span>
  );
}

export function Dot({
  tone = "neutral",
  color,
}: {
  tone?: Tone;
  color?: string;
}) {
  return (
    <span
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${color ? "" : DOT[tone]}`}
      style={color ? { background: color } : undefined}
    />
  );
}

type BtnVariant =
  "primary" | "secondary" | "ghost" | "danger" | "band" | "bandPrimary";
const BTN: Record<BtnVariant, string> = {
  primary:
    "bg-[var(--pv-primary)] text-[var(--pv-primary-text)] shadow-[0_1px_1px_rgba(16,24,40,0.1)]",
  secondary:
    "border border-[var(--pv-border)] bg-white text-[var(--pv-ink)] shadow-[0_1px_1px_rgba(16,24,40,0.04)]",
  ghost: "text-[var(--pv-text2)]",
  danger: "border border-[var(--pv-border)] bg-white text-[var(--pv-bad)]",
  band: "border border-white/45 text-white",
  bandPrimary: "bg-[#10C4CE] text-[#223754]",
};

export function Btn({
  v = "secondary",
  icon: Icon,
  children,
  off,
  size = "md",
  className = "",
}: {
  v?: BtnVariant;
  icon?: LucideIcon;
  children?: ReactNode;
  off?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-[var(--pv-radius-ctl)] font-medium ${size === "sm" ? "h-7 px-2.5 text-[12px]" : "h-8 px-3 text-[12.5px]"} ${BTN[v]} ${off ? "opacity-45" : ""} ${className}`}
    >
      {Icon ? (
        <Icon
          className={size === "sm" ? "h-3.5 w-3.5" : "h-[15px] w-[15px]"}
          strokeWidth={2}
        />
      ) : null}
      {children}
    </span>
  );
}

export function Card({
  title,
  sub,
  right,
  children,
  pad = true,
  className = "",
  bodyClass = "",
}: {
  title?: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
  pad?: boolean;
  className?: string;
  bodyClass?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[var(--pv-radius)] border border-[var(--pv-border)] bg-[var(--pv-card)] shadow-[0_1px_2px_rgba(16,24,40,0.04)] ${className}`}
    >
      {title || right ? (
        <div className="flex items-center gap-3 border-b border-[var(--pv-divider)] px-4 py-2.5">
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold">{title}</div>
            {sub ? (
              <div className="truncate text-[11.5px] text-[var(--pv-muted)]">
                {sub}
              </div>
            ) : null}
          </div>
          {right}
        </div>
      ) : null}
      <div className={pad ? `p-4 ${bodyClass}` : bodyClass}>{children}</div>
    </div>
  );
}

export interface KpiProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: Tone;
  spark?: number[];
  delta?: string;
  deltaTone?: Tone;
}

export function Kpi({
  label,
  value,
  hint,
  tone,
  spark,
  delta,
  deltaTone = "neutral",
}: KpiProps) {
  return (
    <div className="min-w-0 rounded-[var(--pv-radius)] border border-[var(--pv-border)] bg-[var(--pv-card)] px-4 py-3 shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
      <div className="truncate text-[12px] font-medium text-[var(--pv-text2)]">
        {label}
      </div>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <div
          className={`truncate font-[family-name:var(--pv-display)] text-[22px] font-semibold leading-none tracking-[-0.015em] ${tone ? toneText[tone] : ""}`}
        >
          {value}
        </div>
        {spark ? <Spark data={spark} /> : null}
      </div>
      {hint || delta ? (
        <div className="mt-2 flex min-w-0 items-center gap-1.5 text-[11.5px] text-[var(--pv-muted)]">
          {delta ? <Badge tone={deltaTone}>{delta}</Badge> : null}
          <span className="truncate">{hint}</span>
        </div>
      ) : null}
    </div>
  );
}

export function Kpis({ items, cols }: { items: KpiProps[]; cols?: number }) {
  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: `repeat(${cols ?? items.length}, minmax(0, 1fr))`,
      }}
    >
      {items.map((k) => (
        <Kpi key={k.label} {...k} />
      ))}
    </div>
  );
}

export interface Col {
  h: ReactNode;
  w?: number | string;
  align?: "left" | "right" | "center";
}

export function Table({
  cols,
  rows,
  sel,
  rowTone,
  dense,
  foot,
  className = "",
  bare,
  small,
}: {
  small?: boolean;
  cols: Col[];
  rows: ReactNode[][];
  sel?: number;
  rowTone?: (Tone | undefined)[];
  dense?: boolean;
  foot?: ReactNode[];
  className?: string;
  bare?: boolean;
}) {
  const brand = useBrand();
  const th =
    brand === "glo"
      ? "text-[10.5px] font-semibold uppercase tracking-[0.05em] text-[var(--pv-thead-text)]"
      : "text-[11.5px] font-medium text-[var(--pv-thead-text)]";
  const pad = small
    ? "px-2 py-[7px]"
    : dense
      ? "px-2.5 py-[7px]"
      : "px-3 py-[9px]";
  return (
    <table
      className={`w-full table-fixed border-collapse text-left ${small ? "text-[12px]" : "text-[12.5px]"} ${className}`}
    >
      <colgroup>
        {cols.map((c, i) => (
          <col key={i} style={c.w !== undefined ? { width: c.w } : undefined} />
        ))}
      </colgroup>
      <thead>
        <tr className={bare ? "" : "bg-[var(--pv-thead)]"}>
          {cols.map((c, i) => (
            <th
              key={i}
              className={`border-b border-[var(--pv-border)] ${small ? "px-2" : dense ? "px-2.5" : "px-3"} py-2 ${th} ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""} whitespace-nowrap`}
            >
              {c.h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, ri) => {
          const t = rowTone?.[ri];
          const tint =
            t === "bad"
              ? "bg-[var(--pv-bad-tint)]"
              : t === "warn"
                ? "bg-[var(--pv-warn-tint)]"
                : t === "good"
                  ? "bg-[var(--pv-good-tint)]"
                  : "";
          return (
            <tr
              key={ri}
              className={`${ri === sel ? "bg-[var(--pv-primary-tint)] shadow-[inset_3px_0_0_var(--pv-dot)]" : tint}`}
            >
              {r.map((cell, ci) => (
                <td
                  key={ci}
                  className={`truncate border-b border-[var(--pv-divider)] ${pad} align-middle ${cols[ci]?.align === "right" ? "text-right" : cols[ci]?.align === "center" ? "text-center" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
      {foot ? (
        <tfoot>
          <tr className="bg-[var(--pv-surface)] font-semibold">
            {foot.map((cell, ci) => (
              <td
                key={ci}
                className={`truncate ${small ? "px-2" : dense ? "px-2.5" : "px-3"} py-2 ${cols[ci]?.align === "right" ? "text-right" : ""}`}
              >
                {cell}
              </td>
            ))}
          </tr>
        </tfoot>
      ) : null}
    </table>
  );
}

const AV_TONES = ["#E7F8F9", "#EEF2F7", "#F2F0FA", "#ECF6F0", "#FBF3E8"];
export function Avatar({
  name,
  size = 26,
  tone,
}: {
  name: string;
  size?: number;
  tone?: number;
}) {
  const parts = name
    .replace(/[^A-Za-z ]/g, "")
    .split(" ")
    .filter(Boolean);
  const ini = (
    (parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")
  ).toUpperCase();
  const t =
    tone ?? (name.length * 7 + (name.charCodeAt(0) || 0)) % AV_TONES.length;
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-[var(--pv-text2)]"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.4),
        background: AV_TONES[t],
      }}
    >
      {ini}
    </span>
  );
}

export function Person({
  name,
  sub,
  size,
}: {
  name: string;
  sub?: ReactNode;
  size?: number;
}) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Avatar name={name} size={size} />
      <span className="min-w-0">
        <span className="block truncate font-medium">{name}</span>
        {sub ? (
          <span className="block truncate text-[11.5px] text-[var(--pv-muted)]">
            {sub}
          </span>
        ) : null}
      </span>
    </span>
  );
}

export function Meter({
  value,
  max = 100,
  tone = "brand",
  w,
  h = 6,
}: {
  value: number;
  max?: number;
  tone?: Tone;
  w?: number | string;
  h?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill =
    tone === "brand"
      ? "var(--pv-dot)"
      : tone === "good"
        ? "var(--pv-good)"
        : tone === "warn"
          ? "#f59e0b"
          : tone === "bad"
            ? "var(--pv-bad)"
            : "var(--pv-faint)";
  const track =
    tone === "bad"
      ? "var(--pv-bad-tint)"
      : tone === "warn"
        ? "#fef3c7"
        : tone === "good"
          ? "var(--pv-good-tint)"
          : "var(--pv-primary-tint)";
  return (
    <span
      className="block overflow-hidden rounded-full"
      style={{ width: w ?? "100%", height: h, background: track }}
    >
      <span
        className="block h-full rounded-full"
        style={{ width: `${pct}%`, background: fill }}
      />
    </span>
  );
}

export function Tabs({
  items,
  active = 0,
  className = "",
}: {
  items: ReactNode[];
  active?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-5 border-b border-[var(--pv-border)] ${className}`}
    >
      {items.map((t, i) => (
        <span
          key={i}
          className={`-mb-px whitespace-nowrap border-b-2 pb-2 text-[12.5px] ${i === active ? "border-[var(--pv-dot)] font-semibold text-[var(--pv-ink)]" : "border-transparent text-[var(--pv-text2)]"}`}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

export function Chips({
  items,
  active = 0,
}: {
  items: [string, ReactNode?][];
  active?: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {items.map(([label, count], i) => (
        <span
          key={label}
          className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[12px] ${i === active ? "border-transparent bg-[var(--pv-primary-tint)] font-medium text-[var(--pv-primary-strong)]" : "border-[var(--pv-border)] bg-white text-[var(--pv-text2)]"}`}
        >
          {label}
          {count !== undefined ? (
            <span className={i === active ? "" : "text-[var(--pv-muted)]"}>
              {count}
            </span>
          ) : null}
        </span>
      ))}
    </div>
  );
}

export function Field({
  placeholder,
  w = 240,
  icon: Icon = Search,
  value,
}: {
  placeholder?: string;
  w?: number | string;
  icon?: LucideIcon;
  value?: string;
}) {
  return (
    <span
      className="inline-flex h-8 items-center gap-2 rounded-[var(--pv-radius-ctl)] border border-[var(--pv-border)] bg-white px-2.5 text-[12.5px] shadow-[0_1px_1px_rgba(16,24,40,0.03)]"
      style={{ width: w }}
    >
      <Icon className="h-[15px] w-[15px] shrink-0 text-[var(--pv-muted)]" />
      <span
        className={`truncate ${value ? "text-[var(--pv-ink)]" : "text-[var(--pv-muted)]"}`}
      >
        {value ?? placeholder}
      </span>
    </span>
  );
}

export function Kv({
  rows,
  cols = 1,
  labelW = 116,
}: {
  rows: [ReactNode, ReactNode][];
  cols?: number;
  labelW?: number;
}) {
  return (
    <dl
      className="grid gap-x-6 gap-y-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
    >
      {rows.map(([k, v], i) => (
        <div
          key={i}
          className="grid min-w-0 items-baseline gap-2 text-[12.5px]"
          style={{ gridTemplateColumns: `${labelW}px minmax(0,1fr)` }}
        >
          <dt className="truncate text-[var(--pv-muted)]">{k}</dt>
          <dd className="min-w-0 truncate font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Timeline({
  items,
}: {
  items: { time: string; title: ReactNode; sub?: ReactNode; tone?: Tone }[];
}) {
  return (
    <ol className="relative">
      {items.map((it, i) => (
        <li
          key={i}
          className="relative grid grid-cols-[52px_14px_minmax(0,1fr)] gap-2 pb-3 last:pb-0"
        >
          <span className="pt-px text-right text-[11.5px] tabular-nums text-[var(--pv-muted)]">
            {it.time}
          </span>
          <span className="relative flex justify-center">
            <span
              className={`relative z-10 mt-[5px] h-2 w-2 rounded-full ring-2 ring-white ${DOT[it.tone ?? "brand"]}`}
            />
            {i < items.length - 1 ? (
              <span className="absolute top-3 h-[calc(100%-2px)] w-px bg-[var(--pv-border)]" />
            ) : null}
          </span>
          <span className="min-w-0">
            <span className="block text-[12.5px] font-medium leading-snug">
              {it.title}
            </span>
            {it.sub ? (
              <span className="block text-[11.5px] leading-snug text-[var(--pv-muted)]">
                {it.sub}
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Banner({
  tone = "brand",
  icon: Icon,
  title,
  children,
  className = "",
}: {
  tone?: Tone;
  icon?: LucideIcon;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-[var(--pv-radius)] px-3.5 py-2.5 text-[12.5px] ${TONE[tone]} ${className}`}
    >
      {Icon ? <Icon className="mt-px h-4 w-4 shrink-0" /> : null}
      <div className="min-w-0">
        <span className="font-semibold">{title}</span>
        {children ? (
          <span className="text-[var(--pv-text2)]"> {children}</span>
        ) : null}
      </div>
    </div>
  );
}

export function Check({
  ok = true,
  children,
  sub,
}: {
  ok?: boolean | "warn";
  children: ReactNode;
  sub?: ReactNode;
}) {
  const tone: Tone = ok === true ? "good" : ok === "warn" ? "warn" : "bad";
  return (
    <div className="flex items-start gap-2.5 py-[7px]">
      <span
        className={`mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${tone === "good" ? "bg-[var(--pv-good)]" : tone === "warn" ? "bg-[#d97706]" : "bg-[var(--pv-bad)]"}`}
      >
        {ok === true ? "✓" : "!"}
      </span>
      <span className="min-w-0">
        <span className="block text-[12.5px] leading-snug">{children}</span>
        {sub ? (
          <span
            className={`block text-[11.5px] leading-snug ${ok === true ? "text-[var(--pv-muted)]" : toneText[tone]}`}
          >
            {sub}
          </span>
        ) : null}
      </span>
    </div>
  );
}

export function Money({
  children,
  muted,
}: {
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <span className={`tabular-nums ${muted ? "text-[var(--pv-muted)]" : ""}`}>
      {children}
    </span>
  );
}

export function Muted({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`text-[var(--pv-muted)] ${className}`}>{children}</span>
  );
}

export function H2({
  children,
  right,
  className = "",
}: {
  children: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <h3 className="text-[13.5px] font-semibold">{children}</h3>
      {right}
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <span className="rounded border border-white/25 px-1 text-[10px] leading-4 text-white/60">
      {children}
    </span>
  );
}

export function CheckLine({
  ok = true,
  children,
  note,
}: {
  ok?: boolean | "warn";
  children: ReactNode;
  note?: ReactNode;
}) {
  const tone: Tone = ok === true ? "good" : ok === "warn" ? "warn" : "bad";
  return (
    <div className="flex items-center gap-2.5 border-b border-[var(--pv-divider)] py-[4.5px] last:border-0">
      <span
        className={`flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${tone === "good" ? "bg-[var(--pv-good)]" : tone === "warn" ? "bg-[#d97706]" : "bg-[var(--pv-bad)]"}`}
      >
        {ok === true ? "✓" : "!"}
      </span>
      <span
        className={`min-w-0 flex-1 truncate text-[12.5px] ${ok === true ? "" : "font-medium"}`}
      >
        {children}
      </span>
      {note ? (
        <span
          className={`shrink-0 text-[11.5px] ${ok === true ? "text-[var(--pv-muted)]" : toneText[tone]}`}
        >
          {note}
        </span>
      ) : null}
    </div>
  );
}
