import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Fragment, useMemo, useRef, useState } from "react";
import { MessageSquareText, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { useStore, getState, setState, siteById, clientById, fullName, logActivity, nowHM, type ShortlistState } from "../data/store";
import { Page, Panel, Button, Badge, statusTone, Th, Td, Empty, toast, Avatar } from "./ui";
import { shortlist, type Scored } from "../data/match";
import { ScoreBar, PART_COLOURS } from "./bits";
import { MapView, type Pin } from "./MapView";

export function ShortlistsList() {
  const jobs = useStore((s) => s.jobs);
  const candidates = useStore((s) => s.candidates);
  const settings = useStore((s) => s.settings);
  const sl = useStore((s) => s.shortlist);
  const nav = useNavigate();
  const open = jobs.filter((j) => j.stage !== "Filled");
  const rows = useMemo(() => open.map((j) => ({ j, ranked: shortlist(j, siteById(j.siteId), candidates, settings) })), [open, candidates, settings]);
  return (
    <Page title="Shortlists" context={`Every new job gets a ranked shortlist within minutes. Matching up to ${settings.radius} miles from site.`}>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-[13px]">
            <thead><tr className="border-b border-gborder"><Th>Job</Th><Th>Client</Th><Th className="text-right">Matches</Th><Th className="text-right">Best score</Th><Th>Replies</Th><Th>Stage</Th></tr></thead>
            <tbody className="divide-y divide-gborder">
              {rows.map(({ j, ranked }) => {
                const st = Object.values(sl[j.id] ?? {});
                return (
                  <tr key={j.id} className="cursor-pointer hover:bg-gbg" onClick={() => nav(`/crm/shortlists/${j.id}`)}>
                    <Td><p className="font-medium">{j.headcount} × {j.title}</p><p className="text-gmuted">{siteById(j.siteId).name}, starts {j.start}</p></Td>
                    <Td className="text-gmuted">{clientById(j.clientId).name}</Td>
                    <Td className="text-right tabular">{ranked.length}</Td>
                    <Td className="text-right tabular font-medium">{ranked[0]?.score ?? "–"}</Td>
                    <Td className="text-gmuted">{st.length ? `${st.filter((x) => x === "Available" || x === "Booked").length} yes, ${st.filter((x) => x === "Texted").length} waiting` : "Not texted yet"}</Td>
                    <Td><Badge tone={statusTone(j.stage)}>{j.stage}</Badge></Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </Page>
  );
}

const NONE: Record<string, ShortlistState> = {};
const STATE_TONE: Record<ShortlistState, string> = { Texted: "blue", Available: "green", Unavailable: "grey", Booked: "navy", "No reply": "grey" };

export function ShortlistDetail() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const j = useStore((s) => s.jobs.find((x) => x.id === id));
  const candidates = useStore((s) => s.candidates);
  const settings = useStore((s) => s.settings);
  const states = useStore((s) => (id ? s.shortlist[id] ?? NONE : NONE));
  const [open, setOpen] = useState<string | null>(null);
  const [count, setCount] = useState(6);
  const timers = useRef<number[]>([]);
  const ranked = useMemo(
    () => (j ? shortlist(j, siteById(j.siteId), candidates.map((c) => (states[c.id] === "Booked" ? { ...c, status: "Available" as const } : c)), settings) : []),
    [j, candidates, settings, states],
  );
  if (!j) return <Page title="Job not found"><Empty title="This job no longer exists" action={<Button to="/crm/shortlists">Back to shortlists</Button>} /></Page>;
  const site = siteById(j.siteId);
  const need = j.headcount - j.filled;

  const setOne = (cid: string, st: ShortlistState) => setState((s) => ({ ...s, shortlist: { ...s.shortlist, [j.id]: { ...(s.shortlist[j.id] ?? {}), [cid]: st } } }));

  const textTop = () => {
    const pick = ranked.filter((r) => !states[r.candidate.id]).slice(0, count);
    if (!pick.length) return;
    setState((s) => ({
      ...s,
      jobs: s.jobs.map((x) => (x.id === j.id && x.stage === "Open" ? { ...x, stage: "Shortlisted" } : x)),
      shortlist: { ...s.shortlist, [j.id]: { ...(s.shortlist[j.id] ?? {}), ...Object.fromEntries(pick.map((r) => [r.candidate.id, "Texted" as ShortlistState])) } },
    }));
    logActivity({ who: "Sam", kind: "sms", text: `Texted ${pick.length} people about ${j.headcount} × ${j.title}, ${site.town}.`, jobId: j.id });
    toast(`Texted ${pick.length} people`);
    // replies arrive over the next few seconds
    pick.forEach((r, i) => {
      const t = window.setTimeout(() => {
        const yes = i % 4 !== 2;
        setOne(r.candidate.id, yes ? "Available" : "Unavailable");
        if (yes) toast(`${r.candidate.first} ${r.candidate.last[0]}. replied: available`);
      }, 1600 + i * 900 + Math.random() * 500);
      timers.current.push(t);
    });
  };

  const book = (r: Scored) => {
    const fresh = getState().jobs.find((x) => x.id === j.id)!;
    if (fresh.filled >= fresh.headcount) return;
    const filled = fresh.filled + 1;
    setState((s) => ({
      ...s,
      jobs: s.jobs.map((x) => (x.id === j.id ? { ...x, filled, stage: filled >= x.headcount ? "Filled" : "Booked" } : x)),
      shortlist: { ...s.shortlist, [j.id]: { ...(s.shortlist[j.id] ?? {}), [r.candidate.id]: "Booked" } },
      candidates: s.candidates.map((c) => (c.id === r.candidate.id ? { ...c, status: "On assignment" } : c)),
      placements: [{ id: `pl${Date.now()}`, candidateId: r.candidate.id, jobId: j.id, clientId: j.clientId, siteId: j.siteId, type: j.type, start: "2026-10-19", payRate: j.payRate, chargeRate: j.chargeRate, by: "Sam" }, ...s.placements],
    }));
    logActivity({ who: "Sam", kind: "placement", text: `Booked ${fullName(r.candidate)} for ${j.title}, ${site.name}. Confirmation text sent with site address and start time.`, jobId: j.id, candidateId: r.candidate.id, at: nowHM() });
    toast(filled >= j.headcount ? `${j.title} filled` : `${r.candidate.first} booked, ${j.headcount - filled} to go`);
  };

  const pins: Pin[] = [
    { id: "site", lat: site.lat, lng: site.lng, kind: "site", label: site.name },
    ...ranked.map((r, i) => ({ id: r.candidate.id, lat: r.candidate.lat, lng: r.candidate.lng, kind: (states[r.candidate.id] ? "chosen" : "person") as Pin["kind"], label: `${fullName(r.candidate)}, ${r.distance.toFixed(1)} mi, score ${r.score}`, rank: i < 10 ? i + 1 : undefined })),
  ];
  const texted = Object.keys(states).length;
  const wTotal = Object.values(settings.weights).reduce((a, b) => a + b, 0);
  const fresh = params.get("new") === "1" && !texted;

  return (
    <Page
      title={`${j.headcount} × ${j.title}`}
      context={<><Link to="/crm/shortlists" className="hover:text-gfg">Shortlists</Link> / {clientById(j.clientId).name}, {site.name}</>}
      wide
      actions={
        need > 0 ? (
          <div className="flex items-center gap-2">
            <select value={count} onChange={(e) => setCount(+e.target.value)} className="h-9 rounded-lg border border-gborder bg-white px-2 text-[13px]" aria-label="How many to text">
              {[3, 6, 10, 15].map((n) => <option key={n} value={n}>Top {n}</option>)}
            </select>
            <Button variant="primary" icon={<MessageSquareText className="h-4 w-4" />} onClick={textTop} disabled={!ranked.some((r) => !states[r.candidate.id])}>
              {texted ? "Text the next" : "Text them"}
            </Button>
          </div>
        ) : (
          <Badge tone="green">Filled</Badge>
        )
      }
    >
      {fresh && ranked.length ? (
        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-[#cfe3d6] bg-[#f1f8f3] px-5 py-3.5 text-[13.5px]">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gsuccess text-white"><Zap className="h-4 w-4" /></span>
          <p className="flex-1">
            <span className="font-semibold text-gsuccess">Matched automatically.</span>{" "}
            {ranked.length} people free with cards in date within {settings.radius} miles. The nearest is {Math.min(...ranked.map((r) => r.distance)).toFixed(1)} miles from site.
          </p>
          <span className="text-[12.5px] text-gmuted">Ranked the moment the job was saved</span>
        </div>
      ) : null}
      <div className="mb-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Panel>
          <MapView pins={pins} center={site} radius={settings.radius} height={360} />
        </Panel>
        <Panel title="How people are ranked" meta="Weights are set in Settings and locked once a shortlist is sent" pad>
          <ul className="space-y-3 text-[13px]">
            {(Object.entries(settings.weights) as [keyof typeof settings.weights, number][]).map(([k, v]) => (
              <li key={k} className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: PART_COLOURS[k] }} />
                <span className="flex-1">{{ history: "Has worked for us", distance: "Distance to site", recent: "Worked recently", availability: "Available now", contact: "Spoken to recently" }[k]}</span>
                <span className="tabular text-gmuted">{Math.round((v / wTotal) * 100)}%</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-gborder pt-3 text-[12.5px] leading-[1.5] text-gmuted">Only people with cards in date, right to work checked and not already on site are scored. Anyone further than {settings.radius} miles is left out.</p>
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-gborder pt-3 text-center">
            <div><p className="text-[20px] font-semibold tabular text-navy">{ranked.length}</p><p className="text-[12px] text-gmuted">matches</p></div>
            <div><p className="text-[20px] font-semibold tabular text-navy">{texted}</p><p className="text-[12px] text-gmuted">texted</p></div>
            <div><p className="text-[20px] font-semibold tabular text-navy">{j.filled}/{j.headcount}</p><p className="text-[12px] text-gmuted">booked</p></div>
          </div>
        </Panel>
      </div>

      <Panel title="Ranked shortlist" meta={`${site.postcode}, ${j.type.toLowerCase()}, £${j.payRate.toFixed(2)} pay, starts ${j.start}`}>
        {ranked.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-[13px]">
              <thead><tr className="border-b border-gborder"><Th className="w-10">#</Th><Th>Name</Th><Th className="text-right">Miles</Th><Th className="text-right">Shifts</Th><Th className="w-[200px]">Score</Th><Th className="text-right" /><Th>Reply</Th><Th className="text-right" /></tr></thead>
              <tbody className="divide-y divide-gborder">
                {ranked.map((r, i) => {
                  const st = states[r.candidate.id];
                  const exp = open === r.candidate.id;
                  return (
                    <Fragment key={r.candidate.id}>
                      <tr className={st === "Booked" ? "bg-[#f3f6fa]" : ""}>
                        <Td className="w-10 tabular text-gmuted">{i + 1}</Td>
                        <Td>
                          <Link to={`/crm/candidates/${r.candidate.id}`} className="flex items-center gap-2.5 font-medium hover:underline"><Avatar name={fullName(r.candidate)} size={26} />{fullName(r.candidate)}</Link>
                        </Td>
                        <Td className="text-right tabular">{r.distance.toFixed(1)}</Td>
                        <Td className="text-right tabular">{r.candidate.shiftsWorked || "–"}</Td>
                        <Td><ScoreBar parts={r.parts} weights={settings.weights} /></Td>
                        <Td className="text-right">
                          <button onClick={() => setOpen(exp ? null : r.candidate.id)} className="inline-flex items-center gap-1 font-semibold tabular text-navy" aria-expanded={exp} aria-label={`Show how ${r.candidate.first} scored`}>
                            {r.score}{exp ? <ChevronUp className="h-3.5 w-3.5 text-gmuted" /> : <ChevronDown className="h-3.5 w-3.5 text-gmuted" />}
                          </button>
                        </Td>
                        <Td>{st ? <Badge tone={STATE_TONE[st]}>{st === "Texted" ? "Waiting" : st}</Badge> : <span className="text-gmuted">–</span>}</Td>
                        <Td className="text-right">
                          {st === "Available" && need > 0 ? <Button size="sm" variant="primary" onClick={() => book(r)}>Book</Button> : null}
                          {!st && need > 0 ? <Button size="sm" onClick={() => { setOne(r.candidate.id, "Texted"); toast(`Texted ${r.candidate.first}`); window.setTimeout(() => setOne(r.candidate.id, "Available"), 2200); }}>Text</Button> : null}
                        </Td>
                      </tr>
                      {exp ? (
                        <tr className="bg-gbg">
                          <td colSpan={8} className="px-5 py-3">
                            <div className="grid gap-3 sm:grid-cols-5">
                              {r.parts.map((p) => (
                                <div key={p.key} className="text-[12.5px]">
                                  <p className="flex items-center gap-1.5 text-gmuted"><span className="h-2 w-2 rounded-sm" style={{ background: PART_COLOURS[p.key] }} />{p.label}</p>
                                  <p className="font-medium">{p.detail}</p>
                                  <p className="tabular text-gmuted">{Math.round(p.value * settings.weights[p.key] * 100 / wTotal)} of {Math.round(settings.weights[p.key] * 100 / wTotal)}</p>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty title="No one in reach right now" body="Nobody with this trade, cards in date and free is within range. Widen the radius in Settings or run an availability check." action={<Button to="/crm/availability">Run availability check</Button>} />
        )}
      </Panel>
    </Page>
  );
}
