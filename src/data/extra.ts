// Further fictional demo data derived from seed.ts.
import { candidates, clients, sites, assignments, jobs, TODAY } from "./seed";

let s = 771;
const rnd = () => {
  s = (s * 1664525 + 1013904223) % 4294967296;
  return s / 4294967296;
};
const int = (a: number, b: number) => a + Math.floor(rnd() * (b - a + 1));
const day = (d: number) => {
  const x = new Date(TODAY);
  x.setDate(x.getDate() + d);
  return x.toISOString().slice(0, 10);
};

export interface ContactRec {
  id: string;
  clientId: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  invoices: boolean;
  lastContact: string;
}
const EXTRA_CONTACTS: [string, string, string][] = [
  ["k01", "Owen Fairley", "Site manager"],
  ["k01", "Priya Natt", "Accounts payable"],
  ["k02", "Lisa Crane", "Quantity surveyor"],
  ["k02", "Mick Rourke", "General foreman"],
  ["k03", "Tom Avery", "Contracts manager"],
  ["k04", "Jade Willis", "Office manager"],
  ["k05", "Aaron Pell", "Electrical supervisor"],
  ["k05", "Hannah Lees", "Commercial manager"],
  ["k06", "Craig Moss", "Site supervisor"],
  ["k07", "Ian Sharma", "Maintenance coordinator"],
  ["k08", "Beth Calder", "Quantity surveyor"],
  ["k08", "Stuart Nye", "Site manager"],
  ["k10", "Rachel Imrie", "Office manager"],
];
const slug = (n: string) => n.toLowerCase().replace(/[^a-z]+/g, ".");
export const contacts: ContactRec[] = [
  ...clients.map((c, i) => ({
    id: `ct${i + 1}`,
    clientId: c.id,
    name: c.contact,
    role: c.contactRole,
    phone: c.phone,
    email: `${slug(c.contact)}@${c.invoiceEmail.split("@")[1] ?? c.name.toLowerCase().split(" ")[0] + ".example"}`,
    invoices: false,
    lastContact: day(-int(0, 30)),
  })),
  ...EXTRA_CONTACTS.map(([cid, name, role], i) => {
    const c = clients.find((x) => x.id === cid)!;
    return {
      id: `ct${clients.length + i + 1}`,
      clientId: cid,
      name,
      role,
      phone: `07${int(400, 999)} ${int(100000, 999999)}`,
      email: `${slug(name)}@${c.invoiceEmail.split("@")[1] ?? "example.com"}`,
      invoices: /payable|surveyor|commercial|office/i.test(role),
      lastContact: day(-int(0, 60)),
    };
  }),
];

export interface Placement {
  id: string;
  candidateId: string;
  jobId: string;
  clientId: string;
  siteId: string;
  type: "Temp" | "Contract" | "Permanent";
  start: string;
  end?: string;
  payRate: number;
  chargeRate: number;
  fee?: number;
  by: string;
}
export const initialPlacements: Placement[] = [
  ...assignments.map((a, i) => {
    const j = jobs.find((x) => x.id === a.jobId)!;
    return {
      id: `pl${i + 1}`,
      candidateId: a.candidateId,
      jobId: a.jobId,
      clientId: a.clientId,
      siteId: a.siteId,
      type: (j.type === "Permanent" ? "Contract" : j.type) as Placement["type"],
      start: a.start,
      payRate: a.payRate,
      chargeRate: a.chargeRate,
      by: i % 3 === 0 ? "Priya" : "Sam",
    };
  }),
  {
    id: "plp1",
    candidateId: candidates.find((c) => c.trade === "Site manager")?.id ?? candidates[0].id,
    jobId: "j15",
    clientId: "k08",
    siteId: "s13",
    type: "Permanent",
    start: day(-41),
    payRate: 0,
    chargeRate: 0,
    fee: 7800,
    by: "Sam",
  },
];

export interface Note {
  id: string;
  at: string;
  who: string;
  kind: "note" | "call" | "email" | "sms" | "meeting";
  text: string;
  candidateId?: string;
  clientId?: string;
  jobId?: string;
}
export const initialNotes: Note[] = [
  { id: "n1", at: day(-2), who: "Sam", kind: "call", text: "Phil confirmed 4 groundworkers from Monday, 07:30 start, report to the welfare cabin by gate 2.", clientId: "k02", jobId: "j01" },
  { id: "n2", at: day(-6), who: "Priya", kind: "meeting", text: "Site visit with Gemma. Two more floors to board out after Christmas, likely 6 dryliners.", clientId: "k01" },
  { id: "n3", at: day(-12), who: "Sam", kind: "email", text: "Sent updated rate card for 2027. Awaiting sign-off from commercial.", clientId: "k05" },
  { id: "n4", at: day(-3), who: "Priya", kind: "note", text: "Prefers early starts, has own transport and a 6 tonne dumper ticket as well.", candidateId: candidates[2].id },
];

