import {
  Archive,
  Bot,
  Check as CheckIcon,
  CreditCard,
  FileText,
  Hand,
  Inbox,
  MapPin,
  Pencil,
  Plus,
  Rss,
  Search,
  Send,
  Sparkles,
  Star,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { Fill, GloApp, GloHead } from "../shells";
import {
  Avatar,
  Badge,
  Btn,
  Card,
  CheckLine,
  Chips,
  Kpis,
  Kv,
  Meter,
  Muted,
  Person,
  Table,
  Tabs,
  Timeline,
  type Tone,
} from "../kit";
import { Columns, LineChart, Spark } from "../charts";
import { Hl } from "./parts";

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

/* 38 · Pay first, delivered automatically ---------------------------------- */

function Checkout() {
  return (
    <GloApp nav="orders">
      <GloHead
        title="Orders"
        meta="Glo Career Services, this week"
        tabs={
          <Tabs
            items={[
              "All orders",
              "Waiting for intake",
              "With a writer",
              "Delivered",
            ]}
            active={0}
          />
        }
      />
      <Fill className="flex flex-col gap-4">
        <Kpis
          items={[
            { label: "Orders this week", value: "23" },
            {
              label: "Started within a minute",
              value: "23 of 23",
              tone: "good",
            },
            { label: "Intake answered", value: "19", hint: "4 reminded today" },
            { label: "Delivered on time", value: "100%", hint: "Last 30 days" },
          ]}
        />
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_340px] gap-4">
          <Card pad={false} className="h-full">
            <Table
              dense
              sel={0}
              cols={[
                { h: "Order", w: 64 },
                { h: "Customer" },
                { h: "Package", w: 128 },
                { h: "Paid", w: 118 },
                { h: "Intake", w: 100 },
                { h: "Due", w: 54 },
              ]}
              rows={[
                [
                  "#2291",
                  <Person key="p" name="Sarah Okafor" sub="Today 09:14" />,
                  "CV and LinkedIn",
                  <Badge key="b" tone="good" dot>
                    Card
                  </Badge>,
                  <Badge key="i" tone="brand">
                    Sent
                  </Badge>,
                  "Fri",
                ],
                [
                  "#2290",
                  <Person key="p" name="Daniel Moss" sub="Today 08:02" />,
                  "CV",
                  <Badge key="b" tone="good" dot>
                    Card
                  </Badge>,
                  <Badge key="i" tone="good">
                    Answered
                  </Badge>,
                  "Thu",
                ],
                [
                  "#2289",
                  <Person key="p" name="Leah Grant" sub="Yesterday" />,
                  "Executive CV",
                  <Badge key="b" tone="good" dot>
                    Card
                  </Badge>,
                  <Badge key="i" tone="good">
                    Answered
                  </Badge>,
                  "Mon",
                ],
                [
                  "#2288",
                  <Person key="p" name="Omar Haddad" sub="Yesterday" />,
                  "Cover letter",
                  <Badge key="b" tone="good" dot>
                    Apple Pay
                  </Badge>,
                  <Badge key="i" tone="warn">
                    Reminded
                  </Badge>,
                  "Thu",
                ],
                [
                  "#2287",
                  <Person key="p" name="Chloe Barnes" sub="Mon" />,
                  "CV and LinkedIn",
                  <Badge key="b" tone="good" dot>
                    Card
                  </Badge>,
                  <Badge key="i" tone="good">
                    Answered
                  </Badge>,
                  "Wed",
                ],
                [
                  "#2286",
                  <Person key="p" name="Ian Pearce" sub="Mon" />,
                  "LinkedIn profile",
                  <Badge key="b" tone="good" dot>
                    Card
                  </Badge>,
                  <Badge key="i" tone="good">
                    Answered
                  </Badge>,
                  "Done",
                ],
                [
                  "#2285",
                  <Person key="p" name="Maya Singh" sub="Sun" />,
                  "CV",
                  <Badge key="b" tone="good" dot>
                    Google Pay
                  </Badge>,
                  <Badge key="i" tone="good">
                    Answered
                  </Badge>,
                  "Done",
                ],
              ]}
            />
          </Card>
          <Card
            title="Order #2291, Sarah Okafor"
            sub="Nobody touched it"
            className="h-full"
          >
            <Timeline
              items={[
                {
                  time: "09:14:02",
                  title: "Paid by card",
                  sub: "Checkout confirmed the payment",
                },
                {
                  time: "09:14:05",
                  title: "Account created",
                  sub: "With the email she paid with",
                },
                {
                  time: "09:14:06",
                  title: "Sign-in link sent",
                  sub: "No password to remember",
                },
                {
                  time: "09:14:08",
                  title: "Intake questions sent",
                  sub: "For a CV and LinkedIn package",
                },
                {
                  time: "09:14:09",
                  title: "On the writers' board",
                  sub: "Due Friday",
                  tone: "good",
                },
                {
                  time: "09:31",
                  title: "She started the intake",
                  sub: "Saved as she goes",
                  tone: "neutral",
                },
              ]}
            />
            <div className="mt-3 flex items-center gap-2 rounded-[8px] bg-[var(--pv-page)] px-3 py-2 text-[12px]">
              <CreditCard className="h-4 w-4 text-[var(--pv-muted)]" /> Paid
              before any work starts, so there's no chasing.
            </div>
          </Card>
        </div>
      </Fill>
    </GloApp>
  );
}

