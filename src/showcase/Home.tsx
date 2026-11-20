import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  ArrowRight,
  Code2,
  Github,
  LayoutDashboard,
  Globe,
} from "lucide-react";
import { GROUPS, byGroup } from "./catalogue";
import { StatusPill } from "./bits";
import { CODE_URL, GITHUB_PROFILE, PORTFOLIO_URL } from "./links";

const FACTS: [string, string][] = [
  [
    "1,478",
    "candidates asked for their availability automatically, 115 Bullhorn records updated, in 7 weeks with no consultant time",
  ],
  [
    "63,000+",
    "candidates and nearly 130,000 CV files recovered into a new recruitment CRM",
  ],
  [
    "62 to 38",
    "duplicate client records merged, with every invoice and term carried across",
  ],
  ["2,784", "AI candidate analyses run for an executive search desk"],
];

export function ShowcaseHome() {
  const { hash } = useLocation();
  useEffect(() => {
    document.title = "Automation showcase | Scott Burns";
  }, []);
  // HashRouter keeps the route in the URL's hash, so a section is reached by scrolling, not by an anchor.
  useEffect(() => {
    const id = hash.replace("#", "");
    if (id)
      setTimeout(
        () => document.getElementById(id)?.scrollIntoView({ block: "start" }),
        0,
      );
  }, [hash]);

  return (
    <div className="min-h-screen bg-gbg font-glo text-gfg">
      <TopBar />

      <section className="bg-midnight text-white">
        <div className="mx-auto max-w-[1180px] px-5 pb-16 pt-14 md:px-8 md:pb-20 md:pt-20">
          <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-white/55">
            Automation showcase
          </p>
          <h1 className="mt-4 max-w-[820px] text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.08] tracking-[-0.02em]">
            Automations I've built for recruitment and service businesses.
          </h1>
          <p className="mt-5 max-w-[680px] text-[16px] leading-[1.65] text-white/70">
            45 of them, from reading emailed timesheets to drafting outreach for
            approval. The real systems run on clients' own data, so every demo
            here runs on made-up names and figures. Press every button.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() =>
                document
                  .getElementById("finance")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[14px] font-medium text-midnight hover:bg-white/90"
            >
              See the automations <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              to="/crm"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-[14px] font-medium text-white hover:bg-white/10"
            >
              <LayoutDashboard className="h-4 w-4" /> Open the demo back office
            </Link>
            <a
              href={CODE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-[14px] font-medium text-white hover:bg-white/10"
            >
              <Code2 className="h-4 w-4" /> Read a tested code sample
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-gborder bg-white">
        <div className="mx-auto grid max-w-[1180px] gap-px px-5 py-8 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
          {FACTS.map(([n, t]) => (
            <div key={n} className="p-3">
              <p className="text-[26px] font-semibold tracking-[-0.01em] text-action">
                {n}
              </p>
              <p className="mt-1 text-[13px] leading-[1.55] text-gmuted">{t}</p>
            </div>
          ))}
        </div>
      </section>

      <nav className="sticky top-14 z-20 border-b border-gborder bg-gbg/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] gap-1 overflow-x-auto px-5 py-2 md:px-8">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() =>
                document
                  .getElementById(g.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="shrink-0 rounded-md px-3 py-1.5 text-[13px] font-medium text-gmuted hover:bg-white hover:text-gfg"
            >
              {g.title}{" "}
              <span className="text-gmuted/70">({byGroup(g.id).length})</span>
            </button>
          ))}
        </div>
      </nav>

      {GROUPS.map((g) => (
        <section key={g.id} id={g.id} className="scroll-mt-28">
          <div className="mx-auto max-w-[1180px] px-5 py-14 md:px-8">
            <p className="text-[12.5px] font-medium uppercase tracking-[0.1em] text-gmuted">
              {g.kicker}
            </p>
            <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.01em]">
              {g.title}
            </h2>
            <p className="mt-2 max-w-[720px] text-[15px] leading-[1.6] text-gmuted">
              {g.intro}
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {byGroup(g.id).map((a) => (
                <Link
                  key={a.slug}
                  to={`/demo/${a.slug}`}
                  className="group flex flex-col rounded-xl border border-gborder bg-white p-5 transition-shadow hover:shadow-[0_6px_24px_-12px_rgba(0,33,73,0.35)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium tabular-nums text-gmuted">
                      {String(a.n).padStart(2, "0")}
                    </span>
                    <StatusPill status={a.status} />
                  </div>
                  <p className="mt-3 text-[15.5px] font-semibold leading-[1.35] text-gfg">
                    {a.title}
                  </p>
                  <p className="mt-2 flex-1 text-[13.5px] leading-[1.55] text-gmuted">
                    {a.line}
                  </p>
                  <p className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-action">
                    Try the demo{" "}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      <Footer />
    </div>
  );
}

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-midnight/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1180px] items-center gap-4 px-5 md:px-8">
        <Link to="/" className="text-[15px] font-semibold text-white">
          Scott Burns
          <span className="ml-2 hidden font-normal text-white/55 sm:inline">
            AI automation and recruitment systems
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-[13px]">
          <Link
            to="/crm"
            className="rounded-md px-2.5 py-1.5 text-white/75 hover:bg-white/10 hover:text-white"
          >
            Back office
          </Link>
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-white/75 hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            <Globe className="h-3.5 w-3.5" /> Portfolio
          </a>
          <a
            href={GITHUB_PROFILE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-white/75 hover:bg-white/10 hover:text-white"
          >
            <Github className="h-3.5 w-3.5" /> GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gborder bg-white">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-8 gap-y-3 px-5 py-8 text-[13px] text-gmuted md:px-8">
        <p>
          Built by Scott Burns. Every name, client and figure in the demos is
          made up.
        </p>
        <div className="ml-auto flex gap-5">
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-gfg"
          >
            Portfolio
          </a>
          <a
            href={GITHUB_PROFILE}
            target="_blank"
            rel="noreferrer"
            className="hover:text-gfg"
          >
            GitHub
          </a>
          <a
            href={CODE_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-gfg"
          >
            Code sample
          </a>
        </div>
      </div>
    </footer>
  );
}
