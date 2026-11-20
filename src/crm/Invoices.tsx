import { asset } from "../lib/asset";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Printer, Send, Check, Paperclip } from "lucide-react";
import { useStore, setState, clientById, siteById, fullName, logActivity, contacts } from "../data/store";
import { Page, Panel, Button, Badge, statusTone, Th, Td, Empty, toast, StatRow, Stat } from "./ui";
import { gbp, fmtDate } from "../data/match";
import { LAST_WEEK_ENDING } from "../data/seed";
import type { Invoice } from "../data/extra";

export const net = (i: Invoice) => i.lines.reduce((t, l) => t + l.hours * l.rate, 0);

function nextNumber(all: Invoice[]) {
  const n = Math.max(4400, ...all.map((i) => (i.number ? +i.number.replace(/\D/g, "") : 0)));
  return `DRC-${n + 1}`;
}

export function approve(ids: string[]) {
  setState((s) => {
    let invoices = s.invoices;
    ids.forEach((id) => {
      invoices = invoices.map((i) => (i.id === id && i.status === "Draft" ? { ...i, status: "Approved", number: nextNumber(invoices) } : i));
    });
    return { ...s, invoices };
  });
}

export function InvoicesList() {
  const invoices = useStore((s) => s.invoices);
  const sending = useStore((s) => s.settings.invoiceSending);
  const nav = useNavigate();
  const current = invoices.filter((i) => i.weekEnding === LAST_WEEK_ENDING);
  const earlier = invoices.filter((i) => i.weekEnding !== LAST_WEEK_ENDING);
  const drafts = current.filter((i) => i.status === "Draft");
  const approved = current.filter((i) => i.status === "Approved");
  const owed = invoices.filter((i) => i.status === "Sent").reduce((t, i) => t + net(i) * 1.2, 0);

  const send = (list: Invoice[]) => {
    if (!sending) {
      toast("Invoice sending is switched off in Settings");
      return;
    }
    setState((s) => ({ ...s, invoices: s.invoices.map((i) => (list.some((x) => x.id === i.id) ? { ...i, status: "Sent", sentAt: "Mon 12 Oct" } : i)) }));
    logActivity({ who: "Sam", kind: "email", text: `Sent ${list.length} invoices for w/e 11 Oct, ${gbp(list.reduce((t, i) => t + net(i) * 1.2, 0))} including VAT, each with its signed timesheet.` });
    toast(`${list.length} invoices sent with signed timesheets attached`);
  };

  const Row = ({ i }: { i: Invoice }) => (
    <tr className="cursor-pointer hover:bg-gbg" onClick={() => nav(`/crm/invoices/${i.id}`)}>
      <Td className="font-medium tabular">{i.number ?? <span className="text-gmuted">Draft</span>}</Td>
      <Td><p className="font-medium">{clientById(i.clientId).name}</p><p className="text-gmuted">{siteById(i.siteId).name}</p></Td>
      <Td className="tabular text-gmuted">{i.po ?? <Badge tone="amber">No PO</Badge>}</Td>
      <Td className="text-right tabular">{i.lines.length}</Td>
      <Td className="text-right tabular">{gbp(net(i), 2)}</Td>
      <Td className="text-right tabular font-medium">{gbp(net(i) * 1.2, 2)}</Td>
      <Td><Badge tone={statusTone(i.status)}>{i.status}</Badge></Td>
    </tr>
  );
  const Head = () => (
    <thead><tr className="border-b border-gborder"><Th>Number</Th><Th>Client and site</Th><Th>PO</Th><Th className="text-right">Workers</Th><Th className="text-right">Net</Th><Th className="text-right">With VAT</Th><Th>State</Th></tr></thead>
  );

  return (
    <Page
      title="Invoices"
      context="One invoice per client per site, with the signed timesheet attached"
      actions={
        <>
          <Button disabled={!drafts.length} icon={<Check className="h-4 w-4" />} onClick={() => { approve(drafts.map((d) => d.id)); toast(`${drafts.length} invoices approved and numbered`); }}>Approve all drafts</Button>
          <Button variant="primary" disabled={!approved.length} icon={<Send className="h-4 w-4" />} onClick={() => send(approved)}>Send approved</Button>
        </>
      }
    >
      <StatRow cols={4}>
        <Stat label="This week, drafts" value={drafts.length} />
        <Stat label="This week, value" value={gbp(current.reduce((t, i) => t + net(i) * 1.2, 0))} note="Including VAT" />
        <Stat label="Sent, unpaid" value={gbp(owed)} />
        <Stat label="Paid last week" value={gbp(earlier.filter((i) => i.status === "Paid").reduce((t, i) => t + net(i) * 1.2, 0))} tone="good" />
      </StatRow>
      <Panel title="Week ending 11 October" className="mb-6">
        {current.length ? (
          <div className="overflow-x-auto"><table className="w-full min-w-[860px] text-[13px]"><Head /><tbody className="divide-y divide-gborder">{current.map((i) => <Row key={i.id} i={i} />)}</tbody></table></div>
        ) : (
          <Empty title="No invoices for this week yet" body="Lock this week's payroll run and the invoices are drafted from it, one per site." action={<Button to="/crm/payroll">Go to payroll</Button>} />
        )}
      </Panel>
      <Panel title="Week ending 4 October">
        <div className="overflow-x-auto"><table className="w-full min-w-[860px] text-[13px]"><Head /><tbody className="divide-y divide-gborder">{earlier.map((i) => <Row key={i.id} i={i} />)}</tbody></table></div>
      </Panel>
    </Page>
  );
}

