import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { Download, Lock, Hammer } from "lucide-react";
import { useStore, setState, assignments, siteById, clientById, fullName, logActivity } from "../data/store";
import { Page, Panel, Button, Badge, Th, Td, Empty, toast, StatRow, Stat } from "./ui";
import { gbp, fmtDate } from "../data/match";
import { cardState } from "./bits";
import { LAST_WEEK_ENDING } from "../data/seed";
import type { PayLine } from "../data/extra";

const sum = (h: number[]) => h.reduce((a, b) => a + b, 0);

export function usePayCalc() {
  const timesheets = useStore((s) => s.timesheets);
  const candidates = useStore((s) => s.candidates);
  return useMemo(() => {
    const lines: PayLine[] = [];
    const held: { candidateId: string; siteId: string; hours: number; reason: string }[] = [];
    const notIn: { id: string; siteId: string; workers: number; reason: string }[] = [];
    timesheets
      .filter((t) => t.weekEnding === LAST_WEEK_ENDING && t.lines.length)
      .forEach((t) => {
        if (t.status !== "Approved") {
          notIn.push({ id: t.id, siteId: t.siteId, workers: t.lines.length, reason: t.status === "Awaiting" ? "Timesheet not received" : t.status === "Needs review" ? "A line needs checking" : "Read, waiting for approval" });
          return;
        }
        t.lines.forEach((l) => {
          const c = candidates.find((x) => x.id === l.candidateId)!;
          const a = assignments.find((x) => x.candidateId === l.candidateId)!;
          const hours = sum(l.hours);
          if (cardState(c).tone === "red") held.push({ candidateId: c.id, siteId: t.siteId, hours, reason: `${c.cards[0].scheme} card expired ${fmtDate(c.cards[0].expires)}` });
          else lines.push({ candidateId: c.id, siteId: t.siteId, clientId: t.clientId, hours, payRate: a.payRate, chargeRate: a.chargeRate });
        });
      });
    return { lines, held, notIn };
  }, [timesheets, candidates]);
}

