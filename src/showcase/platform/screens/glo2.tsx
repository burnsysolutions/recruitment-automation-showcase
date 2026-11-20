import {
  ArrowRight,
  Building2,
  CreditCard,
  FileText,
  Link2,
  Mail,
  Megaphone,
  MessageCircle,
  Package,
  Plus,
  Search,
  Share2,
  Sparkles,
  Store,
  Truck,
  Upload,
  Users,
} from "lucide-react";
import { Fill, GloApp, GloHead } from "../shells";
import {
  Avatar,
  Badge,
  Btn,
  Card,
  CheckLine,
  Kpis,
  Meter,
  Muted,
  Person,
  Table,
  Tabs,
  Timeline,
  type Tone,
} from "../kit";
import { LineChart, Spark } from "../charts";
import { CvPage, Hl } from "./parts";
import { asset } from "../../../lib/asset";

function Two({ a, b }: { a: string; b: string }) {
  return (
    <span className="block min-w-0 leading-tight">
      <span className="block truncate font-medium">{a}</span>
      <span className="block truncate text-[11.5px] text-[var(--pv-muted)]">
        {b}
      </span>
    </span>
  );
}

/* 30 · Product demand research --------------------------------------------- */

const PRODUCTS: [string, number[], string, string, string, string, number][] = [
  [
    "Telescopic hedge shears",
    [3, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 11],
    "6",
    "£8.40",
    "38%",
    "1,200",
    81,
  ],
  [
    "Soil sieve set",
    [2, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8, 9],
    "4",
    "£3.10",
    "44%",
    "640",
    77,
  ],
  [
    "Leaf grabbers",
    [1, 1, 2, 2, 2, 3, 4, 6, 8, 9, 9, 10],
    "15",
    "£2.60",
    "36%",
    "1,100",
    66,
  ],
  [
    "Bulb planter",
    [2, 3, 3, 3, 4, 5, 6, 6, 5, 4, 4, 3],
    "12",
    "£2.20",
    "41%",
    "900",
    63,
  ],
  [
    "Kneeler and seat",
    [6, 6, 6, 7, 6, 6, 6, 7, 6, 6, 6, 6],
    "41",
    "£6.90",
    "29%",
    "2,400",
    54,
  ],
  [
    "Pruning saw",
    [5, 5, 5, 5, 6, 5, 5, 5, 5, 6, 5, 5],
    "33",
    "£4.80",
    "31%",
    "1,800",
    49,
  ],
  [
    "Hose reel",
    [9, 9, 8, 8, 7, 7, 6, 6, 5, 5, 4, 4],
    "58",
    "£11.20",
    "22%",
    "3,000",
    33,
  ],
];

function DemandResearch() {
  return (
    <GloApp nav="products">
      <GloHead
        title="Products"
        meta="Research: garden tools"
        actions={<Btn icon={Search}>New category</Btn>}
        tabs={<Tabs items={["Research", "Store", "Suppliers"]} active={0} />}
      />
      <Fill className="grid grid-cols-[minmax(0,1fr)_340px] gap-4">
        <Card pad={false} className="h-full">
          <Table
            dense
            sel={0}
            cols={[
              { h: "Product" },
              { h: "Demand, 12 wks", w: 112 },
              { h: "Sellers", align: "right", w: 66 },
              { h: "Landed", align: "right", w: 70 },
              { h: "Margin", align: "right", w: 66 },
              { h: "Stock", align: "right", w: 64 },
              { h: "Score", w: 86 },
            ]}
            rows={PRODUCTS.map(([n, d, sel, cost, m, st, sc]) => [
              <span key="n" className="font-medium">
                {n}
              </span>,
              <Spark key="s" data={d} w={84} h={22} />,
              sel,
              cost,
              m,
              st,
              <span key="sc" className="flex items-center gap-2">
                <Meter
                  value={sc}
                  w={34}
                  tone={sc >= 60 ? "brand" : "neutral"}
                />
                <span className="font-semibold">{sc}</span>
              </span>,
            ])}
          />
          <p className="px-4 py-2.5 text-[11.5px] text-[var(--pv-muted)]">
            Demand from marketplace sales signals and social ad libraries.
            Landed cost and stock from UK suppliers. Made-up figures.
          </p>
        </Card>
        <div className="flex min-h-0 flex-col gap-4">
          <Card
            title="Telescopic hedge shears"
            sub="Why it scores 81"
            right={
              <Badge tone="good" dot>
                Test it
              </Badge>
            }
          >
            <div className="-mt-1 space-y-2">
              {[
                ["Demand", 34, 40],
                ["Few sellers", 18, 25],
                ["Margin after fees", 19, 25],
                ["Supplier stock", 10, 10],
              ].map(([l, v, m]) => (
                <div
                  key={String(l)}
                  className="grid grid-cols-[120px_1fr_44px] items-center gap-2 text-[12px]"
                >
                  <span>{l}</span>
                  <Meter value={Number(v)} max={Number(m)} h={7} />
                  <span className="text-right text-[var(--pv-muted)]">
                    {v}/{m}
                  </span>
                </div>
              ))}
            </div>
          </Card>
          <Card
            title="Demand signals"
            sub="Searches and sales, last 12 weeks"
            className="min-h-0 flex-1"
          >
            <LineChart
              w={290}
              h={150}
              labels={[
                "Aug",
                "",
                "",
                "",
                "Sep",
                "",
                "",
                "",
                "Oct",
                "",
                "",
                "Now",
              ]}
              series={[
                {
                  name: "Demand index",
                  color: "var(--pv-chart-1)",
                  area: true,
                  data: [31, 36, 35, 42, 48, 50, 57, 63, 66, 72, 80, 86],
                },
              ]}
            />
          </Card>
        </div>
      </Fill>
    </GloApp>
  );
}