export function InvoiceDoc() {
  const { id } = useParams();
  const i = useStore((s) => s.invoices.find((x) => x.id === id));
  const candidates = useStore((s) => s.candidates);
  const all = useStore((s) => s.invoices);
  if (!i) return <Page title="Invoice not found"><Empty title="This invoice no longer exists" action={<Button to="/crm/invoices">Back to invoices</Button>} /></Page>;
  const client = clientById(i.clientId);
  const site = siteById(i.siteId);
  const n = net(i);
  const payee = contacts.find((c) => c.clientId === client.id && c.invoices)?.name ?? "Accounts payable";
  const issued = i.weekEnding === LAST_WEEK_ENDING ? "12 October 2026" : "6 October 2026";

  return (
    <Page
      title={i.number ?? "Draft invoice"}
      context={<Link to="/crm/invoices" className="hover:text-gfg">Invoices</Link>}
      actions={
        <>
          {i.status === "Draft" ? <Button onClick={() => { approve([i.id]); toast(`Approved as ${nextNumber(all)}`); }}>Approve</Button> : null}
          <Button variant="primary" icon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>Download PDF</Button>
        </>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,820px)_minmax(0,1fr)]">
        <div className="print-area rounded-xl border border-gborder bg-white p-10 text-[12.5px] leading-[1.5] text-[#1d1d1d] shadow-[0_1px_2px_rgba(10,16,29,0.04),0_8px_24px_rgba(10,16,29,0.06)] md:p-14">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <img src={asset("/brand/agency-logo.svg")} alt="Demo Recruitment Co" className="h-14 w-auto" />
            <div className="text-right">
              <p className="text-[26px] font-semibold tracking-[-0.01em]">Invoice</p>
              <p className="tabular text-[#555]">{i.number ?? "Draft, not yet numbered"}</p>
            </div>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-[11px] text-[#777]">From</p>
              <p className="font-semibold">Demo Recruitment Co Ltd</p>
              <p>1 Example Street</p>
              <p>Brighton (fictional address)</p>
            </div>
            <div>
              <p className="text-[11px] text-[#777]">To</p>
              <p className="font-semibold">{client.name}</p>
              <p>For the attention of {payee}</p>
              <p>{client.invoiceEmail}</p>
            </div>
            <div className="sm:text-right">
              <p><span className="text-[#777]">Issued</span> {issued}</p>
              <p><span className="text-[#777]">Week ending</span> {fmtDate(i.weekEnding, { day: "numeric", month: "long", year: "numeric" })}</p>
              <p><span className="text-[#777]">Terms</span> {client.terms}</p>
              <p><span className="text-[#777]">PO</span> {i.po ?? "To follow"}</p>
            </div>
          </div>
          <p className="mt-8 font-semibold">Labour supplied to {site.name}, {site.postcode}</p>
          <table className="mt-3 w-full">
            <thead>
              <tr className="border-y border-[#1d1d1d] text-left text-[11px] text-[#555]">
                <th className="py-2 font-medium">Worker</th>
                <th className="py-2 font-medium">Trade</th>
                <th className="py-2 text-right font-medium">Hours</th>
                <th className="py-2 text-right font-medium">Rate</th>
                <th className="py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {i.lines.map((l) => {
                const c = candidates.find((x) => x.id === l.candidateId)!;
                return (
                  <tr key={l.candidateId} className="border-b border-[#e5e5e5]">
                    <td className="py-2">{fullName(c)}</td>
                    <td className="py-2 text-[#555]">{c.trade}</td>
                    <td className="py-2 text-right tabular">{l.hours}</td>
                    <td className="py-2 text-right tabular">£{l.rate.toFixed(2)}</td>
                    <td className="py-2 text-right tabular">{gbp(l.hours * l.rate, 2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="ml-auto mt-4 w-full max-w-[260px] space-y-1 tabular">
            <div className="flex justify-between"><span className="text-[#555]">Net</span><span>{gbp(n, 2)}</span></div>
            <div className="flex justify-between"><span className="text-[#555]">VAT at 20%</span><span>{gbp(n * 0.2, 2)}</span></div>
            <div className="flex justify-between border-t border-[#1d1d1d] pt-2 text-[15px] font-semibold"><span>Total</span><span>{gbp(n * 1.2, 2)}</span></div>
          </div>
          <div className="mt-12 border-t border-[#e5e5e5] pt-4 text-[11px] text-[#666]">
            <p>Signed timesheet for the week attached. Please quote {i.number ?? "the invoice number"} with payment.</p>
            <p>Bank details appear here from the agency's settings. Demo invoice, fictional client.</p>
          </div>
        </div>
        <div className="no-print space-y-6">
          <Panel title="Status" pad>
            <div className="flex items-center gap-2"><Badge tone={statusTone(i.status)}>{i.status}</Badge>{i.sentAt ? <span className="text-[13px] text-gmuted">Sent {i.sentAt}</span> : null}</div>
            <p className="mt-3 text-[13px] text-gmuted">Goes to {client.invoiceEmail || "no invoice address set"}.</p>
          </Panel>
          <Panel title="Attached" pad>
            <p className="flex items-center gap-2 text-[13px]"><Paperclip className="h-4 w-4 text-gmuted" />Signed timesheet, {site.name}, w/e {fmtDate(i.weekEnding)}</p>
          </Panel>
        </div>
      </div>
    </Page>
  );
}
