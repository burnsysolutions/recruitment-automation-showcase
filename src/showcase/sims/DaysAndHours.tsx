import { useMemo, useState } from "react";
import { Code2 } from "lucide-react";
import { daysAndHours, pounds } from "../../lib/daysAndHours";
import { CODE_URL } from "../links";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const EXAMPLES: {
  label: string;
  hours: string[];
  day: string;
  hour: string;
}[] = [
  {
    label: "A short Monday",
    hours: ["5", "9", "9", "9", "9", "", ""],
    day: "265",
    hour: "29.50",
  },
  {
    label: "Long days",
    hours: ["10", "9.5", "9.5", "9", "", "", ""],
    day: "265",
    hour: "29.50",
  },
  {
    label: "Rates that agree",
    hours: ["9", "9", "9", "9", "9", "", ""],
    day: "208",
    hour: "26",
  },
];

/** The real pay rule from the payroll engine, running in the browser. The same file is unit-tested in the repo. */
export function DaysAndHoursDemo() {
  const [hours, setHours] = useState(EXAMPLES[0].hours);
  const [day, setDay] = useState(EXAMPLES[0].day);
  const [hour, setHour] = useState(EXAMPLES[0].hour);

  const result = useMemo(() => {
    try {
      const h = hours.map((x) => (x.trim() === "" ? 0 : Number(x)));
      return {
        ok: true as const,
        r: daysAndHours({
          hours: h,
          dayRate: Number(day),
          hourlyRate: Number(hour),
        }),
        allHours: h.reduce((a, b) => a + b, 0),
      };
    } catch (e) {
      return { ok: false as const, msg: (e as Error).message };
    }
  }, [hours, day, hour]);

  return (
    <div className="rounded-xl border border-gborder bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[15px] font-semibold">
            One pay rule from the engine: days and hours
          </p>
          <p className="mt-1 max-w-[640px] text-[13px] leading-[1.55] text-gmuted">
            A man with both a day rate and an hourly rate. A full day is a day;
            the hours over it, and any shorter day, go by the hour. Change the
            hours or rates and watch the pay. This is the same tested code the
            repo holds.
          </p>
        </div>
        <a
          href={CODE_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gborder px-3 py-1.5 text-[13px] font-medium text-action hover:border-action"
        >
          <Code2 className="h-4 w-4" /> Read the code and its tests
        </a>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {EXAMPLES.map((e) => (
          <button
            key={e.label}
            onClick={() => {
              setHours(e.hours);
              setDay(e.day);
              setHour(e.hour);
            }}
            className="rounded-full border border-gborder px-3 py-1 text-[12.5px] text-gfg hover:border-action hover:text-action"
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="grid grid-cols-7 gap-2">
            {DAYS.map((d, i) => (
              <label key={d} className="text-center">
                <span className="text-[12px] text-gmuted">{d}</span>
                <input
                  inputMode="decimal"
                  value={hours[i]}
                  onChange={(e) =>
                    setHours((h) =>
                      h.map((x, j) => (j === i ? e.target.value : x)),
                    )
                  }
                  className="mt-1 h-10 w-full rounded-lg border border-gborder text-center text-[14px] tabular-nums focus:border-action focus:outline-none"
                  aria-label={`Hours on ${d}`}
                />
              </label>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:max-w-[360px]">
            <label className="text-[12px] text-gmuted">
              Day rate (£)
              <input
                value={day}
                onChange={(e) => setDay(e.target.value)}
                inputMode="decimal"
                className="mt-1 h-10 w-full rounded-lg border border-gborder px-3 text-[14px] text-gfg focus:border-action focus:outline-none"
              />
            </label>
            <label className="text-[12px] text-gmuted">
              Hourly rate (£)
              <input
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                inputMode="decimal"
                className="mt-1 h-10 w-full rounded-lg border border-gborder px-3 text-[14px] text-gfg focus:border-action focus:outline-none"
              />
            </label>
          </div>

          {result.ok ? (
            <div className="mt-4 overflow-x-auto rounded-lg border border-gborder">
              <table className="w-full min-w-[380px] text-[12.5px]">
                <thead className="bg-gsecondary text-gmuted">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Day</th>
                    <th className="px-3 py-2 text-right font-medium">Hours</th>
                    <th className="px-3 py-2 text-right font-medium">
                      Paid as days
                    </th>
                    <th className="px-3 py-2 text-right font-medium">
                      Paid by the hour
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.r.lines.map((l, i) =>
                    l.hours ? (
                      <tr key={i} className="border-t border-gborder">
                        <td className="px-3 py-2">{DAYS[i]}</td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {l.hours}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {l.days ? "1 day" : "–"}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {l.byTheHour ? `${l.byTheHour} h` : "–"}
                        </td>
                      </tr>
                    ) : null,
                  )}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>

        <div className="rounded-xl bg-midnight p-5 text-white">
          {result.ok ? (
            <>
              <p className="text-[12px] uppercase tracking-[0.08em] text-white/55">
                Pay for the week
              </p>
              <p className="mt-1 text-[32px] font-semibold tabular-nums">
                {pounds(result.r.totalPence)}
              </p>
              <dl className="mt-4 space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <dt className="text-white/60">A full day is</dt>
                  <dd className="tabular-nums">
                    {result.r.fullDayHours} hours
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/60">
                    Days at £{Number(day).toFixed(2)}
                  </dt>
                  <dd className="tabular-nums">{result.r.days}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/60">
                    Hours at £{Number(hour).toFixed(2)}
                  </dt>
                  <dd className="tabular-nums">{result.r.byTheHour}</dd>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2">
                  <dt className="text-white/60">
                    Every hour by the hour would be
                  </dt>
                  <dd className="tabular-nums">
                    {pounds(Math.round(result.allHours * Number(hour) * 100))}
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <>
              <p className="text-[12px] uppercase tracking-[0.08em] text-white/55">
                Held, not guessed
              </p>
              <p className="mt-2 text-[14px] leading-[1.55]">{result.msg}</p>
              <p className="mt-3 text-[12.5px] text-white/55">
                The engine never invents a figure. A line it cannot price is
                held with the reason.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
