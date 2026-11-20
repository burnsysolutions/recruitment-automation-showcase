// Fictional demo data for Demo Recruitment Co. Every person, client and site below
// is invented; nothing here is drawn from a real database.

export type Sector = "Fit-out & refurbishment" | "Groundworks & civils" | "Mechanical & electrical" | "Demolition" | "Maintenance";

export type CardScheme = "CSCS" | "CPCS" | "NPORS" | "ECS" | "SMSTS" | "SSSTS";

export interface Card {
  scheme: CardScheme;
  level: string;
  number: string;
  expires: string; // ISO date
}

export type CandidateStatus = "Available" | "On assignment" | "Available from" | "Not looking";

export interface Candidate {
  id: string;
  first: string;
  last: string;
  trade: string;
  sector: Sector;
  postcode: string;
  town: string;
  lat: number;
  lng: number;
  mobile: string;
  email: string;
  status: CandidateStatus;
  availableFrom?: string;
  payRate: number; // £/hr
  shiftsWorked: number; // with the agency
  lastWorked?: string;
  lastContact: string;
  cards: Card[];
  cardPhotos?: { front?: string; back?: string };
  rtw: "Verified" | "Pending";
  umbrella: string;
  source: string;
  owner: string;
  createdAt: string;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  sector: Sector;
  terms: string;
  invoiceEmail: string;
  contact: string;
  contactRole: string;
  phone: string;
  status: "Active" | "Prospect";
}

export interface Site {
  id: string;
  clientId: string;
  name: string;
  town: string;
  postcode: string;
  lat: number;
  lng: number;
  po?: string;
}

export type JobStage = "Open" | "Shortlisted" | "Booked" | "Filled";

export interface Job {
  id: string;
  ref: string;
  title: string;
  trade: string;
  sector: Sector;
  clientId: string;
  siteId: string;
  type: "Temp" | "Contract" | "Permanent";
  headcount: number;
  filled: number;
  payRate: number;
  chargeRate: number;
  start: string;
  duration: string;
  stage: JobStage;
  owner: string;
  createdAt: string;
  publicTitle: string;
  summary: string;
  requirements: string[];
}

export interface Assignment {
  id: string;
  candidateId: string;
  jobId: string;
  siteId: string;
  clientId: string;
  payRate: number;
  chargeRate: number;
  start: string;
}

export interface TimesheetLine {
  candidateId: string;
  hours: number[]; // Mon..Sun
  flag?: string;
}

export interface Timesheet {
  id: string;
  siteId: string;
  clientId: string;
  weekEnding: string;
  status: "Awaiting" | "Received" | "Needs review" | "Approved";
  receivedAt?: string;
  source?: "Email PDF" | "Photo" | "Excel" | "Word";
  confidence?: number;
  lines: TimesheetLine[];
}

export interface Activity {
  id: string;
  at: string;
  who: string;
  kind: "call" | "email" | "sms" | "note" | "system" | "registration" | "placement";
  text: string;
  candidateId?: string;
  clientId?: string;
  jobId?: string;
}

export interface Task {
  id: string;
  title: string;
  due: string;
  owner: string;
  done: boolean;
  candidateId?: string;
  clientId?: string;
  jobId?: string;
}

export interface Prospect {
  id: string;
  company: string;
  site: string;
  town: string;
  lat: number;
  lng: number;
  trades: string[];
  note: string;
}

// ---------- deterministic random ----------
let s = 20261012;
const rnd = () => {
  s = (s * 1664525 + 1013904223) % 4294967296;
  return s / 4294967296;
};
const pick = <T,>(a: readonly T[]) => a[Math.floor(rnd() * a.length)];
const int = (a: number, b: number) => a + Math.floor(rnd() * (b - a + 1));
const pad = (n: number, w = 2) => String(n).padStart(w, "0");

export const TODAY = new Date("2026-10-12T08:40:00");
export const WEEK_ENDING = "2026-10-18";
export const LAST_WEEK_ENDING = "2026-10-11";
const dayOffset = (d: number) => {
  const x = new Date(TODAY);
  x.setDate(x.getDate() + d);
  return x.toISOString().slice(0, 10);
};

