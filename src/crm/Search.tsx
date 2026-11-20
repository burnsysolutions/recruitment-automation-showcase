import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Bookmark } from "lucide-react";
import { useStore, TRADES, CONSULTANTS, sites, fullName, logActivity, siteById } from "../data/store";
import { TOWNS } from "../data/seed";
import { Page, Panel, Button, Badge, statusTone, inputCls, Select, Field, Th, Td, Empty, toast, Avatar } from "./ui";
import { CardBadge, cardState } from "./bits";
import { miles, fmtDate } from "../data/match";

interface Criteria {
  text: string;
  trades: string[];
  near: string;
  radius: number;
  statuses: string[];
  inDate: boolean;
  minShifts: number;
  source: string;
  owner: string;
}
const blank: Criteria = { text: "", trades: [], near: "", radius: 20, statuses: ["Available", "Available from"], inDate: true, minShifts: 0, source: "Any", owner: "Any" };

const SAVED: { name: string; c: Criteria }[] = [
  { name: "Groundworkers near Shoreham", c: { ...blank, trades: ["Groundworker", "Pipelayer"], near: "site:s03", radius: 20 } },
  { name: "Approved sparks, Crawley", c: { ...blank, trades: ["Electrician (approved)"], near: "site:s09", radius: 25 } },
  { name: "Reliable regulars", c: { ...blank, minShifts: 100, statuses: [] } },
];

function point(near: string) {
  if (!near) return null;
  if (near.startsWith("site:")) {
    const s = siteById(near.slice(5));
    return { lat: s.lat, lng: s.lng, label: s.name };
  }
  const t = TOWNS.find((x) => x[0] === near);
  return t ? { lat: t[2], lng: t[3], label: t[0] } : null;
}

