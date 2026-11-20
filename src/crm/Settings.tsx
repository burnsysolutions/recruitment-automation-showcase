import { useState } from "react";
import { useStore, setState, resetDemo, USERS, type Settings as S } from "../data/store";
import { Page, Panel, Button, Badge, Tabs, Th, Td, KV, toast, Avatar, Dialog, Field, inputCls, Select } from "./ui";
import { PART_COLOURS } from "./bits";

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-action" : "bg-[#cfd5dc]"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left] ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

const AUTOS: [keyof S, string, string][] = [
  ["autoShortlist", "Build a shortlist for every new job", "Ranks free, compliant people within reach and emails the job owner."],
  ["availabilityCheck", "Morning availability check", "Texts people not heard from in a month and updates their status from the reply."],
  ["smsEnabled", "Send texts", "When off, availability checks and confirmations go by email only."],
  ["complianceReminders", "Card expiry reminders", "Texts a renewal link at 60, 30 and 14 days, and holds pay once a card has expired."],
  ["prospectAlerts", "Prospect alerts", "Tells you when someone free lives near a site you are trying to win."],
  ["invoiceSending", "Send invoices by email", "Approved invoices go to each site's invoice contact with the signed timesheet attached."],
];

const WEIGHT_LABEL: Record<keyof S["weights"], string> = {
  history: "Has worked for us before",
  distance: "Distance to site",
  recent: "Worked recently",
  availability: "Available now",
  contact: "Spoken to recently",
};

export function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const [tab, setTab] = useState("automations");
  const [invite, setInvite] = useState(false);
  const set = (patch: Partial<S>) => setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  const total = Object.values(settings.weights).reduce((a, b) => a + b, 0);

  return (
    <Page title="Settings" context="Demo Recruitment Co workspace">
      <Panel>
        <div className="px-5 pt-3">
          <Tabs value={tab} onChange={setTab} tabs={[["automations", "Automations"], ["matching", "Matching"], ["users", "Users and roles"], ["company", "Company"], ["demo", "Demo data"]]} />
        </div>
        <div className="p-5">
          {tab === "automations" ? (
            <ul className="divide-y divide-gborder rounded-lg border border-gborder">
              {AUTOS.map(([k, title, body]) => (
                <li key={k} className="flex items-start justify-between gap-6 px-5 py-4">
                  <div>
                    <p className="text-[13.5px] font-medium">{title}</p>
                    <p className="mt-0.5 text-[12.5px] text-gmuted">{body}</p>
                  </div>
                  <Switch label={title} on={!!settings[k]} onChange={(v) => { set({ [k]: v } as Partial<S>); toast(`${title} ${v ? "on" : "off"}`); }} />
                </li>
              ))}
            </ul>
          ) : null}

          {tab === "matching" ? (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-5">
                {(Object.keys(settings.weights) as (keyof S["weights"])[]).map((k) => (
                  <div key={k}>
                    <div className="mb-1.5 flex items-center justify-between text-[13px]">
                      <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: PART_COLOURS[k] }} />{WEIGHT_LABEL[k]}</span>
                      <span className="tabular text-gmuted">{Math.round((settings.weights[k] / total) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      value={settings.weights[k]}
                      onChange={(e) => set({ weights: { ...settings.weights, [k]: +e.target.value } })}
                      className="w-full accent-[#002149]"
                      aria-label={WEIGHT_LABEL[k]}
                    />
                  </div>
                ))}
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-[13px]"><span>Furthest from site</span><span className="tabular text-gmuted">{settings.radius} miles</span></div>
                  <input type="range" min={10} max={60} step={5} value={settings.radius} onChange={(e) => set({ radius: +e.target.value })} className="w-full accent-[#002149]" aria-label="Furthest from site" />
                </div>
              </div>
              <div className="rounded-lg bg-gbg p-4 text-[12.5px] leading-[1.55] text-gmuted">
                <p className="font-medium text-gfg">How this works</p>
                <p className="mt-1">Every shortlist uses these weights and scores out of 100. Moving a slider re-ranks every open shortlist straight away.</p>
                <div className="mt-3 flex h-2.5 overflow-hidden rounded-full">
                  {(Object.keys(settings.weights) as (keyof S["weights"])[]).map((k) => <span key={k} style={{ width: `${(settings.weights[k] / total) * 100}%`, background: PART_COLOURS[k] }} />)}
                </div>
                <Button size="sm" className="mt-4" onClick={() => { set({ weights: { history: 40, distance: 25, recent: 15, availability: 12, contact: 8 }, radius: 35 }); toast("Weights reset"); }}>Reset to default</Button>
              </div>
            </div>
          ) : null}

          {tab === "users" ? (
            <>
              <div className="mb-4 flex justify-end"><Button variant="primary" onClick={() => setInvite(true)}>Invite a user</Button></div>
              <table className="w-full text-[13px]">
                <thead><tr className="border-b border-gborder"><Th>Name</Th><Th>Role</Th><Th>Last signed in</Th></tr></thead>
                <tbody className="divide-y divide-gborder">
                  {USERS.map((u) => (
                    <tr key={u.email}>
                      <Td><div className="flex items-center gap-2.5"><Avatar name={u.name} size={28} /><div><p className="font-medium">{u.name}</p><p className="text-gmuted">{u.email}</p></div></div></Td>
                      <Td><Badge tone={u.role === "Owner" ? "navy" : "grey"}>{u.role}</Badge></Td>
                      <Td className="text-gmuted">{u.last}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 grid gap-3 text-[12.5px] text-gmuted sm:grid-cols-3">
                <p><span className="font-medium text-gfg">Owner</span>: everything, including payroll, invoices and settings.</p>
                <p><span className="font-medium text-gfg">Consultant</span>: candidates, clients, jobs and shortlists. No money screens.</p>
                <p><span className="font-medium text-gfg">Finance</span>: timesheets, payroll and invoices only.</p>
              </div>
              <Dialog open={invite} onClose={() => setInvite(false)} title="Invite a user" footer={<><Button onClick={() => setInvite(false)}>Cancel</Button><Button variant="primary" onClick={() => { setInvite(false); toast("Invitation sent"); }}>Send invitation</Button></>}>
                <div className="space-y-4">
                  <Field label="Email"><input className={inputCls} placeholder="name@demo-recruitment.example" /></Field>
                  <Field label="Role"><Select value="Consultant" onChange={() => {}} options={["Owner", "Consultant", "Finance"]} /></Field>
                </div>
              </Dialog>
            </>
          ) : null}

          {tab === "company" ? (
            <div className="max-w-[640px]">
              <KV
                rows={[
                  ["Trading name", "Demo Recruitment Co Ltd"],
                  ["Address", "1 Example Street, Brighton"],
                  ["Contacts", "Sam, 07700 900123. Priya, 07700 900456"],
                  ["Invoice numbering", "DRC- followed by the next number"],
                  ["VAT on invoices", "20%"],
                  ["Timesheets inbox", "Sheets emailed here are read automatically"],
                ]}
              />
            </div>
          ) : null}

          {tab === "demo" ? (
            <div className="max-w-[560px] text-[13px]">
              <p>Everything in this workspace is invented for the demonstration: every candidate, client, site and figure. Changes you make are kept in this browser only.</p>
              <Button variant="danger" className="mt-4" onClick={() => { resetDemo(); toast("Demo data reset"); }}>Reset demo data</Button>
            </div>
          ) : null}
        </div>
      </Panel>
    </Page>
  );
}