export const CONSULTANTS = ["Sam", "Priya"] as const;

const FIRST = ["Jamie","Liam","Connor","Tomasz","Daniel","Ryan","Kieran","Marek","Lewis","Callum","Adam","Nathan","Piotr","Sam","Jack","Ben","Owen","Darren","Craig","Lee","Mihai","Andrei","Dean","Gary","Steve","Shaun","Kyle","Reece","Josh","Matt","Tony","Paul","Wayne","Jordan","Aaron","Luke","Rob","Chris","Mark","Karl","Grant","Ash","Jake","Harvey","Elliot","Sean","Patrick","Ionut","Bartek","Aidan","Mo","Ade","Kwame","Rhys","Gareth","Neil","Alfie","Ollie","Charlie","Ellie","Hannah","Sophie","Jess"];
const LAST = ["Harding","Nowak","Murphy","Kowalski","Fletcher","Gray","Hughes","Doyle","Popescu","Wiśniewski","Barker","Shaw","Turner","Ward","Kemp","Mason","Reid","O'Neill","Walsh","Booth","Price","Hale","Bennett","Cole","Dixon","Lowe","Webb","Fox","Stone","Hunt","Marsh","Ionescu","Lewandowski","Okafor","Mensah","Adeyemi","Pearce","Rowe","Holt","Burke","Lambert","Wood","Hart","Frost","Sutton","Day","Lynch","Hayes"];

export const TOWNS: [string, string, number, number][] = [
  ["Brighton", "BN1", 50.8225, -0.1372],
  ["Hove", "BN3", 50.8279, -0.1688],
  ["Shoreham-by-Sea", "BN43", 50.8342, -0.2716],
  ["Worthing", "BN11", 50.8179, -0.3729],
  ["Lancing", "BN15", 50.8279, -0.3237],
  ["Newhaven", "BN9", 50.7953, 0.0549],
  ["Lewes", "BN7", 50.8739, 0.0088],
  ["Peacehaven", "BN10", 50.7927, -0.0004],
  ["Burgess Hill", "RH15", 50.9573, -0.1287],
  ["Haywards Heath", "RH16", 51.0045, -0.1048],
  ["Crawley", "RH10", 51.1091, -0.1872],
  ["Horsham", "RH12", 51.0629, -0.3259],
  ["Eastbourne", "BN21", 50.7687, 0.2846],
  ["Hailsham", "BN27", 50.8624, 0.2582],
  ["Littlehampton", "BN17", 50.8110, -0.5395],
  ["Chichester", "PO19", 50.8365, -0.7792],
  ["Uckfield", "TN22", 50.9692, 0.0961],
  ["Henfield", "BN5", 50.9295, -0.2768],
];

export const TRADES: { trade: string; sector: Sector; rate: [number, number]; card: [CardScheme, string] }[] = [
  { trade: "Groundworker", sector: "Groundworks & civils", rate: [17, 20], card: ["CSCS", "Labourer (green)"] },
  { trade: "Pipelayer", sector: "Groundworks & civils", rate: [19, 22], card: ["CSCS", "Skilled worker (blue)"] },
  { trade: "360 excavator operator", sector: "Groundworks & civils", rate: [22, 26], card: ["CPCS", "A59 blue"] },
  { trade: "Forward tipping dumper driver", sector: "Groundworks & civils", rate: [18, 21], card: ["NPORS", "N204 red"] },
  { trade: "Steel fixer", sector: "Groundworks & civils", rate: [20, 24], card: ["CSCS", "Skilled worker (blue)"] },
  { trade: "Dryliner", sector: "Fit-out & refurbishment", rate: [21, 25], card: ["CSCS", "Skilled worker (blue)"] },
  { trade: "Ceiling fixer", sector: "Fit-out & refurbishment", rate: [20, 24], card: ["CSCS", "Skilled worker (blue)"] },
  { trade: "Carpenter (second fix)", sector: "Fit-out & refurbishment", rate: [22, 26], card: ["CSCS", "Skilled worker (blue)"] },
  { trade: "Painter & decorator", sector: "Fit-out & refurbishment", rate: [18, 22], card: ["CSCS", "Skilled worker (blue)"] },
  { trade: "General labourer", sector: "Fit-out & refurbishment", rate: [14, 16], card: ["CSCS", "Labourer (green)"] },
  { trade: "Electrician (approved)", sector: "Mechanical & electrical", rate: [26, 30], card: ["ECS", "Gold (approved)"] },
  { trade: "Electrical improver", sector: "Mechanical & electrical", rate: [18, 21], card: ["ECS", "Improver"] },
  { trade: "Plumber", sector: "Mechanical & electrical", rate: [24, 28], card: ["CSCS", "Skilled worker (blue)"] },
  { trade: "Pipefitter", sector: "Mechanical & electrical", rate: [24, 29], card: ["CSCS", "Skilled worker (blue)"] },
  { trade: "Demolition operative", sector: "Demolition", rate: [16, 19], card: ["CSCS", "Labourer (green)"] },
  { trade: "Topman", sector: "Demolition", rate: [19, 23], card: ["CSCS", "Skilled worker (blue)"] },
  { trade: "Multi-trade operative", sector: "Maintenance", rate: [19, 23], card: ["CSCS", "Skilled worker (blue)"] },
  { trade: "Site manager", sector: "Fit-out & refurbishment", rate: [32, 38], card: ["SMSTS", "Site manager"] },
];

