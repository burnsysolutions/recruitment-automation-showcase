import {
  Download,
  ExternalLink,
  FileText,
  Mail,
  Pause,
  Pencil,
  Send,
  Upload,
  UserPlus,
} from "lucide-react";
import { AvolonApp, NextStep, WEEK } from "../shells";
import {
  Avatar,
  Badge,
  Banner,
  Btn,
  Card,
  Kpis,
  Kv,
  Meter,
  Muted,
  Person,
  Table,
  Tabs,
  Timeline,
} from "../kit";
import { Columns, Legend, Segments } from "../charts";

const AGE = ["#223754", "#39767E", "#10C4CE", "#f59e0b", "#b81e1e"];

/* 8 · Sales ledger --------------------------------------------------------- */

const LEDGER: [
  string,
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  number,
][] = [
  ["Downsline", 6, "£48,310.20", "£33,860.20", "£14,450.00", "", "", "", 60],
  [
    "Northgate Build",
    5,
    "£41,226.48",
    "£30,226.48",
    "£11,000.00",
    "",
    "",
    "",
    69,
  ],
  [
    "Seafront Interiors",
    4,
    "£29,964.00",
    "£22,050.00",
    "£7,914.00",
    "",
    "",
    "",
    60,
  ],
  [
    "Corvid M&E",
    4,
    "£27,318.70",
    "£16,000.00",
    "£4,954.70",
    "£6,364.00",
    "",
    "£6,364.00",
    68,
  ],
  [
    "Weald Civils",
    3,
    "£21,510.92",
    "£15,784.92",
    "",
    "£4,320.00",
    "£1,406.00",
    "£5,726.00",
    36,
  ],
  [
    "Brookside Developments",
    2,
    "£15,088.00",
    "£11,088.00",
    "£4,000.00",
    "",
    "",
    "",
    50,
  ],
  [
    "Ridgeway Civils",
    2,
    "£14,969.60",
    "£12,054.60",
    "",
    "",
    "£2,915.00",
    "£2,915.00",
    60,
  ],
  [
    "Harbourline Fit-Out",
    1,
    "£14,092.20",
    "£10,156.20",
    "",
    "£3,936.00",
    "",
    "£3,936.00",
    71,
  ],
];

