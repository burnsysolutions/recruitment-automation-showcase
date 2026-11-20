import { useMemo, useState } from "react";

// A keyword check that runs in the browser, so visitors can try their own text.
// The real system reads meaning with AI; this demo shows the idea with a fixed list of terms.

const TERMS = [
  "project management",
  "programme",
  "budget",
  "cost control",
  "subcontractors",
  "health and safety",
  "smsts",
  "cscs",
  "nebosh",
  "residential",
  "housebuilding",
  "commercial",
  "fit-out",
  "groundworks",
  "civils",
  "planning",
  "client liaison",
  "quality",
  "snagging",
  "handover",
  "jct",
  "nec",
  "valuations",
  "procurement",
  "team leadership",
  "site management",
  "risk",
  "rams",
];

const JD = `Project Manager, residential housebuilding.
You will manage the programme and budget across two sites, lead site management teams and subcontractors, and own health and safety.
Must have SMSTS and CSCS. NEBOSH preferred. Experience of JCT contracts, valuations and client liaison through to handover.`;

const CV = `Site manager with 12 years in residential construction.
Ran a 140-home phase to completion 3 weeks early, managing 22 subcontractors.
SMSTS, CSCS, NEBOSH General. Responsible for health and safety, quality and snagging through to handover.`;

const find = (text: string) => {
  const t = text.toLowerCase();
  return TERMS.filter((k) => t.includes(k));
};

export function AtsCheckDemo() {
  const [jd, setJd] = useState(JD);
  const [cv, setCv] = useState(CV);

  const r = useMemo(() => {
    const want = find(jd);
    const have = new Set(find(cv));
    const matched = want.filter((k) => have.has(k));
    const missing = want.filter((k) => !have.has(k));
    const score = want.length
      ? Math.round((matched.length / want.length) * 100)
      : 0;
    return { want, matched, missing, score };
  }, [jd, cv]);

  return (
    <div className="rounded-xl border border-gborder bg-white p-5">
      <p className="text-[15px] font-semibold">
        Check a CV against a job description
      </p>
      <p className="mt-1 text-[13px] text-gmuted">
        Edit either box. This demo matches a fixed list of terms in your
        browser; the real system reads meaning with AI and writes the tailored
        version.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <label className="text-[12px] font-medium text-gmuted">
          Job description
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={7}
            className="mt-1 w-full rounded-lg border border-gborder p-3 text-[13px] leading-[1.55] text-gfg focus:border-action focus:outline-none"
          />
        </label>
        <label className="text-[12px] font-medium text-gmuted">
          CV
          <textarea
            value={cv}
            onChange={(e) => setCv(e.target.value)}
            rows={7}
            className="mt-1 w-full rounded-lg border border-gborder p-3 text-[13px] leading-[1.55] text-gfg focus:border-action focus:outline-none"
          />
        </label>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-[200px_1fr_1fr]">
        <div className="rounded-xl bg-midnight p-4 text-white">
          <p className="text-[12px] uppercase tracking-[0.08em] text-white/55">
            Match
          </p>
          <p className="mt-1 text-[34px] font-semibold tabular-nums">
            {r.score}%
          </p>
          <p className="text-[12.5px] text-white/60">
            {r.matched.length} of {r.want.length} terms the job asks for
          </p>
        </div>
        <div className="rounded-xl border border-gborder p-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-gsuccess">
            On the CV
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {r.matched.map((k) => (
              <span
                key={k}
                className="rounded-full bg-[#e8f4ee] px-2 py-0.5 text-[12px] text-gsuccess"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-gborder p-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-gdanger">
            Missing
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {r.missing.length ? (
              r.missing.map((k) => (
                <span
                  key={k}
                  className="rounded-full bg-[#fbeceb] px-2 py-0.5 text-[12px] text-gdanger"
                >
                  {k}
                </span>
              ))
            ) : (
              <span className="text-[13px] text-gmuted">Nothing missing</span>
            )}
          </div>
          {r.missing.length ? (
            <p className="mt-2 text-[12px] text-gmuted">
              The tailoring step adds these only where the client confirms
              they're true.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