/* 39 · WhatsApp auto-reply with staff takeover ----------------------------- */

function WhatsappAi() {
  return (
    <GloApp nav="inbox">
      <GloHead
        title="Messages"
        meta="WhatsApp, Glo Career Services"
        tabs={<Tabs items={["WhatsApp", "Email"]} active={0} />}
      />
      <Fill className="grid grid-cols-[300px_minmax(0,1fr)_270px] gap-4">
        <Card pad={false} className="h-full">
          {[
            {
              n: "Hannah Price",
              t: "Can you do a cover letter too?",
              time: "22:14",
              s: "AI replied",
              tone: "brand" as Tone,
              on: true,
            },
            {
              n: "Ravi Kumar",
              t: "I want a refund, it's not what I asked",
              time: "21:40",
              s: "Needs staff",
              tone: "warn" as Tone,
            },
            {
              n: "Leah Grant",
              t: "Thanks! Got the first draft",
              time: "19:02",
              s: "AI replied",
              tone: "brand" as Tone,
            },
            {
              n: "Tom Ellis",
              t: "Can I change my target role?",
              time: "18:30",
              s: "Staff took over",
              tone: "good" as Tone,
            },
            {
              n: "Grace Obi",
              t: "How long does LinkedIn take?",
              time: "17:55",
              s: "AI replied",
              tone: "brand" as Tone,
            },
            {
              n: "+44 7700 900902",
              t: "Do you do CVs for nurses?",
              time: "16:20",
              s: "AI replied",
              tone: "brand" as Tone,
            },
          ].map((c) => (
            <div
              key={c.n}
              className={`flex gap-3 border-b border-[var(--pv-divider)] px-3.5 py-2.5 ${c.on ? "bg-[var(--pv-primary-tint)] shadow-[inset_3px_0_0_var(--pv-dot)]" : ""}`}
            >
              <Avatar name={c.n} size={30} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[12.5px] font-semibold">
                    {c.n}
                  </span>
                  <span className="text-[11px] text-[var(--pv-muted)]">
                    {c.time}
                  </span>
                </div>
                <p className="truncate text-[12px] text-[var(--pv-text2)]">
                  {c.t}
                </p>
                <Badge tone={c.tone} dot className="mt-1">
                  {c.s}
                </Badge>
              </div>
            </div>
          ))}
        </Card>
        <Card pad={false} className="flex h-full flex-col">
          <div className="flex items-center gap-3 border-b border-[var(--pv-divider)] px-4 py-3">
            <Avatar name="Hannah Price" size={32} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold">Hannah Price</p>
              <p className="text-[11.5px] text-[var(--pv-muted)]">
                Customer, CV and LinkedIn order #2279
              </p>
            </div>
            <Btn v="primary" icon={Hand}>
              Take over
            </Btn>
          </div>
          <div className="flex-1 space-y-3 bg-[#efeae2] px-5 py-4 text-[12.5px]">
            <div className="max-w-[72%] rounded-xl rounded-tl-sm bg-white px-3 py-2 shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
              Hi, how long does a CV take and can you do a cover letter too?
              <span className="mt-0.5 block text-right text-[10.5px] text-[#667781]">
                22:14
              </span>
            </div>
            <div className="ml-auto max-w-[76%] rounded-xl rounded-tr-sm bg-[#d9fdd3] px-3 py-2 shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
              <span className="mb-0.5 flex items-center gap-1 text-[10.5px] font-medium text-[#1f7a4d]">
                <Bot className="h-3 w-3" /> Auto-reply
              </span>
              Hi Hannah! A CV takes 3 working days, and yes, we can add a
              matching cover letter to your order. Would you like me to send you
              the options?
              <span className="mt-0.5 block text-right text-[10.5px] text-[#667781]">
                22:14
              </span>
            </div>
            <div className="max-w-[60%] rounded-xl rounded-tl-sm bg-white px-3 py-2 shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
              Yes please
              <span className="mt-0.5 block text-right text-[10.5px] text-[#667781]">
                22:15
              </span>
            </div>
            <div className="ml-auto max-w-[76%] rounded-xl rounded-tr-sm bg-[#d9fdd3] px-3 py-2 shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
              <span className="mb-0.5 flex items-center gap-1 text-[10.5px] font-medium text-[#1f7a4d]">
                <Bot className="h-3 w-3" /> Auto-reply
              </span>
              Here's the link to add it: it starts as soon as it's paid, and
              your writer will match it to your CV.
              <span className="mt-0.5 block text-right text-[10.5px] text-[#667781]">
                22:15
              </span>
            </div>
            <div className="mx-auto w-fit rounded-md bg-white/80 px-2.5 py-1 text-[11px] text-[#54656f]">
              Flagged for staff in the morning: an upsell to check
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-[var(--pv-divider)] px-4 py-2.5">
            <span className="flex h-8 flex-1 items-center rounded-full bg-[var(--pv-page)] px-3 text-[12px] text-[var(--pv-muted)]">
              Type to reply as staff…
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2b6bea] text-white">
              <Send className="h-4 w-4" />
            </span>
          </div>
        </Card>
        <div className="flex min-h-0 flex-col gap-4">
          <Card title="Answers from" sub="The business's own information">
            <div className="-mt-1 space-y-1.5 text-[12px]">
              {[
                "Packages and turnaround",
                "Prices and add-ons",
                "How the writing works",
                "Her order and its status",
              ].map((x) => (
                <span key={x} className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-[var(--pv-muted)]" />{" "}
                  {x}
                </span>
              ))}
            </div>
          </Card>
          <Card
            title="Hands over to staff"
            sub="Never answered by the AI"
            className="min-h-0 flex-1"
          >
            <div className="-mt-1">
              <CheckLine note="Always">Refunds and complaints</CheckLine>
              <CheckLine note="Always">Money owed</CheckLine>
              <CheckLine note="Always">A question it can't source</CheckLine>
              <CheckLine note="Any time">Staff can take over</CheckLine>
            </div>
          </Card>
        </div>
      </Fill>
    </GloApp>
  );
}