const UMBRELLAS = ["Paystream", "Brookson One", "Parasol", "Giant", "CIS (self-employed)"];
const SOURCES = ["Website", "Referral", "Indeed", "Returning worker", "Facebook", "Walk-in"];

export const candidates: Candidate[] = [];
const COASTAL = TOWNS.filter((t) => t[1].startsWith("BN") || t[1].startsWith("RH1"));
for (let i = 0; i < 214; i++) {
  // the first 34 are groundworks people near the coast, the trade the agency books most
  const t = i < 34 ? TRADES[i % 5 === 4 ? 1 : i % 7 === 6 ? 3 : 0] : pick(TRADES);
  const town = i < 34 ? pick(COASTAL) : pick(TOWNS);
  const first = pick(FIRST);
  const last = pick(LAST);
  const worked = rnd() < 0.62 ? int(4, 260) : 0;
  const statusRoll = rnd();
  const status: CandidateStatus =
    statusRoll < 0.42 ? "On assignment" : statusRoll < 0.72 ? "Available" : statusRoll < 0.88 ? "Available from" : "Not looking";
  const cardExp =
    i % 23 === 4 ? dayOffset(int(-40, -3)) : i % 9 === 2 ? dayOffset(int(5, 58)) : dayOffset(int(90, 1500));
  const cards: Card[] = [{ scheme: t.card[0], level: t.card[1], number: `${t.card[0] === "CPCS" ? "CP" : ""}${int(1000000, 9999999)}`, expires: cardExp }];
  if (rnd() < 0.18) cards.push({ scheme: "SSSTS", level: "Supervisor", number: String(int(100000, 999999)), expires: dayOffset(int(60, 1700)) });
  candidates.push({
    id: `c${pad(i + 1, 3)}`,
    first,
    last,
    trade: t.trade,
    sector: t.sector,
    postcode: `${town[1]} ${int(1, 9)}${pick(["A","B","D","E","F","G","H","J","L","N","P","Q","R","S","T","U","W"])}${pick(["A","B","D","E","F","G","H","J","L","N","P","Q","R","S","T","U","W"])}`,
    town: town[0],
    lat: town[2] + (rnd() - 0.5) * 0.03,
    lng: town[3] + (rnd() - 0.5) * 0.05,
    mobile: `07${int(300, 999)} ${int(100000, 999999)}`,
    email: `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g, "")}${int(1, 99)}@example.com`,
    status,
    availableFrom: status === "Available from" ? dayOffset(int(3, 28)) : undefined,
    payRate: int(t.rate[0] * 2, t.rate[1] * 2) / 2,
    shiftsWorked: worked,
    lastWorked: worked ? dayOffset(-int(0, 160)) : undefined,
    lastContact: dayOffset(-int(0, 220)),
    cards,
    rtw: rnd() < 0.94 ? "Verified" : "Pending",
    umbrella: pick(UMBRELLAS),
    source: pick(SOURCES),
    owner: pick(CONSULTANTS),
    createdAt: dayOffset(-int(1, 900)),
  });
}

