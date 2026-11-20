import { Link, Navigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { AUTOMATIONS, bySlug, groupOf } from "./catalogue";
import { FlowRunner } from "./kit";
import { StatusPill } from "./bits";
import { Footer, TopBar } from "./Home";
import { DaysAndHoursDemo } from "./sims/DaysAndHours";
import { FrontDeskDemo } from "./sims/FrontDesk";
import { AtsCheckDemo } from "./sims/AtsCheck";
import { ShortlistWeightsDemo } from "./sims/ShortlistWeights";

const CUSTOM = {
  "days-and-hours": DaysAndHoursDemo,
  "front-desk": FrontDeskDemo,
  "ats-check": AtsCheckDemo,
  "shortlist-weights": ShortlistWeightsDemo,
};

export function DemoPage() {
  const { slug = "" } = useParams();
  const a = bySlug(slug);

  useEffect(() => {
    if (a) document.title = `${a.title} | Automation showcase`;
    window.scrollTo(0, 0);
  }, [a]);

  if (!a) return <Navigate to="/" replace />;
  const g = groupOf(a.group);
  const i = AUTOMATIONS.indexOf(a);
  const prev = AUTOMATIONS[i - 1];
  const next = AUTOMATIONS[i + 1];
  const Custom = a.custom ? CUSTOM[a.custom] : null;

  return (
    <div className="min-h-screen bg-gbg font-glo text-gfg">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-5 py-8 md:px-8">
        <Link
          to={`/#${a.group}`}
          className="inline-flex items-center gap-1.5 text-[13px] text-gmuted hover:text-gfg"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All automations
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="text-[12.5px] font-medium uppercase tracking-[0.1em] text-gmuted">
            {String(a.n).padStart(2, "0")} · {g.kicker}
          </span>
          <StatusPill status={a.status} />
        </div>
        <h1 className="mt-2 max-w-[860px] text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15] tracking-[-0.015em]">
          {a.title}
        </h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-xl border border-gborder bg-white p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-gmuted">
              The problem
            </p>
            <p className="mt-2 text-[14.5px] leading-[1.65]">{a.problem}</p>
            {a.outcome ? (
              <div className="mt-4 rounded-lg bg-[#e8f4ee] px-3.5 py-2.5 text-[13.5px] font-medium leading-[1.5] text-gsuccess">
                {a.outcome}
              </div>
            ) : null}
          </div>
          <div className="rounded-xl border border-gborder bg-white p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-gmuted">
              How it works
            </p>
            <ul className="mt-2 space-y-2">
              {a.how.map((h) => (
                <li key={h} className="flex gap-2.5 text-[14px] leading-[1.55]">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-action" />
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {a.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-gborder bg-gbg px-2 py-0.5 text-[11.5px] text-gmuted"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-8">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-semibold">Try it</h2>
              <p className="text-[13px] text-gmuted">
                Made-up data. Nothing is sent anywhere.
              </p>
            </div>
            {a.seeAlso?.length ? (
              <div className="flex flex-wrap gap-2">
                {a.seeAlso.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gborder bg-white px-3 py-1.5 text-[13px] font-medium text-action hover:border-action"
                  >
                    {s.label} <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          {Custom ? <Custom /> : null}
          {a.flow ? (
            <div className={Custom ? "mt-6" : ""}>
              <FlowRunner key={a.slug} flow={a.flow} />
            </div>
          ) : null}
        </section>

        <nav className="mt-12 grid gap-3 border-t border-gborder pt-6 sm:grid-cols-2">
          {prev ? (
            <Link
              to={`/demo/${prev.slug}`}
              className="rounded-xl border border-gborder bg-white p-4 hover:border-action"
            >
              <p className="inline-flex items-center gap-1 text-[12px] text-gmuted">
                <ArrowLeft className="h-3 w-3" /> Previous
              </p>
              <p className="mt-1 text-[14px] font-medium">{prev.title}</p>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={`/demo/${next.slug}`}
              className="rounded-xl border border-gborder bg-white p-4 text-right hover:border-action"
            >
              <p className="inline-flex items-center gap-1 text-[12px] text-gmuted">
                Next <ArrowRight className="h-3 w-3" />
              </p>
              <p className="mt-1 text-[14px] font-medium">{next.title}</p>
            </Link>
          ) : null}
        </nav>
      </main>
      <Footer />
    </div>
  );
}
