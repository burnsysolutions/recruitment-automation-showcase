import { Link } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { X, Check } from "lucide-react";

export function Page({ title, context, actions, children, wide }: { title: string; context?: ReactNode; actions?: ReactNode; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    document.title = `${title} | Demo Recruitment Co`;
  }, [title]);
  return (
    <div className={`mx-auto px-5 py-7 lg:px-8 ${wide ? "max-w-[1680px]" : "max-w-[1480px]"}`}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {context ? <div className="text-[13px] text-gmuted">{context}</div> : null}
          <h1 className="mt-0.5 text-[24px] font-semibold tracking-[-0.01em] text-navy">{title}</h1>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}

export function Panel({ title, meta, actions, children, className = "", pad = false }: { title?: ReactNode; meta?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <section className={`rounded-xl border border-gborder bg-white ${className}`}>
      {title ? (
        <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-gborder px-5 py-3.5">
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold text-navy">{title}</h2>
            {meta ? <p className="text-[12.5px] text-gmuted">{meta}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className={pad ? "p-5" : ""}>{children}</div>
    </section>
  );
}

type BtnProps = { children: ReactNode; onClick?: () => void; to?: string; variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "sm" | "md"; disabled?: boolean; type?: "button" | "submit"; icon?: ReactNode; className?: string; title?: string };
export function Button({ children, onClick, to, variant = "secondary", size = "md", disabled, type = "button", icon, className = "", title }: BtnProps) {
  const base = `inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
    size === "sm" ? "h-8 px-3 text-[12.5px]" : "h-9 px-3.5 text-[13px]"
  }`;
  const v = {
    primary: "bg-action text-white hover:bg-action-hover",
    secondary: "border border-gborder bg-white text-navy hover:border-navy/35",
    ghost: "text-action hover:bg-action-tint",
    danger: "border border-[#f0c9c6] bg-white text-gdanger hover:bg-[#fbeceb]",
  }[variant];
  const cls = `${base} ${v} ${className}`;
  if (to)
    return (
      <Link to={to} className={cls} title={title}>
        {icon}
        {children}
      </Link>
    );
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} title={title}>
      {icon}
      {children}
    </button>
  );
}

const TONES: Record<string, string> = {
  green: "bg-[#e7f4ec] text-gsuccess",
  blue: "bg-action-tint text-action",
  amber: "bg-[#fbf3e3] text-gwarning",
  red: "bg-[#fbeceb] text-gdanger",
  grey: "bg-gsecondary text-gmuted",
  navy: "bg-navy text-white",
};
export function Badge({ tone = "grey", children }: { tone?: keyof typeof TONES | string; children: ReactNode }) {
  return <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[12px] font-medium ${TONES[tone] ?? TONES.grey}`}>{children}</span>;
}

export const statusTone = (s: string) =>
  (
    {
      Available: "green",
      "On assignment": "blue",
      "Available from": "amber",
      "Not looking": "grey",
      Approved: "green",
      Received: "blue",
      "Needs review": "amber",
      Awaiting: "grey",
      Open: "amber",
      Shortlisted: "blue",
      Booked: "navy",
      Filled: "green",
      Draft: "grey",
      Locked: "navy",
      Sent: "blue",
      Paid: "green",
      Active: "green",
      Prospect: "amber",
    } as Record<string, string>
  )[s] ?? "grey";

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const hues = ["#1b2a41", "#2b4467", "#3d5a80", "#39767e", "#4c3f80", "#2f5d3a", "#6b4f2a"];
  const h = hues[[...name].reduce((t, c) => t + c.charCodeAt(0), 0) % hues.length];
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full font-medium text-white" style={{ width: size, height: size, background: h, fontSize: size * 0.38 }}>
      {initials}
    </span>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12.5px] font-medium text-gfg">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[12px] text-gmuted">{hint}</span> : null}
    </label>
  );
}
export const inputBase =
  "h-9 rounded-lg border border-gborder bg-white px-3 text-[13px] text-gfg placeholder:text-gmuted/70 focus:border-action focus:outline-none focus:ring-2 focus:ring-action/15";
export const inputCls = `${inputBase} w-full`;

export function Select({ value, onChange, options, className = "" }: { value: string; onChange: (v: string) => void; options: (string | [string, string])[]; className?: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`${/\bw-/.test(className) ? inputBase : inputCls} pr-8 ${className}`}>
      {options.map((o) => {
        const [v, l] = Array.isArray(o) ? o : [o, o];
        return (
          <option key={v} value={v}>
            {l}
          </option>
        );
      })}
    </select>
  );
}

export function Tabs({ tabs, value, onChange }: { tabs: [string, string, number?][]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-gborder" role="tablist">
      {tabs.map(([v, l, n]) => (
        <button
          key={v}
          role="tab"
          aria-selected={value === v}
          onClick={() => onChange(v)}
          className={`relative -mb-px whitespace-nowrap border-b-2 px-3 pb-2.5 pt-1 text-[13px] transition-colors ${
            value === v ? "border-action font-medium text-navy" : "border-transparent text-gmuted hover:text-gfg"
          }`}
        >
          {l}
          {n !== undefined ? <span className="ml-1.5 rounded-full bg-gsecondary px-1.5 text-[11px] tabular text-gmuted">{n}</span> : null}
        </button>
      ))}
    </div>
  );
}

export function Dialog({ open, onClose, title, children, width = 560, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; width?: number; footer?: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0b0f1a]/40 p-4 pt-[8vh]" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} className="w-full rounded-xl bg-white shadow-[0_4px_8px_rgba(10,16,29,0.06),0_32px_80px_rgba(10,16,29,0.18)]" style={{ maxWidth: width }} onMouseDown={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between border-b border-gborder px-5 py-3.5">
          <h2 className="text-[15px] font-semibold text-navy">{title}</h2>
          <button onClick={onClose} className="rounded-md p-1 text-gmuted hover:bg-gsecondary" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="p-5">{children}</div>
        {footer ? <footer className="flex justify-end gap-2 border-t border-gborder px-5 py-3.5">{footer}</footer> : null}
      </div>
    </div>
  );
}

// ---------- toasts ----------
let pushToast: (t: string) => void = () => {};
export const toast = (t: string) => pushToast(t);
export function Toaster() {
  const [items, setItems] = useState<{ id: number; text: string }[]>([]);
  useEffect(() => {
    pushToast = (text) => {
      const id = Date.now() + Math.random();
      setItems((x) => [...x, { id, text }]);
      setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 3600);
    };
  }, []);
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex flex-col gap-2" aria-live="polite">
      {items.map((i) => (
        <div key={i.id} className="toast-in flex items-center gap-2.5 rounded-lg bg-midnight px-4 py-3 text-[13px] text-white shadow-lg">
          <Check className="h-4 w-4 text-[#7fd3a1]" />
          {i.text}
        </div>
      ))}
    </div>
  );
}

export function Empty({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="text-[14px] font-medium text-navy">{title}</p>
      {body ? <p className="mx-auto mt-1 max-w-[46ch] text-[13px] text-gmuted">{body}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function Th({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return <th className={`whitespace-nowrap px-4 py-2.5 text-left text-[12px] font-normal text-gmuted first:pl-5 last:pr-5 ${className}`}>{children}</th>;
}
export function Td({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return <td className={`px-4 py-2.5 align-middle first:pl-5 last:pr-5 ${className}`}>{children}</td>;
}

export function KV({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="divide-y divide-gborder text-[13px]">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[minmax(0,6.5rem)_1fr] gap-4 py-2.5">
          <dt className="text-gmuted">{k}</dt>
          <dd className="min-w-0 break-words">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Stat({ label, value, note, tone }: { label: string; value: ReactNode; note?: ReactNode; tone?: "danger" | "good" }) {
  return (
    <div className="px-5 py-4">
      <p className="text-[12.5px] text-gmuted">{label}</p>
      <p className={`mt-1 text-[24px] font-semibold leading-tight tracking-[-0.01em] tabular ${tone === "danger" ? "text-gdanger" : tone === "good" ? "text-gsuccess" : "text-navy"}`}>{value}</p>
      {note ? <p className="text-[12.5px] text-gmuted">{note}</p> : null}
    </div>
  );
}
export function StatRow({ children, cols = 4 }: { children: ReactNode; cols?: number }) {
  const c = { 3: "md:grid-cols-3", 4: "md:grid-cols-2 xl:grid-cols-4", 5: "md:grid-cols-3 xl:grid-cols-5" }[cols] ?? "md:grid-cols-4";
  return <div className={`mb-6 grid divide-y divide-gborder overflow-hidden rounded-xl border border-gborder bg-white md:divide-x md:divide-y-0 ${c}`}>{children}</div>;
}