function Ledger() {
  return (
    <AvolonApp
      nav="ledger"
      title="Sales ledger"
      context="Who owes what and how old it is. Each invoice is aged by the days since its date; overdue is counted apart."
      actions={
        <>
          <Btn v="band" icon={Download}>
            Export
          </Btn>
          <Btn v="band" icon={FileText}>
            Statements
          </Btn>
        </>
      }
    >
      <div className="flex h-full flex-col gap-3">
        <Tabs
          items={[
            "Summary",
            "Detailed",
            "Mark paid",
            "Statements",
            "Previous system",
          ]}
        />
        <Kpis
          items={[
            {
              label: "Outstanding",
              value: "£212,480.10",
              hint: "27 open invoices, 8 clients",
            },
            {
              label: "Overdue",
              value: "£18,941.00",
              hint: "5 invoices, 4 clients",
              tone: "warn",
            },
            {
              label: "Owed back to clients",
              value: "£0.00",
              hint: "No credits waiting",
            },
            {
              label: "Days to collect",
              value: "41",
              hint: "On the last 90 days",
            },
            { label: "Over their limit", value: "0", hint: "Highest uses 71%" },
          ]}
        />
        <Card pad={false} className="min-h-0 flex-1">
          <div className="border-b border-[var(--pv-divider)] px-4 py-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] font-semibold">Balance by age</span>
              <Legend
                items={[
                  { label: "0 to 30 days £151,220.40", color: AGE[0] },
                  { label: "31 to 60 £42,318.70", color: AGE[1] },
                  { label: "61 to 90 £14,620.00", color: AGE[2] },
                  { label: "91 to 120 £4,321.00", color: AGE[3] },
                  { label: "Over 120 £0.00", color: AGE[4] },
                ]}
              />
            </div>
            <Segments
              h={10}
              parts={[
                { label: "0 to 30", v: 151220.4, color: AGE[0] },
                { label: "31 to 60", v: 42318.7, color: AGE[1] },
                { label: "61 to 90", v: 14620, color: AGE[2] },
                { label: "91 to 120", v: 4321, color: AGE[3] },
              ]}
            />
          </div>
          <Table
            dense
            small
            cols={[
              { h: "Client" },
              { h: "Open", align: "right", w: 46 },
              { h: "Outstanding", align: "right", w: 100 },
              { h: "0 to 30", align: "right", w: 100 },
              { h: "31 to 60", align: "right", w: 90 },
              { h: "61 to 90", align: "right", w: 90 },
              { h: "91 to 120", align: "right", w: 84 },
              { h: "Overdue", align: "right", w: 96 },
              { h: "Limit used", w: 116 },
            ]}
            rows={LEDGER.map(([c, o, out, a, b, d, e, od, used]) => [
              <span key="c" className="font-medium">
                {c}
              </span>,
              o,
              <span key="o" className="font-semibold">
                {out}
              </span>,
              a,
              b || <Muted key="b">–</Muted>,
              d || <Muted key="d">–</Muted>,
              e || <Muted key="e">–</Muted>,
              od ? (
                <span key="od" className="font-medium text-[var(--pv-warn)]">
                  {od}
                </span>
              ) : (
                <Muted key="od">–</Muted>
              ),
              <span key="u" className="flex items-center gap-2">
                <Meter
                  value={used}
                  w={64}
                  tone={used > 70 ? "warn" : "brand"}
                />
                <span className="text-[11.5px]">{used}%</span>
              </span>,
            ])}
            foot={[
              "8 clients",
              "27",
              "£212,480.10",
              "£151,220.40",
              "£42,318.70",
              "£14,620.00",
              "£4,321.00",
              "£18,941.00",
              "",
            ]}
          />
        </Card>
      </div>
    </AvolonApp>
  );
}

/* 9 · The previous system's invoices, side by side ------------------------- */

