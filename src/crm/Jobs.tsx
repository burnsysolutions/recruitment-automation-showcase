import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Globe, Radar } from "lucide-react";
import { useStore, setState, updateJob, clients, sites, clientById, siteById, TRADES, CONSULTANTS, logActivity, fullName } from "../data/store";
import { Page, Panel, Button, Badge, inputCls, Select, Field, Dialog, KV, Th, Td, Empty, Tabs, toast } from "./ui";
import { gbp, fmtDate } from "../data/match";
import { Timeline } from "./Timeline";
import { TasksPanel } from "./Tasks";
import type { Job, JobStage } from "../data/seed";

const STAGES: JobStage[] = ["Open", "Shortlisted", "Booked", "Filled"];
const STAGE_NOTE: Record<JobStage, string> = {
  Open: "Needs a shortlist",
  Shortlisted: "Waiting on replies",
  Booked: "Confirmed, not yet on site",
  Filled: "Everyone on site",
};

export function JobsBoard() {
  const jobs = useStore((s) => s.jobs);
  const [params, setParams] = useSearchParams();
  const [mine, setMine] = useState(false);
  const [q, setQ] = useState("");
  const [drag, setDrag] = useState<string | null>(null);
  const [over, setOver] = useState<JobStage | null>(null);
  const [newOpen, setNewOpen] = useState(false);

  useEffect(() => {
    if (params.get("new")) setNewOpen(true);
  }, [params]);

  const list = jobs.filter((j) => (!mine || j.owner === "Sam") && (!q || `${j.title} ${clientById(j.clientId).name} ${siteById(j.siteId).town}`.toLowerCase().includes(q.toLowerCase())));

  const drop = (stage: JobStage) => {
    if (!drag) return;
    const j = jobs.find((x) => x.id === drag)!;
    if (j.stage !== stage) {
      updateJob(drag, { stage, filled: stage === "Filled" ? j.headcount : j.filled });
      logActivity({ who: "Sam", kind: "note", text: `Moved ${j.headcount} × ${j.title}, ${siteById(j.siteId).town} to ${stage}.`, jobId: j.id });
      toast(`${j.title} moved to ${stage}`);
    }
    setDrag(null);
    setOver(null);
  };

  return (
    <Page
      title="Jobs"
      wide
      context={`${jobs.filter((j) => j.stage !== "Filled").reduce((t, j) => t + j.headcount - j.filled, 0)} heads still to fill`}
      actions={
        <>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Trade, client or town" className={`${inputCls} w-[220px]`} />
          <Button onClick={() => setMine((m) => !m)} variant={mine ? "primary" : "secondary"}>My jobs</Button>
          <Button variant="primary" onClick={() => setNewOpen(true)}>New job</Button>
        </>
      }
    >
      <p className="mb-4 text-[12.5px] text-gmuted">Drag a job between columns to change its stage.</p>
      <div className="grid gap-4 overflow-x-auto pb-2 md:grid-cols-2 xl:grid-cols-4">
        {STAGES.map((stage) => {
          const col = list.filter((j) => j.stage === stage);
          return (
            <section
              key={stage}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(stage);
              }}
              onDragLeave={() => setOver((o) => (o === stage ? null : o))}
              onDrop={() => drop(stage)}
              className={`flex min-h-[420px] flex-col rounded-xl border bg-white/60 transition-colors ${over === stage ? "border-action bg-action-tint/60" : "border-gborder"}`}
              aria-label={stage}
            >
              <header className="flex items-baseline justify-between px-4 pb-2 pt-3.5">
                <div>
                  <h2 className="text-[14px] font-semibold text-navy">{stage}</h2>
                  <p className="text-[12px] text-gmuted">{STAGE_NOTE[stage]}</p>
                </div>
                <span className="rounded-full bg-gsecondary px-2 py-0.5 text-[12px] tabular text-gmuted">{col.length}</span>
              </header>
              <div className="flex-1 space-y-2.5 p-2.5">
                {col.map((j) => (
                  <JobCard key={j.id} j={j} dragging={drag === j.id} onDragStart={() => setDrag(j.id)} onDragEnd={() => { setDrag(null); setOver(null); }} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <NewJob
        open={newOpen}
        clientId={params.get("new") ?? undefined}
        onClose={() => {
          setNewOpen(false);
          if (params.get("new")) setParams({});
        }}
      />
    </Page>
  );
}

function JobCard({ j, dragging, onDragStart, onDragEnd }: { j: Job; dragging: boolean; onDragStart: () => void; onDragEnd: () => void }) {
  const nav = useNavigate();
  const pct = (j.filled / j.headcount) * 100;
  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={() => nav(`/crm/jobs/${j.id}`)}
      className={`cursor-pointer rounded-lg border border-gborder bg-white p-3.5 shadow-[0_1px_2px_rgba(10,16,29,0.04)] transition-shadow hover:shadow-[0_4px_14px_rgba(10,16,29,0.08)] ${dragging ? "opacity-40" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13.5px] font-semibold leading-snug text-gfg">
          {j.headcount} × {j.title}
        </p>
        <span className="shrink-0 text-[11px] tabular text-gmuted">{j.ref}</span>
      </div>
      <p className="mt-1 text-[12.5px] text-gmuted">{clientById(j.clientId).name}</p>
      <p className="text-[12.5px] text-gmuted">{siteById(j.siteId).town}, starts {j.start}</p>
      <div className="mt-3 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gsecondary">
          <div className={`h-full rounded-full ${pct === 100 ? "bg-gsuccess" : "bg-action"}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[11.5px] tabular text-gmuted">{j.filled}/{j.headcount}</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-[12px]">
        <span className="tabular text-gmuted">
          {j.type === "Permanent" ? "Permanent" : `£${j.payRate.toFixed(2)} / £${j.chargeRate.toFixed(2)}`}
        </span>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2b3d59] text-[10px] font-semibold text-white" title={j.owner}>{j.owner[0]}</span>
      </div>
    </article>
  );
}

function NewJob({ open, onClose, clientId }: { open: boolean; onClose: () => void; clientId?: string }) {
  const nav = useNavigate();
  const [cid, setCid] = useState(clientId ?? clients[0].id);
  const [sid, setSid] = useState("");
  const [trade, setTrade] = useState(TRADES[0].trade);
  const [headcount, setHeadcount] = useState(2);
  const [type, setType] = useState<Job["type"]>("Temp");
  const [start, setStart] = useState("Mon 26 Oct");
  const t = TRADES.find((x) => x.trade === trade)!;
  const [pay, setPay] = useState(t.rate[1]);
  const [charge, setCharge] = useState(Math.round(t.rate[1] * 1.32 * 2) / 2);
  const [publish, setPublish] = useState(true);
  const siteOpts = sites.filter((s) => s.clientId === cid);

  useEffect(() => {
    if (clientId) setCid(clientId);
  }, [clientId]);
  useEffect(() => setSid(siteOpts[0]?.id ?? ""), [cid]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPay(t.rate[1]);
    setCharge(Math.round(t.rate[1] * 1.32 * 2) / 2);
  }, [trade]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = () => {
    const id = `j${Date.now()}`;
    const job: Job = {
      id,
      ref: `DRC-${2600 + Math.floor(Math.random() * 300)}`,
      title: trade,
      trade,
      sector: t.sector,
      clientId: cid,
      siteId: sid || sites[0].id,
      type,
      headcount,
      filled: 0,
      payRate: pay,
      chargeRate: charge,
      start,
      duration: type === "Permanent" ? "Permanent" : "4 weeks",
      stage: publish ? "Open" : "Open",
      owner: "Sam",
      createdAt: "2026-10-12",
      publicTitle: headcount > 1 ? `${trade}s` : trade,
      summary: `${trade} work for ${headcount} on a ${t.sector.toLowerCase()} package in ${siteById(sid || sites[0].id).town}.`,
      requirements: [`${t.card[0]} ${t.card[1]} card`, "Right to work in the UK", "Own PPE and hand tools"],
    };
    setState((s) => ({ ...s, jobs: [job, ...s.jobs] }));
    logActivity({ who: "Sam", kind: "note", text: `New job: ${headcount} × ${trade}, ${siteById(job.siteId).name} for ${clientById(cid).name}.${publish ? " Live on the website." : ""}`, jobId: id, clientId: cid });
    toast(publish ? "Job saved and live on the website" : "Job saved");
    onClose();
    nav(`/crm/shortlists/${id}?new=1`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="New job"
      width={620}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={!sid}>Save and build shortlist</Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Client"><Select value={cid} onChange={setCid} options={clients.map((c) => [c.id, c.name] as [string, string])} /></Field>
        <Field label="Site"><Select value={sid} onChange={setSid} options={siteOpts.length ? siteOpts.map((s) => [s.id, s.name] as [string, string]) : [["", "Add a site first"]]} /></Field>
        <Field label="Trade"><Select value={trade} onChange={setTrade} options={TRADES.map((x) => x.trade)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="How many"><input type="number" min={1} value={headcount} onChange={(e) => setHeadcount(Math.max(1, +e.target.value))} className={inputCls} /></Field>
          <Field label="Type"><Select value={type} onChange={(v) => setType(v as Job["type"])} options={["Temp", "Contract", "Permanent"]} /></Field>
        </div>
        <Field label="Start"><input value={start} onChange={(e) => setStart(e.target.value)} className={inputCls} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Pay £/hr"><input type="number" step="0.5" value={pay} onChange={(e) => setPay(+e.target.value)} className={inputCls} /></Field>
          <Field label="Charge £/hr"><input type="number" step="0.5" value={charge} onChange={(e) => setCharge(+e.target.value)} className={inputCls} /></Field>
        </div>
      </div>
      <p className="mt-3 text-[12.5px] text-gmuted tabular">Margin £{(charge - pay).toFixed(2)} an hour, about {gbp((charge - pay) * 45 * headcount)} a week at 45 hours each.</p>
      <label className="mt-4 flex items-center gap-2.5 text-[13px]">
        <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} className="h-4 w-4 accent-[#002149]" />
        Show it on the website jobs page
      </label>
    </Dialog>
  );
}

export function JobRecord() {
  const { id } = useParams();
  const j = useStore((s) => s.jobs.find((x) => x.id === id));
  const sl = useStore((s) => (id ? s.shortlist[id] : undefined));
  const candidates = useStore((s) => s.candidates);
  const [tab, setTab] = useState("people");
  const people = useMemo(() => Object.entries(sl ?? {}).map(([cid, st]) => ({ c: candidates.find((x) => x.id === cid), st })).filter((x) => x.c), [sl, candidates]);
  if (!j) return <Page title="Job not found"><Empty title="This job no longer exists" action={<Button to="/crm/jobs">Back to jobs</Button>} /></Page>;
  const site = siteById(j.siteId);
  return (
    <Page
      title={`${j.headcount} × ${j.title}`}
      context={<><Link to="/crm/jobs" className="hover:text-gfg">Jobs</Link> / {j.ref}</>}
      actions={
        <>
          <Button icon={<Globe className="h-4 w-4" />} to={`/jobs/${j.id}`}>View on website</Button>
          <Button variant="primary" icon={<Radar className="h-4 w-4" />} to={`/crm/shortlists/${j.id}`}>Shortlist</Button>
        </>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel title="Job" actions={<Select value={j.stage} onChange={(v) => { updateJob(j.id, { stage: v as JobStage }); toast(`Stage set to ${v}`); }} options={STAGES} className="h-8 w-auto text-[12.5px]" />} pad>
            <KV
              rows={[
                ["Client", <Link to={`/crm/clients/${j.clientId}`} className="text-action hover:underline">{clientById(j.clientId).name}</Link>],
                ["Site", `${site.name}, ${site.postcode}`],
                ["Purchase order", site.po ?? "None yet"],
                ["Type", `${j.type}, ${j.duration.toLowerCase()}`],
                ["Starts", j.start],
                ["Pay and charge", j.type === "Permanent" ? "Permanent fee" : `£${j.payRate.toFixed(2)} and £${j.chargeRate.toFixed(2)} an hour`],
                ["Filled", `${j.filled} of ${j.headcount}`],
                ["Owner", <Select value={j.owner} onChange={(v) => updateJob(j.id, { owner: v })} options={[...CONSULTANTS]} className="h-8 w-auto text-[12.5px]" />],
              ]}
            />
          </Panel>
          <Panel title="On the website" pad>
            <p className="text-[13px] font-medium">{j.publicTitle}</p>
            <p className="mt-1 text-[13px] leading-[1.55] text-gmuted">{j.summary}</p>
          </Panel>
        </div>
        <Panel>
          <div className="px-5 pt-3">
            <Tabs value={tab} onChange={setTab} tabs={[["people", "People", people.length], ["activity", "Activity"], ["tasks", "Tasks"]]} />
          </div>
          <div className="p-5">
            {tab === "people" ? (
              people.length ? (
                <table className="w-full text-[13px]">
                  <thead><tr className="border-b border-gborder"><Th>Name</Th><Th>Lives</Th><Th>Stage</Th></tr></thead>
                  <tbody className="divide-y divide-gborder">
                    {people.map(({ c, st }) => (
                      <tr key={c!.id}>
                        <Td><Link to={`/crm/candidates/${c!.id}`} className="font-medium hover:underline">{fullName(c!)}</Link></Td>
                        <Td className="text-gmuted">{c!.town}</Td>
                        <Td><Badge tone={st === "Booked" ? "navy" : st === "Available" ? "green" : st === "Unavailable" ? "grey" : "blue"}>{st}</Badge></Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <Empty title="No one on this job yet" body="Build a shortlist and text the best matches." action={<Button variant="primary" to={`/crm/shortlists/${j.id}`}>Open shortlist</Button>} />
              )
            ) : null}
            {tab === "activity" ? <Timeline jobId={j.id} /> : null}
            {tab === "tasks" ? <TasksPanel jobId={j.id} /> : null}
          </div>
        </Panel>
      </div>
    </Page>
  );
}

export function Placements() {
  const placements = useStore((s) => s.placements);
  const candidates = useStore((s) => s.candidates);
  const [type, setType] = useState("All");
  const [owner, setOwner] = useState("All");
  const rows = placements.filter((p) => (type === "All" || p.type === type) && (owner === "All" || p.by === owner));
  const temp = rows.filter((p) => p.type !== "Permanent");
  const weekly = temp.reduce((t, p) => t + (p.chargeRate - p.payRate) * 45, 0);
  const fees = rows.filter((p) => p.type === "Permanent").reduce((t, p) => t + (p.fee ?? 0), 0);
  return (
    <Page title="Placements" context={`${temp.length} on site, ${rows.length - temp.length} permanent this quarter`}>
      <div className="mb-6 grid divide-y divide-gborder overflow-hidden rounded-xl border border-gborder bg-white md:grid-cols-3 md:divide-x md:divide-y-0">
        {[
          ["Temp and contract on site", String(temp.length)],
          ["Weekly margin at 45 hours", gbp(weekly)],
          ["Permanent fees", gbp(fees)],
        ].map(([k, v]) => (
          <div key={k} className="px-5 py-4"><p className="text-[12.5px] text-gmuted">{k}</p><p className="mt-1 text-[22px] font-semibold tabular text-navy">{v}</p></div>
        ))}
      </div>
      <Panel>
        <div className="flex flex-wrap gap-2 border-b border-gborder p-3">
          <Select value={type} onChange={setType} options={[["All", "All types"], "Temp", "Contract", "Permanent"]} className="w-auto" />
          <Select value={owner} onChange={setOwner} options={[["All", "Anyone"], ...CONSULTANTS]} className="w-auto" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-[13px]">
            <thead><tr className="border-b border-gborder"><Th>Worker</Th><Th>Client and site</Th><Th>Type</Th><Th>Started</Th><Th className="text-right">Pay</Th><Th className="text-right">Charge</Th><Th className="text-right">Margin</Th><Th>By</Th></tr></thead>
            <tbody className="divide-y divide-gborder">
              {rows.map((p) => {
                const w = candidates.find((c) => c.id === p.candidateId);
                return (
                  <tr key={p.id} className="hover:bg-gbg">
                    <Td>{w ? <Link to={`/crm/candidates/${w.id}`} className="font-medium hover:underline">{fullName(w)}</Link> : "–"}<p className="text-gmuted">{w?.trade}</p></Td>
                    <Td><p>{clientById(p.clientId).name}</p><p className="text-gmuted">{siteById(p.siteId).name}</p></Td>
                    <Td><Badge tone={p.type === "Permanent" ? "navy" : "blue"}>{p.type}</Badge></Td>
                    <Td className="text-gmuted">{fmtDate(p.start)}</Td>
                    <Td className="text-right tabular">{p.type === "Permanent" ? "–" : `£${p.payRate.toFixed(2)}`}</Td>
                    <Td className="text-right tabular">{p.type === "Permanent" ? "–" : `£${p.chargeRate.toFixed(2)}`}</Td>
                    <Td className="text-right tabular font-medium">{p.type === "Permanent" ? `${gbp(p.fee ?? 0)} fee` : `£${(p.chargeRate - p.payRate).toFixed(2)}/hr`}</Td>
                    <Td className="text-gmuted">{p.by}</Td>
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
