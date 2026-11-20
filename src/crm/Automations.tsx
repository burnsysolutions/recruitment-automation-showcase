import { asset } from "../lib/asset";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Send, Wifi, BatteryFull, Signal, Mail, MessageSquareText, ShieldCheck } from "lucide-react";
import { useStore, setState, getState, fullName, logActivity, nowHM, prospects, updateCandidate } from "../data/store";
import { Page, Panel, Button, Badge, statusTone, Th, Td, Empty, toast, StatRow, Stat, Tabs, Avatar } from "./ui";
import { fmtDate, miles, cardInDate } from "../data/match";
import { CardBadge } from "./bits";
import { MapView, type Pin } from "./MapView";
import { TODAY } from "../data/seed";
import type { AvailabilityMsg } from "../data/extra";

// ---------------- Availability ----------------
const ANSWERS: NonNullable<AvailabilityMsg["answer"]>[] = ["Available now", "Available now", "Available now", "Working at the moment", "Available from", "Not looking"];

export function Availability() {
  const log = useStore((s) => s.availability);
  const candidates = useStore((s) => s.candidates);
  const [running, setRunning] = useState(false);
  const answered = log.filter((m) => m.answer);
  const free = answered.filter((m) => m.answer === "Available now").length;
  const sample = candidates.find((c) => c.id === log[0]?.candidateId) ?? candidates[0];

  const run = () => {
    const sent = new Set(getState().availability.map((m) => m.candidateId));
    const due = getState()
      .candidates.filter((c) => c.status !== "On assignment" && !sent.has(c.id) && (TODAY.getTime() - new Date(c.lastContact).getTime()) / 86400000 > 30)
      .slice(0, 12);
    if (!due.length) {
      toast("Everyone due a check has had one");
      return;
    }
    setRunning(true);
    const at = `Mon ${nowHM()}`;
    // each person gets the check the way they asked to be contacted
    const msgs: AvailabilityMsg[] = due.map((c, i) => ({ id: `av${Date.now()}${i}`, candidateId: c.id, sentAt: at, channel: i % 3 === 2 ? "Email" : "SMS" }));
    const emails = msgs.filter((m) => m.channel === "Email").length;
    setState((s) => ({ ...s, availability: [...msgs, ...s.availability] }));
    logActivity({ who: "System", kind: "sms", text: `Availability check sent to ${due.length} people not heard from in over a month: ${due.length - emails} by text, ${emails} by email.` });
    toast(`${due.length - emails} texts and ${emails} emails sent`);
    msgs.forEach((m, i) => {
      if (i % 5 === 4) return; // some never reply
      window.setTimeout(() => {
        const ans = ANSWERS[(i * 7) % ANSWERS.length];
        const from = ans === "Available from" || ans === "Working at the moment" ? new Date(TODAY.getTime() + (ans === "Available from" ? 5 + i : 21) * 86400000).toISOString().slice(0, 10) : undefined;
        setState((s) => ({ ...s, availability: s.availability.map((x) => (x.id === m.id ? { ...x, answer: ans, from, answeredAt: `Mon ${nowHM()}` } : x)) }));
        updateCandidate(m.candidateId, {
          status: ans === "Available now" ? "Available" : ans === "Not looking" ? "Not looking" : "Available from",
          availableFrom: from,
          lastContact: TODAY.toISOString().slice(0, 10),
        });
        if (i === msgs.length - 1 || i === msgs.length - 2) setRunning(false);
      }, 1400 + i * 650);
    });
    window.setTimeout(() => setRunning(false), 1400 + msgs.length * 650 + 400);
  };

  return (
    <Page
      title="Availability"
      context="A one-tap text or email to people you have not heard from, so the database stays current without anyone ringing round"
      actions={<Button variant="primary" icon={<Send className="h-4 w-4" />} onClick={run} disabled={running}>{running ? "Replies coming in" : "Run this morning's check"}</Button>}
    >
      <StatRow cols={4}>
        <Stat label="Checked this week" value={log.length} note={`${log.filter((m) => m.channel === "Email").length} by email, the rest by text`} />
        <Stat label="Replied" value={answered.length} note={`${Math.round((answered.length / Math.max(1, log.length)) * 100)}% reply rate`} />
        <Stat label="Free now" value={free} tone="good" note="Status updated automatically" />
        <Stat label="Opted out" value={1} note="STOP replies are honoured straight away" />
      </StatRow>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Replies" meta="Each answer updates the candidate record and the shortlists">
          <div className="max-h-[620px] overflow-auto">
            <table className="w-full min-w-[640px] text-[13px]">
              <thead className="sticky top-0 bg-white"><tr className="border-b border-gborder"><Th>Name</Th><Th>Trade</Th><Th>Sent</Th><Th>Answer</Th></tr></thead>
              <tbody className="divide-y divide-gborder">
                {log.map((m) => {
                  const c = candidates.find((x) => x.id === m.candidateId);
                  if (!c) return null;
                  return (
                    <tr key={m.id}>
                      <Td><Link to={`/crm/candidates/${c.id}`} className="flex items-center gap-2.5 font-medium hover:underline"><Avatar name={fullName(c)} size={26} />{fullName(c)}</Link></Td>
                      <Td className="text-gmuted">{c.trade}</Td>
                      <Td className="whitespace-nowrap text-gmuted">{m.channel}, {m.sentAt}</Td>
                      <Td>
                        {m.answer ? (
                          <span className="flex items-center gap-2">
                            <Badge tone={m.answer === "Available now" ? "green" : m.answer === "Available from" ? "amber" : "grey"}>{m.answer === "Available from" ? `From ${fmtDate(m.from)}` : m.answer}</Badge>
                            <span className="text-[12px] text-gmuted">{m.answeredAt}</span>
                          </span>
                        ) : (
                          <span className="text-gmuted">No reply yet</span>
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="What they receive" pad>
          <Phone name={sample.first} />
          <p className="mt-4 text-[12.5px] leading-[1.5] text-gmuted">Sent between 9am and 6pm, never more than once a fortnight to the same person. The link works once and expires after seven days.</p>
        </Panel>
      </div>
    </Page>
  );
}

function Phone({ name }: { name: string }) {
  const [view, setView] = useState<"sms" | "email" | "form">("sms");
  const [pick, setPick] = useState("Available for work");
  return (
    <div>
    <div className="mb-4 flex justify-center gap-1 rounded-lg bg-gsecondary p-1 text-[12.5px]">
      {([["sms", "Text", MessageSquareText], ["email", "Email", Mail]] as const).map(([k, l, I]) => (
        <button key={k} onClick={() => setView(k)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 font-medium ${view === k || (k === "sms" && view === "form") ? "bg-white text-navy shadow-sm" : "text-gmuted"}`}>
          <I className="h-3.5 w-3.5" /> {l}
        </button>
      ))}
    </div>
    <div className="mx-auto w-[260px] rounded-[38px] bg-[#111] p-2.5 shadow-[0_20px_40px_rgba(10,16,29,0.25)]">
      <div className="overflow-hidden rounded-[30px] bg-white">
        <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[11px] font-semibold text-black">
          <span>9:41</span>
          <span className="flex items-center gap-1"><Signal className="h-3 w-3" /><Wifi className="h-3 w-3" /><BatteryFull className="h-3.5 w-3.5" /></span>
        </div>
        {view === "email" ? (
          <div className="flex h-[420px] flex-col bg-white px-3 pb-4 text-black">
            <div className="border-b border-black/5 pb-2">
              <p className="text-[13px] font-semibold">Demo Recruitment Co</p>
              <p className="text-[11px] text-black/50">To {name} · Today 08:30</p>
              <p className="mt-1.5 text-[13px] font-semibold leading-snug">{name}, are you free for work next week?</p>
            </div>
            <div className="pt-3">
              <img src={asset("/brand/agency-logo.svg")} alt="" className="h-6 w-auto" />
              <p className="mt-3 text-[12.5px] leading-[1.45]">Hi {name}, we have work coming up near you. Tap the one that fits and we will do the rest.</p>
              <div className="mt-3 space-y-1.5">
                {["I'm available now", "Available from a date", "Working at the moment", "Not looking just now"].map((o, i) => (
                  <button key={o} onClick={() => toast("Reply recorded")} className={`block w-full rounded-lg py-2 text-[12px] font-semibold ${i === 0 ? "bg-[#DE1314] text-white" : "border border-black/15"}`}>{o}</button>
                ))}
              </div>
              <p className="mt-3 text-[10px] text-black/40">Demo Recruitment Co, 1 Example Street, Brighton. Unsubscribe</p>
            </div>
          </div>
        ) : view === "sms" ? (
          <div className="flex h-[420px] flex-col bg-white px-3 pb-4">
            <p className="border-b border-black/5 pb-2 text-center text-[11px] text-black/60">Demo Recruitment Co</p>
            <div className="mt-auto max-w-[85%] rounded-2xl rounded-bl-md bg-[#e9e9eb] px-3 py-2 text-[12.5px] leading-[1.4] text-black">
              Hi {name}, it's Sam at Demo Recruitment Co. Are you free for work at the moment? Takes 10 seconds:{" "}
              <button onClick={() => setView("form")} className="text-[#0a66d8] underline">demo-recruitment.example/a/7Hq2</button>
              <br />Reply STOP to opt out.
            </div>
            <p className="mt-1 text-[10px] text-black/40">Today 08:30</p>
          </div>
        ) : (
          <div className="h-[420px] bg-white px-4 pb-4 pt-2 text-black">
            <img src={asset("/brand/agency-logo.svg")} alt="Demo Recruitment Co" className="h-7 w-auto" />
            <p className="mt-4 text-[17px] font-semibold leading-tight">Are you available for work?</p>
            <p className="mt-1 text-[12px] text-black/60">Where are you at the moment?</p>
            <div className="mt-3 space-y-2">
              {["Available for work", "Working at the moment", "Not looking just now", "Available from a date"].map((o) => (
                <label key={o} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[12.5px] ${pick === o ? "border-black" : "border-black/15"}`}>
                  <input type="radio" name="av" checked={pick === o} onChange={() => setPick(o)} className="accent-black" />
                  {o}
                </label>
              ))}
            </div>
            <button onClick={() => { setView("sms"); toast("Reply recorded"); }} className="mt-4 w-full rounded-lg bg-black py-2.5 text-[13px] font-semibold text-white">Send</button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

// ---------------- Compliance ----------------
export function Compliance() {
  const candidates = useStore((s) => s.candidates);
  const renewals = useStore((s) => s.renewals);
  const [tab, setTab] = useState("attention");
  const soon = (d: number) => new Date(TODAY.getTime() + d * 86400000);
  const rows = useMemo(
    () =>
      candidates
        .flatMap((c) => c.cards.map((k) => ({ c, k, exp: new Date(k.expires) })))
        .sort((a, b) => +a.exp - +b.exp),
    [candidates],
  );
  const expiredOnSite = rows.filter((r) => r.exp < TODAY && r.c.status === "On assignment");
  const expired = rows.filter((r) => r.exp < TODAY);
  const in30 = rows.filter((r) => r.exp >= TODAY && r.exp < soon(30));
  const in90 = rows.filter((r) => r.exp >= TODAY && r.exp < soon(90));
  const list = tab === "attention" ? [...expired, ...in30] : tab === "90" ? in90 : rows;

  return (
    <Page title="Compliance" context="Every card read from its photo, dated, and watched. Reminders go out at 60, 30 and 14 days.">
      <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-gborder bg-white px-5 py-3 text-[13px]">
        <span className="flex items-center gap-2 font-medium text-navy">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gsuccess opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gsuccess" />
          </span>
          <ShieldCheck className="h-4 w-4" /> Watching {rows.length} cards for {candidates.length} people
        </span>
        <span className="text-gmuted">Last full check today 06:00, next at 18:00</span>
        <span className="text-gmuted">Expired cards are kept off every shortlist automatically</span>
      </div>
      <StatRow cols={4}>
        <Stat label="On site with an expired card" value={expiredOnSite.length} tone={expiredOnSite.length ? "danger" : "good"} note="Hours held at payroll" />
        <Stat label="Expired, not on site" value={expired.length - expiredOnSite.length} note="Left out of shortlists" />
        <Stat label="Expiring in 30 days" value={in30.length} />
        <Stat label="Cards on file" value={rows.length} note={`${candidates.filter((c) => c.rtw === "Verified").length} right to work checks done`} />
      </StatRow>
      <Panel>
        <div className="px-5 pt-3">
          <Tabs value={tab} onChange={setTab} tabs={[["attention", "Needs action", expired.length + in30.length], ["90", "Next 90 days", in90.length], ["all", "All cards", rows.length]]} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-[13px]">
            <thead><tr className="border-b border-gborder"><Th>Name</Th><Th>Card</Th><Th>Number</Th><Th>Expires</Th><Th>Working</Th><Th className="text-right" /></tr></thead>
            <tbody className="divide-y divide-gborder">
              {list.slice(0, 200).map(({ c, k, exp }) => {
                const bad = exp < TODAY;
                return (
                  <tr key={c.id + k.number} className={bad && c.status === "On assignment" ? "bg-[#fdf3f2]" : ""}>
                    <Td><Link to={`/crm/candidates/${c.id}`} className="font-medium hover:underline">{fullName(c)}</Link><p className="text-gmuted">{c.trade}</p></Td>
                    <Td>{k.scheme} <span className="text-gmuted">{k.level}</span></Td>
                    <Td className="tabular text-gmuted">{k.number}</Td>
                    <Td><Badge tone={bad ? "red" : exp < soon(30) ? "amber" : "green"}>{bad ? "Expired " : ""}{fmtDate(k.expires, { day: "numeric", month: "short", year: "numeric" })}</Badge></Td>
                    <Td><Badge tone={statusTone(c.status)}>{c.status === "On assignment" ? "On site" : c.status}</Badge></Td>
                    <Td className="text-right">
                      {bad || exp < soon(60) ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" disabled={!!renewals[c.id]} onClick={() => { setState((s) => ({ ...s, renewals: { ...s.renewals, [c.id]: nowHM() } })); toast(`Renewal link texted to ${c.first}`); }}>{renewals[c.id] ? `Sent ${renewals[c.id]}` : "Text renewal link"}</Button>
                          <Button size="sm" variant="ghost" onClick={() => { updateCandidate(c.id, { cards: c.cards.map((x) => (x.number === k.number ? { ...x, expires: "2031-10-31" } : x)) }); toast("New card recorded, expires Oct 2031"); }}>New card in</Button>
                        </div>
                      ) : null}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!list.length ? <Empty title="Nothing needs action" body="Every card on file is in date for at least 30 days." /> : null}
        </div>
      </Panel>
    </Page>
  );
}

// ---------------- Prospects ----------------
export function Prospects() {
  const candidates = useStore((s) => s.candidates);
  const newIds = useStore((s) => s.newCandidates);
  const [sel, setSel] = useState(prospects[0].id);
  const [sent, setSent] = useState<Record<string, boolean>>({});
  const p = prospects.find((x) => x.id === sel)!;
  const near = (pr: typeof p) =>
    candidates
      .filter((c) => pr.trades.includes(c.trade) && (c.status === "Available" || c.status === "Available from") && cardInDate(c))
      .map((c) => ({ c, d: miles(c, pr) }))
      .filter((x) => x.d <= 30)
      .sort((a, b) => a.d - b.d);
  const list = near(p);
  const pins: Pin[] = [
    ...prospects.map((x) => ({ id: x.id, lat: x.lat, lng: x.lng, kind: "prospect" as const, label: `${x.company}, ${x.site}` })),
    ...list.map((x, i) => ({ id: x.c.id, lat: x.c.lat, lng: x.c.lng, kind: "person" as const, label: `${fullName(x.c)}, ${x.c.trade}, ${x.d.toFixed(1)} mi`, rank: i < 9 ? i + 1 : undefined })),
  ];
  const alerts = newIds
    .map((id) => candidates.find((c) => c.id === id))
    .filter(Boolean)
    .flatMap((c) => prospects.filter((pr) => pr.trades.includes(c!.trade) && miles(c!, pr) <= 35).map((pr) => ({ c: c!, pr, d: miles(c!, pr) })));

  return (
    <Page title="Prospects" context="Sites you want to win, and the free people who could start there. You are told when a good match appears.">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel title="Prospect sites">
            <ul className="divide-y divide-gborder">
              {prospects.map((x) => (
                <li key={x.id}>
                  <button onClick={() => setSel(x.id)} className={`block w-full px-5 py-3.5 text-left text-[13px] ${sel === x.id ? "bg-action-tint" : "hover:bg-gbg"}`}>
                    <p className="font-medium">{x.company}</p>
                    <p className="text-gmuted">{x.site}, {x.town}</p>
                    <p className="mt-1 text-[12px] text-navy">{near(x).length} free people within 30 miles</p>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Recent alerts">
            {alerts.length ? (
              <ul className="divide-y divide-gborder">
                {alerts.map((a) => (
                  <li key={a.c.id + a.pr.id} className="px-5 py-3 text-[13px]">
                    <p><Link to={`/crm/candidates/${a.c.id}`} className="font-medium hover:underline">{fullName(a.c)}</Link> registered, {a.c.trade.toLowerCase()}</p>
                    <p className="text-gmuted">{a.d.toFixed(0)} miles from {a.pr.company}, {a.pr.site}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-4 text-[13px] text-gmuted">No new matches since Friday.</p>
            )}
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel>
            <MapView pins={pins} height={320} />
          </Panel>
          <Panel
            title={`${p.company}, ${p.site}`}
            meta={p.note}
            actions={
              <Button
                variant="primary"
                disabled={!list.length || sent[p.id]}
                onClick={() => {
                  setSent((x) => ({ ...x, [p.id]: true }));
                  logActivity({ who: "Sam", kind: "email", text: `Sent ${p.company} an introduction with ${Math.min(6, list.length)} available people for ${p.site}.` });
                  toast(`Introduction sent to ${p.company}`);
                }}
              >
                {sent[p.id] ? "Introduction sent" : "Send an introduction"}
              </Button>
            }
          >
            <p className="border-b border-gborder px-5 py-2.5 text-[12.5px] text-gmuted">Wanted: {p.trades.join(", ")}</p>
            {list.length ? (
              <div className="overflow-x-auto">
              <table className="w-full min-w-[460px] text-[13px]">
                <thead><tr className="border-b border-gborder"><Th>Name</Th><Th>Trade</Th><Th>Cards</Th><Th className="text-right">Miles</Th></tr></thead>
                <tbody className="divide-y divide-gborder">
                  {list.slice(0, 12).map(({ c, d }) => (
                    <tr key={c.id}>
                      <Td><Link to={`/crm/candidates/${c.id}`} className="font-medium hover:underline">{fullName(c)}</Link></Td>
                      <Td className="text-gmuted">{c.trade}</Td>
                      <Td><CardBadge c={c} /></Td>
                      <Td className="text-right tabular">{d.toFixed(1)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            ) : (
              <Empty title="No one free within 30 miles" />
            )}
          </Panel>
        </div>
      </div>
    </Page>
  );
}