function OldInvoices() {
  return (
    <AvolonApp
      nav="archive"
      title="Invoice archive"
      context="Years of the previous system's invoices, kept apart and never used for pay. Set beside the platform's own, week by week."
      actions={
        <Btn v="band" icon={Upload}>
          Load an export
        </Btn>
      }
    >
      <div className="flex h-full flex-col gap-3">
        <Tabs items={["Side by side, w/e 18 Oct", "Archive", "Load"]} />
        <Kpis
          items={[
            { label: "Compared", value: "54", hint: "Sheets against invoices" },
            {
              label: "The same",
              value: "49",
              tone: "good",
              hint: "Units, rates and money",
            },
            { label: "A penny apart", value: "3", hint: "VAT rounding only" },
            {
              label: "Different",
              value: "1",
              tone: "bad",
              hint: "Said line by line",
            },
            {
              label: "Platform only",
              value: "1",
              hint: "A late sheet on its own week",
            },
          ]}
        />
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_330px] gap-3">
          <Card pad={false} className="h-full">
            <Table
              dense
              sel={3}
              cols={[
                { h: "Client" },
                { h: "PO", w: 66 },
                { h: "Previous system", align: "right", w: 116 },
                { h: "Platform", align: "right", w: 96 },
                { h: "Result", w: 138 },
              ]}
              rows={[
                [
                  "Weald Civils",
                  "4471",
                  "£3,749.04",
                  "£3,749.04",
                  <Badge key="r" tone="good" dot>
                    Same
                  </Badge>,
                ],
                [
                  "Seafront Interiors",
                  "SI-208",
                  "£7,350.00",
                  "£7,350.00",
                  <Badge key="r" tone="good" dot>
                    Same
                  </Badge>,
                ],
                [
                  "Northgate Build",
                  "NB-31",
                  "£9,912.35",
                  "£9,912.36",
                  <Badge key="r" tone="neutral" dot>
                    A penny apart
                  </Badge>,
                ],
                [
                  "Corvid M&E",
                  "CM-77",
                  "£8,582.64",
                  "£8,654.40",
                  <Badge key="r" tone="bad" dot>
                    Different
                  </Badge>,
                ],
                [
                  "Downsline",
                  "DL-12",
                  "£11,286.00",
                  "£11,286.00",
                  <Badge key="r" tone="good" dot>
                    Same
                  </Badge>,
                ],
                [
                  "Ridgeway Civils",
                  "RC-9",
                  "£4,018.20",
                  "£4,018.20",
                  <Badge key="r" tone="good" dot>
                    Same
                  </Badge>,
                ],
                [
                  "Brookside Developments",
                  "BD-04",
                  "£5,544.00",
                  "£5,544.00",
                  <Badge key="r" tone="good" dot>
                    Same
                  </Badge>,
                ],
                [
                  "Harbourline Fit-Out",
                  "HF-3",
                  "£6,120.01",
                  "£6,120.00",
                  <Badge key="r" tone="neutral" dot>
                    A penny apart
                  </Badge>,
                ],
                [
                  "Weald Civils",
                  "4471",
                  <Muted key="m">none</Muted>,
                  "£1,066.80",
                  <Badge key="r" tone="brand" dot>
                    Platform only
                  </Badge>,
                ],
              ]}
            />
            <p className="px-4 py-2.5 text-[11.5px] text-[var(--pv-muted)]">
              Each sheet goes with the invoice nearest to it: same PO and client
              first, then the nearest in money. Never by order of size.
            </p>
          </Card>
          <Card
            title="Corvid M&E, CM-77"
            sub="Where the two differ"
            className="h-full"
          >
            <div className="-mt-1">
              <Table
                bare
                dense
                cols={[
                  { h: "Line, net" },
                  { h: "Previous", align: "right", w: 86 },
                  { h: "Platform", align: "right", w: 86 },
                ]}
                rowTone={[undefined, undefined, "bad"]}
                rows={[
                  ["Tom Ellery", "£1,076.40", "£1,076.40"],
                  ["Aidan Kerr", "£1,256.10", "£1,256.10"],
                  [
                    <span key="l" className="block leading-tight">
                      Liam Ford
                      <span className="block text-[11px] text-[var(--pv-bad)]">
                        38 h there, 40 h here
                      </span>
                    </span>,
                    "£1,136.20",
                    "£1,196.00",
                  ],
                  ["Six others", "£3,683.50", "£3,683.50"],
                ]}
              />
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-[var(--pv-text2)]">
              Liam Ford's signed sheet says 40 hours. The previous system billed
              38. The platform's own check stopped its invoice for the same
              line, so nobody bills it until it's settled.
            </p>
            <Banner tone="neutral" className="mt-3" title="Evidence only.">
              Nothing in the archive reaches pay, an invoice or a file.
            </Banner>
          </Card>
        </div>
      </div>
    </AvolonApp>
  );
}

/* 10 · Clients ------------------------------------------------------------- */

