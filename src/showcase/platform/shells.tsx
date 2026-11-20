import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  Archive,
  BadgeCheck,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  ClipboardList,
  Clock,
  FileSpreadsheet,
  FileText,
  Gauge,
  GitMerge,
  Globe,
  Home,
  Inbox,
  LineChart,
  Link2,
  ListChecks,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Maximize2,
  Megaphone,
  MessageSquare,
  Network,
  Package,
  PanelLeft,
  Phone,
  Plus,
  PoundSterling,
  Radar,
  ReceiptText,
  Rss,
  Search,
  Send,
  Settings,
  ShoppingBag,
  Target,
  UserPlus,
  Users,
  Wand2,
  X,
  type LucideIcon,
} from "lucide-react";
import { asset } from "../../lib/asset";
import { BrandCtx, Btn, Kbd, type Brand } from "./kit";
import "./platform.css";

export const APP_W = 1280;
export const APP_H = 800;
export const CHROME_H = 36;
export const WIN_H = APP_H + CHROME_H;

/* ------------------------------------------------------------------ window */

const SYS = {
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
};

export function PlatformWindow({
  brand,
  path,
  children,
}: {
  brand: Brand;
  path: string;
  children: ReactNode;
}) {
  return (
    <div
      className="overflow-hidden rounded-[12px] border border-[#cdd3da] bg-[#f3f4f6] shadow-[0_40px_80px_-40px_rgba(11,15,26,0.5),0_16px_32px_-16px_rgba(11,15,26,0.22)]"
      style={{ width: APP_W, height: WIN_H }}
    >
      <div
        className="flex items-center gap-2 border-b border-[#dde1e6] px-3.5"
        style={{ height: CHROME_H }}
      >
        <span className="flex gap-1.5">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span
              key={c}
              className="h-3 w-3 rounded-full"
              style={{ background: c }}
            />
          ))}
        </span>
        <span
          className="mx-auto flex h-6 min-w-[380px] items-center justify-center gap-1.5 rounded-md bg-white px-3 text-[11.5px] text-[#4b5563] ring-1 ring-[#e3e6ea]"
          style={SYS}
        >
          <Lock className="h-3 w-3 text-[#8a93a0]" />
          <span className="font-medium text-[#374151]">
            {brand === "avolon" ? "Avolon platform" : "Glo CRM"}
          </span>
          <span className="text-[#8a93a0]">{path}</span>
        </span>
        <span
          className="rounded-full bg-[#e8f4ee] px-2 py-0.5 text-[10.5px] font-medium text-[#17804a]"
          style={SYS}
        >
          Made-up data
        </span>
      </div>
      <BrandCtx.Provider value={brand}>{children}</BrandCtx.Provider>
    </div>
  );
}

