import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Menu, X } from "lucide-react";
import { asset } from "../lib/asset";

/** Header for the fictional agency's public pages. They exist to show the candidate side of the automations. */
export function SiteNav(_props: { overVideo?: boolean }) {
  const [open, setOpen] = useState(false);
  const link = "text-[15px] text-ink/70 transition-colors hover:text-ink";

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ink/10 bg-white/95 backdrop-blur">
      <div className="bg-midnight text-white">
        <div className="mx-auto flex h-9 max-w-[1360px] items-center gap-3 px-5 font-glo text-[12.5px] md:px-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to the automation showcase
          </Link>
          <span className="ml-auto hidden text-white/55 sm:inline">A fictional agency. Every name and figure is made up.</span>
        </div>
      </div>
      <div className="mx-auto flex h-[64px] max-w-[1360px] items-center gap-8 px-5 md:px-10">
        <Link to="/jobs" aria-label="Demo Recruitment Co jobs" className="shrink-0">
          <img src={asset("/brand/agency-logo.svg")} alt="Demo Recruitment Co" className="h-8 w-auto md:h-9" />
        </Link>
        <nav className="ml-auto hidden items-center gap-8 font-arch md:flex" aria-label="Main">
          <NavLink to="/jobs" className={link}>Jobs</NavLink>
          <Link to="/crm" className={link}>Staff back office</Link>
          <Link to="/register" className="rounded-full bg-ink px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-ink/85">
            Register for work
          </Link>
        </nav>
        <button
          type="button"
          className="ml-auto text-ink md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-ink/10 bg-white px-5 pb-6 pt-2 font-arch md:hidden">
          {[
            ["Jobs", "/jobs"],
            ["Staff back office", "/crm"],
            ["Automation showcase", "/"],
          ].map(([l, h]) => (
            <Link key={h} to={h} onClick={() => setOpen(false)} className="block border-b border-ink/10 py-4 text-lg text-ink">
              {l}
            </Link>
          ))}
          <Link to="/register" onClick={() => setOpen(false)} className="mt-5 block rounded-full bg-ink py-3.5 text-center font-semibold text-white">
            Register for work
          </Link>
        </div>
      ) : null}
    </header>
  );
}