export function SearchPage() {
  const candidates = useStore((s) => s.candidates);
  const nav = useNavigate();
  const [c, setC] = useState<Criteria>(blank);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const set = <K extends keyof Criteria>(k: K, v: Criteria[K]) => setC((x) => ({ ...x, [k]: v }));
  const toggleIn = (k: "trades" | "statuses", v: string) => set(k, c[k].includes(v) ? c[k].filter((x) => x !== v) : [...c[k], v]);

  const p = point(c.near);
  const rows = useMemo(() => {
    const t = c.text.toLowerCase();
    return candidates
      .map((x) => ({ x, d: p ? miles(x, p) : null }))
      .filter(({ x, d }) => {
        if (t && !`${x.first} ${x.last} ${x.trade} ${x.notes ?? ""} ${x.postcode}`.toLowerCase().includes(t)) return false;
        if (c.trades.length && !c.trades.includes(x.trade)) return false;
        if (c.statuses.length && !c.statuses.includes(x.status)) return false;
        if (c.inDate && cardState(x).tone === "red") return false;
        if (x.shiftsWorked < c.minShifts) return false;
        if (c.source !== "Any" && x.source !== c.source) return false;
        if (c.owner !== "Any" && x.owner !== c.owner) return false;
        if (d !== null && d > c.radius) return false;
        return true;
      })
      .sort((a, b) => (a.d ?? 0) - (b.d ?? 0) || b.x.shiftsWorked - a.x.shiftsWorked);
  }, [candidates, c, p]);

  return (
    <Page title="Search" context="Find the right people by trade, distance and history">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-[12.5px] text-gmuted">Saved</span>
        {SAVED.map((s) => (
          <button key={s.name} onClick={() => { setC(s.c); setSel(new Set()); }} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-gborder bg-white px-3 text-[12.5px] text-navy hover:border-navy/35">
            <Bookmark className="h-3.5 w-3.5 text-gmuted" />
            {s.name}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Panel pad className="h-fit lg:sticky lg:top-20">
          <div className="space-y-5">
            <Field label="Keywords"><input value={c.text} onChange={(e) => set("text", e.target.value)} placeholder="Name, skill, postcode" className={inputCls} /></Field>
            <div>
              <p className="mb-1.5 text-[12.5px] font-medium">Trade</p>
              <div className="max-h-[200px] space-y-1 overflow-y-auto pr-1">
                {TRADES.map((t) => (
                  <label key={t.trade} className="flex items-center gap-2 text-[13px]">
                    <input type="checkbox" checked={c.trades.includes(t.trade)} onChange={() => toggleIn("trades", t.trade)} className="h-3.5 w-3.5 accent-[#002149]" />
                    {t.trade}
                  </label>
                ))}
              </div>
            </div>
            <Field label="Near">
              <Select value={c.near} onChange={(v) => set("near", v)} options={[["", "Anywhere"], ...sites.map((s) => [`site:${s.id}`, `Site: ${s.name}`] as [string, string]), ...TOWNS.map((t) => [t[0], t[0]] as [string, string])]} />
            </Field>
            {c.near ? (
              <Field label={`Within ${c.radius} miles`}>
                <input type="range" min={5} max={50} step={5} value={c.radius} onChange={(e) => set("radius", +e.target.value)} className="w-full accent-[#002149]" />
              </Field>
            ) : null}
            <div>
              <p className="mb-1.5 text-[12.5px] font-medium">Status</p>
              {["Available", "Available from", "On assignment", "Not looking"].map((s) => (
                <label key={s} className="flex items-center gap-2 text-[13px]">
                  <input type="checkbox" checked={c.statuses.includes(s)} onChange={() => toggleIn("statuses", s)} className="h-3.5 w-3.5 accent-[#002149]" />
                  {s}
                </label>
              ))}
            </div>
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={c.inDate} onChange={(e) => set("inDate", e.target.checked)} className="h-3.5 w-3.5 accent-[#002149]" />
              Cards in date only
            </label>
            <Field label="Shifts with you, at least"><input type="number" min={0} value={c.minShifts} onChange={(e) => set("minShifts", Math.max(0, +e.target.value))} className={inputCls} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Source"><Select value={c.source} onChange={(v) => set("source", v)} options={["Any", "Website", "Referral", "Indeed", "Returning worker", "Facebook", "Walk-in"]} /></Field>
              <Field label="Owner"><Select value={c.owner} onChange={(v) => set("owner", v)} options={["Any", ...CONSULTANTS]} /></Field>
            </div>
            <Button className="w-full" onClick={() => { setC(blank); setSel(new Set()); }}>Clear all</Button>
          </div>
        </Panel>

        <Panel>
          <div className="flex flex-wrap items-center gap-2 border-b border-gborder px-5 py-3">
            <p className="text-[13px]"><span className="font-semibold tabular text-navy">{rows.length}</span> <span className="text-gmuted">people{p ? ` within ${c.radius} miles of ${p.label}` : ""}</span></p>
            <div className="ml-auto flex flex-wrap gap-2">
              <Button size="sm" disabled={!sel.size} onClick={() => { toast(`Availability check texted to ${sel.size} people`); logActivity({ who: "Sam", kind: "sms", text: `Availability check texted to ${sel.size} candidates from a search.` }); setSel(new Set()); }}>Text selected</Button>
              <Button size="sm" disabled={!rows.length} onClick={() => nav(`/crm/mailshots?ids=${(sel.size ? [...sel] : rows.map((r) => r.x.id)).join(",")}`)}>
                {sel.size ? `Email ${sel.size} selected` : `Email all ${rows.length}`}
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-[13px]">
              <thead>
                <tr className="border-b border-gborder">
                  <Th className="w-10"><input type="checkbox" aria-label="Select all" checked={rows.length > 0 && rows.every((r) => sel.has(r.x.id))} onChange={(e) => setSel(e.target.checked ? new Set(rows.map((r) => r.x.id)) : new Set())} /></Th>
                  <Th>Name</Th><Th>Trade</Th><Th>Status</Th><Th>Cards</Th><Th className="text-right">Shifts</Th><Th className="text-right">{p ? "Miles" : "Lives"}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gborder">
                {rows.slice(0, 150).map(({ x, d }) => (
                  <tr key={x.id} className="hover:bg-gbg">
                    <Td className="w-10"><input type="checkbox" aria-label={`Select ${fullName(x)}`} checked={sel.has(x.id)} onChange={() => setSel((s) => { const n = new Set(s); if (n.has(x.id)) n.delete(x.id); else n.add(x.id); return n; })} /></Td>
                    <Td><Link to={`/crm/candidates/${x.id}`} className="flex items-center gap-2.5 font-medium hover:underline"><Avatar name={fullName(x)} size={26} />{fullName(x)}</Link></Td>
                    <Td>{x.trade}</Td>
                    <Td><Badge tone={statusTone(x.status)}>{x.status === "Available from" ? `From ${fmtDate(x.availableFrom)}` : x.status}</Badge></Td>
                    <Td><CardBadge c={x} /></Td>
                    <Td className="text-right tabular">{x.shiftsWorked || "–"}</Td>
                    <Td className="text-right tabular text-gmuted">{d !== null ? d.toFixed(1) : x.town}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length ? <Empty title="No one matches" body="Widen the distance or untick a status." /> : null}
          </div>
        </Panel>
      </div>
    </Page>
  );
}
