import { useMemo, useState } from "react";

// The shortlist score, as the real one works: each factor is 0 to 1, times its weight; anyone beyond the radius is cut first.

type Cand = {
  name: string;
  miles: number;
  pastShifts: number;
  weeksSinceWork: number;
  docsOk: boolean;
  daysSinceContact: number;
  available: boolean;
};

const CANDS: Cand[] = [
  {
    name: "Jamie Hart",
    miles: 4,
    pastShifts: 120,
    weeksSinceWork: 1,
    docsOk: true,
    daysSinceContact: 3,
    available: true,
  },
  {
    name: "Tomasz Nowak",
    miles: 6,
    pastShifts: 96,
    weeksSinceWork: 0,
    docsOk: true,
    daysSinceContact: 10,
    available: false,
  },
  {
    name: "Daniel Price",
    miles: 3,
    pastShifts: 0,
    weeksSinceWork: 30,
    docsOk: true,
    daysSinceContact: 1,
    available: true,
  },
  {
    name: "Connor Webb",
    miles: 18,
    pastShifts: 64,
    weeksSinceWork: 2,
    docsOk: true,
    daysSinceContact: 40,
    available: true,
  },
  {
    name: "Ryan Cole",
    miles: 11,
    pastShifts: 210,
    weeksSinceWork: 6,
    docsOk: false,
    daysSinceContact: 90,
    available: true,
  },
  {
    name: "Liam Ford",
    miles: 27,
    pastShifts: 15,
    weeksSinceWork: 3,
    docsOk: true,
    daysSinceContact: 5,
    available: true,
  },
  {
    name: "Kieran Shaw",
    miles: 41,
    pastShifts: 180,
    weeksSinceWork: 1,
    docsOk: true,
    daysSinceContact: 2,
    available: true,
  },
];

const FACTORS = [
  ["distance", "Distance to site"],
  ["history", "Past hours with the agency"],
  ["recent", "Worked recently"],
  ["docs", "Documents in date"],
  ["contact", "Contacted recently"],
  ["available", "Said they're available"],
] as const;

type Key = (typeof FACTORS)[number][0];

const RADIUS = 35;

const parts = (c: Cand): Record<Key, number> => ({
  distance: Math.max(0, 1 - c.miles / RADIUS),
  history: Math.min(1, c.pastShifts / 150),
  recent: Math.max(0, 1 - c.weeksSinceWork / 26),
  docs: c.docsOk ? 1 : 0,
  contact: Math.max(0, 1 - c.daysSinceContact / 60),
  available: c.available ? 1 : 0,
});

export function ShortlistWeightsDemo() {
  const [w, setW] = useState<Record<Key, number>>({
    distance: 50,
    history: 30,
    recent: 15,
    docs: 10,
    contact: 8,
    available: 5,
  });

  const ranked = useMemo(() => {
    const total = Object.values(w).reduce((a, b) => a + b, 0) || 1;
    return CANDS.map((c) => {
      const p = parts(c);
      const score =
        c.miles > RADIUS
          ? null
          : Math.round(
              (FACTORS.reduce((s, [k]) => s + p[k] * w[k], 0) / total) * 100,
            );
      return { c, score };
    }).sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  }, [w]);

  return (
    <div className="rounded-xl border border-gborder bg-white p-5">
      <p className="text-[15px] font-semibold">
        New vacancy: 4 groundworkers, Shoreham-by-Sea, Monday
      </p>
      <p className="mt-1 text-[13px] text-gmuted">
        Move the weights and watch the order change. The office sets these on
        the real system's settings screen.
      </p>
      <div className="mt-4 grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3">
          {FACTORS.map(([k, label]) => (
            <label key={k} className="block">
              <span className="flex justify-between text-[12.5px]">
                <span className="text-gfg">{label}</span>
                <span className="tabular-nums text-gmuted">{w[k]}</span>
              </span>
              <input
                type="range"
                min={0}
                max={60}
                value={w[k]}
                onChange={(e) =>
                  setW((x) => ({ ...x, [k]: Number(e.target.value) }))
                }
                className="mt-1 w-full accent-[#002149]"
              />
            </label>
          ))}
          <p className="text-[12px] text-gmuted">
            Anyone over {RADIUS} miles away is cut before ranking.
          </p>
        </div>
        <ol className="divide-y divide-gborder rounded-lg border border-gborder">
          {ranked.map(({ c, score }, i) => (
            <li
              key={c.name}
              className={`flex items-center gap-3 px-3 py-2.5 ${score === null ? "bg-gsecondary/60" : ""}`}
            >
              <span className="w-5 text-[12px] tabular-nums text-gmuted">
                {score === null ? "–" : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[13.5px] font-medium ${score === null ? "text-gmuted" : ""}`}
                >
                  {c.name}
                </p>
                <p className="text-[12px] text-gmuted">
                  {c.miles} miles · {c.pastShifts} past shifts ·{" "}
                  {c.available ? "available" : "not said"}
                  {c.docsOk ? "" : " · card expired"}
                </p>
              </div>
              {score === null ? (
                <span className="rounded-full bg-gsecondary px-2 py-0.5 text-[11.5px] text-gmuted">
                  Too far
                </span>
              ) : (
                <div className="flex w-[110px] items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-gsecondary">
                    <div
                      className="h-2 rounded-full bg-action"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[12.5px] tabular-nums">
                    {score}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
