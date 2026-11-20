import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import { useStore, siteById } from "../data/store";
import type { Sector } from "../data/seed";
import { PayValue } from "./pay";

const SECTORS: (Sector | "All")[] = ["All", "Fit-out & refurbishment", "Groundworks & civils", "Mechanical & electrical", "Demolition", "Maintenance"];
const TYPES = ["Any", "Temp", "Contract", "Permanent"] as const;

export function Jobs() {
  const jobs = useStore((s) => s.jobs);
  const [sector, setSector] = useState<(typeof SECTORS)[number]>("All");
  const [type, setType] = useState<(typeof TYPES)[number]>("Any");
  const [params] = useSearchParams();
  const [q, setQ] = useState(() => params.get("q") ?? "");

  useEffect(() => {
    document.title = "Construction jobs in Sussex and the South | Demo Recruitment Co";
    window.scrollTo(0, 0);
  }, []);

  const open = jobs.filter((j) => j.stage !== "Filled");
  const list = useMemo(
    () =>
      open.filter((j) => {
        if (sector !== "All" && j.sector !== sector) return false;
        if (type !== "Any" && j.type !== type) return false;
        if (q) {
          const hay = `${j.publicTitle} ${j.trade} ${siteById(j.siteId).town}`.toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
      }),
    [open, sector, type, q],
  );

  return (
    <div className="bg-white font-arch text-ink">
      <SiteNav />
      <section className="border-b border-ink/10 bg-concrete pt-[72px]">
        <div className="mx-auto max-w-[1360px] px-5 pb-12 pt-14 md:px-10 md:pb-16 md:pt-20">
          <h1 className="max-w-[16ch] text-[clamp(2.4rem,5.6vw,5rem)] font-[800] leading-[0.95] tracking-[-0.025em] [font-stretch:116%]">Work starting soon</h1>
          <p className="mt-5 max-w-[50ch] text-[18px] leading-[1.6] text-steel">
            {open.length} roles open across Sussex and the South. Apply in two minutes, or register once and we will text you when something comes up near you.
          </p>
          <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative block lg:w-[340px]">
              <span className="sr-only">Search jobs</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-steel" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Trade or town"
                className="h-12 w-full rounded-full border border-ink/15 bg-white pl-11 pr-4 text-[16px] placeholder:text-steel/70 focus:border-ink focus:outline-none"
              />
            </label>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Contract type">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  aria-pressed={type === t}
                  className={`h-10 rounded-full px-4 text-[15px] transition-colors ${type === t ? "bg-ink text-white" : "border border-ink/15 bg-white hover:border-ink/40"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Sector">
            {SECTORS.map((s) => (
              <button
                key={s}
                onClick={() => setSector(s)}
                aria-pressed={sector === s}
                className={`h-9 rounded-full px-3.5 text-[14px] transition-colors ${sector === s ? "bg-signal text-white" : "text-ink/70 hover:text-ink"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1360px] px-5 pb-24 md:px-10">
        <p className="py-6 text-[15px] text-steel" aria-live="polite">
          {list.length === open.length ? `Showing all ${list.length} jobs` : `${list.length} of ${open.length} jobs`}
        </p>
        {list.length === 0 ? (
          <div className="border-t border-ink py-20 text-center">
            <p className="text-[22px] font-[680]">Nothing matches that right now.</p>
            <p className="mt-2 text-[17px] text-steel">Register and we will text you when work like this comes in.</p>
            <Link to="/register" className="mt-6 inline-block rounded-full bg-ink px-6 py-3.5 font-semibold text-white">
              Register for work
            </Link>
          </div>
        ) : (
          <ul className="border-t border-ink">
            {list.map((j) => {
              const site = siteById(j.siteId);
              return (
                <li key={j.id} className="border-b border-ink/15">
                  <Link to={`/jobs/${j.id}`} className="group grid gap-2 py-7 md:grid-cols-12 md:items-baseline md:gap-6">
                    <div className="md:col-span-5">
                      <h2 className="text-[24px] font-[700] leading-tight tracking-[-0.01em] [font-stretch:108%] group-hover:text-signal">{j.publicTitle}</h2>
                      <p className="mt-1 text-[15px] text-steel">{j.sector}</p>
                    </div>
                    <p className="text-[16px] md:col-span-2">{site.town}</p>
                    <p className="text-[16px] text-steel md:col-span-2">
                      {j.type}, {j.duration.toLowerCase()}
                    </p>
                    <p className="text-[16px] text-steel md:col-span-1">{j.start.replace(/^\w+ /, "")}</p>
                    <p className="text-[22px] font-[700] tabular [font-stretch:94%] md:col-span-2 md:text-right">
                      <PayValue j={j} />
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
