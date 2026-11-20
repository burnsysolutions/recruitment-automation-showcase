import { Link, useNavigate, useParams } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import { Upload, FileText, AlertTriangle, Check, Mail } from "lucide-react";
import { useStore, setState, updateTimesheet, clientById, siteById, contacts, fullName, logActivity, nowHM, assignments, sites } from "../data/store";
import { Page, Panel, Button, Badge, statusTone, Th, Td, Empty, Dialog, toast, StatRow, Stat, inputCls } from "./ui";
import { fmtDate } from "../data/match";
import type { Timesheet } from "../data/seed";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const total = (h: number[]) => h.reduce((a, b) => a + b, 0);

export function TimesheetsList() {
  const timesheets = useStore((s) => s.timesheets);
  const candidates = useStore((s) => s.candidates);
  const nav = useNavigate();
  const [reading, setReading] = useState(false);
  const rows = timesheets.filter((t) => t.lines.length);
  const hours = rows.filter((t) => t.status !== "Awaiting").reduce((a, t) => a + t.lines.reduce((b, l) => b + (l.flag ? 0 : total(l.hours)), 0), 0);

  return (
    <Page
      title="Timesheets"
      context="Week ending Sunday 11 October"
      actions={
        <>
          <Button
            disabled={!rows.some((t) => t.status === "Received")}
            onClick={() => {
              const clean = rows.filter((t) => t.status === "Received");
              setState((s) => ({ ...s, timesheets: s.timesheets.map((t) => (clean.some((c) => c.id === t.id) ? { ...t, status: "Approved" } : t)) }));
              logActivity({ who: "Sam", kind: "note", text: `Approved ${clean.length} timesheets with nothing flagged.` });
              toast(`${clean.length} timesheets approved for payroll`);
            }}
          >
            Approve all clean sheets
          </Button>
          <Button variant="primary" icon={<Upload className="h-4 w-4" />} onClick={() => setReading(true)}>Read a timesheet</Button>
        </>
      }
    >
      <StatRow cols={4}>
        <Stat label="Sheets in" value={`${rows.filter((t) => t.status !== "Awaiting").length} of ${rows.length}`} note="Sites with someone on last week" />
        <Stat label="Approved" value={rows.filter((t) => t.status === "Approved").length} note="Ready for payroll" tone="good" />
        <Stat label="Need a look" value={rows.filter((t) => t.status === "Needs review").length} note="A line the reader was not sure of" />
        <Stat label="Hours read" value={hours.toLocaleString("en-GB")} note={`${candidates.filter((c) => c.status === "On assignment").length} people on site`} />
      </StatRow>
      <Panel meta="Timesheets arrive by email and are read automatically. Anything uncertain is flagged rather than guessed.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-[13px]">
            <thead>
              <tr className="border-b border-gborder"><Th>Site</Th><Th>Arrived</Th><Th className="text-right">Workers</Th><Th className="text-right">Hours</Th><Th className="text-right">Confidence</Th><Th>State</Th></tr>
            </thead>
            <tbody className="divide-y divide-gborder">
              {rows.map((t) => (
                <tr key={t.id} className="cursor-pointer hover:bg-gbg" onClick={() => nav(`/crm/timesheets/${t.id}`)}>
                  <Td><p className="font-medium">{siteById(t.siteId).name}</p><p className="text-gmuted">{clientById(t.clientId).name}</p></Td>
                  <Td className="text-gmuted">{t.receivedAt ? <span className="inline-flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" />{t.source}, {t.receivedAt}</span> : "Not yet"}</Td>
                  <Td className="text-right tabular">{t.lines.length}</Td>
                  <Td className="text-right tabular">{t.status === "Awaiting" ? "–" : t.lines.reduce((a, l) => a + total(l.hours), 0)}</Td>
                  <Td className="text-right tabular text-gmuted">{t.confidence ? `${Math.min(99, Math.round(t.confidence * 100))}%` : "–"}</Td>
                  <Td><Badge tone={statusTone(t.status)}>{t.status}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <ReadDialog open={reading} onClose={() => setReading(false)} />
    </Page>
  );
}

const STEPS = ["Reading the sheet", "Matching names to the people on site", "Checking each line adds up", "Attaching the signed copy"];

function ReadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const timesheets = useStore((s) => s.timesheets);
  const nav = useNavigate();
  const waiting = timesheets.filter((t) => t.status === "Awaiting" && t.lines.length);
  const [siteId, setSiteId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const target = waiting.find((t) => t.siteId === siteId) ?? waiting[0];

  const run = (f: File) => {
    setFile(f);
    setStep(0);
    let i = 0;
    const tick = () => {
      i++;
      if (i < STEPS.length) {
        setStep(i);
        setTimeout(tick, 750);
      } else {
        const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
        const source: Timesheet["source"] = ["xlsx", "xls", "csv"].includes(ext) ? "Excel" : ["doc", "docx"].includes(ext) ? "Word" : ext === "pdf" ? "Email PDF" : "Photo";
        updateTimesheet(target.id, (t) => ({ ...t, status: "Received", receivedAt: `Mon ${nowHM()}`, source, confidence: 0.98 }));
        logActivity({ who: "System", kind: "system", text: `Read the ${siteById(target.siteId).name} timesheet: ${target.lines.length} workers matched, all totals agree.`, clientId: target.clientId });
        setStep(STEPS.length);
      }
    };
    setTimeout(tick, 750);
  };

  const close = () => {
    setStep(-1);
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={close} title="Read a timesheet" width={560}>
      {!waiting.length ? (
        <Empty title="Every timesheet is in" body="All sites with workers on last week have sent their sheet." />
      ) : step === -1 ? (
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-[12.5px] font-medium">Which site is it from?</span>
            <select value={target?.siteId} onChange={(e) => setSiteId(e.target.value)} className={inputCls}>
              {waiting.map((t) => (
                <option key={t.id} value={t.siteId}>{siteById(t.siteId).name}, {clientById(t.clientId).name}</option>
              ))}
            </select>
          </label>
          <button
            onClick={() => input.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) run(f);
            }}
            className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-navy/30 bg-gbg px-6 py-10 text-center hover:border-action"
          >
            <Upload className="h-6 w-6 text-action" />
            <span className="text-[13.5px] font-medium text-navy">Drop a timesheet here, or choose a file</span>
            <span className="text-[12.5px] text-gmuted">Phone photo, PDF, Word or Excel</span>
          </button>
          <input ref={input} type="file" className="sr-only" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv" onChange={(e) => e.target.files?.[0] && run(e.target.files[0])} />
          <p className="text-[12px] text-gmuted">Day to day this happens without anyone opening this screen: sheets emailed to the timesheets inbox are read as they land.</p>
        </div>
      ) : (
        <div>
          <p className="mb-4 flex items-center gap-2 text-[13px] text-gmuted"><FileText className="h-4 w-4" />{file?.name}</p>
          <ol className="space-y-3">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-3 text-[13.5px]">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full ${i < step || step === STEPS.length ? "bg-gsuccess text-white" : i === step ? "border-2 border-action" : "border border-gborder"}`}>
                  {i < step || step === STEPS.length ? <Check className="h-3.5 w-3.5" /> : i === step ? <span className="h-2 w-2 animate-pulse rounded-full bg-action" /> : null}
                </span>
                <span className={i <= step ? "text-gfg" : "text-gmuted"}>{s}</span>
              </li>
            ))}
          </ol>
          {step === STEPS.length ? (
            <div className="mt-6 rounded-lg bg-[#e7f4ec] p-4 text-[13px] text-gsuccess">
              <p className="font-medium">{target.lines.length} workers matched, {target.lines.reduce((a, l) => a + total(l.hours), 0)} hours, nothing to check.</p>
              <div className="mt-3 flex gap-2">
                <Button variant="primary" size="sm" onClick={() => { const id = target.id; close(); nav(`/crm/timesheets/${id}`); }}>Open the sheet</Button>
                <Button size="sm" onClick={close}>Done</Button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </Dialog>
  );
}

export function TimesheetDetail() {
  const { id } = useParams();
  const t = useStore((s) => s.timesheets.find((x) => x.id === id));
  const candidates = useStore((s) => s.candidates);
  const [edit, setEdit] = useState<{ li: number; di: number } | null>(null);
  if (!t) return <Page title="Timesheet not found"><Empty title="This timesheet no longer exists" action={<Button to="/crm/timesheets">Back to timesheets</Button>} /></Page>;
  const site = siteById(t.siteId);
  const client = clientById(t.clientId);
  const flags = t.lines.filter((l) => l.flag).length;
  const signer = contacts.find((c) => c.clientId === t.clientId)?.name ?? client.contact;

  const setHour = (li: number, di: number, v: number) =>
    updateTimesheet(t.id, (x) => ({ ...x, lines: x.lines.map((l, i) => (i === li ? { ...l, hours: l.hours.map((h, d) => (d === di ? v : h)), flag: undefined } : l)) }));

  return (
    <Page
      title={site.name}
      context={<><Link to="/crm/timesheets" className="hover:text-gfg">Timesheets</Link> / week ending {fmtDate(t.weekEnding, { day: "numeric", month: "long" })}</>}
      wide
      actions={
        t.status === "Awaiting" ? (
          <Button variant="primary" icon={<Mail className="h-4 w-4" />} onClick={() => { setState((s) => ({ ...s, chased: { ...s.chased, [t.id]: nowHM() } })); toast(`Chaser sent to ${client.invoiceEmail}`); }}>Send chaser</Button>
        ) : t.status === "Approved" ? (
          <Badge tone="green">Approved for payroll</Badge>
        ) : (
          <Button
            variant="primary"
            disabled={flags > 0}
            title={flags ? "Resolve the flagged line first" : undefined}
            onClick={() => {
              updateTimesheet(t.id, (x) => ({ ...x, status: "Approved" }));
              logActivity({ who: "Sam", kind: "note", text: `Approved the ${site.name} timesheet, ${t.lines.reduce((a, l) => a + total(l.hours), 0)} hours.`, clientId: t.clientId });
              toast("Approved and sent to payroll");
            }}
          >
            Approve for payroll
          </Button>
        )
      }
    >
      <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-gmuted">
        <span>{client.name}</span>
        <span>{t.receivedAt ? `${t.source}, arrived ${t.receivedAt}` : "Not arrived yet"}</span>
        {t.confidence ? <span>{Math.min(99, Math.round(t.confidence * 100))}% confidence across the sheet</span> : null}
        <span>{site.po ? `Purchase order ${site.po}` : "No purchase order on file"}</span>
        <Badge tone={statusTone(t.status)}>{t.status}</Badge>
      </div>

      {t.status === "Awaiting" ? (
        <Panel>
          <Empty title="Nothing in from this site yet" body={`${t.lines.length} people worked here last week. A chaser goes to ${client.invoiceEmail} each morning until the sheet arrives.`} />
        </Panel>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,440px)] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
          <Panel title="What the reader found" meta="Click any figure to correct it. Corrections are logged.">
            {flags ? (
              t.lines.map((l, li) =>
                l.flag ? (
                  <div key={li} className="flex flex-wrap items-center gap-3 border-b border-[#f1dfb8] bg-[#fdf8ee] px-5 py-3 text-[13px] text-gwarning">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{fullName(candidates.find((c) => c.id === l.candidateId)!)}: {l.flag}.</span>
                    <Button size="sm" onClick={() => { setHour(li, l.hours.findIndex((h) => h > 24), 9.5); toast("Corrected to 9.5 hours"); }}>Use 9.5</Button>
                  </div>
                ) : null,
              )
            ) : null}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-[13px]">
                <thead>
                  <tr className="border-b border-gborder">
                    <Th>Worker</Th>
                    {DAYS.map((d) => <Th key={d} className="!px-1 text-center">{d}</Th>)}
                    <Th className="text-right">Total</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gborder">
                  {t.lines.map((l, li) => {
                    const w = candidates.find((c) => c.id === l.candidateId)!;
                    return (
                      <tr key={li} className={l.flag ? "bg-[#fdf8ee]" : ""}>
                        <Td className="whitespace-nowrap">
                          <Link to={`/crm/candidates/${w.id}`} className="font-medium hover:underline">{fullName(w)}</Link>
                          <p className="text-[12px] text-gmuted">Sheet says “{w.first[0]}. {w.last}”</p>
                        </Td>
                        {l.hours.map((h, di) => (
                          <Td key={di} className="!px-1 text-center">
                            {edit?.li === li && edit.di === di ? (
                              <input
                                autoFocus
                                type="number"
                                step="0.5"
                                defaultValue={h}
                                onBlur={(e) => { setHour(li, di, Math.max(0, Math.min(24, +e.target.value))); setEdit(null); }}
                                onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                                className="h-7 w-14 rounded border border-action text-center tabular"
                              />
                            ) : (
                              <button
                                onClick={() => t.status !== "Approved" && setEdit({ li, di })}
                                className={`h-7 w-10 rounded tabular ${h > 24 ? "bg-[#f6e2bf] font-semibold text-gwarning" : h ? "hover:bg-gsecondary" : "text-gmuted/50 hover:bg-gsecondary"}`}
                              >
                                {h || "–"}
                              </button>
                            )}
                          </Td>
                        ))}
                        <Td className="text-right font-semibold tabular">{total(l.hours)}</Td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gborder">
                    <Td className="font-medium">Sheet total</Td>
                    {DAYS.map((_, di) => <Td key={di} className="!px-1 text-center tabular text-gmuted">{t.lines.reduce((a, l) => a + l.hours[di], 0) || ""}</Td>)}
                    <Td className="text-right font-semibold tabular">{t.lines.reduce((a, l) => a + total(l.hours), 0)}</Td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="border-t border-gborder px-5 py-3 text-[12.5px] text-gmuted">Signed by {signer} for {client.name}. Signed copy attached to the invoice automatically.</p>
          </Panel>
          <Panel title="Original" meta={t.source === "Photo" ? "Phone photo from site" : t.source === "Excel" ? "Spreadsheet" : "Signed sheet"}>
            <div className="overflow-hidden bg-[#3a3f47] p-6">
              <OriginalSheet t={t} signer={signer} />
            </div>
          </Panel>
        </div>
      )}
    </Page>
  );
}

function OriginalSheet({ t, signer }: { t: Timesheet; signer: string }) {
  const candidates = useStore((s) => s.candidates);
  const site = siteById(t.siteId);
  const client = clientById(t.clientId);
  const hand = (h: number) => (h === 95 ? "9½" : h === 9.5 ? "9½" : h ? String(h).replace(".5", "½") : "");
  if (t.source === "Excel") {
    return (
      <div className="overflow-x-auto rounded bg-white text-[11px] text-[#222] shadow-xl">
        <table className="w-full border-collapse font-[Calibri,Arial,sans-serif]">
          <thead>
            <tr className="bg-[#f3f3f3] text-[#666]">
              <th className="w-6 border border-[#d4d4d4]" />
              {["A", "B", "C", "D", "E", "F", "G", "H", "I"].map((c) => <th key={c} className="border border-[#d4d4d4] px-1 font-normal">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr><td className="border border-[#d4d4d4] bg-[#f3f3f3] text-center text-[#666]">1</td><td colSpan={9} className="border border-[#d4d4d4] px-1.5 py-0.5 font-bold">{client.name} labour timesheet, {site.name}, w/e {fmtDate(t.weekEnding, { day: "2-digit", month: "2-digit", year: "numeric" })}</td></tr>
            <tr><td className="border border-[#d4d4d4] bg-[#f3f3f3] text-center text-[#666]">2</td>{["Name", ...DAYS, "Total"].map((h) => <td key={h} className="border border-[#d4d4d4] bg-[#e2efda] px-1.5 py-0.5 font-bold">{h}</td>)}</tr>
            {t.lines.map((l, i) => {
              const w = candidates.find((c) => c.id === l.candidateId)!;
              return (
                <tr key={i}>
                  <td className="border border-[#d4d4d4] bg-[#f3f3f3] text-center text-[#666]">{i + 3}</td>
                  <td className="whitespace-nowrap border border-[#d4d4d4] px-1.5 py-0.5">{w.first[0]} {w.last}</td>
                  {l.hours.map((h, d) => <td key={d} className="border border-[#d4d4d4] px-1.5 py-0.5 text-right">{h === 95 ? 9.5 : h || ""}</td>)}
                  <td className="border border-[#d4d4d4] px-1.5 py-0.5 text-right font-bold">{l.hours.reduce((a, b) => a + (b === 95 ? 9.5 : b), 0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
  const photo = t.source === "Photo";
  return (
    <div
      className="relative mx-auto max-w-[500px] rounded-[2px] bg-[#fbfaf6] p-6 text-[#1d1d1d] shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
      style={{ transform: photo ? "perspective(1200px) rotateX(4deg) rotateZ(-1.6deg)" : "rotateZ(-0.4deg)", backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.04))" }}
    >
      <div className="flex items-start justify-between border-b-2 border-[#1d1d1d] pb-2">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-wide">{client.name}</p>
          <p className="text-[10px]">Weekly labour timesheet</p>
        </div>
        <div className="text-right text-[10px] leading-tight">
          <p>Site: <span className="font-hand text-[15px] text-[#1f3a8a]">{site.name.split(",")[0]}</span></p>
          <p>W/E: <span className="font-hand text-[15px] text-[#1f3a8a]">{fmtDate(t.weekEnding, { day: "2-digit", month: "2-digit", year: "2-digit" })}</span></p>
        </div>
      </div>
      <p className="mt-2 text-[9.5px]">Agency: <span className="font-hand text-[14px] text-[#1f3a8a]">DRC</span></p>
      <table className="mt-2 w-full border-collapse text-[9.5px]">
        <thead>
          <tr>
            <th className="border border-[#1d1d1d] px-1 py-0.5 text-left">Name</th>
            {DAYS.map((d) => <th key={d} className="w-[9%] border border-[#1d1d1d] px-0.5 py-0.5">{d}</th>)}
            <th className="border border-[#1d1d1d] px-0.5 py-0.5">Tot</th>
          </tr>
        </thead>
        <tbody>
          {t.lines.map((l, i) => {
            const w = candidates.find((c) => c.id === l.candidateId)!;
            const tot = l.hours.reduce((a, b) => a + (b === 95 ? 9.5 : b), 0);
            return (
              <tr key={i} className="h-[24px]">
                <td className="whitespace-nowrap border border-[#1d1d1d] px-1 font-hand text-[15px] leading-none text-[#1f3a8a]">{w.first[0]}. {w.last}</td>
                {l.hours.map((h, d) => <td key={d} className="border border-[#1d1d1d] text-center font-hand text-[16px] leading-none text-[#1f3a8a]">{hand(h)}</td>)}
                <td className="border border-[#1d1d1d] text-center font-hand text-[16px] leading-none text-[#1f3a8a]">{String(tot).replace(".5", "½")}</td>
              </tr>
            );
          })}
          {Array.from({ length: Math.max(0, 7 - t.lines.length) }).map((_, i) => (
            <tr key={`e${i}`} className="h-[24px]">{Array.from({ length: 9 }).map((__, d) => <td key={d} className="border border-[#1d1d1d]" />)}</tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 grid grid-cols-2 gap-4 text-[9.5px]">
        <div>
          <p>Authorised by</p>
          <p className="mt-0.5 border-b border-[#1d1d1d] font-hand text-[22px] leading-none text-[#1f3a8a]">{signer.split(" ").map((p, i) => (i === 0 ? p[0] + "." : p)).join(" ")}</p>
        </div>
        <div>
          <p>Position</p>
          <p className="mt-0.5 border-b border-[#1d1d1d] font-hand text-[16px] leading-none text-[#1f3a8a]">{contacts.find((c) => c.name === signer)?.role ?? "Site manager"}</p>
        </div>
      </div>
      {photo ? <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_10%,rgba(255,255,255,0.18),transparent_60%),radial-gradient(90%_70%_at_90%_100%,rgba(0,0,0,0.12),transparent_70%)]" /> : null}
    </div>
  );
}

export function ChaseBoard() {
  const timesheets = useStore((s) => s.timesheets);
  const chased = useStore((s) => s.chased);
  const [poFor, setPoFor] = useState<string | null>(null);
  const [po, setPo] = useState("");
  const [pos, setPos] = useState<Record<string, string>>({});
  const rows = timesheets.filter((t) => t.lines.length);
  const outstanding = rows.filter((t) => t.status === "Awaiting");
  const noPo = useMemo(() => sites.filter((s) => !s.po && !pos[s.id] && assignments.some((a) => a.siteId === s.id)), [pos]);

  const chase = (ids: string[]) => {
    const at = nowHM();
    setState((s) => ({ ...s, chased: { ...s.chased, ...Object.fromEntries(ids.map((i) => [i, at])) } }));
    toast(ids.length > 1 ? `${ids.length} chasers sent` : "Chaser sent");
  };

  return (
    <Page
      title="Chase board"
      context="Week ending Sunday 11 October. Who still owes a timesheet, worked out from who was on site."
      actions={<Button variant="primary" disabled={!outstanding.filter((t) => !chased[t.id]).length} onClick={() => chase(outstanding.filter((t) => !chased[t.id]).map((t) => t.id))}>Chase all outstanding</Button>}
    >
      <StatRow cols={3}>
        <Stat label="Expected" value={rows.length} note="Sites with workers on last week" />
        <Stat label="Received" value={rows.length - outstanding.length} tone="good" />
        <Stat label="Still owed" value={outstanding.length} tone={outstanding.length ? "danger" : undefined} note={outstanding.length ? `${outstanding.reduce((a, t) => a + t.lines.length, 0)} workers cannot be paid until they arrive` : "All in"} />
      </StatRow>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Panel>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-[13px]">
              <thead><tr className="border-b border-gborder"><Th>Client and site</Th><Th>Purchase order</Th><Th className="text-right">On site</Th><Th>Timesheet</Th><Th className="text-right" /></tr></thead>
              <tbody className="divide-y divide-gborder">
                {rows
                  .slice()
                  .sort((a, b) => Number(b.status === "Awaiting") - Number(a.status === "Awaiting"))
                  .map((t) => {
                    const s = siteById(t.siteId);
                    return (
                      <tr key={t.id} className={t.status === "Awaiting" ? "bg-[#fffaf3]" : ""}>
                        <Td><p className="font-medium">{s.name}</p><p className="text-gmuted">{clientById(t.clientId).name}</p></Td>
                        <Td className="tabular text-gmuted">{s.po ?? pos[s.id] ?? <Badge tone="amber">None</Badge>}</Td>
                        <Td className="text-right tabular">{t.lines.length}</Td>
                        <Td>{t.status === "Awaiting" ? <span className="text-gwarning">{chased[t.id] ? `Chased at ${chased[t.id]}` : "Not received"}</span> : <span className="text-gsuccess">In, {t.receivedAt}</span>}</Td>
                        <Td className="text-right">
                          {t.status === "Awaiting" ? (
                            <Button size="sm" disabled={!!chased[t.id]} onClick={() => chase([t.id])}>{chased[t.id] ? "Chased" : "Chase"}</Button>
                          ) : (
                            <Link to={`/crm/timesheets/${t.id}`} className="text-[12.5px] font-medium text-action hover:underline">Open</Link>
                          )}
                        </Td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Waiting on a purchase order" meta="Invoices for these sites will be held until a PO is added">
          {noPo.length ? (
            <ul className="divide-y divide-gborder">
              {noPo.map((s) => (
                <li key={s.id} className="px-5 py-3 text-[13px]">
                  <div className="flex items-center justify-between gap-3">
                    <div><p className="font-medium">{s.name}</p><p className="text-gmuted">{clientById(s.clientId).name}</p></div>
                    {poFor !== s.id ? <Button size="sm" onClick={() => { setPoFor(s.id); setPo(""); }}>Add PO</Button> : null}
                  </div>
                  {poFor === s.id ? (
                    <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!po.trim()) return; setPos((p) => ({ ...p, [s.id]: po.trim() })); setPoFor(null); toast("Purchase order saved"); }}>
                      <input autoFocus value={po} onChange={(e) => setPo(e.target.value)} placeholder="PO number" className={inputCls} />
                      <Button type="submit" variant="primary" size="sm">Save</Button>
                    </form>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="Every site has a PO" />
          )}
        </Panel>
      </div>
    </Page>
  );
}
