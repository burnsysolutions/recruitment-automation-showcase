import { Link, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Phone, Mail } from "lucide-react";
import { useStore, clients, sites, contacts, assignments, clientById, siteById, fullName } from "../data/store";
import { Page, Panel, Button, Badge, statusTone, inputCls, Tabs, KV, Th, Td, Empty, Avatar, Select, toast } from "./ui";
import { gbp, fmtDate } from "../data/match";
import { Timeline } from "./Timeline";
import { TasksPanel } from "./Tasks";

const invTotal = (lines: { hours: number; rate: number }[]) => lines.reduce((t, l) => t + l.hours * l.rate, 0);

export function ClientsList() {
  const jobs = useStore((s) => s.jobs);
  const invoices = useStore((s) => s.invoices);
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const rows = useMemo(
    () =>
      clients
        .filter((c) => (status === "All" || c.status === status) && (!q || `${c.name} ${c.contact}`.toLowerCase().includes(q.toLowerCase())))
        .map((c) => ({
          c,
          onSite: assignments.filter((a) => a.clientId === c.id).length,
          sites: sites.filter((s) => s.clientId === c.id).length,
          open: jobs.filter((j) => j.clientId === c.id && j.stage !== "Filled").length,
          billed: invoices.filter((i) => i.clientId === c.id && i.weekEnding === "2026-10-04").reduce((t, i) => t + invTotal(i.lines), 0),
        })),
    [q, status, jobs, invoices],
  );
  return (
    <Page title="Clients" context={`${clients.filter((c) => c.status === "Active").length} active, ${clients.filter((c) => c.status === "Prospect").length} prospect`}>
      <Panel>
        <div className="flex flex-wrap gap-2 border-b border-gborder p-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Client or contact" className={`${inputCls} w-full sm:w-[280px]`} />
          <Select value={status} onChange={setStatus} options={[["All", "Active and prospect"], "Active", "Prospect"]} className="w-auto" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-[13px]">
            <thead>
              <tr className="border-b border-gborder">
                <Th>Client</Th><Th>Main contact</Th><Th>Terms</Th><Th className="text-right">Sites</Th><Th className="text-right">On site now</Th><Th className="text-right">Open jobs</Th><Th className="text-right">Billed w/e 4 Oct</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gborder">
              {rows.map(({ c, onSite, sites: n, open, billed }) => (
                <tr key={c.id} className="cursor-pointer hover:bg-gbg" onClick={() => nav(`/crm/clients/${c.id}`)}>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-action-tint text-[11px] font-semibold text-navy">{c.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-[12px] text-gmuted">{c.sector}</p>
                      </div>
                    </div>
                  </Td>
                  <Td><p>{c.contact}</p><p className="text-[12px] text-gmuted">{c.contactRole}</p></Td>
                  <Td className="text-gmuted">{c.status === "Prospect" ? <Badge tone="amber">Prospect</Badge> : c.terms}</Td>
                  <Td className="text-right tabular">{n}</Td>
                  <Td className="text-right tabular">{onSite || "–"}</Td>
                  <Td className="text-right tabular">{open || "–"}</Td>
                  <Td className="text-right tabular">{billed ? gbp(billed) : "–"}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </Page>
  );
}

export function ClientRecord() {
  const { id } = useParams();
  const c = clients.find((x) => x.id === id);
  const jobs = useStore((s) => s.jobs);
  const invoices = useStore((s) => s.invoices);
  const candidates = useStore((s) => s.candidates);
  const [tab, setTab] = useState("activity");
  if (!c) return <Page title="Client not found"><Empty title="This client no longer exists" action={<Button to="/crm/clients">Back to clients</Button>} /></Page>;

  const mySites = sites.filter((s) => s.clientId === c.id);
  const people = contacts.filter((p) => p.clientId === c.id);
  const myJobs = jobs.filter((j) => j.clientId === c.id);
  const myInv = invoices.filter((i) => i.clientId === c.id);
  const onSite = assignments.filter((a) => a.clientId === c.id);

  return (
    <Page
      title={c.name}
      context={<Link to="/crm/clients" className="hover:text-gfg">Clients</Link>}
      actions={
        <>
          <Button icon={<Phone className="h-4 w-4" />} onClick={() => toast(`Calling ${c.phone}`)}>Call</Button>
          <Button variant="primary" to={`/crm/jobs?new=${c.id}`}>New job</Button>
        </>
      }
    >
      <div className="mb-6 grid divide-y divide-gborder overflow-hidden rounded-xl border border-gborder bg-white md:grid-cols-4 md:divide-x md:divide-y-0">
        {[
          ["On site now", String(onSite.length)],
          ["Open jobs", String(myJobs.filter((j) => j.stage !== "Filled").length)],
          ["Billed last week", gbp(myInv.filter((i) => i.weekEnding === "2026-10-04").reduce((t, i) => t + invTotal(i.lines), 0))],
          ["Unpaid", gbp(myInv.filter((i) => i.status === "Sent").reduce((t, i) => t + invTotal(i.lines) * 1.2, 0))],
        ].map(([k, v]) => (
          <div key={k} className="px-5 py-4">
            <p className="text-[12.5px] text-gmuted">{k}</p>
            <p className="mt-1 text-[22px] font-semibold tabular text-navy">{v}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel title="Account" actions={<Badge tone={statusTone(c.status)}>{c.status}</Badge>} pad>
            <KV rows={[["Sector", c.sector], ["Payment terms", c.terms], ["Invoices to", <span className="[overflow-wrap:anywhere]">{c.invoiceEmail || "Not set"}</span>], ["Phone", c.phone]]} />
          </Panel>
          <Panel title="Contacts" meta={`${people.length} people`}>
            <ul className="divide-y divide-gborder">
              {people.map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-5 py-3 text-[13px]">
                  <Avatar name={p.name} size={30} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{p.name} {p.invoices ? <Badge tone="blue">Invoices</Badge> : null}</p>
                    <p className="text-[12px] text-gmuted">{p.role}</p>
                  </div>
                  <a href={`mailto:${p.email}`} className="rounded-md p-1.5 text-gmuted hover:bg-gsecondary" aria-label={`Email ${p.name}`}><Mail className="h-4 w-4" /></a>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Sites" meta={`${mySites.length} sites`}>
            <ul className="divide-y divide-gborder">
              {mySites.map((s) => (
                <li key={s.id} className="px-5 py-3 text-[13px]">
                  <p className="font-medium">{s.name}</p>
                  <p className="text-[12px] text-gmuted">{s.town}, {s.postcode}. {s.po ? `Purchase order ${s.po}` : "No purchase order"}. {assignments.filter((a) => a.siteId === s.id).length} on site.</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <Panel>
          <div className="px-5 pt-3">
            <Tabs value={tab} onChange={setTab} tabs={[["activity", "Activity"], ["jobs", "Jobs", myJobs.length], ["onsite", "On site", onSite.length], ["invoices", "Invoices", myInv.length], ["tasks", "Tasks"]]} />
          </div>
          <div className="p-5">
            {tab === "activity" ? <Timeline clientId={c.id} /> : null}
            {tab === "tasks" ? <TasksPanel clientId={c.id} /> : null}
            {tab === "jobs" ? (
              myJobs.length ? (
                <ul className="divide-y divide-gborder rounded-lg border border-gborder">
                  {myJobs.map((j) => (
                    <li key={j.id}>
                      <Link to={`/crm/jobs/${j.id}`} className="flex items-center justify-between gap-4 px-4 py-3 text-[13px] hover:bg-gbg">
                        <div><p className="font-medium">{j.headcount} × {j.title}</p><p className="text-gmuted">{siteById(j.siteId).name}, starts {j.start}</p></div>
                        <Badge tone={statusTone(j.stage)}>{j.stage}</Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : <Empty title="No jobs yet" />
            ) : null}
            {tab === "onsite" ? (
              <table className="w-full text-[13px]">
                <thead><tr className="border-b border-gborder"><Th>Worker</Th><Th>Site</Th><Th className="text-right">Pay</Th><Th className="text-right">Charge</Th></tr></thead>
                <tbody className="divide-y divide-gborder">
                  {onSite.map((a) => {
                    const w = candidates.find((x) => x.id === a.candidateId)!;
                    return (
                      <tr key={a.id}>
                        <Td><Link to={`/crm/candidates/${w.id}`} className="font-medium hover:underline">{fullName(w)}</Link><p className="text-gmuted">{w.trade}</p></Td>
                        <Td className="text-gmuted">{siteById(a.siteId).name}</Td>
                        <Td className="text-right tabular">£{a.payRate.toFixed(2)}</Td>
                        <Td className="text-right tabular">£{a.chargeRate.toFixed(2)}</Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : null}
            {tab === "invoices" ? (
              myInv.length ? (
                <ul className="divide-y divide-gborder rounded-lg border border-gborder">
                  {myInv.map((i) => (
                    <li key={i.id}>
                      <Link to={`/crm/invoices/${i.id}`} className="flex items-center justify-between gap-4 px-4 py-3 text-[13px] hover:bg-gbg">
                        <div><p className="font-medium">{i.number ?? "Draft"}, {siteById(i.siteId).name}</p><p className="text-gmuted">Week ending {fmtDate(i.weekEnding)}</p></div>
                        <div className="flex items-center gap-3"><span className="tabular">{gbp(invTotal(i.lines) * 1.2, 2)}</span><Badge tone={statusTone(i.status)}>{i.status}</Badge></div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : <Empty title="No invoices yet" />
            ) : null}
          </div>
        </Panel>
      </div>
    </Page>
  );
}

export function ContactsList() {
  const [q, setQ] = useState("");
  const rows = contacts.filter((p) => !q || `${p.name} ${p.role} ${clientById(p.clientId).name}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <Page title="Contacts" context={`${contacts.length} people at ${clients.length} clients`}>
      <Panel>
        <div className="border-b border-gborder p-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, role or client" className={`${inputCls} w-full sm:w-[280px]`} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-[13px]">
            <thead><tr className="border-b border-gborder"><Th>Name</Th><Th>Client</Th><Th>Phone</Th><Th>Email</Th><Th>Last contact</Th></tr></thead>
            <tbody className="divide-y divide-gborder">
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-gbg">
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={p.name} size={28} />
                      <div><p className="font-medium">{p.name} {p.invoices ? <Badge tone="blue">Invoices</Badge> : null}</p><p className="text-[12px] text-gmuted">{p.role}</p></div>
                    </div>
                  </Td>
                  <Td><Link to={`/crm/clients/${p.clientId}`} className="hover:underline">{clientById(p.clientId).name}</Link></Td>
                  <Td className="tabular text-gmuted">{p.phone}</Td>
                  <Td><a href={`mailto:${p.email}`} className="text-action hover:underline">{p.email}</a></Td>
                  <Td className="text-gmuted">{fmtDate(p.lastContact)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </Page>
  );
}