/** Draws a fixed-size screen at whatever width it is given, like a screenshot that stays sharp. */
export function ScaleToFit({
  w = APP_W,
  h = WIN_H,
  children,
  max = 1,
}: {
  w?: number;
  h?: number;
  children: ReactNode;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setS(Math.min(max, el.clientWidth / w));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, max]);
  return (
    <div
      ref={ref}
      className="relative w-full"
      style={{
        height: s ? h * s : undefined,
        aspectRatio: s ? undefined : `${w} / ${h}`,
      }}
    >
      {s ? (
        <div
          className="absolute left-0 top-0"
          style={{
            width: w,
            height: h,
            transform: `scale(${s})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

/** The same screen at its full size, in an overlay that scrolls when the window is smaller. */
export function FullSize({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-[100] flex flex-col bg-[#0b0f1a]/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-3 text-white">
        <p className="text-[13px] text-white/75">{label}</p>
        <button
          ref={closeRef}
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 px-3 py-1.5 text-[13px] font-medium hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X className="h-4 w-4" /> Close
        </button>
      </div>
      <div
        className="min-h-0 flex-1 overflow-auto px-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto w-fit">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export function ExpandButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-gborder bg-white px-3 py-1.5 text-[13px] font-medium text-action hover:border-action focus:outline-none focus-visible:ring-2 focus-visible:ring-action"
    >
      <Maximize2 className="h-3.5 w-3.5" /> View full size
    </button>
  );
}

/* ------------------------------------------------------------------ Avolon */

type NavItem = { key: string; label: string; icon: LucideIcon };

const AV_NAV: { label: string; items: NavItem[] }[] = [
  {
    label: "Payroll and Invoicing",
    items: [
      { key: "inbox", label: "Timesheet Inbox", icon: Inbox },
      { key: "plan", label: "Mini Plan", icon: ClipboardList },
      { key: "timesheets", label: "Timesheets", icon: FileSpreadsheet },
      { key: "runs", label: "Payroll runs", icon: ListChecks },
      { key: "invoices", label: "Invoices", icon: ReceiptText },
      { key: "credit", label: "Credit control", icon: Gauge },
      { key: "ledger", label: "Sales ledger", icon: PoundSterling },
      { key: "insights", label: "Insights", icon: LineChart },
      { key: "clients", label: "Clients", icon: Building2 },
      { key: "archive", label: "Invoice archive", icon: Archive },
    ],
  },
  {
    label: "Compliance",
    items: [
      { key: "compliance", label: "Cards and tickets", icon: BadgeCheck },
    ],
  },
  {
    label: "Automations",
    items: [
      { key: "registrations", label: "Registrations", icon: UserPlus },
      { key: "shortlists", label: "Shortlists", icon: Users },
      { key: "sweep", label: "Availability sweep", icon: Mail },
      { key: "prospects", label: "Prospect sites", icon: MapPin },
      { key: "calls", label: "Calls and texts", icon: Phone },
      { key: "feed", label: "Jobs feed", icon: Rss },
      { key: "merge", label: "Merge duplicates", icon: GitMerge },
      { key: "jobs", label: "Scheduled jobs", icon: Clock },
    ],
  },
];

export type StepState = "done" | "now" | "part" | "todo";
export interface WeekStep {
  label: string;
  detail: string;
  state: StepState;
}

const STEP_DOT: Record<StepState, string> = {
  done: "border-[#059669] bg-[#059669] text-white",
  now: "border-[#223754] bg-[#223754] text-white",
  part: "border-[#f59e0b] bg-[#fffbeb] text-[#92400e]",
  todo: "border-[#e3e8ea] bg-white text-[#5f7186]",
};

export function WeekSteps({
  steps,
  next,
}: {
  steps: WeekStep[];
  next?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-x-4 border-b border-[var(--pv-border)] bg-white px-6 py-2.5">
      <ol className="flex min-w-0 items-center">
        {steps.map((st, i) => (
          <li key={st.label} className="flex items-center">
            {i > 0 ? (
              <span className="mx-2 h-px w-3 bg-[var(--pv-border)]" />
            ) : null}
            <span
              className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${STEP_DOT[st.state]}`}
            >
              {st.state === "done" ? (
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              ) : (
                i + 1
              )}
            </span>
            <span className="ml-1.5 leading-tight">
              <span
                className={`block whitespace-nowrap text-[12px] ${st.state === "now" ? "font-semibold" : st.state === "todo" ? "text-[var(--pv-muted)]" : "font-medium"}`}
              >
                {st.label}
              </span>
              <span className="block whitespace-nowrap text-[11px] text-[var(--pv-muted)]">
                {st.detail}
              </span>
            </span>
          </li>
        ))}
      </ol>
      {next ? <div className="ml-auto shrink-0">{next}</div> : null}
    </div>
  );
}