// registered on the website this morning
candidates.push({
  id: "c900",
  first: "Kieran",
  last: "Doyle",
  trade: "Pipelayer",
  sector: "Groundworks & civils",
  postcode: "RH15 0QS",
  town: "Burgess Hill",
  lat: 50.9541,
  lng: -0.1342,
  mobile: "07812 440913",
  email: "kieran.doyle@example.com",
  status: "Available",
  payRate: 21,
  shiftsWorked: 0,
  lastContact: dayOffset(0),
  cards: [{ scheme: "CSCS", level: "Skilled worker (blue)", number: "6620194", expires: "2029-03-31" }],
  rtw: "Verified",
  umbrella: "Paystream",
  source: "Website",
  owner: "Sam",
  createdAt: dayOffset(0),
  notes: "Confined space ticket. Own transport.",
});

export const clients: Client[] = [
  { id: "k01", name: "Harlow & Finch Construction", sector: "Fit-out & refurbishment", terms: "30 days from invoice", invoiceEmail: "accounts@harlowfinch.example", contact: "Gemma Ralston", contactRole: "Project manager", phone: "01273 555 014", status: "Active" },
  { id: "k02", name: "Weald Civils", sector: "Groundworks & civils", terms: "30 days after month end", invoiceEmail: "payables@wealdcivils.example", contact: "Phil Oduya", contactRole: "Contracts manager", phone: "01444 555 220", status: "Active" },
  { id: "k03", name: "Seafront Interiors", sector: "Fit-out & refurbishment", terms: "14 days", invoiceEmail: "invoices@seafrontinteriors.example", contact: "Lauren Pike", contactRole: "Site manager", phone: "01273 555 871", status: "Active" },
  { id: "k04", name: "Downsline Groundworks", sector: "Groundworks & civils", terms: "30 days from invoice", invoiceEmail: "accounts@downsline.example", contact: "Terry Maddox", contactRole: "Director", phone: "01903 555 402", status: "Active" },
  { id: "k05", name: "Corvid M&E Services", sector: "Mechanical & electrical", terms: "30 days from invoice", invoiceEmail: "ap@corvidme.example", contact: "Sanjay Mehta", contactRole: "Operations director", phone: "01293 555 118", status: "Active" },
  { id: "k06", name: "Breakline Demolition", sector: "Demolition", terms: "21 days", invoiceEmail: "office@breakline.example", contact: "Dean Archer", contactRole: "Contracts manager", phone: "01323 555 670", status: "Active" },
  { id: "k07", name: "Regency Estates Maintenance", sector: "Maintenance", terms: "30 days from invoice", invoiceEmail: "finance@regencyestates.example", contact: "Claire Whitlock", contactRole: "Facilities manager", phone: "01273 555 309", status: "Active" },
  { id: "k08", name: "Northgate Build", sector: "Fit-out & refurbishment", terms: "30 days after month end", invoiceEmail: "invoices@northgatebuild.example", contact: "Ross Kelleher", contactRole: "Senior site manager", phone: "01403 555 761", status: "Active" },
  { id: "k09", name: "Tidemark Homes", sector: "Groundworks & civils", terms: "30 days from invoice", invoiceEmail: "", contact: "Amy Lomax", contactRole: "Build manager", phone: "01243 555 093", status: "Prospect" },
  { id: "k10", name: "Kestrel Electrical", sector: "Mechanical & electrical", terms: "14 days", invoiceEmail: "accounts@kestrelelec.example", contact: "Neil Barton", contactRole: "Director", phone: "01273 555 488", status: "Active" },
];