export function Payroll() {
  const runs = useStore((s) => s.runs);
  const candidates = useStore((s) => s.candidates);
  const invoices = useStore((s) => s.invoices);
  const nav = useNavigate();
  const calc = usePayCalc();
  const current = runs.find((r) => r.weekEnding === LAST_WEEK_ENDING);
  const lines = current?.status === "Locked" ? current.lines ?? [] : calc.lines;
  const gross = lines.reduce((t, l) => t + l.hours * l.payRate, 0);
  const hours = lines.reduce((t, l) => t + l.hours, 0);
  const byUmbrella = useMemo(() => {
    const m = new Map<string, PayLine[]>();
    lines.forEach((l) => {
      const u = candidates.find((c) => c.id === l.candidateId)!.umbrella;
      m.set(u, [...(m.get(u) ?? []), l]);
    });
    return [...m.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [lines, candidates]);

  const build = () => {
    setState((s) => ({ ...s, runs: [...s.runs.filter((r) => r.weekEnding !== LAST_WEEK_ENDING), { id: "r42", number: 42, weekEnding: LAST_WEEK_ENDING, status: "Draft", workers: calc.lines.length, hours, gross }] }));
    toast(`Run 42 built: ${calc.lines.length} workers`);
  };
  const lock = () => {
    setState((s) => ({ ...s, runs: s.runs.map((r) => (r.id === "r42" ? { ...r, status: "Locked", lockedAt: "Mon 12 Oct", lines: calc.lines, workers: calc.lines.length, hours, gross } : r)) }));
    logActivity({ who: "Sam", kind: "note", text: `Locked payroll run 42: ${calc.lines.length} workers, ${hours} hours, ${gbp(gross)} gross.` });
    toast("Run 42 locked. Umbrella files are ready.");
  };
  const download = (umbrella: string, ls: PayLine[]) => {
    const rows = [["Surname", "Forename", "Mobile", "Site", "Week ending", "Hours", "Rate", "Gross"]];
    ls.forEach((l) => {
      const c = candidates.find((x) => x.id === l.candidateId)!;
      rows.push([c.last, c.first, c.mobile, siteById(l.siteId).name, LAST_WEEK_ENDING, String(l.hours), l.payRate.toFixed(2), (l.hours * l.payRate).toFixed(2)]);
    });
    const csv = rows.map((r) => r.map((v) => (/[",]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `DRC-run42-${umbrella.replace(/\W+/g, "-")}-we-11-10-2026.csv`;
    a.click();
    toast(`${umbrella} file downloaded`);
  };
  const genInvoices = () => {
    const bySite = new Map<string, PayLine[]>();
    (current?.lines ?? []).forEach((l) => bySite.set(l.siteId, [...(bySite.get(l.siteId) ?? []), l]));
    const drafts = [...bySite.entries()].map(([siteId, ls], i) => ({
      id: `inv-d${i + 1}`,
      clientId: ls[0].clientId,
      siteId,
      weekEnding: LAST_WEEK_ENDING,
      po: siteById(siteId).po,
      status: "Draft" as const,
      lines: ls.map((l) => ({ candidateId: l.candidateId, hours: l.hours, rate: l.chargeRate })),
    }));
    setState((s) => ({ ...s, invoices: [...drafts, ...s.invoices.filter((i) => i.weekEnding !== LAST_WEEK_ENDING)] }));
    toast(`${drafts.length} draft invoices created`);
    nav("/crm/invoices");
  };
  const invoicesMade = invoices.some((i) => i.weekEnding === LAST_WEEK_ENDING);

  return (
    <Page
      title="Payroll"
      context="Run 42, week ending Sunday 11 October"
      actions={
        !current ? (
          <Button variant="primary" icon={<Hammer className="h-4 w-4" />} onClick={build} disabled={!calc.lines.length}>Build run 42</Button>
        ) : current.status === "Draft" ? (
          <>
            <Button onClick={build}>Rebuild</Button>
            <Button variant="primary" icon={<Lock className="h-4 w-4" />} onClick={lock}>Lock run</Button>
          </>
        ) : invoicesMade ? (
          <Button to="/crm/invoices">View invoices</Button>
        ) : (
          <Button variant="primary" onClick={genInvoices}>Create invoices from this run</Button>
        )
      }
    >
      <StatRow cols={4}>
        <Stat label={current ? "Workers in the run" : "Ready to pay"} value={lines.length} note={current ? (current.status === "Locked" ? `Locked ${current.lockedAt}` : "Draft, not locked") : "Not built yet"} />
        <Stat label="Hours" value={hours.toLocaleString("en-GB")} />
        <Stat label="Gross pay" value={gbp(gross)} />
        <Stat label="Held or waiting" value={calc.held.length + calc.notIn.reduce((a, n) => a + n.workers, 0)} note="Go into the next run once sorted" tone={calc.held.length ? "danger" : undefined} />
      </StatRow>

      {current?.status === "Locked" ? (
        <Panel title="Umbrella and CIS files" meta="One file per provider, in the column order they ask for" className="mb-6">
          <ul className="divide-y divide-gborder">
            {byUmbrella.map(([u, ls]) => (
              <li key={u} className="flex flex-wrap items-center gap-4 px-5 py-3 text-[13px]">
                <div className="min-w-0 flex-1"><p className="font-medium">{u}</p><p className="text-gmuted">{ls.length} workers, {ls.reduce((t, l) => t + l.hours, 0)} hours</p></div>
                <span className="tabular">{gbp(ls.reduce((t, l) => t + l.hours * l.payRate, 0), 2)}</span>
                <Button size="sm" icon={<Download className="h-3.5 w-3.5" />} onClick={() => download(u, ls)}>Download</Button>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <Panel title={current ? "In this run" : "Ready to go in"} meta="Approved timesheets, priced at each worker's agreed rate">
          {lines.length ? (
            <div className="max-h-[640px] overflow-auto">
              <table className="w-full min-w-[640px] text-[13px]">
                <thead className="sticky top-0 bg-white"><tr className="border-b border-gborder"><Th>Worker</Th><Th>Site</Th><Th className="text-right">Hours</Th><Th className="text-right">Rate</Th><Th className="text-right">Gross</Th></tr></thead>
                <tbody className="divide-y divide-gborder">
                  {lines.map((l) => {
                    const c = candidates.find((x) => x.id === l.candidateId)!;
                    return (
                      <tr key={l.candidateId}>
                        <Td><Link to={`/crm/candidates/${c.id}`} className="font-medium hover:underline">{fullName(c)}</Link><p className="text-gmuted">{c.umbrella}</p></Td>
                        <Td className="text-gmuted">{siteById(l.siteId).name}</Td>
                        <Td className="text-right tabular">{l.hours}</Td>
                        <Td className="text-right tabular">£{l.payRate.toFixed(2)}</Td>
                        <Td className="text-right tabular font-medium">{gbp(l.hours * l.payRate, 2)}</Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty title="No approved timesheets yet" body="Approve timesheets and they appear here, priced and ready." action={<Button to="/crm/timesheets">Go to timesheets</Button>} />
          )}
        </Panel>
        <div className="space-y-6">
          <Panel title="Held back" meta="Will not be paid until fixed">
            {calc.held.length ? (
              <ul className="divide-y divide-gborder">
                {calc.held.map((h) => {
                  const c = candidates.find((x) => x.id === h.candidateId)!;
                  return (
                    <li key={h.candidateId} className="px-5 py-3 text-[13px]">
                      <p className="font-medium">{fullName(c)}, {h.hours} hours</p>
                      <p className="text-gdanger">{h.reason}</p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-5 py-4 text-[13px] text-gmuted">Nobody held this week.</p>
            )}
          </Panel>
          <Panel title="Not in this run yet">
            {calc.notIn.length ? (
              <ul className="divide-y divide-gborder">
                {calc.notIn.map((n) => (
                  <li key={n.id}>
                    <Link to={`/crm/timesheets/${n.id}`} className="block px-5 py-3 text-[13px] hover:bg-gbg">
                      <p className="font-medium">{siteById(n.siteId).name}, {n.workers} workers</p>
                      <p className="text-gmuted">{clientById(siteById(n.siteId).clientId).name}. {n.reason}.</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-4 text-[13px] text-gmuted">Every timesheet is in the run.</p>
            )}
          </Panel>
          <Panel title="Earlier runs">
            <ul className="divide-y divide-gborder">
              {runs.filter((r) => r.weekEnding !== LAST_WEEK_ENDING).slice().reverse().map((r) => (
                <li key={r.id} className="flex items-center justify-between px-5 py-3 text-[13px]">
                  <div><p className="font-medium">Run {r.number}, w/e {fmtDate(r.weekEnding)}</p><p className="text-gmuted">{r.workers} workers, {r.hours.toLocaleString("en-GB")} hours</p></div>
                  <div className="text-right"><p className="tabular">{gbp(r.gross)}</p><Badge tone="navy">Locked</Badge></div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </Page>
  );
}
