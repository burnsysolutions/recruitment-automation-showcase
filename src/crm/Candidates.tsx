import { Link, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Phone, MessageSquareText, Mail, ChevronLeft, ChevronRight, BriefcaseBusiness, ArrowUpDown } from "lucide-react";
import { useStore, setState, updateCandidate, fullName, CONSULTANTS, siteById, clientById, logActivity, nowHM } from "../data/store";
import { Page, Panel, Button, Badge, statusTone, Avatar, inputCls, Select, Tabs, KV, Th, Td, Empty, toast, Dialog } from "./ui";
import { CardBadge, cardState } from "./bits";
import { fmtDate, gbp } from "../data/match";
import { Timeline } from "./Timeline";
import { TasksPanel } from "./Tasks";
import type { Candidate, CandidateStatus } from "../data/seed";

const STATUSES: CandidateStatus[] = ["Available", "Available from", "On assignment", "Not looking"];

export function CandidatesList() {
  const candidates = useStore((s) => s.candidates);
  const newIds = useStore((s) => s.newCandidates);
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [sector, setSector] = useState("All");
  const [cards, setCards] = useState("All");
  const [owner, setOwner] = useState("All");
  const [sort, setSort] = useState<{ k: keyof Candidate | "card"; dir: 1 | -1 }>({ k: "createdAt", dir: -1 });
  const [page, setPage] = useState(0);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const PER = 25;

  const rows = useMemo(() => {
    const ql = q.toLowerCase();
    const r = candidates.filter((c) => {
      if (ql && !`${c.first} ${c.last} ${c.trade} ${c.town} ${c.postcode} ${c.mobile}`.toLowerCase().includes(ql)) return false;
      if (status !== "All" && c.status !== status) return false;
      if (sector !== "All" && c.sector !== sector) return false;
      if (owner !== "All" && c.owner !== owner) return false;
      if (cards !== "All") {
        const st = cardState(c).tone;
        if (cards === "Expired" && st !== "red") return false;
        if (cards === "Expiring" && st !== "amber") return false;
        if (cards === "In date" && st !== "green") return false;
      }
      return true;
    });
    return r.sort((a, b) => {
      const av = sort.k === "card" ? a.cards[0].expires : (a[sort.k] as string | number);
      const bv = sort.k === "card" ? b.cards[0].expires : (b[sort.k] as string | number);
      return (av > bv ? 1 : av < bv ? -1 : 0) * sort.dir;
    });
  }, [candidates, q, status, sector, owner, cards, sort]);

  const pages = Math.max(1, Math.ceil(rows.length / PER));
  const view = rows.slice(page * PER, page * PER + PER);
  const toggle = (id: string) => setSel((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    return n;
  });
  const sortBy = (k: typeof sort.k) => setSort((s) => ({ k, dir: s.k === k ? ((s.dir * -1) as 1 | -1) : 1 }));
  const SortTh = ({ k, children, className = "" }: { k: typeof sort.k; children: React.ReactNode; className?: string }) => (
    <Th className={className}>
      <button onClick={() => sortBy(k)} className="inline-flex items-center gap-1 hover:text-gfg">
        {children}
        <ArrowUpDown className={`h-3 w-3 ${sort.k === k ? "text-action" : "opacity-40"}`} />
      </button>
    </Th>
  );

  return (
    <Page
      title="Candidates"
      context={`${candidates.length} people on file`}
      actions={
        <>
          <Button to="/crm/search">Advanced search</Button>
          <Button variant="primary" to="/register">Add candidate</Button>
        </>
      }
    >
      <Panel>
        <div className="flex flex-wrap items-center gap-2 border-b border-gborder p-3">
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Name, trade, town, postcode or mobile" className={`${inputCls} w-full sm:w-[300px]`} />
          <Select value={status} onChange={(v) => { setStatus(v); setPage(0); }} options={[["All", "Any status"], ...STATUSES]} className="w-auto" />
          <Select value={sector} onChange={(v) => { setSector(v); setPage(0); }} options={[["All", "Any sector"], "Fit-out & refurbishment", "Groundworks & civils", "Mechanical & electrical", "Demolition", "Maintenance"]} className="w-auto" />
          <Select value={cards} onChange={(v) => { setCards(v); setPage(0); }} options={[["All", "Any card state"], "In date", ["Expiring", "Expiring in 30 days"], "Expired"]} className="w-auto" />
          <Select value={owner} onChange={(v) => { setOwner(v); setPage(0); }} options={[["All", "Any owner"], ...CONSULTANTS]} className="w-auto" />
          <span className="ml-auto text-[12.5px] tabular text-gmuted">{rows.length.toLocaleString("en-GB")} match</span>
        </div>
        {sel.size ? (
          <div className="flex flex-wrap items-center gap-2 border-b border-gborder bg-action-tint px-5 py-2.5 text-[13px]">
            <span className="font-medium text-navy">{sel.size} selected</span>
            <Button size="sm" onClick={() => { toast(`Availability check texted to ${sel.size} people`); logActivity({ who: "Sam", kind: "sms", text: `Availability check texted to ${sel.size} candidates.` }); setSel(new Set()); }}>Text availability check</Button>
            <Button size="sm" to={`/crm/mailshots?ids=${[...sel].join(",")}`}>Email these people</Button>
            <button className="ml-auto text-[12.5px] text-gmuted hover:text-gfg" onClick={() => setSel(new Set())}>Clear</button>
          </div>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-[13px]">
            <thead>
              <tr className="border-b border-gborder">
                <Th className="w-10">
                  <input type="checkbox" aria-label="Select all on this page" checked={view.length > 0 && view.every((c) => sel.has(c.id))} onChange={(e) => setSel((s) => { const n = new Set(s); view.forEach((c) => (e.target.checked ? n.add(c.id) : n.delete(c.id))); return n; })} />
                </Th>
                <SortTh k="last">Name</SortTh>
                <SortTh k="trade">Trade</SortTh>
                <SortTh k="town">Lives</SortTh>
                <SortTh k="status">Status</SortTh>
                <SortTh k="card">Cards</SortTh>
                <SortTh k="shiftsWorked" className="text-right">Shifts with you</SortTh>
                <SortTh k="lastContact">Last contact</SortTh>
                <SortTh k="owner">Owner</SortTh>
              </tr>
            </thead>
            <tbody className="divide-y divide-gborder">
              {view.map((c) => (
                <tr key={c.id} className="cursor-pointer hover:bg-gbg" onClick={() => nav(`/crm/candidates/${c.id}`)}>
                  <Td className="w-10" >
                    <input type="checkbox" aria-label={`Select ${fullName(c)}`} checked={sel.has(c.id)} onClick={(e) => e.stopPropagation()} onChange={() => toggle(c.id)} />
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={fullName(c)} size={28} />
                      <span className="whitespace-nowrap font-medium text-gfg">{fullName(c)}</span>
                      {newIds.includes(c.id) ? <Badge tone="blue">New</Badge> : null}
                    </div>
                  </Td>
                  <Td>{c.trade}</Td>
                  <Td className="text-gmuted">{c.town}</Td>
                  <Td><Badge tone={statusTone(c.status)}>{c.status === "Available from" ? `From ${fmtDate(c.availableFrom)}` : c.status}</Badge></Td>
                  <Td><CardBadge c={c} /></Td>
                  <Td className="text-right tabular">{c.shiftsWorked || "–"}</Td>
                  <Td className="text-gmuted">{fmtDate(c.lastContact)}</Td>
                  <Td className="text-gmuted">{c.owner}</Td>
                </tr>
              ))}
            </tbody>
          </table>
          {view.length === 0 ? <Empty title="No one matches those filters" body="Clear a filter or search by postcode instead." /> : null}
        </div>
        <div className="flex items-center justify-between border-t border-gborder px-5 py-2.5 text-[12.5px] text-gmuted">
          <span className="tabular">{rows.length ? `${page * PER + 1} to ${Math.min(rows.length, page * PER + PER)} of ${rows.length}` : ""}</span>
          <div className="flex gap-1">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="rounded-md p-1.5 hover:bg-gsecondary disabled:opacity-30" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} className="rounded-md p-1.5 hover:bg-gsecondary disabled:opacity-30" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </Panel>
    </Page>
  );
}

export function CandidateRecord() {
  const { id } = useParams();
  const c = useStore((s) => s.candidates.find((x) => x.id === id));
  const placements = useStore((s) => s.placements);
  const timesheets = useStore((s) => s.timesheets);
  const jobs = useStore((s) => s.jobs);
  const [tab, setTab] = useState("activity");
  const [addOpen, setAddOpen] = useState(false);

  if (!c) return <Page title="Candidate not found"><Empty title="This record no longer exists" action={<Button to="/crm/candidates">Back to candidates</Button>} /></Page>;

  const mine = placements.filter((p) => p.candidateId === c.id);
  const hours = timesheets.flatMap((t) => t.lines.filter((l) => l.candidateId === c.id).map((l) => ({ t, h: l.hours.reduce((a, b) => a + b, 0), flag: l.flag })));
  const openJobs = jobs.filter((j) => j.stage !== "Filled" && j.trade === c.trade);

  return (
    <Page
      title={fullName(c)}
      context={<Link to="/crm/candidates" className="hover:text-gfg">Candidates</Link>}
      actions={
        <>
          <Button icon={<Phone className="h-4 w-4" />} onClick={() => { logActivity({ who: "Sam", kind: "call", text: `Called ${fullName(c)}.`, candidateId: c.id }); toast(`Calling ${c.mobile}`); }}>Call</Button>
          <Button icon={<MessageSquareText className="h-4 w-4" />} onClick={() => { logActivity({ who: "Sam", kind: "sms", text: `Availability check texted to ${fullName(c)}.`, candidateId: c.id }); toast("Availability check texted"); }}>Text</Button>
          <Button icon={<Mail className="h-4 w-4" />} to={`/crm/mailshots?ids=${c.id}`}>Email</Button>
          <Button variant="primary" icon={<BriefcaseBusiness className="h-4 w-4" />} onClick={() => setAddOpen(true)}>Add to a job</Button>
        </>
      }
    >
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-gborder bg-white px-5 py-4">
        <Avatar name={fullName(c)} size={48} />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-navy">{c.trade}</p>
          <p className="text-[13px] text-gmuted">{c.town}, {c.postcode}. Registered {fmtDate(c.createdAt, { day: "numeric", month: "short", year: "numeric" })} via {c.source.toLowerCase()}.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] text-gmuted">Status</span>
          <Select
            value={c.status}
            onChange={(v) => { updateCandidate(c.id, { status: v as CandidateStatus }); toast(`Status set to ${v}`); }}
            options={STATUSES}
            className="w-auto"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] text-gmuted">Owner</span>
          <Select value={c.owner} onChange={(v) => updateCandidate(c.id, { owner: v })} options={[...CONSULTANTS]} className="w-auto" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel title="Details" pad>
            <KV
              rows={[
                ["Mobile", <a href={`tel:${c.mobile.replace(/\s/g, "")}`} className="tabular text-action hover:underline">{c.mobile}</a>],
                ["Email", <span className="[overflow-wrap:anywhere]">{c.email}</span>],
                ["Pay rate", `£${c.payRate.toFixed(2)} an hour`],
                ["Paid through", c.umbrella],
                ["Shifts with you", c.shiftsWorked ? `${c.shiftsWorked}, last ${fmtDate(c.lastWorked)}` : "None yet"],
                ["Availability", c.status === "Available from" ? `From ${fmtDate(c.availableFrom, { day: "numeric", month: "long" })}` : c.status],
                ["Notes", c.notes ?? "–"],
              ]}
            />
          </Panel>
          <Panel title="Cards and right to work" actions={<CardBadge c={c} />}>
            <ul className="divide-y divide-gborder">
              {c.cards.map((k, ki) => {
                const exp = new Date(k.expires);
                const expired = exp < new Date("2026-10-12");
                const photo = ki === 0 ? c.cardPhotos?.front : undefined;
                return (
                  <li key={k.number} className="flex items-center gap-4 px-5 py-3.5">
                    {photo ? (
                      <img src={photo} alt={`${k.scheme} card, front`} className="h-11 w-16 shrink-0 rounded-md object-cover ring-1 ring-gborder" />
                    ) : (
                      <div className="flex h-11 w-16 shrink-0 flex-col justify-between rounded-md bg-gradient-to-br from-[#2b4467] to-[#1b2a41] p-1.5 text-[9px] font-semibold leading-none text-white">
                        <span>{k.scheme}</span>
                        <span className="opacity-60">{k.number.slice(-4)}</span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1 text-[13px]">
                      <p className="font-medium">{k.scheme} {k.level}</p>
                      <p className={expired ? "text-gdanger" : "text-gmuted"}>
                        No. {k.number}. {expired ? "Expired" : "Expires"} {fmtDate(k.expires, { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </li>
                );
              })}
              {c.cardPhotos?.front ? (
                <li className="px-5 py-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    {[c.cardPhotos.front, c.cardPhotos.back].filter(Boolean).map((u, i) => (
                      <img key={i} src={u} alt={i ? "Back of card" : "Front of card"} className="aspect-[85/54] w-full rounded-lg object-cover ring-1 ring-gborder" />
                    ))}
                  </div>
                  <p className="mt-2.5 flex items-center gap-2 text-[12.5px] text-gsuccess">
                    <span className="h-1.5 w-1.5 rounded-full bg-gsuccess" /> Sent from their phone at registration. Number and expiry read from the photo.
                  </p>
                </li>
              ) : null}
              <li className="flex items-center justify-between px-5 py-3.5 text-[13px]">
                <span>Right to work</span>
                <Badge tone={c.rtw === "Verified" ? "green" : "amber"}>{c.rtw === "Verified" ? "Checked" : "Share code to check"}</Badge>
              </li>
            </ul>
          </Panel>
          {openJobs.length ? (
            <Panel title="Open jobs that fit">
              <ul className="divide-y divide-gborder">
                {openJobs.slice(0, 4).map((j) => (
                  <li key={j.id}>
                    <Link to={`/crm/shortlists/${j.id}`} className="block px-5 py-3 text-[13px] hover:bg-gbg">
                      <p className="font-medium">{j.publicTitle}, {siteById(j.siteId).town}</p>
                      <p className="text-gmuted">{clientById(j.clientId).name}, starts {j.start}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}
        </div>

        <Panel>
          <div className="px-5 pt-3">
            <Tabs value={tab} onChange={setTab} tabs={[["activity", "Activity"], ["work", "Work history", mine.length], ["tasks", "Tasks"], ["docs", "Documents"]]} />
          </div>
          <div className="p-5">
            {tab === "activity" ? <Timeline candidateId={c.id} /> : null}
            {tab === "work" ? (
              mine.length || hours.length ? (
                <div className="space-y-6">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="border-b border-gborder"><Th>Client and site</Th><Th>Started</Th><Th className="text-right">Pay</Th><Th className="text-right">Charge</Th></tr>
                    </thead>
                    <tbody className="divide-y divide-gborder">
                      {mine.map((p) => (
                        <tr key={p.id}>
                          <Td><p className="font-medium">{siteById(p.siteId).name}</p><p className="text-gmuted">{clientById(p.clientId).name}</p></Td>
                          <Td className="text-gmuted">{fmtDate(p.start)}</Td>
                          <Td className="text-right tabular">{p.type === "Permanent" ? "–" : `£${p.payRate.toFixed(2)}`}</Td>
                          <Td className="text-right tabular">{p.type === "Permanent" ? gbp(p.fee ?? 0) + " fee" : `£${p.chargeRate.toFixed(2)}`}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {hours.length ? (
                    <div>
                      <p className="mb-2 text-[13px] font-medium text-navy">Hours on timesheets</p>
                      {hours.map(({ t, h, flag }) => (
                        <Link key={t.id} to={`/crm/timesheets/${t.id}`} className="flex items-center justify-between rounded-lg border border-gborder px-4 py-2.5 text-[13px] hover:border-navy/30">
                          <span>Week ending {fmtDate(t.weekEnding)}, {siteById(t.siteId).name}</span>
                          <span className="flex items-center gap-2 tabular">{flag ? <Badge tone="amber">Check</Badge> : null}{h} hrs</span>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <Empty title="No work with you yet" body="Add them to a job to start their history." />
              )
            ) : null}
            {tab === "tasks" ? <TasksPanel candidateId={c.id} /> : null}
            {tab === "docs" ? (
              <ul className="divide-y divide-gborder rounded-lg border border-gborder text-[13px]">
                {[
                  [`${c.cards[0].scheme} card, front`, "Photo, read automatically"],
                  [`${c.cards[0].scheme} card, back`, "Photo"],
                  ["Right to work evidence", c.rtw === "Verified" ? "Checked" : "Waiting"],
                  ["CV", c.source === "Website" ? "Not supplied" : "PDF"],
                ].map(([n, d]) => (
                  <li key={n} className="flex items-center justify-between px-4 py-3">
                    <span className="font-medium">{n}</span>
                    <span className="text-gmuted">{d}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </Panel>
      </div>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} title={`Add ${c.first} to a job`}>
        {jobs.filter((j) => j.stage !== "Filled").length ? (
          <ul className="max-h-[50vh] divide-y divide-gborder overflow-y-auto rounded-lg border border-gborder">
            {jobs
              .filter((j) => j.stage !== "Filled")
              .sort((a, b) => Number(b.trade === c.trade) - Number(a.trade === c.trade))
              .map((j) => (
                <li key={j.id} className="flex items-center justify-between gap-4 px-4 py-3 text-[13px]">
                  <div>
                    <p className="font-medium">{j.publicTitle}, {siteById(j.siteId).town}</p>
                    <p className="text-gmuted">{clientById(j.clientId).name}, {j.headcount - j.filled} places left</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setState((s) => ({ ...s, shortlist: { ...s.shortlist, [j.id]: { ...(s.shortlist[j.id] ?? {}), [c.id]: "Available" } } }));
                      logActivity({ who: "Sam", kind: "note", text: `Added ${fullName(c)} to ${j.publicTitle}, ${siteById(j.siteId).town}.`, candidateId: c.id, jobId: j.id, at: nowHM() });
                      toast(`Added to ${j.publicTitle}`);
                      setAddOpen(false);
                    }}
                  >
                    Add
                  </Button>
                </li>
              ))}
          </ul>
        ) : (
          <Empty title="No open jobs" />
        )}
      </Dialog>
    </Page>
  );
}