function Clients() {
  return (
    <AvolonApp
      nav="clients"
      title="Weald Civils"
      context="Active client. Particulars from the record kept in the previous system where ours held nothing."
      actions={
        <>
          <Btn v="band" icon={FileText}>
            Statement
          </Btn>
          <Btn v="band" icon={Pencil}>
            Edit details
          </Btn>
        </>
      }
    >
      <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3">
        <div className="flex min-h-0 flex-col gap-3">
          <Card title="Basic information">
            <Kv
              rows={[
                ["Registered name", "Weald Civils Limited (made up)"],
                ["Company number", "0000 4471 (made up)"],
                ["Address", "1 Example Street, Horsham"],
                ["Invoices go to", "accounts@wealdcivils.example"],
                ["VAT", "20%"],
              ]}
            />
          </Card>
          <Card
            title="Payment terms"
            sub="Dated rows. The terms in force on the invoice's date set its due date."
            pad={false}
          >
            <Table
              dense
              cols={[
                { h: "For", w: 70 },
                { h: "Terms" },
                { h: "From", w: 96 },
                { h: "To", w: 106 },
              ]}
              rows={[
                [
                  "Temp",
                  "30 days after month end",
                  "1 Jan 2025",
                  <Badge key="o" tone="good">
                    In force
                  </Badge>,
                ],
                ["Temp", "30 days", "1 Mar 2023", "31 Dec 2024"],
                [
                  "Perm",
                  "14 days",
                  "1 Mar 2023",
                  <Badge key="o" tone="good">
                    In force
                  </Badge>,
                ],
              ]}
            />
          </Card>
          <Card
            title="Credit"
            sub="Set by an approver, with a reason"
            className="shrink-0"
          >
            <div className="flex items-center justify-between text-[12.5px]">
              <span>
                <span className="font-semibold">£21,510.92</span>{" "}
                <Muted>of £60,000 limit</Muted>
              </span>
              <Muted>36% used, BDP £45,000</Muted>
            </div>
            <div className="mt-2">
              <Meter value={36} h={8} />
            </div>
          </Card>
          <Card title="Recent invoices" pad={false} className="min-h-0 flex-1">
            <Table
              dense
              cols={[
                { h: "Number", w: 104 },
                { h: "Week" },
                { h: "Total", align: "right", w: 96 },
                { h: "", w: 116 },
              ]}
              rows={[
                [
                  "INV-001284",
                  "18 Oct",
                  "£3,749.04",
                  <Badge key="s" tone="brand" dot>
                    Draft
                  </Badge>,
                ],
                [
                  "INV-001288",
                  "11 Oct, late",
                  "£1,066.80",
                  <Badge key="s" tone="brand" dot>
                    Draft
                  </Badge>,
                ],
                [
                  "INV-001262",
                  "11 Oct",
                  "£4,310.40",
                  <Badge key="s" tone="good" dot>
                    Paid 12 Oct
                  </Badge>,
                ],
              ]}
            />
          </Card>
        </div>
        <div className="flex min-h-0 flex-col gap-3">
          <Card title="Sites and purchase orders" pad={false}>
            <Table
              dense
              cols={[
                { h: "Site" },
                { h: "PO", w: 66 },
                { h: "Men this week", align: "right", w: 104 },
                { h: "", w: 84 },
              ]}
              rows={[
                [
                  "Shoreham Harbour",
                  "4471",
                  3,
                  <Badge key="s" tone="good">
                    Open
                  </Badge>,
                ],
                [
                  "Littlehampton",
                  "4480",
                  2,
                  <Badge key="s" tone="good">
                    Open
                  </Badge>,
                ],
                ["Bognor flood wall", "4392", 0, <Badge key="s">Closed</Badge>],
              ]}
            />
          </Card>
          <Card
            title="History"
            sub="Every change, who made it and why"
            className="min-h-0 flex-1"
          >
            <Timeline
              items={[
                {
                  time: "14 Nov",
                  title: "Payment terms set: 30 days after month end",
                  sub: "By Sam, approver. Note: as on their contract.",
                },
                {
                  time: "14 Nov",
                  title: "Credit limit £60,000, BDP £45,000",
                  sub: "By Sam, approver. Note: reviewed with the owner.",
                },
                {
                  time: "14 Nov",
                  title: "Linked to the previous system's record",
                  sub: "Its particulars filled the boxes ours left empty.",
                },
                {
                  time: "26 Oct",
                  title: "Merged “Weald Civils Ltd (Horsham)” into this record",
                  sub: "14 invoices, 3 POs and their terms moved across.",
                  tone: "good",
                },
                {
                  time: "8 Nov",
                  title: "Site Littlehampton added from the Mini Plan",
                  sub: "PO 4480, found by its letters and digits",
                  tone: "neutral",
                },
                {
                  time: "3 Sep",
                  title: "Client created from Bullhorn",
                  tone: "neutral",
                },
              ]}
            />
          </Card>
        </div>
      </div>
    </AvolonApp>
  );
}

/* 11 · Weekly check against the owner's figures ----------------------------- */

