import { Link } from "react-router-dom";
import { useMemo } from "react";
import { AlertTriangle, ArrowUpRight, FileClock, Phone, UserPlus, Radar, Mail } from "lucide-react";
import { ScoreBar, kindIcon } from "./bits";
import { toast } from "./ui";
import { useStore, sites, clientById, siteById, assignments, setState, nowHM, fullName } from "../data/store";
import { shortlist, gbp, fmtDate, miles } from "../data/match";
import { TODAY } from "../data/seed";

export function Desk() {
  const candidates = useStore((s) => s.candidates);
  const jobs = useStore((s) => s.jobs);
  const timesheets = useStore((s) => s.timesheets);
  const activities = useStore((s) => s.activities);
  const settings = useStore((s) => s.settings);
  const chased = useStore((s) => s.chased);
  const renewals = useStore((s) => s.renewals);
  const newIds = useStore((s) => s.newCandidates);

  const m = useMemo(() => {
    const byId = new Map(candidates.map((c) => [c.id, c]));
    const sitesOnHire = new Set(assignments.map((a) => a.siteId)).size;
    const expected = timesheets.filter((t) => t.lines.length).length;
    const inCount = timesheets.filter((t) => t.lines.length && t.status !== "Awaiting").length;
    let margin = 0;
    let hours = 0;
    timesheets.forEach((t) => {
      if (t.status === "Awaiting") return;
      t.lines.forEach((l) => {
        const a = assignments.find((x) => x.candidateId === l.candidateId);
        if (!a || l.flag) return;
        const h = l.hours.reduce((x, y) => x + y, 0);
        hours += h;
        margin += h * (a.chargeRate - a.payRate);
      });
    });
    const unfilled = jobs.filter((j) => j.stage !== "Filled").reduce((t, j) => t + (j.headcount - j.filled), 0);
    const soon = new Date(TODAY);
    soon.setDate(soon.getDate() + 30);
    const expiring = candidates.filter((c) => c.cards.some((k) => new Date(k.expires) < soon && new Date(k.expires) > TODAY));
    const expired = candidates.filter((c) => c.status === "On assignment" && c.cards.some((k) => new Date(k.expires) < TODAY));
    const bersted = { lat: 50.795, lng: -0.68 };
    const nearBersted = candidates.filter((c) => c.sector === "Groundworks & civils" && miles(c, bersted) < 30).length;
    return { byId, sitesOnHire, expected, inCount, margin, hours, unfilled, expiring, expired, nearBersted };
  }, [candidates, jobs, timesheets]);

  const focusJob = jobs.find((j) => j.id === "j01")!;
  const focusSite = siteById(focusJob.siteId);
  const allRanked = useMemo(() => shortlist(focusJob, focusSite, candidates, settings), [focusJob, focusSite, candidates, settings]);
  const ranked = allRanked.slice(0, 6);

  const series = [61, 64, 58, 66, 70, 69, 72, 74, 71, 76, 79, assignments.length];

  const review = timesheets.find((t) => t.status === "Needs review");
  const awaiting = timesheets.filter((t) => t.status === "Awaiting" && t.lines.length);

  return (
    <div className="mx-auto max-w-[1480px] px-5 py-7 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-gmuted">Monday 12 October</p>
          <h1 className="mt-0.5 text-[24px] font-semibold tracking-[-0.01em] text-navy">Desk</h1>
        </div>
        <div className="flex items-center gap-2 text-[13px]">
          <span className="text-gmuted">Week ending</span>
          <button className="rounded-lg border border-gborder bg-white px-3 py-1.5 font-medium text-navy">Sun 18 Oct</button>
        </div>
      </div>

      {/* Headline numbers */}
      <section className="mt-6 grid overflow-hidden rounded-xl border border-gborder bg-white md:grid-cols-2 xl:grid-cols-5" aria-label="This week">
        <Metric label="On site today" value={String(assignments.length)} note={`across ${m.sitesOnHire} sites`}>
          <Spark data={series} />
        </Metric>
        <Metric label="Timesheets in, w/e 11 Oct" value={`${m.inCount} of ${m.expected}`} note={`${m.expected - m.inCount} still to chase`}>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gsecondary">
            <div className="h-full rounded-full bg-action" style={{ width: `${(m.inCount / m.expected) * 100}%` }} />
          </div>
        </Metric>
        <Metric label="Gross margin, w/e 11 Oct" value={gbp(m.margin)} note={`${Math.round(m.hours).toLocaleString("en-GB")} hours read so far`} />
        <Metric label="Heads still to fill" value={String(m.unfilled)} note={`${jobs.filter((j) => j.stage === "Open").length} jobs with no shortlist sent`} />
        <Metric label="Cards expiring in 30 days" value={String(m.expiring.length)} note={m.expired.length ? `${m.expired.length} on site with an expired card` : "None expired on site"} tone={m.expired.length ? "danger" : undefined} />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* Needs you */}
        <section className="rounded-xl border border-gborder bg-white">
          <header className="flex items-center justify-between border-b border-gborder px-5 py-3.5">
            <h2 className="text-[15px] font-semibold text-navy">Needs you</h2>
            <span className="hidden text-[12px] text-gmuted sm:inline">Sorted by what costs money first</span>
          </header>
          <ul className="divide-y divide-gborder">
            {m.expired.slice(0, 2).map((c) => (
              <Row
                key={c.id}
                icon={<AlertTriangle className="h-4 w-4" />}
                tone="danger"
                title={`${fullName(c)} is on site with an expired ${c.cards[0].scheme} card`}
                body={
                  renewals[c.id]
                    ? `Renewal link texted at ${renewals[c.id]}. Hours stay on hold until a new card is read.`
                    : `Expired ${fmtDate(c.cards[0].expires, { day: "numeric", month: "long" })}. Payroll will hold their hours until a new card is on file.`
                }
                action={renewals[c.id] ? "Link sent" : "Text renewal link"}
                done={!!renewals[c.id]}
                onAction={() => {
                  setState((s) => ({ ...s, renewals: { ...s.renewals, [c.id]: nowHM() } }));
                  toast(`Renewal link texted to ${c.first}`);
                }}
              />
            ))}
            {review ? (
              <Row
                icon={<FileClock className="h-4 w-4" />}
                tone="warn"
                title={`${siteById(review.siteId).name}: one line needs a look`}
                body={review.lines.find((l) => l.flag)?.flag ?? ""}
                action="Open timesheet"
                to={`/crm/timesheets/${review.id}`}
              />
            ) : null}
            <Row
              icon={<Radar className="h-4 w-4" />}
              title={`Shortlist ready: ${focusJob.headcount} groundworkers, ${focusSite.town}`}
              body={`${allRanked.length} people in date and within ${settings.radius} miles. ${clientById(focusJob.clientId).name} want them ${focusJob.start}.`}
              action="Open shortlist"
              to={`/crm/shortlists/${focusJob.id}`}
            />
            {awaiting.slice(0, 2).map((t) => (
              <Row
                key={t.id}
                icon={<Mail className="h-4 w-4" />}
                title={`No timesheet from ${siteById(t.siteId).name}`}
                body={
                  chased[t.id]
                    ? `Chaser emailed to ${clientById(t.clientId).invoiceEmail} at ${chased[t.id]}.`
                    : `${t.lines.length} workers on site last week. Timesheet contact: ${clientById(t.clientId).invoiceEmail || "not set"}.`
                }
                action={chased[t.id] ? "Chased" : "Send chaser"}
                done={!!chased[t.id]}
                onAction={() => {
                  setState((s) => ({ ...s, chased: { ...s.chased, [t.id]: nowHM() } }));
                  toast(`Chaser sent for ${siteById(t.siteId).name}`);
                }}
              />
            ))}
            {newIds.slice(0, 2).map((id) => {
              const c = candidates.find((x) => x.id === id);
              if (!c) return null;
              return (
                <Row
                  key={id}
                  icon={<UserPlus className="h-4 w-4" />}
                  title={`New registration: ${fullName(c)}, ${c.trade.toLowerCase()}`}
                  body={`Registered on the website. ${c.cards[0].scheme} card read, expires ${fmtDate(c.cards[0].expires, { month: "short", year: "numeric" })}. ${c.status === "Available" ? "Available now" : "Available soon"}, ${c.town}.`}
                  action="Review"
                  to={`/crm/candidates/${id}`}
                />
              );
            })}
            <Row
              icon={<Phone className="h-4 w-4" />}
              title="Call back Amy Lomax, Tidemark Homes"
              body={`Prospect. Groundworks starting November at Bersted Park; ${m.nearBersted} of your groundworks people live within reach.`}
              action="Open prospect"
              to="/crm/prospects"
            />
          </ul>
        </section>

        {/* Shortlist preview */}
        <section className="rounded-xl border border-gborder bg-white">
          <header className="flex items-start justify-between gap-4 border-b border-gborder px-5 py-3.5">
            <div>
              <h2 className="text-[15px] font-semibold text-navy">Groundworkers for Shoreham Harbour</h2>
              <p className="text-[12.5px] text-gmuted">
                {clientById(focusJob.clientId).name}, {focusJob.headcount} needed from {focusJob.start}, £{focusJob.payRate.toFixed(2)} pay, £{focusJob.chargeRate.toFixed(2)} charge
              </p>
            </div>
            <Link to={`/crm/shortlists/${focusJob.id}`} className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[12.5px] font-medium text-action hover:bg-action-tint">
              Open <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </header>
          <ol className="divide-y divide-gborder">
            {ranked.map((r, i) => (
              <li key={r.candidate.id} className="grid grid-cols-[1.25rem_minmax(0,1fr)_7.5rem_2.5rem] items-center gap-3 px-5 py-3">
                <span className="text-[12px] tabular text-gmuted">{i + 1}</span>
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-medium">{r.candidate.first} {r.candidate.last}</p>
                  <p className="truncate text-[12px] text-gmuted">
                    {r.candidate.town}, {r.distance.toFixed(1)} mi, {r.candidate.shiftsWorked ? `${r.candidate.shiftsWorked} shifts with you` : "new to you"}
                  </p>
                </div>
                <ScoreBar parts={r.parts} weights={settings.weights} />
                <span className="text-right text-[13.5px] font-semibold tabular text-navy">{r.score}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* Chase */}
        <section className="rounded-xl border border-gborder bg-white">
          <header className="flex items-center justify-between border-b border-gborder px-5 py-3.5">
            <h2 className="text-[15px] font-semibold text-navy">Timesheets, week ending 11 Oct</h2>
            <Link to="/crm/chase" className="text-[12.5px] font-medium text-action hover:underline">Chase board</Link>
          </header>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-[13px]">
            <thead>
              <tr className="text-left text-[12px] text-gmuted">
                <th className="px-5 py-2 font-normal">Site</th>
                <th className="w-20 py-2 font-normal">Workers</th>
                <th className="w-44 py-2 font-normal">Arrived</th>
                <th className="px-5 py-2 text-right font-normal">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gborder border-t border-gborder">
              {timesheets.filter((t) => t.lines.length).slice(0, 8).map((t) => (
                <tr key={t.id}>
                  <td className="px-5 py-2.5">
                    <p className="font-medium">{siteById(t.siteId).name}</p>
                    <p className="text-[12px] text-gmuted">{clientById(t.clientId).name}</p>
                  </td>
                  <td className="tabular">{t.lines.length}</td>
                  <td className="text-gmuted">{t.receivedAt ? `${t.receivedAt}, ${t.source}` : "Not yet"}</td>
                  <td className="px-5 text-right"><State s={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </section>

        {/* Activity */}
        <section className="rounded-xl border border-gborder bg-white">
          <header className="flex items-center justify-between border-b border-gborder px-5 py-3.5">
            <h2 className="text-[15px] font-semibold text-navy">Since Friday</h2>
          </header>
          <ul className="px-5 py-2">
            {activities.map((a) => (
              <li key={a.id} className="grid grid-cols-[3rem_1.25rem_1fr] gap-2 py-2.5 text-[13px]">
                <span className="tabular text-gmuted">{a.at}</span>
                <span className="mt-0.5 text-gmuted">{kindIcon(a.kind)}</span>
                <p>
                  <span className="text-gmuted">{a.who === "System" ? "Automation" : a.who}. </span>
                  {a.text}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <p className="mt-8 text-[12px] text-gmuted">Sites with an active purchase order: {sites.filter((s) => s.po).length} of {sites.length}.</p>
    </div>
  );
}

function Metric({ label, value, note, tone, children }: { label: string; value: string; note: string; tone?: "danger"; children?: React.ReactNode }) {
  return (
    <div className="border-b border-gborder px-5 py-4 md:[&:nth-child(odd)]:border-r xl:border-b-0 xl:border-r xl:last:border-r-0">
      <p className="text-[12.5px] text-gmuted">{label}</p>
      <p className={`mt-1 text-[26px] font-semibold leading-tight tracking-[-0.01em] tabular ${tone === "danger" ? "text-gdanger" : "text-navy"}`}>{value}</p>
      <p className={`text-[12.5px] ${tone === "danger" ? "text-gdanger" : "text-gmuted"}`}>{note}</p>
      {children}
    </div>
  );
}

function Spark({ data }: { data: number[] }) {
  const w = 160, h = 28;
  const min = Math.min(...data) - 4, max = Math.max(...data) + 2;
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d - min) / (max - min)) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-7 w-full max-w-[180px]" aria-label="On site by week, last 12 weeks">
      <polyline points={pts} fill="none" stroke="#6b7f9e" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((data[data.length - 1] - min) / (max - min)) * h} r="2.5" fill="#002149" />
    </svg>
  );
}

function Row({ icon, title, body, action, to, tone, onAction, done }: { icon: React.ReactNode; title: string; body: string; action: string; to?: string; tone?: "danger" | "warn"; onAction?: () => void; done?: boolean }) {
  const toneCls = tone === "danger" ? "bg-[#fbeceb] text-gdanger" : tone === "warn" ? "bg-[#fbf3e3] text-gwarning" : "bg-gsecondary text-navy";
  const btn = "shrink-0 rounded-md border border-gborder bg-white px-3 py-1.5 text-[12.5px] font-medium text-navy hover:border-navy/40";
  return (
    <li className="flex items-start gap-3.5 px-5 py-3.5">
      <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${toneCls}`}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-medium">{title}</p>
        <p className="mt-0.5 text-[12.5px] leading-[1.5] text-gmuted">{body}</p>
      </div>
      {to ? (
        <Link to={to} className={btn}>{action}</Link>
      ) : (
        <button className={`${btn} ${done ? "pointer-events-none border-transparent bg-gsecondary text-gmuted" : ""}`} onClick={onAction} disabled={done}>
          {action}
        </button>
      )}
    </li>
  );
}

function State({ s }: { s: string }) {
  const map: Record<string, string> = {
    Approved: "bg-[#e7f4ec] text-gsuccess",
    Received: "bg-action-tint text-action",
    "Needs review": "bg-[#fbf3e3] text-gwarning",
    Awaiting: "bg-gsecondary text-gmuted",
  };
  return <span className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[12px] font-medium ${map[s]}`}>{s}</span>;
}