const SITE_DEFS: [string, string, string, string, number, number][] = [
  ["k01", "Preston Road offices, CAT A fit-out", "Brighton", "BN1 6AF", 50.8357, -0.1446],
  ["k01", "Hove Lawns apartments", "Hove", "BN3 2WW", 50.8248, -0.1701],
  ["k02", "Shoreham Harbour flood defences", "Shoreham-by-Sea", "BN43 5WA", 50.8318, -0.2541],
  ["k02", "A23 junction improvements", "Burgess Hill", "RH15 9TL", 50.9551, -0.1530],
  ["k03", "Churchill Square retail units", "Brighton", "BN1 2RG", 50.8236, -0.1460],
  ["k03", "Kemptown hotel refurbishment", "Brighton", "BN2 1PE", 50.8197, -0.1235],
  ["k04", "Lancing Business Park, plot 4", "Lancing", "BN15 8UG", 50.8320, -0.3110],
  ["k04", "Newhaven port access road", "Newhaven", "BN9 0DF", 50.7930, 0.0560],
  ["k05", "Gatwick logistics hub", "Crawley", "RH10 9GX", 51.1310, -0.1610],
  ["k05", "Royal Sussex hospital plant room", "Brighton", "BN2 5BE", 50.8190, -0.1180],
  ["k06", "Former Eastbourne depot", "Eastbourne", "BN22 8AA", 50.7840, 0.2930],
  ["k07", "Regency Square portfolio", "Brighton", "BN1 2FG", 50.8226, -0.1495],
  ["k08", "Horsham civic quarter", "Horsham", "RH12 1RL", 51.0624, -0.3275],
  ["k08", "Worthing seafront residential", "Worthing", "BN11 3PX", 50.8120, -0.3700],
  ["k10", "Lewes school extension", "Lewes", "BN7 2NP", 50.8740, 0.0100],
];
export const sites: Site[] = SITE_DEFS.map((d, i) => ({
  id: `s${pad(i + 1)}`,
  clientId: d[0],
  name: d[1],
  town: d[2],
  postcode: d[3],
  lat: d[4],
  lng: d[5],
  po: i % 5 === 3 ? undefined : `PO-${int(40000, 49999)}`,
}));

const JOB_SPECS: [number, string, number, "Temp" | "Contract" | "Permanent", JobStage, string][] = [
  // siteIdx, trade, headcount, type, stage, start offset label
  [2, "Groundworker", 4, "Temp", "Open", "Mon 19 Oct"],
  [0, "Dryliner", 3, "Contract", "Shortlisted", "Wed 14 Oct"],
  [8, "Electrician (approved)", 2, "Contract", "Open", "Mon 19 Oct"],
  [6, "360 excavator operator", 1, "Temp", "Booked", "Tue 13 Oct"],
  [4, "Ceiling fixer", 2, "Temp", "Shortlisted", "Thu 15 Oct"],
  [10, "Demolition operative", 5, "Temp", "Open", "Mon 19 Oct"],
  [11, "Multi-trade operative", 2, "Temp", "Filled", "Mon 5 Oct"],
  [3, "Pipelayer", 2, "Contract", "Open", "Wed 21 Oct"],
  [12, "Carpenter (second fix)", 3, "Contract", "Booked", "Mon 12 Oct"],
  [9, "Plumber", 1, "Contract", "Shortlisted", "Mon 19 Oct"],
  [13, "General labourer", 4, "Temp", "Filled", "Mon 28 Sep"],
  [7, "Forward tipping dumper driver", 1, "Temp", "Open", "Tue 13 Oct"],
  [1, "Painter & decorator", 2, "Temp", "Open", "Mon 26 Oct"],
  [14, "Electrical improver", 2, "Temp", "Booked", "Mon 12 Oct"],
  [5, "Site manager", 1, "Permanent", "Shortlisted", "Mon 2 Nov"],
  [2, "Steel fixer", 3, "Contract", "Open", "Mon 26 Oct"],
];