export interface PayLine {
  candidateId: string;
  siteId: string;
  clientId: string;
  hours: number;
  payRate: number;
  chargeRate: number;
}
export interface PayrollRun {
  id: string;
  number: number;
  weekEnding: string;
  status: "Draft" | "Locked";
  workers: number;
  hours: number;
  gross: number;
  lockedAt?: string;
  lines?: PayLine[];
}
export const initialRuns: PayrollRun[] = [
  { id: "r40", number: 40, weekEnding: "2026-09-27", status: "Locked", workers: 79, hours: 3204, gross: 64932, lockedAt: "Tue 29 Sep" },
  { id: "r41", number: 41, weekEnding: "2026-10-04", status: "Locked", workers: 82, hours: 3311, gross: 67805, lockedAt: "Tue 6 Oct" },
];

export interface InvoiceLine {
  candidateId: string;
  hours: number;
  rate: number;
}
export interface Invoice {
  id: string;
  number?: string;
  clientId: string;
  siteId: string;
  weekEnding: string;
  po?: string;
  status: "Draft" | "Approved" | "Sent" | "Paid";
  lines: InvoiceLine[];
  sentAt?: string;
}
// last week's history, already sent
export const initialInvoices: Invoice[] = sites
  .filter((st) => assignments.some((a) => a.siteId === st.id))
  .slice(0, 12)
  .map((st, i) => ({
    id: `inv-h${i + 1}`,
    number: `DRC-${4410 + i}`,
    clientId: st.clientId,
    siteId: st.id,
    weekEnding: "2026-10-04",
    po: st.po,
    status: i % 4 === 1 ? "Sent" : "Paid",
    sentAt: "Tue 6 Oct",
    lines: assignments
      .filter((a) => a.siteId === st.id)
      .map((a) => ({ candidateId: a.candidateId, hours: [44, 45, 40, 47.5, 36][int(0, 4)], rate: a.chargeRate })),
  }));

export interface Mailshot {
  id: string;
  subject: string;
  body: string;
  audience: string;
  recipients: number;
  sentAt: string;
  opened: number;
  clicked: number;
  by: string;
}
export const initialMailshots: Mailshot[] = [
  { id: "m1", subject: "Groundworkers wanted, Shoreham, Monday start", body: "", audience: "Groundworkers within 20 miles of BN43", recipients: 46, sentAt: "Fri 9 Oct, 15:42", opened: 31, clicked: 12, by: "Sam" },
  { id: "m2", subject: "Winter work: dryliners and ceiling fixers", body: "", audience: "Fit-out trades, available or available soon", recipients: 58, sentAt: "Mon 5 Oct, 08:10", opened: 37, clicked: 9, by: "Priya" },
  { id: "m3", subject: "Is your CSCS card in date?", body: "", audience: "Cards expiring within 90 days", recipients: 21, sentAt: "Thu 1 Oct, 11:05", opened: 18, clicked: 14, by: "Automation" },
];

export interface AvailabilityMsg {
  id: string;
  candidateId: string;
  sentAt: string;
  channel: "SMS" | "Email";
  answer?: "Available now" | "Working at the moment" | "Available from" | "Not looking";
  from?: string;
  answeredAt?: string;
}
const pool = candidates.filter((c) => c.status !== "On assignment").slice(0, 40);
export const initialAvailability: AvailabilityMsg[] = pool.slice(0, 26).map((c, i) => {
  const answered = i % 5 !== 3;
  const answers: AvailabilityMsg["answer"][] = ["Available now", "Available now", "Working at the moment", "Available from", "Not looking"];
  const a = answers[i % answers.length];
  return {
    id: `av${i + 1}`,
    candidateId: c.id,
    sentAt: i < 14 ? "Sun 18:00" : "Mon 08:30",
    channel: i % 4 === 0 ? "Email" : "SMS",
    answer: answered ? a : undefined,
    from: answered && a === "Available from" ? day(int(4, 20)) : undefined,
    answeredAt: answered ? (i < 14 ? `Sun ${18 + (i % 4)}:${String(10 + i * 3).slice(-2)}` : `Mon 0${8 + (i % 2)}:${String(31 + i).slice(-2)}`) : undefined,
  };
});

export const USERS = [
  { name: "Sam", email: "sam@demo-recruitment.example", role: "Owner", last: "Today 08:40" },
  { name: "Priya", email: "priya@demo-recruitment.example", role: "Owner", last: "Today 07:55" },
  { name: "Scott Burns", email: "scott@globusinesssolution.com", role: "Glo support", last: "Sat 13:44" },
];
