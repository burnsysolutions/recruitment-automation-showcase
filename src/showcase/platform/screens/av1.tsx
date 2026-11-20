import {
  Ban,
  CalendarRange,
  CircleCheck,
  Download,
  FileSpreadsheet,
  FileText,
  Lock,
  Loader2,
  Paperclip,
  Play,
  RefreshCw,
  Upload,
} from "lucide-react";
import { AvolonApp, NextStep, WEEK } from "../shells";
import {
  Avatar,
  Badge,
  Banner,
  Btn,
  Card,
  Check,
  CheckLine,
  Chips,
  Kpis,
  Kv,
  Muted,
  Person,
  Table,
  Tabs,
  type Tone,
} from "../kit";
import { AvolonInvoicePage, ScanSheet } from "./parts";

/* 1 · Timesheet Inbox ------------------------------------------------------ */

const MAIL: {
  from: string;
  subject: string;
  time: string;
  files: string;
  tone: Tone;
  state: string;
  spin?: boolean;
}[] = [
  {
    from: "Weald Civils",
    subject: "Weald Civils, PO 4471 w.e. 18.10.26",
    time: "08:12",
    files: "1 PDF",
    tone: "good",
    state: "1 sheet filed",
  },
  {
    from: "Seafront Interiors",
    subject: "Kemptown hotel timesheets WE 18/10",
    time: "08:05",
    files: "1 PDF, 3 pages",
    tone: "good",
    state: "3 sheets filed",
  },
  {
    from: "Corvid M&E",
    subject: "CM-77 weekly sheet",
    time: "07:58",
    files: "2 photos",
    tone: "warn",
    state: "Week in doubt",
  },
  {
    from: "Downsline",
    subject: "DL-12 timesheet attached",
    time: "07:41",
    files: "1 photo",
    tone: "brand",
    state: "Reading",
    spin: true,
  },
  {
    from: "Northgate Build",
    subject: "Lewes phase 2, two gangs",
    time: "07:33",
    files: "1 PDF, 2 pages",
    tone: "good",
    state: "2 sheets filed",
  },
  {
    from: "Brookside Developments",
    subject: "Timesheet, Burgess Hill",
    time: "Mon 18:20",
    files: "1 PDF, 2 pages",
    tone: "warn",
    state: "1 page not filed",
  },
  {
    from: "Ridgeway Civils",
    subject: "Fwd: photos from site",
    time: "Mon 17:44",
    files: "3 photos",
    tone: "neutral",
    state: "Not a timesheet",
  },
  {
    from: "Seafront Interiors",
    subject: "Re: missing sheet for Ellis",
    time: "Mon 17:02",
    files: "1 PDF",
    tone: "good",
    state: "1 sheet filed",
  },
];