function WeeklyCheck() {
  return (
    <AvolonApp
      nav="plan"
      title="Weekly hours check"
      context="Each man's Units from the owner's own spreadsheet beside what payroll makes of his signed sheets. Evidence, never pay."
      steps={WEEK.run}
      next={<NextStep>Next: Check and lock run 42</NextStep>}
    >
      <div className="flex h-full flex-col gap-3">
        <Kpis
          items={[
            { label: "Men compared", value: "96" },
            { label: "Agree", value: "87", tone: "good" },
            { label: "Differ", value: "5", tone: "warn" },
            { label: "Payroll would hold", value: "4" },
          ]}
        />
        <Card pad={false} className="min-h-0 flex-1">
          <div className="flex items-center justify-between border-b border-[var(--pv-divider)] px-4 py-2.5">
            <span className="text-[13px] font-semibold">Differences first</span>
            <Muted className="text-[11.5px]">
              The owner's figures are never used to pay anyone
            </Muted>
          </div>
          <Table
            dense
            cols={[
              { h: "Worker", w: 160 },
              { h: "Client", w: 146 },
              { h: "Owner's sheet", align: "right", w: 104 },
              { h: "Platform", align: "right", w: 96 },
              { h: "", w: 116 },
              { h: "Why" },
            ]}
            rowTone={[undefined, undefined, undefined, undefined, undefined]}
            rows={[
              [
                <Person key="p" name="Connor Webb" />,
                "Downsline",
                "5 d",
                "4.5 d",
                <Badge key="b" tone="warn">
                  −0.5 d
                </Badge>,
                "His sheet shows a half day on Friday",
              ],
              [
                <Person key="p" name="Liam Ford" />,
                "Corvid M&E",
                "38 h",
                "40 h",
                <Badge key="b" tone="warn">
                  +2 h
                </Badge>,
                "His signed sheet says 40",
              ],
              [
                <Person key="p" name="Daniel Price" />,
                "Northgate Build",
                "41 h",
                "4 d + 5 h",
                <Badge key="b">Same hours</Badge>,
                "Paid as days and hours, as invoiced",
              ],
              [
                <Person key="p" name="Jack Fox" />,
                "Weald Civils",
                "–",
                "40 h",
                <Badge key="b" tone="warn">
                  Not on plan
                </Badge>,
                "Held until he is on the Mini Plan",
              ],
              [
                <Person key="p" name="Ellis Moore" />,
                "Seafront Interiors",
                "45 h",
                "–",
                <Badge key="b" tone="warn">
                  Held
                </Badge>,
                "Wednesday on his sheet reads “n/a”",
              ],
              [
                <Person key="p" name="Sam Turner" />,
                "Brookside",
                "40 h",
                "–",
                <Badge key="b" tone="warn">
                  Held
                </Badge>,
                "No rate for him on the plan",
              ],
              [
                <Person key="p" name="Jamie Hart" />,
                "Weald Civils",
                "44 h",
                "44 h",
                <Badge key="b" tone="good">
                  Agree
                </Badge>,
                "",
              ],
              [
                <Person key="p" name="Kieran Shaw" />,
                "Downsline",
                "5 d",
                "5 d",
                <Badge key="b" tone="good">
                  Agree
                </Badge>,
                "",
              ],
              [
                <Person key="p" name="Ryan Cole" />,
                "Weald Civils",
                "35 h",
                "35 h",
                <Badge key="b" tone="good">
                  Agree
                </Badge>,
                "",
              ],
            ]}
          />
        </Card>
      </div>
    </AvolonApp>
  );
}

/* 12 · Registrations into Bullhorn ----------------------------------------- */