const SUMMARY: Record<string, string> = {
  Groundworker: "Drainage, kerbs and general groundworks on a live coastal civils package. Early starts, steady hours.",
  Dryliner: "Metal stud partitions and boarding on a CAT A office floor plate. Price work available after week two.",
  "Electrician (approved)": "Containment, first and second fix on a new-build logistics unit. Long-running package.",
  "360 excavator operator": "13 tonne 360 on bulk dig and service trenches. Own CPCS or NPORS ticket required.",
  "Ceiling fixer": "MF ceilings and bulkheads across three retail units, night shifts possible.",
  "Demolition operative": "Soft strip and segregation on a depot clearance. CCDO card an advantage.",
  "Multi-trade operative": "Reactive maintenance across a residential portfolio, van and fuel card supplied.",
  Pipelayer: "Foul and surface water runs up to 2.5 m deep. Confined space ticket preferred.",
  "Carpenter (second fix)": "Doors, ironmongery and skirtings on a civic building fit-out.",
  Plumber: "Plant room pipework and commissioning support in a live hospital environment.",
  "General labourer": "Site clearance, loading out and supporting trades on a seafront residential scheme.",
  "Forward tipping dumper driver": "6 tonne forward tipping dumper on a port access road.",
  "Painter & decorator": "Mist coats and finishes on new apartments, brush and roller.",
  "Electrical improver": "Supporting an approved electrician on a school extension. JIB grading considered.",
  "Site manager": "Run a hotel refurbishment from strip-out to handover for a long-standing client.",
  "Steel fixer": "Fixing to drawings on retaining walls for a flood defence scheme.",
};

export const jobs: Job[] = JOB_SPECS.map((j, i) => {
  const site = sites[j[0]];
  const t = TRADES.find((x) => x.trade === j[1])!;
  const pay = t.rate[1];
  const charge = Math.round(pay * 1.32 * 2) / 2;
  const filled = j[4] === "Filled" ? j[2] : j[4] === "Booked" ? Math.max(1, j[2] - 1) : 0;
  return {
    id: `j${pad(i + 1)}`,
    ref: `DRC-${2400 + i * 7}`,
    title: j[1],
    trade: j[1],
    sector: t.sector,
    clientId: site.clientId,
    siteId: site.id,
    type: j[3],
    headcount: j[2],
    filled,
    payRate: pay,
    chargeRate: charge,
    start: j[5],
    duration: j[3] === "Permanent" ? "Permanent" : pick(["2 weeks", "4 weeks", "6 weeks", "8 weeks+", "Ongoing"]),
    stage: j[4],
    owner: i % 3 === 0 ? "Priya" : "Sam",
    createdAt: dayOffset(-int(0, 9)),
    publicTitle: `${j[1]}${j[2] > 1 ? "s" : ""}`.replace("Electrician (approved)s", "Approved electricians").replace("Carpenter (second fix)s", "Second fix carpenters"),
    summary: SUMMARY[j[1]] ?? "",
    requirements: [
      `${t.card[0]} ${t.card[1]} card`,
      "Right to work in the UK",
      "Own PPE and hand tools",
      ...(j[3] === "Contract" ? ["Umbrella or CIS"] : []),
    ],
  };
});

// assignments: on-assignment candidates spread across sites
export const assignments: Assignment[] = [];
const onAssign = candidates.filter((c) => c.status === "On assignment");
const sectorOf = (st: Site) => clients.find((k) => k.id === st.clientId)!.sector;
const cursor: Record<string, number> = {};
onAssign.forEach((c, i) => {
  // place people on sites that use their trade; a few general trades go anywhere
  const fits = sites.filter((st) => sectorOf(st) === c.sector);
  const pool = fits.length && c.trade !== "General labourer" ? fits : sites;
  const key = pool === sites ? "any" : c.sector;
  cursor[key] = (cursor[key] ?? i) + 1;
  const site = pool[cursor[key] % pool.length];
  const charge = Math.round(c.payRate * (1.28 + rnd() * 0.1) * 2) / 2;
  assignments.push({
    id: `a${pad(i + 1, 3)}`,
    candidateId: c.id,
    jobId: jobs.find((j) => j.siteId === site.id)?.id ?? jobs[0].id,
    siteId: site.id,
    clientId: site.clientId,
    payRate: c.payRate,
    chargeRate: charge,
    start: dayOffset(-int(3, 70)),
  });
});