function TimesheetInbox() {
  return (
    <AvolonApp
      nav="inbox"
      title="Timesheet Inbox"
      context="Every email to the timesheet address, read as it lands and filed to its client, PO and week."
      actions={
        <Btn v="band" icon={Upload}>
          Read a sheet
        </Btn>
      }
      steps={WEEK.inbox}
      next={<NextStep>Next: Approve 6 timesheets</NextStep>}
    >
      <div className="grid h-full grid-cols-[408px_minmax(0,1fr)] gap-4">
        <Card pad={false} className="h-full">
          <div className="border-b border-[var(--pv-divider)] px-4 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold">
                Today and yesterday
              </span>
              <Muted className="text-[11.5px]">Read every minute</Muted>
            </div>
            <Tabs
              className="mt-2.5"
              items={[
                "All 38",
                "Needs a person 3",
                "Filed 33",
                "Not timesheets 2",
              ]}
            />
          </div>
          <div>
            {MAIL.map((m, i) => (
              <div
                key={m.subject}
                className={`flex gap-3 border-b border-[var(--pv-divider)] px-4 py-[9px] ${i === 0 ? "bg-[var(--pv-primary-tint)] shadow-[inset_3px_0_0_var(--pv-dot)]" : ""}`}
              >
                <Avatar name={m.from} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[12.5px] font-semibold">
                      {m.from}
                    </span>
                    <span className="shrink-0 text-[11px] text-[var(--pv-muted)]">
                      {m.time}
                    </span>
                  </div>
                  <p className="truncate text-[12px] text-[var(--pv-text2)]">
                    {m.subject}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] text-[var(--pv-muted)]">
                      <Paperclip className="h-3 w-3" /> {m.files}
                    </span>
                    <Badge tone={m.tone} dot={!m.spin}>
                      {m.spin ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : null}
                      {m.state}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card pad={false} className="h-full">
          <div className="flex items-start justify-between gap-4 border-b border-[var(--pv-divider)] px-5 py-3.5">
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold">
                Weald Civils, PO 4471 w.e. 18.10.26
              </p>
              <p className="mt-1 flex items-center gap-2 text-[12px] text-[var(--pv-muted)]">
                <span className="truncate">From the site office at 08:12</span>
                <Badge tone="good" dot>
                  Read in 52 seconds
                </Badge>
              </p>
            </div>
            <Btn v="primary" icon={CircleCheck}>
              Open to approve
            </Btn>
          </div>
          <div className="grid grid-cols-[270px_minmax(0,1fr)] gap-5 px-5 py-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[12px]">
                <FileText className="h-4 w-4 text-[var(--pv-muted)]" />
                <span className="font-medium">Shoreham_WE18.pdf</span>
                <Muted className="text-[11.5px]">1 page</Muted>
              </div>
              <div className="flex justify-center rounded-[10px] bg-[var(--pv-surface)] py-4">
                <ScanSheet
                  client="Weald Civils"
                  site="Shoreham Harbour"
                  we="18/10/26"
                  po="4471"
                  signed="P. Oduya"
                  width={236}
                  rows={[
                    {
                      name: "Jamie Hart",
                      days: ["9", "9", "9", "9", "8"],
                      total: "44",
                    },
                    {
                      name: "T. Nowak",
                      days: ["9", "9", "9", "9", "8"],
                      total: "44",
                    },
                    {
                      name: "Ryan Cole",
                      days: ["9", "9", "-", "9", "8"],
                      total: "35",
                    },
                  ]}
                />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold">Filed as</p>
              <div className="mt-2 rounded-[10px] border border-[var(--pv-border)] p-3">
                <Kv
                  labelW={92}
                  rows={[
                    ["Client", "Weald Civils"],
                    ["Site", "Shoreham Harbour"],
                    ["PO", "4471"],
                    ["Week ending", "Sun 18 Oct 2026"],
                    ["Lines", "3 men, 123 hours"],
                  ]}
                />
              </div>
              <p className="mt-3.5 text-[12.5px] font-semibold">
                How it decided
              </p>
              <div className="mt-1 divide-y divide-[var(--pv-divider)]">
                <Check sub="Its own printed name, matched exactly">
                  Client from the sheet
                </Check>
                <Check sub="On the sheet and in the file name, and they agree">
                  PO 4471
                </Check>
                <Check sub="Written 18/10/26, a Sunday">Week ending</Check>
                <Check sub="The only Nowak on PO 4471 this week">
                  “T. Nowak” is Tomasz Nowak
                </Check>
                <Check sub="Printed 123, lines add up to 123">
                  Totals agree
                </Check>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AvolonApp>
  );
}

/* 2 · Timesheet checks ----------------------------------------------------- */

function TimesheetChecks() {
  return (
    <AvolonApp
      nav="timesheets"
      title="Seafront Interiors, SI-208"
      context="Kemptown hotel refurbishment. Week ending Sun 18 Oct 2026. Read from accounts@seafrontinteriors.example at 08:05."
      actions={
        <>
          <Btn v="band" icon={CalendarRange}>
            Change week
          </Btn>
          <Btn v="bandPrimary" icon={CircleCheck} off>
            Approve
          </Btn>
        </>
      }
    >
      <div className="grid h-full grid-cols-[290px_minmax(0,1fr)] gap-4">
        <Card
          title="The sheet as read"
          sub="Page 1 of 3, Kemptown_WE18.pdf"
          className="h-full"
        >
          <div className="flex justify-center rounded-[10px] bg-[var(--pv-surface)] py-5">
            <ScanSheet
              client="Seafront Interiors"
              site="Kemptown"
              we="WC 12.10"
              po="SI-208"
              signed="R. Adeyemi"
              width={244}
              mark={{ row: 1, day: 2 }}
              rows={[
                {
                  name: "Kieran Shaw",
                  days: ["1", "1", "1", "1", "1"],
                  total: "5",
                },
                {
                  name: "Ellis Moore",
                  days: ["9", "9", "n/a", "9", "9"],
                  total: "36",
                },
                {
                  name: "Marek Z.",
                  days: ["8", "8", "8", "8", "8"],
                  total: "40",
                },
                {
                  name: "Callum Reid",
                  days: ["9.5", "9.5", "9.5", "9.5", "9"],
                  total: "47",
                },
                { name: "", days: [], total: "132", flag: true },
              ]}
            />
          </div>
          <p className="mt-3 text-[11.5px] leading-relaxed text-[var(--pv-muted)]">
            Highlighted: the box the reader could not take as a figure. It is
            quoted below, never read as nought.
          </p>
        </Card>

        <div className="flex min-h-0 flex-col gap-3">
          <Banner
            tone="bad"
            icon={Ban}
            title="Approval is stopped by 2 things on this sheet."
          >
            Put them right, or have a named person check them. Nothing else on
            the sheet is held.
          </Banner>
          <Card pad={false}>
            <Table
              cols={[
                { h: "Worker", w: 170 },
                { h: "Mon", align: "center" },
                { h: "Tue", align: "center" },
                { h: "Wed", align: "center" },
                { h: "Thu", align: "center" },
                { h: "Fri", align: "center" },
                { h: "Total", align: "right", w: 62 },
                { h: "", w: 190 },
              ]}
              rowTone={[undefined, "warn", undefined, undefined]}
              rows={[
                [
                  <Person key="k" name="Kieran Shaw" sub="Day rate" />,
                  "1",
                  "1",
                  "1",
                  "1",
                  "1",
                  "5 d",
                  <Badge key="b" tone="bad" dot>
                    Same days on DL-12
                  </Badge>,
                ],
                [
                  <Person key="l" name="Ellis Moore" sub="Hourly" />,
                  "9",
                  "9",
                  <span
                    key="n"
                    className="rounded bg-[#fef3c7] px-1 font-medium text-[#92400e]"
                  >
                    n/a
                  </span>,
                  "9",
                  "9",
                  "36 h",
                  <Badge key="b" tone="warn" dot>
                    Wed needs a figure
                  </Badge>,
                ],
                [
                  <Person
                    key="m"
                    name="Marek Zielinski"
                    sub="Hourly, “Marek Z.”"
                  />,
                  "8",
                  "8",
                  "8",
                  "8",
                  "8",
                  "40 h",
                  <Badge key="b" tone="good" dot>
                    Ready
                  </Badge>,
                ],
                [
                  <Person key="d" name="Callum Reid" sub="Hourly" />,
                  "9.5",
                  "9.5",
                  "9.5",
                  "9.5",
                  "9",
                  "47 h",
                  <Badge key="b" tone="good" dot>
                    Ready
                  </Badge>,
                ],
              ]}
            />
          </Card>
          <Card
            title="Checks on this sheet"
            sub="Each one says what it found"
            className="min-h-0 flex-1"
          >
            <div className="-mt-1">
              <CheckLine note="From its printed name and PO">
                Client and PO: Seafront Interiors, SI-208
              </CheckLine>
              <CheckLine note="Sheet says WC 12.10, file name w.e. 18.10">
                Week ending settled as Sun 18 Oct
              </CheckLine>
              <CheckLine ok={false} note="Stops approval">
                Printed total 132, lines add up to 123
              </CheckLine>
              <CheckLine ok="warn" note="Type a figure, or a person checks it">
                Ellis Moore, Wednesday reads “n/a”
              </CheckLine>
              <CheckLine ok={false} note="Held as a duplicate, not paid twice">
                Kieran Shaw, Mon to Fri also on Downsline DL-12
              </CheckLine>
              <CheckLine note="“Marek Z.” is the only Marek on SI-208">
                Every name matched to one worker
              </CheckLine>
              <CheckLine note="No £0 line, no day over 24 hours">
                Nothing impossible on the sheet
              </CheckLine>
            </div>
          </Card>
        </div>
      </div>
    </AvolonApp>
  );
}

/* 3 · Mini Plan and chase board -------------------------------------------- */

const CHASE: [string, string, string, number, Tone, string, string][] = [
  ["Weald Civils", "4471", "Shoreham Harbour", 3, "good", "In, 08:12", "Inbox"],
  [
    "Seafront Interiors",
    "SI-208",
    "Kemptown hotel",
    4,
    "good",
    "In, 08:05",
    "Inbox",
  ],
  [
    "Corvid M&E",
    "CM-77",
    "Crawley data hall",
    6,
    "warn",
    "In, week in doubt",
    "Inbox",
  ],
  [
    "Downsline",
    "DL-12",
    "Newhaven port road",
    9,
    "brand",
    "Reading now",
    "Inbox",
  ],
  [
    "Northgate Build",
    "NB-31",
    "Lewes phase 2",
    7,
    "good",
    "In, 07:33",
    "Inbox",
  ],
  [
    "Brookside Developments",
    "BD-04",
    "Burgess Hill",
    5,
    "bad",
    "Not in, chased 10:15",
    "Chased",
  ],
  ["Ridgeway Civils", "RC-9", "Worthing seafront", 4, "bad", "Not in", "Chase"],
  [
    "Tidemark Homes",
    "TH-02",
    "Peacehaven",
    3,
    "neutral",
    "No PO yet",
    "Pick a PO",
  ],
  ["Weald Civils", "4480", "Littlehampton", 2, "bad", "Not in", "Chase"],
];

function MiniPlan() {
  return (
    <AvolonApp
      nav="plan"
      title="Mini Plan"
      context="The week's plan sets every rate and who owes a sheet. Uploading it rebuilds the week."
      actions={
        <>
          <Btn v="band" icon={Upload}>
            Upload again
          </Btn>
          <Btn v="bandPrimary" icon={Play}>
            Run payroll
          </Btn>
        </>
      }
      steps={WEEK.inbox}
      next={<NextStep>Next: Approve 6 timesheets</NextStep>}
    >
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-center gap-3 rounded-[var(--pv-radius)] border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-2.5">
          <FileSpreadsheet className="h-5 w-5 text-[var(--pv-link)]" />
          <span className="text-[12.5px]">
            <span className="font-semibold">MiniPlan_WE18Oct.xlsx</span>{" "}
            <Muted>uploaded Mon 08:41 by Sam</Muted>
          </span>
          <span className="ml-2 flex gap-1.5">
            <Badge tone="good">96 people</Badge>
            <Badge tone="good">54 POs</Badge>
            <Badge tone="good">Rates read for 93</Badge>
            <Badge tone="warn">3 to place</Badge>
          </span>
          <Btn size="sm" className="ml-auto">
            Place them now
          </Btn>
        </div>
        <Kpis
          items={[
            {
              label: "Sheets in",
              value: "47 of 54",
              hint: "POs on this week's plan",
            },
            {
              label: "Still to chase",
              value: "7",
              hint: "1 chased this morning",
              tone: "bad",
            },
            {
              label: "On the plan with no PO",
              value: "1",
              hint: "Tidemark Homes, Peacehaven",
            },
            {
              label: "Rates from the plan",
              value: "93 of 96",
              hint: "3 rows need a rate",
              tone: "warn",
            },
          ]}
        />
        <Card pad={false} className="min-h-0 flex-1">
          <div className="flex items-center justify-between border-b border-[var(--pv-divider)] px-4 py-2.5">
            <span className="text-[13px] font-semibold">
              Who owes a sheet this week
            </span>
            <Chips
              items={[
                ["All", 54],
                ["In", 47],
                ["To chase", 7],
                ["No PO", 1],
              ]}
              active={2}
            />
          </div>
          <Table
            dense
            cols={[
              { h: "Client", w: 190 },
              { h: "PO", w: 70 },
              { h: "Site" },
              { h: "Men", align: "right", w: 54 },
              { h: "Sheet", w: 190 },
              { h: "", w: 108, align: "right" },
            ]}
            rows={CHASE.map(([c, po, site, men, tone, st, act]) => [
              <span key="c" className="font-medium">
                {c}
              </span>,
              po,
              site,
              men,
              <Badge key="s" tone={tone} dot>
                {st}
              </Badge>,
              act === "Inbox" ? (
                <Muted key="a">Open sheet</Muted>
              ) : (
                <Btn
                  key="a"
                  size="sm"
                  v={act === "Chased" ? "ghost" : "secondary"}
                >
                  {act}
                </Btn>
              ),
            ])}
          />
        </Card>
      </div>
    </AvolonApp>
  );
}

/* 4 · Payroll engine ------------------------------------------------------- */

function PayrollEngine() {
  return (
    <AvolonApp
      nav="runs"
      title="Payroll run 42"
      context="Draft, built at 10:42 from every approved line. Each line priced from this week's Mini Plan and nothing else."
      actions={
        <>
          <Btn v="band" icon={RefreshCw}>
            Run payroll again
          </Btn>
          <Btn v="bandPrimary" icon={Lock}>
            Check and lock
          </Btn>
        </>
      }
      steps={WEEK.run}
      next={<NextStep>Next: Check and lock run 42</NextStep>}
    >
      <div className="flex h-full flex-col gap-3">
        <Kpis
          items={[
            {
              label: "Lines priced",
              value: "118",
              hint: "96 people, 21 clients",
            },
            {
              label: "Held, not priced",
              value: "5",
              hint: "Each says why",
              tone: "warn",
            },
            {
              label: "Pay",
              value: "£104,980.15",
              hint: "To two umbrella companies",
            },
            { label: "Charge", value: "£128,412.60", hint: "On 54 invoices" },
            { label: "Margin", value: "£23,432.45", hint: "18.2% of charge" },
          ]}
        />
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_252px] gap-3">
          <Card pad={false} className="h-full">
            <Table
              dense
              cols={[
                { h: "Worker", w: 114 },
                { h: "Client and PO", w: 132 },
                { h: "Priced as" },
                { h: "Units", align: "right", w: 74 },
                { h: "Pay rate", align: "right", w: 104 },
                { h: "Pay", align: "right", w: 90 },
                { h: "Charge", align: "right", w: 86 },
              ]}
              sel={3}
              rows={[
                [
                  "Jamie Hart",
                  "Weald Civils 4471",
                  "Hourly",
                  "44 h",
                  "£19.50",
                  "£858.00",
                  "£1,117.60",
                ],
                [
                  "Tomasz Nowak",
                  "Weald Civils 4471",
                  "Hourly",
                  "44 h",
                  "£19.50",
                  "£858.00",
                  "£1,117.60",
                ],
                [
                  "Ryan Cole",
                  "Weald Civils 4471",
                  "Hourly",
                  "35 h",
                  "£19.50",
                  "£682.50",
                  "£889.00",
                ],
                [
                  "Daniel Price",
                  "Northgate NB-31",
                  <Badge key="b" tone="brand">
                    Days and hours
                  </Badge>,
                  "4 d + 5 h",
                  "£265, £29.50",
                  "£1,207.50",
                  "£1,504.00",
                ],
                [
                  "Kieran Shaw",
                  "Downsline DL-12",
                  "Day rate",
                  "5 d",
                  "£190.00",
                  "£950.00",
                  "£1,225.00",
                ],
                [
                  "Connor Webb",
                  "Downsline DL-12",
                  "Day rate",
                  "4.5 d",
                  "£200.00",
                  "£900.00",
                  "£1,179.00",
                ],
                [
                  "Liam Ford",
                  "Corvid CM-77",
                  "Hourly",
                  "40 h",
                  "£23.00",
                  "£920.00",
                  "£1,196.00",
                ],
                [
                  "Lee Grant",
                  "Corvid CM-80",
                  "Shifts, 9 h",
                  "5 shifts",
                  "£21.00",
                  "£945.00",
                  "£1,228.50",
                ],
                [
                  "Marek Zielinski",
                  "Seafront SI-208",
                  "Hourly",
                  "40 h",
                  "£20.00",
                  "£800.00",
                  "£1,040.00",
                ],
                [
                  "Sam Okafor",
                  "Ridgeway RC-9",
                  "Hourly",
                  "45 h",
                  "£18.50",
                  "£832.50",
                  "£1,084.50",
                ],
                [
                  "Ben Holt",
                  "Brookside BD-04",
                  "Day rate",
                  "5 d",
                  "£180.00",
                  "£900.00",
                  "£1,170.00",
                ],
              ]}
            />
            <div className="flex items-center gap-2 border-t border-[var(--pv-divider)] bg-[var(--pv-surface)] px-4 py-2 text-[11.5px] text-[var(--pv-text2)]">
              <span className="font-semibold text-[var(--pv-ink)]">
                Daniel Price:
              </span>{" "}
              5, 9, 9, 9 and 9 hours. A full day is 9 hours at these rates, so 4
              days at £265 and the short Monday's 5 hours at £29.50.
            </div>
          </Card>
          <Card
            title="Held, not priced"
            sub="Waiting for the figure, never guessed"
            className="h-full"
          >
            <div className="-mt-1 space-y-2">
              {[
                [
                  "No rate",
                  "Sam Turner, Brookside BD-04",
                  "On the Mini Plan, no rate written for him.",
                ],
                [
                  "Which PO",
                  "Ashley Reed, Northgate",
                  "Two placements there and the sheet names no PO.",
                ],
                [
                  "No units",
                  "Owen Burke, Corvid M&E",
                  "A weekly total of 6 for a day-rate man: his days are needed.",
                ],
              ].map(([k, who, why]) => (
                <div
                  key={who}
                  className="rounded-[10px] border border-[var(--pv-border)] px-3 py-2"
                >
                  <Badge tone="warn">{k}</Badge>
                  <p className="mt-1 truncate text-[12.5px] font-semibold">
                    {who}
                  </p>
                  <p className="text-[11.5px] leading-snug text-[var(--pv-muted)]">
                    {why}
                  </p>
                </div>
              ))}
              <p className="px-1 text-[11.5px] leading-snug text-[var(--pv-muted)]">
                And 2 more: Jack Fox is not on this week's Mini Plan, and Kieran
                Shaw's SI-208 days are already paid on DL-12.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </AvolonApp>
  );
}

/* 5 · Umbrella batch file -------------------------------------------------- */

function UmbrellaFile() {
  return (
    <AvolonApp
      nav="runs"
      title="Umbrella files for run 42"
      context="Built from the locked run in each umbrella company's own layout. Stored, never sent by the platform."
      actions={
        <>
          <Btn v="band" icon={Download}>
            Download .xlsx
          </Btn>
          <Btn v="bandPrimary" icon={CircleCheck}>
            Approve 2 files
          </Btn>
        </>
      }
      steps={WEEK.files}
      next={<NextStep>Next: Approve 2 umbrella files</NextStep>}
    >
      <div className="grid h-full grid-cols-[232px_minmax(0,1fr)] gap-4">
        <div className="space-y-3">
          {[
            {
              n: "Northbridge Umbrella",
              m: "34 men",
              v: "£31,740.25",
              on: true,
            },
            { n: "Keystone Payroll", m: "62 men", v: "£73,239.90" },
          ].map((f) => (
            <div
              key={f.n}
              className={`rounded-[var(--pv-radius)] border px-4 py-3 ${f.on ? "border-[var(--pv-dot)] bg-[var(--pv-primary-tint)] shadow-[inset_3px_0_0_var(--pv-dot)]" : "border-[var(--pv-border)] bg-white"}`}
            >
              <p className="text-[13px] font-semibold">{f.n}</p>
              <p className="text-[11.5px] text-[var(--pv-muted)]">
                {f.m}, net pay
              </p>
              <p className="mt-1.5 font-[family-name:var(--pv-display)] text-[19px] font-semibold">
                {f.v}
              </p>
              <div className="mt-2 flex gap-1.5">
                <Badge tone="good" dot>
                  Checks pass
                </Badge>
                <Badge>Draft</Badge>
              </div>
            </div>
          ))}
          <Card title="Never on this file">
            <p className="-mt-1 text-[12px] leading-relaxed text-[var(--pv-text2)]">
              The charge, the PO, the client and the site. The umbrella company
              sees pay and nothing else.
            </p>
          </Card>
        </div>
        <Card pad={false} className="h-full">
          <div className="flex items-center justify-between border-b border-[var(--pv-divider)] px-4 py-2.5">
            <span className="text-[13px] font-semibold">
              Northbridge Umbrella, w/e 18 Oct
            </span>
            <Muted className="text-[11.5px]">
              Their columns, in their order
            </Muted>
          </div>
          <Table
            dense
            small
            cols={[
              { h: "Worker ref", w: 92 },
              { h: "Temp name" },
              { h: "Date", w: 78 },
              { h: "Units", align: "right", w: 48 },
              { h: "Pay", align: "right", w: 72 },
              { h: "Rate type", w: 72 },
              { h: "Net", align: "right", w: 88 },
              { h: "VAT", align: "right", w: 80 },
              { h: "Gross", align: "right", w: 88 },
            ]}
            rows={[
              [
                "UM-10442",
                "Jamie Hart",
                "18/10/26",
                44,
                "£19.50",
                "Hourly",
                "£858.00",
                "£171.60",
                "£1,029.60",
              ],
              [
                "UM-10443",
                "Tomasz Nowak",
                "18/10/26",
                44,
                "£19.50",
                "Hourly",
                "£858.00",
                "£171.60",
                "£1,029.60",
              ],
              [
                "UM-10451",
                "Ryan Cole",
                "18/10/26",
                35,
                "£19.50",
                "Hourly",
                "£682.50",
                "£136.50",
                "£819.00",
              ],
              [
                "UM-10518",
                "Kieran Shaw",
                "18/10/26",
                5,
                "£190.00",
                "Day",
                "£950.00",
                "£190.00",
                "£1,140.00",
              ],
              [
                "UM-10530",
                "Liam Ford",
                "18/10/26",
                40,
                "£23.00",
                "Hourly",
                "£920.00",
                "£184.00",
                "£1,104.00",
              ],
              [
                "UM-10544",
                "Connor Webb",
                "18/10/26",
                4.5,
                "£200.00",
                "Day",
                "£900.00",
                "£180.00",
                "£1,080.00",
              ],
              [
                <Muted key="r">No ref yet</Muted>,
                "Daniel Price",
                "18/10/26",
                4,
                "£265.00",
                "Day",
                "£1,060.00",
                "£212.00",
                "£1,272.00",
              ],
              [
                <Muted key="r">No ref yet</Muted>,
                "Daniel Price",
                "18/10/26",
                5,
                "£29.50",
                "Hourly",
                "£147.50",
                "£29.50",
                "£177.00",
              ],
              [<Muted key="m">27 more</Muted>, "", "", "", "", "", "", "", ""],
            ]}
            foot={[
              "Grand total",
              "",
              "",
              "",
              "",
              "",
              "£31,740.25",
              "£6,348.05",
              "£38,088.30",
            ]}
          />
          <div className="flex items-center gap-4 border-t border-[var(--pv-divider)] px-4 py-2.5 text-[11.5px] text-[var(--pv-text2)]">
            <span className="inline-flex items-center gap-1.5">
              <CircleCheck className="h-3.5 w-3.5 text-[var(--pv-good)]" /> Rows
              and Net agree with run 42
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CircleCheck className="h-3.5 w-3.5 text-[var(--pv-good)]" /> VAT
              and Gross worked out per row
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CircleCheck className="h-3.5 w-3.5 text-[var(--pv-good)]" /> A
              man with no ref is still paid
            </span>
          </div>
        </Card>
      </div>
    </AvolonApp>
  );
}

/* 6 · Invoices ------------------------------------------------------------- */

function Invoices() {
  return (
    <AvolonApp
      nav="invoices"
      title="Invoices"
      context="Run 42: one invoice per client, PO and week, with the signed timesheets from page 2."
      actions={
        <>
          <Btn v="band" icon={Download}>
            PDFs as a zip
          </Btn>
          <Btn v="bandPrimary" icon={CircleCheck}>
            Approve 53 ready
          </Btn>
        </>
      }
      steps={WEEK.files}
      next={<NextStep>Next: Approve 2 umbrella files</NextStep>}
    >
      <div className="grid h-full grid-cols-[minmax(0,1fr)_350px] gap-4">
        <Card pad={false} className="h-full">
          <div className="border-b border-[var(--pv-divider)] px-4 pt-2.5">
            <Tabs
              items={["All invoices", "By payroll run", "Previous system"]}
              active={1}
            />
          </div>
          <Table
            dense
            sel={0}
            cols={[
              { h: "Number", w: 100 },
              { h: "Client" },
              { h: "PO", w: 66 },
              { h: "Week", w: 64 },
              { h: "Total", align: "right", w: 94 },
              { h: "Status", w: 146 },
            ]}
            rows={[
              [
                "INV-001284",
                "Weald Civils",
                "4471",
                "18 Oct",
                "£3,749.04",
                <Badge key="s" tone="brand" dot>
                  Draft
                </Badge>,
              ],
              [
                "INV-001285",
                "Seafront Interiors",
                "SI-208",
                "18 Oct",
                "£7,350.00",
                <Badge key="s" tone="brand" dot>
                  Draft
                </Badge>,
              ],
              [
                "INV-001286",
                "Northgate Build",
                "NB-31",
                "18 Oct",
                "£9,912.36",
                <Badge key="s" tone="brand" dot>
                  Draft
                </Badge>,
              ],
              [
                "INV-001287",
                "Downsline",
                "DL-12",
                "18 Oct",
                "£11,286.00",
                <Badge key="s" tone="brand" dot>
                  Draft
                </Badge>,
              ],
              [
                "INV-001288",
                "Weald Civils",
                "4471",
                "11 Oct",
                "£1,066.80",
                <Badge key="s" tone="neutral" dot>
                  Late sheet
                </Badge>,
              ],
              [
                "INV-001289",
                "Ridgeway Civils",
                "RC-9",
                "18 Oct",
                "£4,018.20",
                <Badge key="s" tone="brand" dot>
                  Draft
                </Badge>,
              ],
              [
                "INV-001290",
                "Brookside Dev.",
                "BD-04",
                "18 Oct",
                "£5,544.00",
                <Badge key="s" tone="brand" dot>
                  Draft
                </Badge>,
              ],
              [
                "INV-001291",
                "Corvid M&E",
                "CM-77",
                "18 Oct",
                "£8,654.40",
                <Badge key="s" tone="bad" dot>
                  Check stops it
                </Badge>,
              ],
              [
                "INV-001276",
                "Seafront Interiors",
                "SI-208",
                "11 Oct",
                "£6,912.00",
                <Badge key="s" tone="good" dot>
                  Sent 13 Oct
                </Badge>,
              ],
              [
                "CN-000012",
                "Corvid M&E",
                "CM-77",
                "11 Oct",
                "−£358.80",
                <Badge key="s" tone="neutral" dot>
                  Credit note, sent
                </Badge>,
              ],
            ]}
          />
          <p className="px-4 py-2.5 text-[11.5px] text-[var(--pv-muted)]">
            54 invoices from run 42. Void and credit notes keep their numbers; a
            sent invoice is only reduced by a credit note.
          </p>
        </Card>
        <div className="flex min-h-0 flex-col gap-3">
          <div className="flex min-h-0 flex-1 items-start justify-center overflow-hidden rounded-[var(--pv-radius)] bg-[var(--pv-surface)] pt-4">
            <AvolonInvoicePage
              draft
              number="INV-001284"
              client="Weald Civils"
              site="Shoreham Harbour flood defences"
              po="4471"
              we="18 Oct 2026"
              due="30 Nov 2026"
              width={300}
              lines={[
                ["Jamie Hart", "44 h", "£25.40", "£1,117.60"],
                ["Tomasz Nowak", "44 h", "£25.40", "£1,117.60"],
                ["Ryan Cole", "35 h", "£25.40", "£889.00"],
              ]}
              net="£3,124.20"
              vat="£624.84"
              total="£3,749.04"
            />
          </div>
          <div className="flex items-center gap-2 rounded-[var(--pv-radius)] border border-[var(--pv-border)] px-3 py-2.5">
            <span className="flex gap-1">
              {["Invoice", "Sheet"].map((p, i) => (
                <span
                  key={p}
                  className={`flex h-9 w-7 flex-col gap-[3px] rounded-[2px] border bg-white p-1 ${i === 0 ? "border-[var(--pv-dot)]" : "border-[var(--pv-border)]"}`}
                >
                  {[0, 1, 2, 3].map((l) => (
                    <span
                      key={l}
                      className="h-[2px] rounded bg-[var(--pv-border)]"
                      style={{ width: `${90 - l * 15}%` }}
                    />
                  ))}
                </span>
              ))}
            </span>
            <span className="text-[12px] leading-tight">
              <span className="block font-medium">2 pages</span>
              <Muted className="text-[11px]">Page 2, the signed sheet</Muted>
            </span>
            <span className="ml-auto flex gap-1.5">
              <Btn size="sm">Void</Btn>
              <Btn size="sm" v="primary">
                Approve
              </Btn>
            </span>
          </div>
        </div>
      </div>
    </AvolonApp>
  );
}

/* 7 · Checks on every run -------------------------------------------------- */

const INV_CHECKS: [string, boolean | "warn", string?][] = [
  ["Each invoice line matches its payroll line", false, "INV-001291 line 3"],
  ["Each invoice's subtotal adds up", true],
  ["VAT once, on each invoice's net", true],
  ["VAT shared to lines a penny at a time", true],
  ["PO subtotals add up to the invoice", true],
  ["Numbers in order, none repeated", true],
  ["Invoice and due dates from the client's terms", true],
  ["One week on each invoice", true],
  ["Every charged line on one standing invoice", true],
  ["No hours on no invoice", true],
  ["Void invoices counted nowhere", true],
  ["Credit notes taken off once", true],
  ["Signed sheets are this client's only", true],
  ["Client details complete", true],
  ["Run total equals its invoices", true, "explained by INV-001291"],
];

const PAY_CHECKS: [string, boolean | "warn", string?][] = [
  ["Charge and margin on every line", true],
  ["Pay rates are this week's Mini Plan rates", true],
  ["Charge rates are this week's Mini Plan rates", true],
  ["Run totals add up", true],
  ["Each file's rows match the run", true],
  ["Each file's Net matches its lines", true],
  ["Every paid man has one umbrella", true],
  ["No man on two files", true],
  ["No £0 line on any file", true],
];

function RunChecks() {
  return (
    <AvolonApp
      nav="runs"
      title="Checks on run 42"
      context="Fifteen invoice checks and nine payroll checks. A problem stops only what it is about."
      actions={
        <Btn v="band" icon={RefreshCw}>
          Check again
        </Btn>
      }
      steps={WEEK.files}
      next={<NextStep>Next: Approve 2 umbrella files</NextStep>}
    >
      <div className="flex h-full flex-col gap-3">
        <Kpis
          items={[
            { label: "Checks run", value: "24" },
            { label: "Passed", value: "23", tone: "good" },
            { label: "Stopping something", value: "1", tone: "bad" },
            { label: "Invoices ready to approve", value: "53 of 54" },
          ]}
        />
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
          <Card
            title="Invoices"
            sub="15 checks"
            right={
              <Badge tone="bad" dot>
                1 problem
              </Badge>
            }
            className="h-full"
            bodyClass="py-0.5"
          >
            {INV_CHECKS.map(([t, ok, note]) => (
              <CheckLine key={t} ok={ok} note={note}>
                {t}
              </CheckLine>
            ))}
          </Card>
          <div className="flex min-h-0 flex-col gap-3">
            <Card
              title="Payroll and umbrella files"
              sub="9 checks"
              right={
                <Badge tone="good" dot>
                  All pass
                </Badge>
              }
              bodyClass="py-0.5"
            >
              {PAY_CHECKS.map(([t, ok, note]) => (
                <CheckLine key={t} ok={ok} note={note}>
                  {t}
                </CheckLine>
              ))}
            </Card>
            <Banner tone="bad" icon={Ban} title="INV-001291, Corvid M&E:">
              line 3 charges 40 hours; its payroll line says 38. This invoice
              can't be approved or sent until it is generated again. The other
              53 can.
            </Banner>
          </div>
        </div>
      </div>
    </AvolonApp>
  );
}

export const screens = {
  "timesheet-inbox": TimesheetInbox,
  "timesheet-checks": TimesheetChecks,
  "mini-plan": MiniPlan,
  "payroll-engine": PayrollEngine,
  "umbrella-file": UmbrellaFile,
  invoices: Invoices,
  "run-checks": RunChecks,
};