function Registrations() {
  return (
    <AvolonApp
      nav="registrations"
      title="Registrations"
      context="Website sign-ups, pushed into Bullhorn every hour with their files and consents attached."
      actions={
        <Btn v="band" icon={Send}>
          Push now
        </Btn>
      }
    >
      <div className="flex h-full flex-col gap-3">
        <Kpis
          items={[
            { label: "This week", value: "23", hint: "From the register page" },
            {
              label: "In Bullhorn",
              value: "21",
              tone: "good",
              hint: "With files attached",
            },
            {
              label: "Waiting for the next push",
              value: "2",
              hint: "At 10:00",
            },
            {
              label: "Files attached",
              value: "64",
              hint: "Cards, tickets and CVs",
            },
          ]}
        />
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_320px] gap-3">
          <Card pad={false} className="h-full">
            <Table
              dense
              sel={0}
              cols={[
                { h: "Name" },
                { h: "Trade", w: 116 },
                { h: "Area", w: 58 },
                { h: "Files", w: 140 },
                { h: "Bullhorn", w: 146 },
              ]}
              rows={[
                [
                  <Person key="p" name="Nathan Hughes" sub="Today 08:52" />,
                  "Ganger",
                  "PO19",
                  "CSCS, SMSTS, CV",
                  <Badge key="b" tone="brand" dot>
                    Next push 10:00
                  </Badge>,
                ],
                [
                  <Person key="p" name="Tyler Brooks" sub="Today 08:14" />,
                  "Groundworker",
                  "BN43",
                  "CSCS, CV",
                  <Badge key="b" tone="good" dot>
                    In, ID 48211
                  </Badge>,
                ],
                [
                  <Person key="p" name="Piotr Kowal" sub="Today 07:40" />,
                  "360 excavator",
                  "RH13",
                  "CPCS, CV",
                  <Badge key="b" tone="good" dot>
                    In, ID 48212
                  </Badge>,
                ],
                [
                  <Person key="p" name="Jade Collins" sub="Mon 21:05" />,
                  "Site engineer",
                  "BN1",
                  "CV",
                  <Badge key="b" tone="good" dot>
                    In, ID 48190
                  </Badge>,
                ],
                [
                  <Person key="p" name="Mihai Popescu" sub="Mon 18:31" />,
                  "Dumper driver",
                  "BN11",
                  "CPCS",
                  <Badge key="b" tone="good" dot>
                    In, ID 48188
                  </Badge>,
                ],
                [
                  <Person key="p" name="Owen Pike" sub="Mon 12:10" />,
                  "Groundworker",
                  "BN3",
                  "CSCS",
                  <Badge key="b" tone="brand" dot>
                    Next push 10:00
                  </Badge>,
                ],
                [
                  <Person key="p" name="Grace Fenn" sub="Sun 16:44" />,
                  "Setting out",
                  "RH16",
                  "CV",
                  <Badge key="b" tone="good" dot>
                    In, ID 48160
                  </Badge>,
                ],
              ]}
            />
          </Card>
          <Card
            title="Nathan Hughes"
            sub="As it will reach Bullhorn"
            className="h-full"
          >
            <Kv
              labelW={96}
              rows={[
                ["Status", "Pre-Registered"],
                ["Source", "Website"],
                ["Trades", "Ganger, groundworker"],
                ["Area", "Chichester, PO19"],
                ["Mobile", "07700 900215"],
                ["Owner", "The desk"],
              ]}
            />
            <p className="mt-3 text-[12px] font-semibold">Files</p>
            <div className="mt-1.5 space-y-1.5">
              {[
                "CSCS card, front and back",
                "SMSTS certificate",
                "CV, NathanHughes.pdf",
              ].map((f) => (
                <span key={f} className="flex items-center gap-2 text-[12px]">
                  <FileText className="h-3.5 w-3.5 text-[var(--pv-link)]" /> {f}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[12px] font-semibold">Consents</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <Badge tone="good">Terms of engagement</Badge>
              <Badge tone="good">Privacy notice</Badge>
              <Badge>Job alerts: no</Badge>
            </div>
          </Card>
        </div>
      </div>
    </AvolonApp>
  );
}

/* 13 · Shortlists ---------------------------------------------------------- */

const SHORT: [string, string, number, string, string, string, string][] = [
  [
    "Grant Hayes",
    "Haywards Heath",
    83,
    "258 shifts",
    "Last week",
    "13.5 mi",
    "Free now",
  ],
  [
    "Jack Hale",
    "Lancing",
    78,
    "256 shifts",
    "3 weeks ago",
    "2.6 mi",
    "From Mon",
  ],
  [
    "Kieran Ward",
    "Haywards Heath",
    74,
    "115 shifts",
    "Last week",
    "13.1 mi",
    "Not said",
  ],
  [
    "Lewis Fox",
    "Lewes",
    60,
    "104 shifts",
    "2 months ago",
    "12.6 mi",
    "Free now",
  ],
  [
    "Jack Reid",
    "Worthing",
    57,
    "64 shifts",
    "Last month",
    "5.7 mi",
    "Not said",
  ],
  [
    "Sophie Lowe",
    "Lancing",
    50,
    "9 shifts",
    "Last month",
    "4.1 mi",
    "Free now",
  ],
  ["Ben Carter", "Brighton", 44, "None", "Never", "6.4 mi", "Free now"],
];

function Shortlists() {
  return (
    <AvolonApp
      nav="shortlists"
      title="4 groundworkers, Shoreham-by-Sea"
      context="Weald Civils, from Mon 19 Oct, £20.00 pay. Built 14 minutes after the job went on Bullhorn."
      actions={
        <>
          <Btn v="band" icon={ExternalLink}>
            Open in Bullhorn
          </Btn>
          <Btn v="bandPrimary" icon={Mail}>
            Email to the desk
          </Btn>
        </>
      }
    >
      <div className="grid h-full grid-cols-[minmax(0,1fr)_270px] gap-3">
        <Card pad={false} className="h-full">
          <div className="flex items-center justify-between border-b border-[var(--pv-divider)] px-4 py-2.5">
            <span className="text-[13px] font-semibold">
              Ranked, best first
            </span>
            <Muted className="text-[11.5px]">
              Available or pre-registered, within 35 miles, cards in date
            </Muted>
          </div>
          <Table
            dense
            sel={0}
            cols={[
              { h: "", w: 30 },
              { h: "Candidate" },
              { h: "Score", w: 114 },
              { h: "Worked for us", w: 96 },
              { h: "Last worked", w: 102 },
              { h: "Distance", align: "right", w: 70 },
              { h: "Available", w: 108 },
            ]}
            rows={SHORT.map(([n, town, sc, shifts, last, dist, av], i) => [
              <Muted key="i">{i + 1}</Muted>,
              <Person key="p" name={n} sub={town} />,
              <span key="s" className="flex items-center gap-2">
                <Meter value={sc} w={70} />
                <span className="font-semibold">{sc}</span>
              </span>,
              shifts,
              last,
              dist,
              av === "Free now" ? (
                <Badge key="a" tone="good" dot>
                  Free now
                </Badge>
              ) : (
                av
              ),
            ])}
          />
        </Card>
        <div className="flex min-h-0 flex-col gap-3">
          <Card title="Weights" sub="Set by the office, locked once used">
            <div className="-mt-1 space-y-2">
              {[
                ["Worked for Avolon", 60],
                ["Recent work", 15],
                ["Distance to site", 12],
                ["Last contact", 8],
                ["Said they're available", 5],
              ].map(([l, w]) => (
                <div key={String(l)}>
                  <div className="flex justify-between text-[12px]">
                    <span>{l}</span>
                    <span className="font-semibold">{w}</span>
                  </div>
                  <div className="mt-1">
                    <Meter value={Number(w)} max={60} h={5} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11.5px] leading-snug text-[var(--pv-muted)]">
              A signal with no value is left out of the score, not counted as
              nought.
            </p>
          </Card>
          <Card
            title="Emailed to the desk"
            sub="10:07, with mobiles, ready to call"
            className="min-h-0 flex-1"
          >
            <div className="-mt-1 space-y-1.5 text-[12px]">
              {SHORT.slice(0, 4).map(([n, , sc]) => (
                <div key={n} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Avatar name={n} size={22} /> {n}
                  </span>
                  <Muted>{sc}</Muted>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AvolonApp>
  );
}

/* 14 · Availability sweep -------------------------------------------------- */

function Availability() {
  return (
    <AvolonApp
      nav="sweep"
      title="Availability sweep"
      context="Candidates Bullhorn hasn't heard from in 6 to 12 months get a one-tap link each morning. Answers go back hourly."
      actions={
        <>
          <span className="inline-flex h-8 items-center gap-1.5 rounded-[var(--pv-radius-ctl)] bg-white/10 px-3 text-[12.5px] font-medium text-white">
            <span className="h-2 w-2 rounded-full bg-[#10C4CE]" /> Sending on
          </span>
          <Btn v="band" icon={Pause}>
            Pause
          </Btn>
        </>
      }
    >
      <div className="flex h-full flex-col gap-3">
        <Kpis
          items={[
            {
              label: "Emailed this morning",
              value: "40",
              hint: "07:30, one link each",
            },
            { label: "Answered so far", value: "9", hint: "Since 07:30" },
            {
              label: "Written to Bullhorn",
              value: "7",
              hint: "Next write 11:00",
            },
            { label: "Stopped", value: "1", hint: "Suppressed at once" },
          ]}
        />
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_300px] gap-3">
          <div className="flex min-h-0 flex-col gap-3">
            <Card title="Answers by day" sub="The last four weeks">
              <Columns
                w={640}
                h={132}
                data={[
                  6, 8, 5, 9, 7, 0, 0, 8, 10, 6, 7, 9, 0, 0, 7, 11, 8, 6, 9, 0,
                  0, 8, 9, 7, 10, 9,
                ].map((v, i) => ({
                  label: ["28 Sep", "5 Oct", "12 Oct", "19 Oct"][i / 7] ?? "",
                  v,
                }))}
              />
            </Card>
            <Card pad={false} className="min-h-0 flex-1">
              <Table
                dense
                cols={[
                  { h: "Candidate" },
                  { h: "Answer", w: 170 },
                  { h: "When", w: 70 },
                  { h: "Bullhorn", w: 150 },
                ]}
                rows={[
                  [
                    <Person key="p" name="Tyler Brooks" sub="Groundworker" />,
                    <Badge key="a" tone="good" dot>
                      Free now
                    </Badge>,
                    "08:14",
                    "Written 09:00",
                  ],
                  [
                    <Person key="p" name="Mihai Popescu" sub="Dumper driver" />,
                    <Badge key="a" tone="brand" dot>
                      Free from Mon 26 Oct
                    </Badge>,
                    "08:31",
                    "Written 09:00",
                  ],
                  [
                    <Person key="p" name="Gary Lane" sub="Ganger" />,
                    <Badge key="a">Not looking</Badge>,
                    "08:47",
                    "Written 09:00",
                  ],
                  [
                    <Person key="p" name="Owen Pike" sub="Groundworker" />,
                    <Badge key="a" tone="good" dot>
                      Free now
                    </Badge>,
                    "09:40",
                    <Muted key="m">At 11:00</Muted>,
                  ],
                ]}
              />
            </Card>
          </div>
          <Card
            title="The email they get"
            sub="Single use, from the desk's own address"
            className="h-full"
          >
            <div className="-mt-1 rounded-[10px] border border-[var(--pv-border)] p-3 text-[12px] leading-relaxed">
              <p className="font-semibold">Are you free for work, Tyler?</p>
              <p className="mt-1.5 text-[var(--pv-text2)]">
                We've got groundworks running across Sussex this month. Tap one
                button and we'll update your record.
              </p>
              <div className="mt-3 space-y-1.5">
                {["I'm free now", "Free from a date", "Not looking"].map(
                  (b, i) => (
                    <span
                      key={b}
                      className={`flex h-8 items-center justify-center rounded-md text-[12px] font-medium ${i === 0 ? "bg-[#223754] text-white" : "border border-[var(--pv-border)]"}`}
                    >
                      {b}
                    </span>
                  ),
                )}
              </div>
              <p className="mt-3 text-[11px] text-[var(--pv-muted)]">
                Reply STOP and we won't contact you again.
              </p>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-[var(--pv-muted)]">
              <UserPlus className="h-3.5 w-3.5" /> Anyone on a live shortlist is
              left for a person to call.
            </p>
          </Card>
        </div>
      </div>
    </AvolonApp>
  );
}

export const screens = {
  ledger: Ledger,
  "old-invoices": OldInvoices,
  clients: Clients,
  "weekly-check": WeeklyCheck,
  registrations: Registrations,
  shortlists: Shortlists,
  availability: Availability,
};