// last week's timesheets, one per site with assignments
export const timesheets: Timesheet[] = sites.map((site, i) => {
  const people = assignments.filter((a) => a.siteId === site.id);
  const status: Timesheet["status"] =
    i === 2 || i === 9 ? "Needs review" : i === 5 || i === 12 || i === 7 ? "Awaiting" : i % 3 === 0 ? "Received" : "Approved";
  return {
    id: `t${pad(i + 1)}`,
    siteId: site.id,
    clientId: site.clientId,
    weekEnding: LAST_WEEK_ENDING,
    status,
    receivedAt: status === "Awaiting" ? undefined : `${pick(["Sat", "Sun", "Mon"])} ${pad(int(6, 18))}:${pad(int(0, 59))}`,
    source: status === "Awaiting" ? undefined : i === 2 ? "Photo" : pick(["Email PDF", "Photo", "Excel", "Word"] as const),
    confidence: status === "Awaiting" ? undefined : status === "Needs review" ? 0.81 : 0.97 + rnd() * 0.03,
    lines: people.map((p, k) => {
      const hours = [9, 9, 9, 9, 8, rnd() < 0.3 ? 5 : 0, 0].map((h) => (rnd() < 0.06 ? 0 : h));
      return {
        candidateId: p.candidateId,
        hours: status === "Needs review" && k === 0 ? [9, 9, 95, 9, 8, 0, 0] : hours,
        flag: status === "Needs review" && k === 0 ? "Wednesday reads 95 hours; the sheet likely says 9.5" : undefined,
      };
    }),
  };
});

export const prospects: Prospect[] = [
  { id: "p1", company: "Tidemark Homes", site: "Bersted Park, phase 3", town: "Bognor Regis", lat: 50.795, lng: -0.68, trades: ["Groundworker", "Pipelayer", "360 excavator operator"], note: "Groundworks package starting November; no labour supplier named." },
  { id: "p2", company: "Ashcombe Developments", site: "Falmer student blocks", town: "Brighton", lat: 50.862, lng: -0.087, trades: ["Dryliner", "Ceiling fixer", "Carpenter (second fix)"], note: "Fit-out tender won in September." },
  { id: "p3", company: "Southwick Marine", site: "Basin road warehouse", town: "Shoreham-by-Sea", lat: 50.831, lng: -0.235, trades: ["Demolition operative", "General labourer"], note: "Planning approved for strip-out and rebuild." },
];

export const activities: Activity[] = [
  { id: "ac1", at: "08:36", who: "System", kind: "system", text: "Read Shoreham Harbour timesheet from a phone photo. 1 line needs a look.", clientId: "k02" },
  { id: "ac2", at: "08:21", who: "System", kind: "registration", text: "New registration from the website: Kieran Doyle, pipelayer, Burgess Hill." },
  { id: "ac3", at: "08:04", who: "System", kind: "sms", text: "14 candidates confirmed availability by text overnight." },
  { id: "ac4", at: "07:52", who: "Sam", kind: "call", text: "Spoke to Phil at Weald Civils, 4 groundworkers needed Monday at Shoreham.", clientId: "k02", jobId: "j01" },
  { id: "ac5", at: "07:40", who: "System", kind: "system", text: "Shortlist ready for Dryliners, Preston Road: 9 matches, 6 available now.", jobId: "j02" },
  { id: "ac6", at: "Sun", who: "System", kind: "system", text: "Weekly reminder sent: 3 CSCS cards expire within 30 days." },
  { id: "ac7", at: "Sun", who: "Priya", kind: "placement", text: "Booked Marek Nowak, 360 operator, Lancing Business Park from Tuesday.", jobId: "j04" },
  { id: "ac8", at: "Sat", who: "System", kind: "email", text: "Invoice batch for w/e 4 Oct sent to 7 clients, £41,286 total." },
];

export const tasks: Task[] = [
  { id: "tk1", title: "Confirm start time with Weald Civils for Shoreham groundworkers", due: dayOffset(0), owner: "Sam", done: false, clientId: "k02", jobId: "j01" },
  { id: "tk2", title: "Chase Kemptown hotel timesheet", due: dayOffset(0), owner: "Priya", done: false, clientId: "k03" },
  { id: "tk3", title: "Call back Amy Lomax at Tidemark about November groundworks", due: dayOffset(1), owner: "Sam", done: false, clientId: "k09" },
  { id: "tk4", title: "Check references for new site manager candidates", due: dayOffset(2), owner: "Priya", done: false, jobId: "j15" },
  { id: "tk5", title: "Send rate card to Kestrel Electrical", due: dayOffset(-1), owner: "Sam", done: false, clientId: "k10" },
];