export function AvolonApp({
  nav,
  title,
  context,
  actions,
  steps,
  next,
  children,
  week = "Week ending Sun 18 Oct 2026",
}: {
  nav: string;
  title: string;
  context?: string;
  actions?: ReactNode;
  steps?: WeekStep[];
  next?: ReactNode;
  children: ReactNode;
  week?: string;
}) {
  return (
    <div
      className="pv pv-avolon flex overflow-hidden bg-white"
      style={{ width: APP_W, height: APP_H }}
    >
      <aside className="flex w-[228px] shrink-0 flex-col bg-[#223754] text-[#e7ecee]">
        <div className="flex h-14 shrink-0 items-center px-3.5">
          <img
            src={asset("/brand/avolon/avolon-logo-reversed.png")}
            alt=""
            className="h-[36px] w-auto"
          />
        </div>
        <nav className="min-h-0 flex-1 overflow-hidden pb-2">
          {AV_NAV.map((g) => (
            <div key={g.label} className="pt-2">
              <p className="px-4 pb-1 pt-1.5 text-[11px] font-medium text-[#9fb0c4]">
                {g.label}
              </p>
              {g.items.map((it) => {
                const on = it.key === nav;
                return (
                  <span
                    key={it.key}
                    className={`mx-2 flex h-[29px] items-center gap-2.5 rounded-md px-2.5 text-[12.5px] ${on ? "bg-[#10C4CE] font-semibold text-[#223754]" : "text-[#e7ecee]/90"}`}
                  >
                    <it.icon
                      className={`h-[15px] w-[15px] shrink-0 ${on ? "" : "text-[#b3c0cf]"}`}
                      strokeWidth={1.9}
                    />
                    {it.label}
                  </span>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="border-t border-[#394e6a] px-2 py-2">
          <span className="flex h-[29px] items-center gap-2.5 rounded-md px-2.5 text-[12.5px] text-[#e7ecee]/90">
            <Settings
              className="h-[15px] w-[15px] text-[#b3c0cf]"
              strokeWidth={1.9}
            />
            Settings
          </span>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/10 bg-[#223754] px-3 text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-md text-white/80">
            <PanelLeft className="h-4 w-4" />
          </span>
          <span className="flex h-8 w-[232px] items-center justify-between rounded-md border border-white/20 bg-white/10 px-3 text-[12.5px]">
            {week}
            <ChevronDown className="h-4 w-4 text-white/60" />
          </span>
          <span className="flex-1" />
          <span className="flex items-center gap-2 px-2 text-[12.5px] text-white/75">
            <Search className="h-4 w-4" /> Search <Kbd>⌘K</Kbd>
          </span>
          <span className="flex items-center gap-2 px-2 text-[12.5px] text-white/75">
            <LogOut className="h-4 w-4" /> Sign out
          </span>
        </header>
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div
            className="flex shrink-0 items-start justify-between gap-4 border-b-[3px] px-6 pb-4 pt-5"
            style={{
              background:
                "linear-gradient(180deg, #223754 0%, #1b2d45 46%, #0d1c38 100%)",
              borderBottomColor: "#10C4CE",
            }}
          >
            <div className="min-w-0">
              <h1 className="font-[family-name:var(--pv-display)] text-[23px] font-semibold leading-tight tracking-[-0.01em] text-white">
                {title}
              </h1>
              {context ? (
                <p className="mt-1 text-[13px] text-white/75">{context}</p>
              ) : null}
            </div>
            {actions ? (
              <div className="flex shrink-0 items-center gap-2 pt-1">
                {actions}
              </div>
            ) : null}
          </div>
          {steps ? <WeekSteps steps={steps} next={next} /> : null}
          <div className="min-h-0 flex-1 px-6 pb-5 pt-4">{children}</div>
        </main>
      </div>
    </div>
  );
}

/** The week as the steps bar shows it at each point of the test week. */
export const WEEK = {
  inbox: [
    { label: "Mini Plan", detail: "96 people", state: "done" },
    { label: "Timesheets in", detail: "82 of 96", state: "part" },
    { label: "Approve timesheets", detail: "6 to approve", state: "now" },
    { label: "Run payroll", detail: "76 ready to run", state: "todo" },
    { label: "Umbrella files", detail: "After payroll", state: "todo" },
    { label: "Invoices", detail: "After payroll", state: "todo" },
  ],
  run: [
    { label: "Mini Plan", detail: "96 people", state: "done" },
    { label: "Timesheets in", detail: "96 of 96", state: "done" },
    { label: "Approve timesheets", detail: "All approved", state: "done" },
    { label: "Run payroll", detail: "Run 42, draft", state: "now" },
    { label: "Umbrella files", detail: "After the lock", state: "todo" },
    { label: "Invoices", detail: "After the lock", state: "todo" },
  ],
  files: [
    { label: "Mini Plan", detail: "96 people", state: "done" },
    { label: "Timesheets in", detail: "96 of 96", state: "done" },
    { label: "Approve timesheets", detail: "All approved", state: "done" },
    { label: "Run payroll", detail: "Run 42 locked", state: "done" },
    { label: "Umbrella files", detail: "2 to approve", state: "now" },
    { label: "Invoices", detail: "54 drafts", state: "part" },
  ],
} satisfies Record<string, WeekStep[]>;

export function NextStep({ children }: { children: ReactNode }) {
  return (
    <Btn v="primary" size="sm">
      {children}
    </Btn>
  );
}

/* ------------------------------------------------------------------ Glo CRM */

const GLO_NAV: { label?: string; items: NavItem[] }[] = [
  {
    items: [
      { key: "search", label: "Search", icon: Search },
      { key: "home", label: "Home", icon: Home },
    ],
  },
  {
    label: "Recruitment",
    items: [
      { key: "jobs", label: "Jobs", icon: Briefcase },
      { key: "candidates", label: "Candidates", icon: Users },
      { key: "mapping", label: "Talent mapping", icon: Network },
      { key: "companies", label: "Companies", icon: Building2 },
      { key: "mailshots", label: "Mailshots", icon: Mail },
    ],
  },
  {
    label: "Growth",
    items: [
      { key: "frontdesk", label: "Front Desk", icon: Inbox },
      { key: "inbox", label: "Messages", icon: MessageSquare },
      { key: "prospecting", label: "Prospecting", icon: Target },
      { key: "outreach", label: "Outreach", icon: Send },
      { key: "intel", label: "Intelligence", icon: Radar },
      { key: "tracking", label: "Link tracking", icon: Link2 },
      { key: "ads", label: "Ads", icon: Megaphone },
    ],
  },
  {
    label: "Services",
    items: [
      { key: "cvstudio", label: "CV studio", icon: Wand2 },
      { key: "formatter", label: "CV formatter", icon: FileText },
      { key: "orders", label: "Orders", icon: ShoppingBag },
      { key: "products", label: "Products", icon: Package },
      { key: "website", label: "Website", icon: Globe },
    ],
  },
];

export function GloApp({
  nav,
  children,
}: {
  nav: string;
  children: ReactNode;
}) {
  return (
    <div
      className="pv pv-glo flex overflow-hidden bg-[var(--pv-page)]"
      style={{ width: APP_W, height: APP_H }}
    >
      <aside className="flex w-[218px] shrink-0 flex-col bg-[#0b1020] text-[#93a2bc]">
        <div className="flex items-center gap-2 px-4 py-4">
          <img
            src={asset("/brand/glo/glo-crm-mark.png")}
            alt=""
            className="h-[26px] w-auto"
          />
          <span className="text-[15px] font-semibold tracking-tight text-white">
            Glo CRM
          </span>
        </div>
        <div className="px-3 pb-1">
          <span className="flex h-8 items-center justify-center gap-1.5 rounded-md bg-[#2b6bea] text-[13px] font-medium text-white">
            <Plus className="h-4 w-4" /> New
          </span>
        </div>
        <nav className="min-h-0 flex-1 overflow-hidden px-2">
          {GLO_NAV.map((g, gi) => (
            <div key={gi} className="pt-1.5">
              {g.label ? (
                <p className="px-3 pb-0.5 pt-1.5 text-[11px] font-medium text-white/45">
                  {g.label}
                </p>
              ) : null}
              {g.items.map((it) => {
                const on = it.key === nav;
                return (
                  <span
                    key={it.key}
                    className={`flex h-[27px] items-center gap-3 rounded-md px-3 text-[13px] ${on ? "bg-[#2b6bea] font-medium text-white" : "text-[#93a2bc]"}`}
                  >
                    <it.icon
                      className={`h-4 w-4 shrink-0 ${on ? "text-white" : "text-[#93a2bc]"}`}
                    />
                    {it.label}
                  </span>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="border-t border-white/10 px-2 py-2">
          <span className="flex h-[29px] items-center gap-3 rounded-md px-3 text-[13px] text-[#93a2bc]">
            <Settings className="h-4 w-4" /> Admin
          </span>
        </div>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[var(--pv-border)] bg-white px-6">
          <span className="flex h-8 w-[400px] items-center gap-2 rounded-md border border-[var(--pv-border)] bg-[var(--pv-page)] px-3 text-[12.5px] text-[var(--pv-muted)]">
            <Search className="h-4 w-4" /> Search candidates, jobs, companies
            and people
            <span className="ml-auto rounded border border-[var(--pv-border)] bg-white px-1 text-[10px] leading-4">
              ⌘K
            </span>
          </span>
          <span className="ml-auto text-[13px] text-[#2b6bea]">Help</span>
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#eaf0fd] text-[11.5px] font-semibold text-[#2b6bea]">
            SB
          </span>
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-6 pt-5">
          {children}
        </div>
      </main>
    </div>
  );
}

export function GloHead({
  title,
  meta,
  actions,
  tabs,
}: {
  title: string;
  meta?: ReactNode;
  actions?: ReactNode;
  tabs?: ReactNode;
}) {
  return (
    <div className="mb-4 shrink-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-baseline gap-2.5">
          <h1 className="text-[21px] font-semibold tracking-[-0.2px]">
            {title}
          </h1>
          {meta ? (
            <span className="truncate text-[13px] text-[var(--pv-muted)]">
              {meta}
            </span>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
      {tabs ? <div className="mt-3">{tabs}</div> : null}
    </div>
  );
}

/** The part of a Glo CRM page below its heading: fills what is left of the screen. */
export function Fill({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`min-h-0 flex-1 ${className}`}>{children}</div>;
}
