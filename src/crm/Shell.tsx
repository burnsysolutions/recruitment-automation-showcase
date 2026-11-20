import { asset } from "../lib/asset";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  Search,
  Users,
  Building2,
  Contact,
  BriefcaseBusiness,
  Handshake,
  FileClock,
  Radar,
  Wallet,
  ReceiptText,
  ListOrdered,
  MessageSquareText,
  BadgeCheck,
  MapPinned,
  Send,
  CheckSquare,
  Settings,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from "lucide-react";
import { useStore } from "../data/store";
import { Toaster } from "./ui";

type Item = { to: string; label: string; icon: LucideIcon; count?: number };

export function CrmShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const nav = useNavigate();
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        nav("/crm/search");
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [nav]);
  const timesheets = useStore((s) => s.timesheets);
  const jobs = useStore((s) => s.jobs);
  const toReview = timesheets.filter((t) => t.status === "Needs review" || t.status === "Received").length;
  const openJobs = jobs.filter((j) => j.stage !== "Filled").length;
  const openTasks = useStore((s) => s.tasks).filter((t) => !t.done).length;


  const groups: { label: string; items: Item[] }[] = [
    {
      label: "",
      items: [
        { to: "/crm", label: "Desk", icon: LayoutGrid },
        { to: "/crm/search", label: "Search", icon: Search },
        { to: "/crm/tasks", label: "Tasks", icon: CheckSquare, count: openTasks },
      ],
    },
    {
      label: "Records",
      items: [
        { to: "/crm/candidates", label: "Candidates", icon: Users },
        { to: "/crm/jobs", label: "Jobs", icon: BriefcaseBusiness, count: openJobs },
        { to: "/crm/clients", label: "Clients", icon: Building2 },
        { to: "/crm/contacts", label: "Contacts", icon: Contact },
        { to: "/crm/placements", label: "Placements", icon: Handshake },
      ],
    },
    {
      label: "Weekly money",
      items: [
        { to: "/crm/timesheets", label: "Timesheets", icon: FileClock, count: toReview },
        { to: "/crm/chase", label: "Chase board", icon: ListOrdered },
        { to: "/crm/payroll", label: "Payroll", icon: Wallet },
        { to: "/crm/invoices", label: "Invoices", icon: ReceiptText },
      ],
    },
    {
      label: "Automations",
      items: [
        { to: "/crm/shortlists", label: "Shortlists", icon: Radar },
        { to: "/crm/availability", label: "Availability", icon: MessageSquareText },
        { to: "/crm/compliance", label: "Compliance", icon: BadgeCheck },
        { to: "/crm/prospects", label: "Prospects", icon: MapPinned },
        { to: "/crm/mailshots", label: "Mailshots", icon: Send },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gbg font-glo text-gfg">
      <header className="no-print sticky top-0 z-30 bg-midnight">
        <div className="flex h-14 items-center gap-3 px-4">
          <button onClick={() => setMobile(true)} className="-ml-1 rounded-md p-1.5 text-white md:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <img src={asset("/brand/glo-mark-pink.png")} alt="Glo" className="h-8 w-auto" />
          <button className="hidden items-center sm:flex gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-white/[0.1]">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-white text-[10px] font-semibold text-midnight">DR</span>
            Demo Recruitment Co
            <ChevronDown className="h-3.5 w-3.5 text-white/60" />
          </button>
          <button onClick={() => nav("/crm/search")} className="ml-auto hidden h-8 w-[340px] items-center gap-2 rounded-lg bg-white px-2.5 text-left text-[13px] md:flex" aria-label="Search">
            <Search className="h-4 w-4 text-navy" strokeWidth={1.75} />
            <span className="flex-1 text-gmuted">Search candidates, clients, jobs</span>
            <kbd className="rounded border border-gborder px-1.5 text-[11px] text-gmuted">⌘K</kbd>
          </button>
          <div className="ml-auto flex items-center gap-2 md:ml-3">
            <button onClick={() => nav("/")} className="rounded-md border border-white/15 px-2 py-1 text-[11px] font-medium text-white/80 hover:bg-white/10">
              Back to the showcase
            </button>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2b3d59] text-[12px] font-semibold text-white">S</span>
          </div>
        </div>
      </header>

      <div className="flex">
        <div className="hidden shrink-0 border-r border-gborder bg-white md:block">
        <aside
          className={`sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col ${
            collapsed ? "w-[60px]" : "w-[232px]"
          } transition-[width] duration-200`}
        >
          <NavList groups={groups} collapsed={collapsed} />
          <div className="border-t border-gborder p-2.5">
            <NavLink to="/crm/settings" className="flex h-9 items-center gap-2.5 rounded-md px-2.5 text-[13.5px] text-gfg/80 hover:bg-gsecondary">
              <Settings className="h-4 w-4 text-gmuted" strokeWidth={1.75} />
              {!collapsed ? "Settings" : null}
            </NavLink>
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-[13.5px] text-gmuted hover:bg-gsecondary"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" strokeWidth={1.75} /> : <PanelLeftClose className="h-4 w-4" strokeWidth={1.75} />}
              {!collapsed ? "Collapse" : null}
            </button>
          </div>
        </aside>
        </div>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      {mobile ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-[#0b0f1a]/40" onClick={() => setMobile(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[272px] flex-col bg-white shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-gborder px-4">
              <span className="text-[14px] font-semibold text-navy">Demo Recruitment Co</span>
              <button onClick={() => setMobile(false)} className="rounded-md p-1.5 text-gmuted" aria-label="Close menu"><X className="h-5 w-5" /></button>
            </div>
            <NavList groups={[...groups, { label: "", items: [{ to: "/crm/settings", label: "Settings", icon: Settings }] }]} collapsed={false} onNavigate={() => setMobile(false)} />
          </div>
        </div>
      ) : null}
      <Toaster />
    </div>
  );
}

function NavList({ groups, collapsed, onNavigate }: { groups: { label: string; items: Item[] }[]; collapsed: boolean; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 overflow-y-auto px-2.5 py-3" aria-label="CRM">
            {groups.map((g) => (
              <div key={g.label || "top"} className="mb-1">
                {g.label && !collapsed ? (
                  <p className="px-2.5 pb-1 pt-4 text-[11px] font-medium text-gmuted">{g.label}</p>
                ) : g.label ? (
                  <div className="mx-2 my-3 border-t border-gborder" />
                ) : null}
                {g.items.map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    end={it.to === "/crm"}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `group relative flex h-9 items-center gap-2.5 rounded-md px-2.5 text-[13.5px] transition-colors ${
                        isActive ? "bg-action-tint font-medium text-navy" : "text-gfg/80 hover:bg-gsecondary"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <it.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-action" : "text-gmuted"}`} strokeWidth={1.75} />
                        {!collapsed ? <span className="flex-1 truncate">{it.label}</span> : null}
                        {!collapsed && it.count ? (
                          <span className="rounded-full bg-gsecondary px-1.5 py-0.5 text-[11px] font-medium tabular text-gmuted">{it.count}</span>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
  );
}