/* 31 · Dropshipping -------------------------------------------------------- */

function Dropshipping() {
  return (
    <GloApp nav="products">
      <GloHead
        title="Products"
        meta="Store: orders, stock and prices"
        actions={<Btn icon={Store}>Listings</Btn>}
        tabs={<Tabs items={["Research", "Store", "Suppliers"]} active={1} />}
      />
      <Fill className="flex flex-col gap-4">
        <Kpis
          items={[
            { label: "Orders overnight", value: "7" },
            { label: "Sales", value: "£214.30" },
            { label: "Margin after fees", value: "34%" },
            { label: "Live listings", value: "24" },
            { label: "Paused for stock", value: "1", tone: "warn" },
          ]}
        />
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_330px] gap-4">
          <Card pad={false} className="h-full">
            <Table
              dense
              cols={[
                { h: "Order", w: 70 },
                { h: "Product" },
                { h: "Channel", w: 98 },
                { h: "Status", w: 164 },
                { h: "Margin", align: "right", w: 66 },
              ]}
              rows={[
                [
                  "#3108",
                  "Telescopic hedge shears",
                  "Marketplace",
                  <Badge key="s" tone="brand" dot>
                    Sent to supplier
                  </Badge>,
                  "£6.10",
                ],
                [
                  "#3107",
                  "Soil sieve set",
                  "Own shop",
                  <Badge key="s" tone="brand" dot>
                    Sent to supplier
                  </Badge>,
                  "£4.40",
                ],
                [
                  "#3106",
                  "Leaf grabbers",
                  "Marketplace",
                  <Badge key="s" tone="good" dot>
                    Shipped, tracked
                  </Badge>,
                  "£3.20",
                ],
                [
                  "#3105",
                  "Telescopic hedge shears",
                  "Marketplace",
                  <Badge key="s" tone="good" dot>
                    Shipped, tracked
                  </Badge>,
                  "£6.10",
                ],
                [
                  "#3104",
                  "Bulb planter",
                  "Own shop",
                  <Badge key="s" tone="good" dot>
                    Delivered
                  </Badge>,
                  "£2.90",
                ],
                [
                  "#3103",
                  "Soil sieve set",
                  "Marketplace",
                  <Badge key="s" tone="good" dot>
                    Delivered
                  </Badge>,
                  "£4.40",
                ],
                [
                  "#3102",
                  "Leaf grabbers",
                  "Marketplace",
                  <Badge key="s" tone="warn" dot>
                    Late, supplier asked
                  </Badge>,
                  "£3.20",
                ],
                [
                  "#3101",
                  "Telescopic hedge shears",
                  "Own shop",
                  <Badge key="s" tone="good" dot>
                    Delivered
                  </Badge>,
                  "£6.10",
                ],
              ]}
            />
          </Card>
          <div className="flex min-h-0 flex-col gap-4">
            <Card title="Morning digest" sub="Emailed at 07:00">
              <div className="-mt-1 space-y-2.5 text-[12px]">
                {[
                  [Package, "7 orders, £214.30 in sales", "good"],
                  [
                    Truck,
                    "Soil sieve set: supplier down to 3. Listing pauses at 2.",
                    "warn",
                  ],
                  [
                    Megaphone,
                    "Hedge shears undercut by £1.20. Still 34% if matched.",
                    "brand",
                  ],
                ].map(([I, t, tone], i) => {
                  const Icon = I as typeof Package;
                  return (
                    <div key={i} className="flex gap-2.5">
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${tone === "good" ? "bg-[var(--pv-good-tint)] text-[var(--pv-good)]" : tone === "warn" ? "bg-[var(--pv-warn-tint)] text-[var(--pv-warn)]" : "bg-[var(--pv-primary-tint)] text-[var(--pv-primary-strong)]"}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="leading-snug">{String(t)}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card title="Price watch" pad={false} className="min-h-0 flex-1">
              <Table
                dense
                cols={[
                  { h: "Product" },
                  { h: "Ours", align: "right", w: 64 },
                  { h: "Lowest", align: "right", w: 66 },
                ]}
                rows={[
                  [
                    "Hedge shears",
                    "£24.99",
                    <span key="l" className="text-[var(--pv-warn)]">
                      £23.79
                    </span>,
                  ],
                  ["Soil sieve set", "£12.99", "£13.49"],
                  ["Leaf grabbers", "£9.99", "£9.99"],
                  ["Bulb planter", "£7.49", "£7.99"],
                ]}
              />
            </Card>
          </div>
        </div>
      </Fill>
    </GloApp>
  );
}

/* 32 · Connections --------------------------------------------------------- */

const CONN: {
  n: string;
  icon: typeof Mail;
  d: string;
  m: string;
  tone: Tone;
  s: string;
}[] = [
  {
    n: "WhatsApp Cloud API",
    icon: MessageCircle,
    d: "Webhook healthy, last message 10:41",
    m: "1,204 messages, 30 days",
    tone: "good",
    s: "Connected",
  },
  {
    n: "Gmail",
    icon: Mail,
    d: "2 inboxes, read every minute",
    m: "3,118 emails, 30 days",
    tone: "good",
    s: "Connected",
  },
  {
    n: "Meta Conversions API",
    icon: Megaphone,
    d: "Server events, matched to ads",
    m: "312 events, 30 days",
    tone: "good",
    s: "Connected",
  },
  {
    n: "TikTok Events API",
    icon: Megaphone,
    d: "Server events",
    m: "96 events, 30 days",
    tone: "good",
    s: "Connected",
  },
  {
    n: "Stripe",
    icon: CreditCard,
    d: "Payments start orders",
    m: "23 payments, 30 days",
    tone: "good",
    s: "Connected",
  },
  {
    n: "Brevo",
    icon: Mail,
    d: "Sending domain verified",
    m: "4,410 emails, 30 days",
    tone: "good",
    s: "Connected",
  },
  {
    n: "Companies House",
    icon: Building2,
    d: "Company checks for prospects",
    m: "1,880 checks, 30 days",
    tone: "good",
    s: "Connected",
  },
  {
    n: "Apollo",
    icon: Users,
    d: "Key expires in 6 days",
    m: "640 lookups, 30 days",
    tone: "warn",
    s: "Renew key",
  },
];

function Connections() {
  return (
    <GloApp nav="admin">
      <GloHead
        title="Admin"
        meta="Connections"
        actions={
          <Btn v="primary" icon={Plus}>
            Connect an app
          </Btn>
        }
        tabs={
          <Tabs
            items={["Users", "Connections", "Billing", "Data"]}
            active={1}
          />
        }
      />
      <Fill className="flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-3">
          {CONN.map((c) => (
            <div
              key={c.n}
              className="rounded-[var(--pv-radius)] border border-[var(--pv-border)] bg-white p-3.5"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--pv-surface)] text-[var(--pv-text2)]">
                  <c.icon className="h-4 w-4" />
                </span>
                <Badge tone={c.tone} dot>
                  {c.s}
                </Badge>
              </div>
              <p className="mt-2.5 truncate text-[13px] font-semibold">{c.n}</p>
              <p className="truncate text-[11.5px] text-[var(--pv-muted)]">
                {c.d}
              </p>
              <p className="mt-2 text-[12px] font-medium">{c.m}</p>
            </div>
          ))}
        </div>
        <Card
          title="Event log"
          sub="The latest from every connection"
          pad={false}
          className="min-h-0 flex-1"
        >
          <Table
            dense
            cols={[
              { h: "Time", w: 70 },
              { h: "From", w: 170 },
              { h: "Event" },
              { h: "Result", w: 190 },
            ]}
            rows={[
              [
                "10:41",
                "WhatsApp Cloud API",
                "Message in from a customer",
                <Badge key="r" tone="good" dot>
                  Filed, reply drafted
                </Badge>,
              ],
              [
                "10:38",
                "Stripe",
                "Payment for a CV and LinkedIn package",
                <Badge key="r" tone="good" dot>
                  Order started
                </Badge>,
              ],
              [
                "10:38",
                "Meta Conversions API",
                "Purchase sent from the server, consent given",
                <Badge key="r" tone="good" dot>
                  Matched to the ad
                </Badge>,
              ],
              [
                "10:22",
                "Gmail",
                "Reply from a prospect",
                <Badge key="r" tone="good" dot>
                  Logged on Prospecting
                </Badge>,
              ],
              [
                "09:55",
                "Apollo",
                "Key expires in 6 days",
                <Badge key="r" tone="warn" dot>
                  Owner emailed
                </Badge>,
              ],
            ]}
          />
        </Card>
      </Fill>
    </GloApp>
  );
}

/* 33 · CV pipeline --------------------------------------------------------- */

const LANES: {
  t: string;
  n: number;
  cards: {
    name: string;
    pkg: string;
    due: string;
    note: string;
    tone: Tone;
    on?: boolean;
  }[];
}[] = [
  {
    t: "Writing",
    n: 2,
    cards: [
      {
        name: "Mark Doyle",
        pkg: "CV",
        due: "Due Thu",
        note: "Draft 1 of 3",
        tone: "brand",
      },
      {
        name: "Aisha Rahman",
        pkg: "CV and LinkedIn",
        due: "Due Fri",
        note: "Draft 1 of 3",
        tone: "brand",
      },
    ],
  },
  {
    t: "Audit",
    n: 2,
    cards: [
      {
        name: "Sarah Lane",
        pkg: "CV and cover letter",
        due: "Due Fri",
        note: "4 found",
        tone: "warn",
        on: true,
      },
      {
        name: "Tom Ellis",
        pkg: "CV",
        due: "Due Mon",
        note: "Checking",
        tone: "brand",
      },
    ],
  },
  {
    t: "Fixing",
    n: 1,
    cards: [
      {
        name: "Priya Shah",
        pkg: "Executive CV",
        due: "Due Thu",
        note: "2 to fix",
        tone: "warn",
      },
    ],
  },
  {
    t: "Writer sign-off",
    n: 2,
    cards: [
      {
        name: "James Okoro",
        pkg: "CV",
        due: "Due today",
        note: "Ready",
        tone: "good",
      },
      {
        name: "Hannah Price",
        pkg: "CV and LinkedIn",
        due: "Due Thu",
        note: "Ready",
        tone: "good",
      },
    ],
  },
];

function CvPipeline() {
  return (
    <GloApp nav="cvstudio">
      <GloHead
        title="CV studio"
        meta="Glo Career Services, 7 in progress"
        actions={
          <Btn v="primary" icon={Plus}>
            New order
          </Btn>
        }
        tabs={
          <Tabs
            items={["Pipeline", "Free reviews", "ATS check", "Method"]}
            active={0}
          />
        }
      />
      <Fill className="grid grid-cols-[repeat(4,minmax(0,1fr))_316px] gap-3">
        {LANES.map((l) => (
          <div
            key={l.t}
            className="flex min-h-0 flex-col rounded-[var(--pv-radius)] bg-[#eef2f6] p-2"
          >
            <div className="flex items-center justify-between px-1.5 pb-2 pt-0.5">
              <span className="text-[12.5px] font-semibold">{l.t}</span>
              <span className="text-[11.5px] text-[var(--pv-muted)]">
                {l.n}
              </span>
            </div>
            <div className="space-y-2">
              {l.cards.map((c) => (
                <div
                  key={c.name}
                  className={`rounded-[7px] border bg-white p-2.5 shadow-[0_1px_2px_rgba(16,24,40,0.05)] ${c.on ? "border-[#2b6bea] ring-2 ring-[#2b6bea]/20" : "border-[var(--pv-border)]"}`}
                >
                  <div className="flex items-center gap-2">
                    <Avatar name={c.name} size={22} />
                    <span className="truncate text-[12.5px] font-semibold">
                      {c.name}
                    </span>
                  </div>
                  <p className="mt-1.5 truncate text-[11.5px] text-[var(--pv-text2)]">
                    {c.pkg}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <Muted className="text-[11px]">{c.due}</Muted>
                    <Badge tone={c.tone}>{c.note}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <Card
          title="Sarah Lane"
          sub="Site manager to project manager"
          className="h-full"
        >
          <p className="-mt-1 text-[12px] font-semibold">
            The audit, against the method
          </p>
          <div className="mt-1">
            <CheckLine ok={false} note="Fixed">
              Banned phrase: “passionate”
            </CheckLine>
            <CheckLine ok={false} note="Fixed">
              An early finish with no number
            </CheckLine>
            <CheckLine ok="warn" note="Fixed">
              Two tenses in one role
            </CheckLine>
            <CheckLine ok="warn" note="Asked">
              No budget for the phase
            </CheckLine>
            <CheckLine note="All match">Facts traced to her notes</CheckLine>
          </div>
          <p className="mt-3 text-[12px] font-semibold">
            Profile, after the fix
          </p>
          <p className="mt-1 rounded-[8px] bg-[var(--pv-page)] p-2.5 text-[12px] leading-relaxed">
            Site manager with 12 years in residential construction. Ran a
            140-home phase to completion <Hl>3 weeks early</Hl>, managing 22
            subcontractors. SMSTS and NEBOSH General.
          </p>
          <div className="mt-3 flex gap-2">
            <Btn v="primary" icon={ArrowRight}>
              Send to sign-off
            </Btn>
            <Btn icon={FileText}>Versions</Btn>
          </div>
        </Card>
      </Fill>
    </GloApp>
  );
}

/* 34 · Gap analysis and cover letter --------------------------------------- */

function GapAnalysis() {
  return (
    <GloApp nav="cvstudio">
      <GloHead
        title="Sarah Lane"
        meta="Order 1187, CV and cover letter, due Friday"
        actions={
          <>
            <Btn icon={MessageCircle}>Message her</Btn>
            <Btn v="primary" icon={Sparkles}>
              Build the answers in
            </Btn>
          </>
        }
        tabs={
          <Tabs
            items={["Overview", "Gap analysis", "Versions", "Messages"]}
            active={1}
          />
        }
      />
      <Fill className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-4">
        <Card
          title="What the target job asks for"
          sub="Project manager, a made-up housebuilder"
          pad={false}
          className="h-full"
        >
          <Table
            dense
            cols={[
              { h: "It asks for", w: 168 },
              { h: "On her CV", w: 92 },
              { h: "Question and answer" },
            ]}
            rows={[
              [
                "Budget responsibility",
                <Badge key="b" tone="bad" dot>
                  Missing
                </Badge>,
                <Two
                  key="q"
                  a="“Have you managed a budget? How big?”"
                  b="Answered: £4.2m on the 140-home phase"
                />,
              ],
              [
                "Subcontractor teams",
                <Badge key="b" tone="warn" dot>
                  Partly
                </Badge>,
                <Two
                  key="q"
                  a="“How many subcontractors at peak?”"
                  b="Answered: 22 trades"
                />,
              ],
              [
                "Client or NHBC awards",
                <Badge key="b" tone="bad" dot>
                  Missing
                </Badge>,
                <Two
                  key="q"
                  a="“Any client or NHBC awards?”"
                  b="Waiting for her answer"
                />,
              ],
              [
                "Programme management",
                <Badge key="b" tone="good" dot>
                  On it
                </Badge>,
                <Muted key="q">Nothing to ask</Muted>,
              ],
              [
                "NEBOSH or SMSTS",
                <Badge key="b" tone="good" dot>
                  On it
                </Badge>,
                <Muted key="q">Nothing to ask</Muted>,
              ],
              [
                "Handover and snagging",
                <Badge key="b" tone="good" dot>
                  On it
                </Badge>,
                <Muted key="q">Nothing to ask</Muted>,
              ],
            ]}
          />
          <div className="border-t border-[var(--pv-divider)] px-4 py-3">
            <Timeline
              items={[
                {
                  time: "Mon 10:02",
                  title: "3 questions emailed to Sarah",
                  sub: "Short, one line each",
                },
                {
                  time: "Mon 19:40",
                  title: "2 answers back",
                  sub: "Built into the CV as facts, not adjectives",
                  tone: "good",
                },
                {
                  time: "Wed",
                  title: "Reminder if the third is still open",
                  tone: "neutral",
                },
              ]}
            />
          </div>
        </Card>
        <div className="flex min-h-0 items-start justify-center overflow-hidden rounded-[var(--pv-radius)] bg-[#eef2f6] pt-5">
          <CvPage
            name="Sarah Lane"
            role="Cover letter, Project Manager"
            width={410}
            text={11.5}
            lines={[
              <p key="1">Dear Hiring Manager,</p>,
              <p key="2">
                I've spent 12 years running residential sites, most recently a
                140-home phase I handed over three weeks early, with a{" "}
                <Hl>£4.2m budget</Hl> and <Hl>22 subcontractor trades</Hl> on
                site at peak.
              </p>,
              <p key="3">
                Your role asks for programme, budget and people in one pair of
                hands. That has been my job for the last four years, and the
                numbers above are what it looked like.
              </p>,
              <p key="4">
                I'd welcome the chance to talk about your next development.
              </p>,
              <p key="5">Sarah Lane</p>,
            ]}
          >
            <p className="mt-3 border-t border-[#e5e7eb] pt-2 text-[10px] text-[#6b7280]">
              Highlighted: facts from her answers this week
            </p>
          </CvPage>
        </div>
      </Fill>
    </GloApp>
  );
}

/* 35 · Free CV review ------------------------------------------------------ */

function Dots({ s }: { s: string }) {
  return (
    <span className="flex items-center gap-1">
      {s.split("").map((c, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${c === "s" ? "bg-[#2b6bea]" : c === "q" ? "border border-[#2b6bea] bg-white" : c === "x" ? "bg-[#cbd5e1]" : "bg-[#059669]"}`}
        />
      ))}
    </span>
  );
}

function FreeCvReview() {
  return (
    <GloApp nav="cvstudio">
      <GloHead
        title="CV studio"
        meta="Free reviews"
        tabs={
          <Tabs
            items={["Pipeline", "Free reviews", "ATS check", "Method"]}
            active={1}
          />
        }
      />
      <Fill className="flex flex-col gap-4">
        <Kpis
          items={[
            { label: "Reviews this week", value: "46" },
            { label: "Average score", value: "57", hint: "Out of 100" },
            { label: "Booked a call", value: "6" },
            { label: "Bought", value: "5", tone: "good" },
          ]}
        />
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_340px] gap-4">
          <Card pad={false} className="h-full">
            <Table
              dense
              sel={0}
              cols={[
                { h: "Person" },
                { h: "Target role", w: 138 },
                { h: "Score", w: 58 },
                { h: "Came from", w: 96 },
                { h: "Follow-ups", w: 96 },
                { h: "", w: 104 },
              ]}
              rows={[
                [
                  <Person key="p" name="Mark Doyle" sub="Today 09:12" />,
                  "Quantity surveyor",
                  58,
                  "Meta ad",
                  <Dots key="d" s="sqq" />,
                  <Badge key="b" tone="brand">
                    Day 1
                  </Badge>,
                ],
                [
                  <Person key="p" name="Aisha Rahman" sub="Yesterday" />,
                  "Marketing manager",
                  64,
                  "Search",
                  <Dots key="d" s="g" />,
                  <Badge key="b" tone="good">
                    Bought
                  </Badge>,
                ],
                [
                  <Person key="p" name="Ken Watts" sub="Yesterday" />,
                  "Site manager",
                  49,
                  "Meta ad",
                  <Dots key="d" s="ssq" />,
                  <Badge key="b" tone="brand">
                    Day 3
                  </Badge>,
                ],
                [
                  <Person key="p" name="Lucy Hart" sub="Mon" />,
                  "Nurse to admin",
                  71,
                  "TikTok",
                  <Dots key="d" s="sss" />,
                  <Badge key="b">Finished</Badge>,
                ],
                [
                  <Person key="p" name="Dev Patel" sub="Mon" />,
                  "Data analyst",
                  55,
                  "Search",
                  <Dots key="d" s="ssx" />,
                  <Badge key="b">Opted out</Badge>,
                ],
                [
                  <Person key="p" name="Grace Obi" sub="Sun" />,
                  "Head chef",
                  62,
                  "Meta ad",
                  <Dots key="d" s="sg" />,
                  <Badge key="b" tone="good">
                    Bought
                  </Badge>,
                ],
              ]}
            />
            <div className="flex items-center gap-4 px-4 py-2.5 text-[11.5px] text-[var(--pv-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#2b6bea]" /> Sent
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full border border-[#2b6bea]" />{" "}
                Due
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#059669]" /> Bought,
                follow-ups stop
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#cbd5e1]" /> Stopped
              </span>
            </div>
          </Card>
          <Card
            title="Mark Doyle, 58 out of 100"
            sub="Sent in 3 minutes, written for his target role"
            className="h-full"
          >
            <div className="-mt-1 space-y-2.5 text-[12px]">
              {[
                [
                  "bad",
                  "No figures on any project",
                  "Add contract values and the savings you made.",
                ],
                [
                  "warn",
                  "Two pages of duties",
                  "Lead each role with what changed because you were there.",
                ],
                ["good", "Strong first line", "Keep it."],
              ].map(([t, a, b]) => (
                <div
                  key={a}
                  className="rounded-[8px] border border-[var(--pv-border)] p-2.5"
                >
                  <Badge tone={t as Tone} dot>
                    {t === "bad" ? "Fix first" : t === "warn" ? "Fix" : "Good"}
                  </Badge>
                  <p className="mt-1 font-semibold">{a}</p>
                  <p className="text-[var(--pv-muted)]">{b}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] font-semibold">Follow-ups</p>
            <div className="mt-1.5 space-y-1 text-[12px]">
              <p className="flex justify-between">
                <span>Email, the review</span> <Muted>Sent 09:15</Muted>
              </p>
              <p className="flex justify-between">
                <span>WhatsApp, day 2</span> <Muted>Due Thu</Muted>
              </p>
              <p className="flex justify-between">
                <span>Email, day 5, then stops</span> <Muted>Due Sun</Muted>
              </p>
            </div>
          </Card>
        </div>
      </Fill>
    </GloApp>
  );
}

/* 36 · CV formatter -------------------------------------------------------- */

function CvFormatter() {
  return (
    <GloApp nav="formatter">
      <GloHead
        title="CV formatter"
        meta="Demo Recruitment Co template"
        actions={
          <>
            <Btn icon={Upload}>Upload CVs</Btn>
            <Btn v="primary" icon={Share2}>
              Share link
            </Btn>
          </>
        }
      />
      <Fill className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_260px] gap-4">
        <div className="flex min-h-0 flex-col">
          <p className="mb-2 text-[12px] font-medium text-[var(--pv-text2)]">
            As it arrived: jamie_hart_cv_FINAL2.docx
          </p>
          <div className="flex min-h-0 flex-1 justify-center overflow-hidden rounded-[var(--pv-radius)] bg-[#eef2f6] pt-4">
            <CvPage
              name="JAMIE HART"
              role="Groundworker / Labourer / Driver"
              width={300}
              lines={[
                <p
                  key="c"
                  className="rounded bg-[#fee2e2] px-1 text-[#991b1b] line-through"
                >
                  07700 900321 · jamie@example.com · 14 Example Road
                </p>,
                <p key="1" className="font-serif text-[9px] italic">
                  Hard working reliable lad looking for work!!
                </p>,
                <p key="2" className="text-[9.5px] font-bold underline">
                  EXPERIENCE
                </p>,
                <p key="3">
                  2019-now various sites, drainage, kerbs, footings, also some
                  driving
                </p>,
                <p key="4" className="font-mono text-[8px]">
                  Tickets: CSCS green, CPCS 360 (A59), first aid
                </p>,
                <p key="5" className="text-[9.5px] font-bold underline">
                  HOBBIES
                </p>,
                <p key="6">Football, fishing</p>,
              ]}
            />
          </div>
        </div>
        <div className="flex min-h-0 flex-col">
          <p className="mb-2 text-[12px] font-medium text-[var(--pv-text2)]">
            Formatted in 6 seconds
          </p>
          <div className="flex min-h-0 flex-1 justify-center overflow-hidden rounded-[var(--pv-radius)] bg-[#eef2f6] pt-4">
            <CvPage
              name="Jamie Hart"
              role="Groundworker, CPCS 360 excavator"
              width={300}
              brandBar={
                <div className="-mx-5 -mt-4 mb-3 flex items-center justify-between bg-[#0A0A0A] px-5 py-2">
                  <img
                    src={asset("/brand/agency-logo-reversed.svg")}
                    alt=""
                    className="h-3.5 w-auto"
                  />
                  <span className="text-[7.5px] text-white/70">
                    Presented by Demo Recruitment Co
                  </span>
                </div>
              }
              lines={[
                <p
                  key="s"
                  className="text-[9px] font-semibold uppercase tracking-[0.06em] text-[#E8590C]"
                >
                  Summary
                </p>,
                <p key="1">
                  Groundworker with 8 years on civils and housing sites. CSCS
                  and CPCS 360 excavator.
                </p>,
                <p
                  key="r"
                  className="text-[9px] font-semibold uppercase tracking-[0.06em] text-[#E8590C]"
                >
                  Recent work
                </p>,
                <p key="2">
                  Flood defences, Shoreham: drainage, kerbing and footings.
                </p>,
                <p key="3">
                  Housing, Worthing: 360 excavator on a 60-home phase.
                </p>,
                <p
                  key="t"
                  className="text-[9px] font-semibold uppercase tracking-[0.06em] text-[#E8590C]"
                >
                  Tickets
                </p>,
                <p key="4">CSCS, CPCS 360 excavator, first aid at work.</p>,
              ]}
            />
          </div>
        </div>
        <div className="flex min-h-0 flex-col gap-4">
          <Card title="Settings for this CV">
            <div className="-mt-1">
              <CheckLine note="Removed">Contact details</CheckLine>
              <CheckLine note="Agency's own">Header and fonts</CheckLine>
              <CheckLine note="Rewritten">Spelling and layout</CheckLine>
              <CheckLine note="Taken out">Hobbies</CheckLine>
            </div>
          </Card>
          <Card title="Share link" sub="For the client, no login">
            <span className="flex h-8 items-center gap-2 rounded-md border border-[var(--pv-border)] bg-[var(--pv-page)] px-2.5 text-[12px] text-[var(--pv-text2)]">
              <Link2 className="h-3.5 w-3.5" /> share.example/cv/7Hk2
            </span>
            <p className="mt-2 text-[11.5px] text-[var(--pv-muted)]">
              Expires in 14 days, then deleted.
            </p>
          </Card>
          <Card
            title="This month"
            sub="Monthly plan"
            className="min-h-0 flex-1"
          >
            <p className="text-[12.5px]">
              <span className="font-semibold">143</span>{" "}
              <Muted>of 200 CVs</Muted>
            </p>
            <div className="mt-2">
              <Meter value={143} max={200} h={8} />
            </div>
            <p className="mt-2 text-[11.5px] text-[var(--pv-muted)]">
              Resets on the 1st.
            </p>
          </Card>
        </div>
      </Fill>
    </GloApp>
  );
}

/* 37 · ATS check and tailoring --------------------------------------------- */

function AtsCheck() {
  return (
    <GloApp nav="cvstudio">
      <GloHead
        title="CV studio"
        meta="ATS check: Project Manager, a made-up housebuilder"
        actions={
          <Btn v="primary" icon={Sparkles}>
            Write the tailored CV
          </Btn>
        }
        tabs={
          <Tabs
            items={["Pipeline", "Free reviews", "ATS check", "Method"]}
            active={2}
          />
        }
      />
      <Fill className="grid grid-cols-[300px_minmax(0,1fr)] gap-4">
        <div className="flex min-h-0 flex-col gap-4">
          <Card title="Match" sub="Sarah Lane's CV against the advert">
            <p className="-mt-1 text-[40px] font-semibold leading-none tracking-[-0.02em]">
              74%
            </p>
            <div className="mt-3 space-y-2 text-[12px]">
              {[
                ["Must have", 8, 10],
                ["Nice to have", 3, 5],
                ["Seniority words", 4, 6],
              ].map(([l, v, m]) => (
                <div key={String(l)}>
                  <div className="flex justify-between">
                    <span>{l}</span>
                    <Muted>
                      {v} of {m}
                    </Muted>
                  </div>
                  <div className="mt-1">
                    <Meter value={Number(v)} max={Number(m)} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card
            title="Only what's true"
            sub="Before a term is added"
            className="min-h-0 flex-1"
          >
            <p className="-mt-1 text-[12px] leading-relaxed text-[var(--pv-text2)]">
              Two missing terms need her say-so. They go into the tailored
              version only if she confirms them; nothing is invented to beat the
              filter.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <Badge tone="warn">JCT contracts: asked</Badge>
              <Badge tone="warn">Valuations: asked</Badge>
            </div>
          </Card>
        </div>
        <div className="flex min-h-0 flex-col gap-4">
          <Card pad={false}>
            <Table
              dense
              cols={[
                { h: "Term in the advert" },
                { h: "Weight", w: 108 },
                { h: "On her CV", w: 112 },
                { h: "Note", w: 224 },
              ]}
              rows={[
                [
                  "Programme management",
                  <Badge key="w">Must have</Badge>,
                  <Badge key="c" tone="good" dot>
                    Found
                  </Badge>,
                  "“Ran the programme, 140 homes”",
                ],
                [
                  "Budget",
                  <Badge key="w">Must have</Badge>,
                  <Badge key="c" tone="good" dot>
                    Found
                  </Badge>,
                  "Added from her gap answer",
                ],
                [
                  "Subcontractors",
                  <Badge key="w">Must have</Badge>,
                  <Badge key="c" tone="good" dot>
                    Found
                  </Badge>,
                  "“22 trades at peak”",
                ],
                [
                  "JCT contracts",
                  <Badge key="w">Must have</Badge>,
                  <Badge key="c" tone="bad" dot>
                    Missing
                  </Badge>,
                  "Asked her, not added yet",
                ],
                [
                  "Valuations",
                  <Badge key="w">Must have</Badge>,
                  <Badge key="c" tone="bad" dot>
                    Missing
                  </Badge>,
                  "Asked her, not added yet",
                ],
                [
                  "Client liaison",
                  <Badge key="w">Nice to have</Badge>,
                  <Badge key="c" tone="good" dot>
                    Found
                  </Badge>,
                  "Said as “client meetings”",
                ],
                [
                  "NHBC",
                  <Badge key="w">Nice to have</Badge>,
                  <Badge key="c" tone="warn" dot>
                    Waiting
                  </Badge>,
                  "Her answer is still open",
                ],
              ]}
            />
          </Card>
          <Card
            title="Tailored lines"
            sub="Her words, reordered to the advert"
            className="min-h-0 flex-1"
          >
            <div className="-mt-1 grid grid-cols-2 gap-3 text-[12px] leading-relaxed">
              <div className="rounded-[8px] bg-[#fef2f2] p-2.5">
                <p className="text-[11px] font-medium text-[var(--pv-bad)]">
                  Before
                </p>
                <p className="mt-1">
                  Responsible for running site and dealing with subbies and the
                  client.
                </p>
              </div>
              <div className="rounded-[8px] bg-[#ecfdf5] p-2.5">
                <p className="text-[11px] font-medium text-[var(--pv-good)]">
                  After
                </p>
                <p className="mt-1">
                  Managed programme, a £4.2m budget and 22 subcontractor trades,
                  with weekly client liaison through to handover.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Fill>
    </GloApp>
  );
}

export const screens = {
  "demand-research": DemandResearch,
  dropshipping: Dropshipping,
  connections: Connections,
  "cv-pipeline": CvPipeline,
  "gap-analysis": GapAnalysis,
  "free-cv-review": FreeCvReview,
  "cv-formatter": CvFormatter,
  "ats-check": AtsCheck,
};