/* 40 · Headhunting engine -------------------------------------------------- */

function Headhunting() {
  return (
    <GloApp nav="mapping">
      <GloHead
        title="Talent mapping"
        meta="Fit-out project director, Dubai. Executive search desk (made up)"
        actions={
          <Btn v="primary" icon={CheckIcon}>
            Approve 3 messages
          </Btn>
        }
        tabs={
          <Tabs
            items={[
              "Candidates 48",
              "Hiring managers 12",
              "Outreach 6",
              "The brief",
            ]}
            active={0}
          />
        }
      />
      <Fill className="grid grid-cols-[minmax(0,1fr)_336px] gap-4">
        <Card pad={false} className="h-full">
          <Table
            dense
            sel={0}
            cols={[
              { h: "Candidate" },
              { h: "Fit", w: 86 },
              { h: "Likely to move", w: 112 },
              { h: "Why", w: 214 },
              { h: "", w: 104 },
            ]}
            rows={[
              [
                <Two key="p" a="R. Menon" b="4 years in role" />,
                <Score key="s" v={91} />,
                <Badge key="m" tone="good" dot>
                  High
                </Badge>,
                "Project just handed over",
                <Badge key="b" tone="brand">
                  Draft ready
                </Badge>,
              ],
              [
                <Two key="p" a="A. Haddad" b="Senior PM, hospitality" />,
                <Score key="s" v={86} />,
                <Badge key="m" tone="warn" dot>
                  Medium
                </Badge>,
                "Promoted last year",
                <Badge key="b" tone="brand">
                  Draft ready
                </Badge>,
              ],
              [
                <Two key="p" a="J. Clarke" b="Projects head, interiors" />,
                <Score key="s" v={79} />,
                <Badge key="m" tone="good" dot>
                  High
                </Badge>,
                "Company lost two big bids",
                <Badge key="b" tone="brand">
                  Draft ready
                </Badge>,
              ],
              [
                <Two key="p" a="S. Varghese" b="Operations director" />,
                <Score key="s" v={74} />,
                <Badge key="m" dot>
                  Low
                </Badge>,
                "Joined a new firm in spring",
                <Muted key="b">Not now</Muted>,
              ],
              [
                <Two key="p" a="M. Khoury" b="Fit-out director" />,
                <Score key="s" v={72} />,
                <Badge key="m" tone="warn" dot>
                  Medium
                </Badge>,
                "Firm relocating to Riyadh",
                <Muted key="b">Researching</Muted>,
              ],
              [
                <Two key="p" a="L. Fernandes" b="Senior PM, retail" />,
                <Score key="s" v={68} />,
                <Badge key="m" tone="good" dot>
                  High
                </Badge>,
                "Contract ends in December",
                <Muted key="b">Researching</Muted>,
              ],
              [
                <Two key="p" a="D. Aziz" b="PM, hotels" />,
                <Score key="s" v={63} />,
                <Badge key="m" dot>
                  Low
                </Badge>,
                "Under 10 years' experience",
                <Muted key="b">Below brief</Muted>,
              ],
            ]}
          />
          <p className="px-4 py-2.5 text-[11.5px] text-[var(--pv-muted)]">
            Every candidate is analysed against the brief. A consultant approves
            each message before it goes.
          </p>
        </Card>
        <div className="flex min-h-0 flex-col gap-4">
          <Card
            title="Message to R. Menon"
            sub="Waiting for a consultant"
            className="min-h-0 flex-1"
          >
            <p className="-mt-1 text-[12.5px] leading-relaxed">
              Hi Rahul, congratulations on handing over the Marina hotel
              interiors. I'm working on a project director role for a fit-out
              contractor with three hospitality schemes starting next year. Open
              to a confidential chat this week?
            </p>
            <div className="mt-3 flex gap-2">
              <Btn v="primary" icon={CheckIcon}>
                Approve
              </Btn>
              <Btn icon={Pencil}>Edit</Btn>
            </div>
          </Card>
          <Card
            title="Hiring managers ranked"
            sub="By authority over this hire"
          >
            <div className="-mt-1 space-y-2 text-[12px]">
              {[
                ["Managing director", "Signs off senior hires", 95],
                ["Operations director", "Owns the fit-out division", 88],
                ["Head of HR", "Runs the process", 61],
              ].map(([t, d, v]) => (
                <div key={String(t)} className="flex items-center gap-2">
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{t}</span>
                    <span className="block text-[11.5px] text-[var(--pv-muted)]">
                      {d}
                    </span>
                  </span>
                  <Score v={Number(v)} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Fill>
    </GloApp>
  );
}

function Score({ v }: { v: number }) {
  return (
    <span className="flex items-center gap-2">
      <Meter value={v} w={40} />
      <span className="font-semibold">{v}</span>
    </span>
  );
}

/* 41 · Search by meaning --------------------------------------------------- */

function SemanticSearch() {
  return (
    <GloApp nav="search">
      <GloHead title="Search" meta="Candidates, by what they've done" />
      <Fill className="grid grid-cols-[230px_minmax(0,1fr)] gap-4">
        <div className="space-y-4">
          <Card title="Filters">
            <div className="-mt-1 space-y-3 text-[12px]">
              <div>
                <p className="mb-1 text-[var(--pv-muted)]">Location</p>
                <span className="flex h-8 items-center gap-2 rounded-md border border-[var(--pv-border)] px-2.5">
                  <MapPin className="h-3.5 w-3.5 text-[var(--pv-muted)]" />{" "}
                  Dubai, UAE
                </span>
              </div>
              <div>
                <p className="mb-1 text-[var(--pv-muted)]">Experience</p>
                <span className="flex h-8 items-center rounded-md border border-[var(--pv-border)] px-2.5">
                  10 years or more
                </span>
              </div>
              <div>
                <p className="mb-1 text-[var(--pv-muted)]">Last updated</p>
                <Chips items={[["Any"], ["Year"], ["6 months"]]} active={1} />
              </div>
            </div>
          </Card>
          <Card title="How it searches">
            <p className="-mt-1 text-[12px] leading-relaxed text-[var(--pv-text2)]">
              By meaning, so “hotel interiors” is found when you search
              “hospitality fit-out”. Every result says why it matched.
            </p>
          </Card>
        </div>
        <div className="flex min-h-0 flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 flex-1 items-center gap-2.5 rounded-[8px] border-2 border-[#2b6bea] bg-white px-3.5 text-[14px] shadow-[0_0_0_4px_rgba(43,107,234,0.12)]">
              <Search className="h-5 w-5 text-[#2b6bea]" />
              hospitality fit-out project manager
            </span>
            <Chips items={[["By meaning"], ["Exact words"]]} active={0} />
          </div>
          <p className="text-[12px] text-[var(--pv-muted)]">
            36 candidates, best match first. Exact words alone would have found
            9.
          </p>
          {[
            {
              n: "N. Farah",
              r: "Project manager, interiors contractor",
              m: 92,
              why: (
                <>
                  “Delivered <Hl>six hotel interiors</Hl> in Dubai Marina, from
                  design handover to opening.”
                </>
              ),
              kw: false,
            },
            {
              n: "P. Walsh",
              r: "Senior PM, leisure",
              m: 84,
              why: (
                <>
                  “Project lead on <Hl>restaurant and bar refurbishments</Hl>{" "}
                  across three emirates.”
                </>
              ),
              kw: false,
            },
            {
              n: "K. Osei",
              r: "Fit-out manager, hospitality",
              m: 81,
              why: (
                <>
                  “<Hl>Hospitality fit-out</Hl> manager for a 300-key resort.”
                </>
              ),
              kw: true,
            },
            {
              n: "E. Rossi",
              r: "Construction manager",
              m: 73,
              why: (
                <>
                  “Ran <Hl>guest-floor refits</Hl> while the hotel stayed open.”
                </>
              ),
              kw: false,
            },
          ].map((c, i) => (
            <div
              key={c.n}
              className={`rounded-[var(--pv-radius)] border bg-white px-4 py-3 ${i === 0 ? "border-[var(--pv-dot)] shadow-[inset_3px_0_0_var(--pv-dot)]" : "border-[var(--pv-border)]"}`}
            >
              <div className="flex items-center gap-3">
                <Avatar name={c.n} size={30} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold">{c.n}</p>
                  <p className="text-[11.5px] text-[var(--pv-muted)]">{c.r}</p>
                </div>
                {c.kw ? (
                  <Badge>Also an exact match</Badge>
                ) : (
                  <Badge tone="brand">Found by meaning</Badge>
                )}
                <span className="w-12 text-right text-[15px] font-semibold">
                  {c.m}%
                </span>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--pv-text2)]">
                {c.why}
              </p>
            </div>
          ))}
        </div>
      </Fill>
    </GloApp>
  );
}

/* 42 · Jobs, hiring signals and salary data -------------------------------- */

function Ingestion() {
  return (
    <GloApp nav="intel">
      <GloHead
        title="Intelligence"
        meta="Hiring signals, construction in the UAE"
        tabs={
          <Tabs
            items={["Sites", "Buying signals", "Hiring signals"]}
            active={2}
          />
        }
      />
      <Fill className="grid grid-cols-[minmax(0,1fr)_340px] gap-4">
        <div className="flex min-h-0 flex-col gap-4">
          <Kpis
            items={[
              {
                label: "New jobs, 7 days",
                value: "214",
                hint: "From job boards",
              },
              {
                label: "Company news",
                value: "38",
                hint: "Wins, moves, openings",
              },
              {
                label: "Firms hiring now",
                value: "27",
                hint: "3 or more roles",
              },
            ]}
          />
          <Card pad={false} className="min-h-0 flex-1">
            <Table
              dense
              sel={0}
              cols={[
                { h: "Company (made up)" },
                { h: "Roles, 30 days", align: "right", w: 104 },
                { h: "Trend", w: 96 },
                { h: "Latest", w: 220 },
              ]}
              rows={[
                [
                  "Crescent Interiors",
                  11,
                  <Spark key="s" data={[2, 3, 3, 5, 6, 8, 11]} w={70} h={20} />,
                  "Won a 400-key hotel tower",
                ],
                [
                  "Dunecraft Fit-Out",
                  8,
                  <Spark key="s" data={[3, 3, 4, 4, 6, 7, 8]} w={70} h={20} />,
                  "4 site roles in a week",
                ],
                [
                  "Al Noor Contracting",
                  6,
                  <Spark key="s" data={[5, 6, 5, 6, 6, 6, 6]} w={70} h={20} />,
                  "New operations director",
                ],
                [
                  "Harbourline Gulf",
                  5,
                  <Spark key="s" data={[1, 1, 2, 3, 3, 4, 5]} w={70} h={20} />,
                  "Opening an Abu Dhabi office",
                ],
                [
                  "Palmfront Projects",
                  4,
                  <Spark key="s" data={[6, 5, 5, 4, 4, 4, 4]} w={70} h={20} />,
                  "Lost a mall refit bid",
                ],
                [
                  "Sandline MEP",
                  4,
                  <Spark key="s" data={[2, 2, 2, 3, 3, 4, 4]} w={70} h={20} />,
                  "Hiring a commercial lead",
                ],
              ]}
            />
          </Card>
        </div>
        <div className="flex min-h-0 flex-col gap-4">
          <Card
            title="Salary ranges"
            sub="AED a month, from this month's adverts"
          >
            <div className="-mt-1 space-y-3">
              {[
                ["Project director", 55, 85],
                ["Senior PM", 38, 55],
                ["Project manager", 28, 42],
                ["Site manager", 18, 28],
              ].map(([r, lo, hi]) => (
                <div key={String(r)}>
                  <div className="flex justify-between text-[12px]">
                    <span>{r}</span>
                    <Muted>
                      {lo}k to {hi}k
                    </Muted>
                  </div>
                  <div className="relative mt-1.5 h-2 rounded-full bg-[var(--pv-primary-tint)]">
                    <span
                      className="absolute h-2 rounded-full bg-[#2b6bea]"
                      style={{
                        left: `${(Number(lo) / 90) * 100}%`,
                        width: `${((Number(hi) - Number(lo)) / 90) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Today's news" className="min-h-0 flex-1">
            <Timeline
              items={[
                {
                  time: "08:40",
                  title: "Crescent Interiors wins a hotel tower",
                  sub: "Linked to 3 of their open roles",
                },
                {
                  time: "07:15",
                  title: "Dunecraft posts 4 site roles",
                  sub: "Desk already knows their HR head",
                },
                {
                  time: "Yest.",
                  title: "Harbourline Gulf opens in Abu Dhabi",
                  sub: "No contact yet",
                  tone: "neutral",
                },
              ]}
            />
          </Card>
        </div>
      </Fill>
    </GloApp>
  );
}

/* 43 · Inbox AI that drafts replies ---------------------------------------- */

function GmailAi() {
  return (
    <GloApp nav="inbox">
      <GloHead
        title="Messages"
        meta="Email, sorted and drafted"
        tabs={<Tabs items={["WhatsApp", "Email"]} active={1} />}
      />
      <Fill className="grid grid-cols-[170px_330px_minmax(0,1fr)] gap-4">
        <div className="space-y-1 pt-1">
          {[
            [Inbox, "Needs you", "4"],
            [Users, "Clients", "6"],
            [User, "Candidates", "11"],
            [FileText, "Suppliers", "2"],
            [Archive, "Noise", "23"],
            [Star, "Drafted", "5"],
          ].map(([I, l, n], i) => {
            const Icon = I as typeof Inbox;
            return (
              <span
                key={String(l)}
                className={`flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[12.5px] ${i === 0 ? "bg-white font-semibold shadow-[0_1px_2px_rgba(16,24,40,0.06)] ring-1 ring-[var(--pv-border)]" : "text-[var(--pv-text2)]"}`}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{String(l)}</span>
                <span className="text-[11.5px] text-[var(--pv-muted)]">
                  {String(n)}
                </span>
              </span>
            );
          })}
        </div>
        <Card pad={false} className="h-full">
          {[
            {
              f: "Client, made-up contractor",
              s: "CVs for the PM role?",
              t: "Hi, any update on CVs for the project manager role? We'd like to interview next week.",
              time: "09:12",
              tag: "Client, urgent",
              tone: "bad" as Tone,
              on: true,
            },
            {
              f: "R. Menon",
              s: "Re: Confidential chat",
              t: "Thanks for getting in touch. Thursday evening works.",
              time: "08:47",
              tag: "Candidate",
              tone: "brand" as Tone,
            },
            {
              f: "Job board",
              s: "Your invoice is ready",
              t: "Invoice for October advertising credits.",
              time: "08:10",
              tag: "Supplier",
              tone: "neutral" as Tone,
            },
            {
              f: "A. Haddad",
              s: "Salary question",
              t: "Before we talk, is the package above 55k?",
              time: "Yest.",
              tag: "Candidate",
              tone: "brand" as Tone,
            },
            {
              f: "Client, made-up developer",
              s: "Shortlist feedback",
              t: "We liked two of the three. Can we see one more?",
              time: "Yest.",
              tag: "Client",
              tone: "warn" as Tone,
            },
          ].map((m) => (
            <div
              key={m.s}
              className={`border-b border-[var(--pv-divider)] px-3.5 py-2.5 ${m.on ? "bg-[var(--pv-primary-tint)] shadow-[inset_3px_0_0_var(--pv-dot)]" : ""}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[12.5px] font-semibold">
                  {m.f}
                </span>
                <span className="text-[11px] text-[var(--pv-muted)]">
                  {m.time}
                </span>
              </div>
              <p className="truncate text-[12px] font-medium">{m.s}</p>
              <p className="truncate text-[12px] text-[var(--pv-text2)]">
                {m.t}
              </p>
              <Badge tone={m.tone} dot className="mt-1">
                {m.tag}
              </Badge>
            </div>
          ))}
        </Card>
        <Card pad={false} className="flex h-full flex-col">
          <div className="border-b border-[var(--pv-divider)] px-4 py-3">
            <p className="text-[14px] font-semibold">CVs for the PM role?</p>
            <p className="text-[11.5px] text-[var(--pv-muted)]">
              From a made-up contractor, today 09:12. Sorted as a client email,
              urgent.
            </p>
          </div>
          <div className="px-4 py-3 text-[12.5px] leading-relaxed">
            Hi, any update on CVs for the project manager role? We'd like to
            interview next week.
          </div>
          <div className="mx-4 rounded-[10px] border border-dashed border-[#2b6bea]/50 bg-[#eaf0fd] p-3 text-[12.5px] leading-relaxed">
            <p className="mb-1 flex items-center gap-1 text-[11px] font-medium text-[#1f5ad9]">
              <Sparkles className="h-3 w-3" /> Draft in your voice, waiting for
              you
            </p>
            Hi, yes, I have two strong candidates and will send their CVs by 3pm
            today. Could you hold Tuesday or Wednesday afternoon for interviews?
          </div>
          <div className="mt-auto flex items-center gap-2 border-t border-[var(--pv-divider)] px-4 py-3">
            <Btn v="primary" icon={Send}>
              Send
            </Btn>
            <Btn icon={Pencil}>Edit</Btn>
            <Btn v="danger" icon={Trash2}>
              Discard
            </Btn>
            <Muted className="ml-auto text-[11.5px]">
              Used: the PM brief, both shortlists, your diary
            </Muted>
          </div>
        </Card>
      </Fill>
    </GloApp>
  );
}

/* 44 · Ad tracking, lead forms and audiences ------------------------------- */

function AdTracking() {
  return (
    <GloApp nav="ads">
      <GloHead
        title="Ads"
        meta="Events sent from the server, Glo Career Services"
        tabs={<Tabs items={["Events", "Lead forms", "Audiences"]} active={0} />}
      />
      <Fill className="flex flex-col gap-4">
        <Kpis
          items={[
            { label: "Leads, 30 days", value: "184" },
            { label: "Purchases sent back", value: "23" },
            { label: "Matched to an ad", value: "91%", tone: "good" },
            {
              label: "Sent without consent",
              value: "0",
              hint: "Consent checked first",
            },
          ]}
        />
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_360px] gap-4">
          <div className="flex min-h-0 flex-col gap-4">
            <Card title="Events by day" sub="Leads and purchases, last 14 days">
              <LineChart
                w={590}
                h={150}
                labels={[
                  "7 Oct",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "14 Oct",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "Today",
                ]}
                series={[
                  {
                    name: "Meta",
                    color: "var(--pv-chart-1)",
                    data: [
                      9, 11, 8, 12, 14, 10, 13, 15, 12, 16, 14, 17, 15, 18,
                    ],
                  },
                  {
                    name: "TikTok",
                    color: "var(--pv-chart-2)",
                    data: [2, 3, 2, 4, 3, 5, 4, 4, 6, 5, 6, 5, 7, 6],
                  },
                ]}
              />
            </Card>
            <Card pad={false} className="min-h-0 flex-1">
              <Table
                dense
                cols={[
                  { h: "Time", w: 60 },
                  { h: "Event" },
                  { h: "Sent to", w: 80 },
                  { h: "Consent", w: 98 },
                  { h: "Result", w: 126 },
                ]}
                rows={[
                  [
                    "10:38",
                    "Purchase, CV and LinkedIn",
                    "Meta",
                    <Badge key="c" tone="good">
                      Given
                    </Badge>,
                    <Badge key="r" tone="good" dot>
                      Matched
                    </Badge>,
                  ],
                  [
                    "10:02",
                    "Lead, free CV review form",
                    "Meta",
                    <Badge key="c" tone="good">
                      Given
                    </Badge>,
                    <Badge key="r" tone="good" dot>
                      Matched
                    </Badge>,
                  ],
                  [
                    "09:47",
                    "Lead, website form",
                    "TikTok",
                    <Badge key="c" tone="good">
                      Given
                    </Badge>,
                    <Badge key="r" tone="good" dot>
                      Matched
                    </Badge>,
                  ],
                  [
                    "09:30",
                    "Purchase, cover letter",
                    "Meta",
                    <Badge key="c">Declined</Badge>,
                    <Badge key="r">Not sent</Badge>,
                  ],
                ]}
              />
            </Card>
          </div>
          <div className="flex min-h-0 flex-col gap-4">
            <Card title="Lead forms" sub="Straight into the CRM">
              <Kv
                labelW={150}
                rows={[
                  ["Free CV review", "112 this month"],
                  ["Moving abroad guide", "41 this month"],
                  ["Time from form to email", "Under a minute"],
                ]}
              />
            </Card>
            <Card
              title="Audiences"
              sub="Built from past buyers"
              className="min-h-0 flex-1"
            >
              <div className="-mt-1 space-y-2.5 text-[12px]">
                {[
                  ["Past buyers", "Refreshed nightly", "Custom"],
                  ["Lookalike of past buyers", "UK, 1%", "Lookalike"],
                  ["Reviewed, didn't buy", "Last 30 days", "Retarget"],
                ].map(([n, d, t]) => (
                  <div
                    key={n}
                    className="flex items-center justify-between gap-2"
                  >
                    <span>
                      <span className="block font-medium">{n}</span>
                      <span className="block text-[11.5px] text-[var(--pv-muted)]">
                        {d}
                      </span>
                    </span>
                    <Badge>{t}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Fill>
    </GloApp>
  );
}

/* 45 · Search visibility --------------------------------------------------- */

function SearchVisibility() {
  return (
    <GloApp nav="website">
      <GloHead
        title="Website"
        meta="Search visibility"
        actions={
          <Btn v="primary" icon={Plus}>
            New article
          </Btn>
        }
        tabs={
          <Tabs items={["Pages", "Search visibility", "Articles"]} active={1} />
        }
      />
      <Fill className="flex flex-col gap-4">
        <Kpis
          items={[
            { label: "Pages in the sitemap", value: "412" },
            { label: "Indexed", value: "388", hint: "94% of the sitemap" },
            { label: "Sent to IndexNow today", value: "6" },
            { label: "Articles this month", value: "8", hint: "2 scheduled" },
          ]}
        />
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_380px] gap-4">
          <div className="flex min-h-0 flex-col gap-4">
            <Card title="Pages indexed" sub="Last 12 weeks">
              <Columns
                w={560}
                h={140}
                data={[
                  300, 312, 318, 330, 341, 349, 356, 362, 370, 377, 383, 388,
                ].map((v, i) => ({
                  label: i % 3 === 0 ? `W${32 + i}` : "",
                  v,
                }))}
                label="last"
              />
            </Card>
            <Card
              title="Told the moment a page changes"
              pad={false}
              className="min-h-0 flex-1"
            >
              <Table
                dense
                cols={[
                  { h: "Time", w: 60 },
                  { h: "Page" },
                  { h: "Change", w: 104 },
                  { h: "IndexNow", w: 112 },
                ]}
                rows={[
                  [
                    "10:20",
                    "/cv-writing/site-managers",
                    "New",
                    <Badge key="b" tone="good" dot>
                      Accepted
                    </Badge>,
                  ],
                  [
                    "09:05",
                    "/moving-abroad/dubai",
                    "Updated",
                    <Badge key="b" tone="good" dot>
                      Accepted
                    </Badge>,
                  ],
                  [
                    "08:40",
                    "/blog/cv-gaps-explained",
                    "New article",
                    <Badge key="b" tone="good" dot>
                      Accepted
                    </Badge>,
                  ],
                  [
                    "Yest.",
                    "/pricing",
                    "Updated",
                    <Badge key="b" tone="good" dot>
                      Accepted
                    </Badge>,
                  ],
                ]}
              />
            </Card>
          </div>
          <Card
            title="Article calendar"
            sub="Published on a schedule, then sent to the feed"
            className="h-full"
          >
            <div className="-mt-1 grid grid-cols-7 gap-1 text-center text-[10.5px] text-[var(--pv-muted)]">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
              {Array.from({ length: 28 }, (_, i) => {
                const pub = [1, 4, 8, 11, 15, 18].includes(i);
                const due = [22, 25].includes(i);
                return (
                  <span
                    key={i}
                    className={`flex h-9 items-center justify-center rounded-md text-[11.5px] ${pub ? "bg-[#2b6bea] font-semibold text-white" : due ? "border border-[#2b6bea] font-semibold text-[#2b6bea]" : "bg-[var(--pv-page)] text-[var(--pv-text2)]"}`}
                  >
                    {i + 1}
                  </span>
                );
              })}
            </div>
            <div className="mt-3 space-y-2 text-[12px]">
              {[
                ["Published", "How to explain a gap on your CV"],
                ["Published", "CV writing for site managers"],
                ["Scheduled, 23rd", "Moving to Dubai: what to expect"],
                ["Scheduled, 26th", "LinkedIn headlines that get found"],
              ].map(([s, t]) => (
                <div key={t} className="flex items-center gap-2">
                  <Rss className="h-3.5 w-3.5 shrink-0 text-[var(--pv-muted)]" />
                  <span className="min-w-0 flex-1 truncate">{t}</span>
                  <Badge tone={s === "Published" ? "good" : "brand"}>{s}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Fill>
    </GloApp>
  );
}

export const screens = {
  checkout: Checkout,
  "whatsapp-ai": WhatsappAi,
  headhunting: Headhunting,
  "zoho-search": SemanticSearch,
  ingestion: Ingestion,
  "gmail-ai": GmailAi,
  "ad-tracking": AdTracking,
  "search-visibility": SearchVisibility,
};
