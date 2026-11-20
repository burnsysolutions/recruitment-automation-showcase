import {
  BellRing,
  Bot,
  CircleCheck,
  ExternalLink,
  GitMerge,
  PhoneOff,
  Plus,
  Power,
  Rss,
  ShieldOff,
  User,
} from "lucide-react";
import { AvolonApp } from "../shells";
import {
  Avatar,
  Badge,
  Banner,
  Btn,
  Card,
  Chips,
  Kpis,
  Kv,
  Muted,
  Person,
  Table,
  Tabs,
  Timeline,
  type Tone,
} from "../kit";

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

/* 15 · Prospect alerts ----------------------------------------------------- */

function ProspectAlerts() {
  return (
    <AvolonApp
      nav="prospects"
      title="Prospect sites"
      context="Sites the desk wants to win and the trades they need. When someone suitable comes free nearby, the team hears first."
      actions={
        <Btn v="band" icon={Plus}>
          Add a site
        </Btn>
      }
    >
      <div className="grid h-full grid-cols-[minmax(0,1fr)_330px] gap-3">
        <div className="flex min-h-0 flex-col gap-3">
          <Kpis
            items={[
              {
                label: "Prospect sites",
                value: "9",
                hint: "Across Sussex and Surrey",
              },
              {
                label: "Alerts this month",
                value: "14",
                hint: "Emailed to the team",
              },
              {
                label: "Became a client",
                value: "2",
                tone: "good",
                hint: "Since September",
              },
            ]}
          />
          <Card pad={false} className="min-h-0 flex-1">
            <Table
              dense
              sel={0}
              cols={[
                { h: "Site", w: 214 },
                { h: "Contractor", w: 140 },
                { h: "Trades wanted" },
                { h: "Within", align: "right", w: 60 },
                { h: "Alerts", align: "right", w: 56 },
              ]}
              rows={[
                [
                  <Two
                    key="p"
                    a="Lewes riverside, 120 homes"
                    b="Starts November"
                  />,
                  "Tidemark Homes",
                  "Machine drivers",
                  "15 mi",
                  5,
                ],
                [
                  <Two key="p" a="Brighton Marina fit-out" b="Tender stage" />,
                  "Harbourline Fit-Out",
                  "Carpenters, labourers",
                  "10 mi",
                  3,
                ],
                [
                  <Two key="p" a="Crawley data hall, phase 2" b="On site" />,
                  "Corvid M&E",
                  "Electricians' mates",
                  "12 mi",
                  2,
                ],
                [
                  <Two key="p" a="Haywards Heath phase 3" b="Ground cleared" />,
                  "Northgate Build",
                  "Ganger, groundworkers",
                  "20 mi",
                  2,
                ],
                [
                  <Two key="p" a="Worthing sea wall" b="Awarded last week" />,
                  "Ridgeway Civils",
                  "Banksmen, dumpers",
                  "15 mi",
                  1,
                ],
                [
                  <Two
                    key="p"
                    a="Horsham school extension"
                    b="Planning approved"
                  />,
                  <Muted key="m">Not named yet</Muted>,
                  "Groundworkers",
                  "15 mi",
                  1,
                ],
              ]}
            />
          </Card>
        </div>
        <Card
          title="Alerts"
          sub="Checked every quarter of an hour"
          className="h-full"
        >
          <Timeline
            items={[
              {
                time: "10:32",
                title: "Connor Webb is free now",
                sub: "Groundworker, 360 ticket. 9 miles from Lewes riverside. Emailed the team.",
              },
              {
                time: "09:47",
                title: "Piotr Kowal registered",
                sub: "360 excavator, Horsham. 4 miles from the school extension.",
              },
              {
                time: "Mon",
                title: "Two banksmen free from 26 Oct",
                sub: "Within 15 miles of Worthing sea wall.",
              },
              {
                time: "Fri",
                title: "Ganger free, Lancing",
                sub: "18 miles from Haywards Heath phase 3.",
              },
              {
                time: "Thu",
                title: "Lewes riverside became a client",
                sub: "Tidemark Homes asked for 4 machine drivers.",
                tone: "good",
              },
            ]}
          />
          <div className="mt-3 rounded-[10px] border border-[var(--pv-border)] p-3 text-[12px] leading-relaxed">
            <p className="flex items-center gap-1.5 font-semibold">
              <BellRing className="h-3.5 w-3.5 text-[var(--pv-link)]" /> The
              email
            </p>
            <p className="mt-1 text-[var(--pv-text2)]">
              Connor Webb (groundworker, 360 ticket) is free now and lives 9
              miles from Tidemark Homes' Lewes site. They said in their last
              call they need machine drivers in November.
            </p>
          </div>
        </Card>
      </div>
    </AvolonApp>
  );
}

/* 16 · Compliance ---------------------------------------------------------- */

const CARDS: [string, string, string, string, string, Tone, boolean][] = [
  ["Reece Booth", "NPORS", "4821", "18 Sep 2026", "Expired", "bad", true],
  ["Jack Fox", "CSCS", "0917", "11 Sep 2026", "Expired", "bad", true],
  [
    "Grant Hayes",
    "CPCS",
    "5530",
    "2 Nov 2026",
    "Within 14 days",
    "warn",
    false,
  ],
  [
    "Ben Carter",
    "CSCS",
    "7712",
    "28 Nov 2026",
    "Within 60 days",
    "warn",
    false,
  ],
  ["Sophie Lowe", "CSCS", "2286", "14 Mar 2028", "In date", "good", true],
  ["Piotr Kowal", "CPCS", "3349", "9 Jun 2029", "In date", "good", false],
  ["Jamie Hart", "CSCS", "1184", "30 Jan 2028", "In date", "good", true],
  [
    "Mihai Popescu",
    "CPCS",
    "6620",
    "Not read yet",
    "Photo waiting",
    "neutral",
    false,
  ],
];

function Compliance() {
  return (
    <AvolonApp
      nav="compliance"
      title="Cards and tickets"
      context="Every card on record, read from its photo by AI, with who is about to lapse and who is on site."
      actions={
        <span className="inline-flex h-8 items-center gap-1.5 rounded-[var(--pv-radius-ctl)] bg-white/10 px-3 text-[12.5px] text-white/85">
          <Power className="h-4 w-4" /> Reminders off
        </span>
      }
    >
      <div className="grid h-full grid-cols-[minmax(0,1fr)_282px] gap-3">
        <div className="flex min-h-0 flex-col gap-3">
          <Kpis
            items={[
              { label: "Cards on record", value: "142", hint: "For 88 people" },
              {
                label: "Expired",
                value: "12",
                tone: "bad",
                hint: "5 on a live assignment",
              },
              { label: "Within 30 days", value: "4", tone: "warn" },
              { label: "Photos to read", value: "3", hint: "Read hourly" },
            ]}
          />
          <Card pad={false} className="min-h-0 flex-1">
            <div className="flex items-center justify-between border-b border-[var(--pv-divider)] px-4 py-2.5">
              <Chips
                items={[
                  ["All", 142],
                  ["Expired", 12],
                  ["Expiring", 4],
                  ["On site", 61],
                ]}
                active={0}
              />
              <Muted className="text-[11.5px]">
                Card numbers shown by their last four
              </Muted>
            </div>
            <Table
              dense
              sel={1}
              cols={[
                { h: "Holder" },
                { h: "Scheme", w: 72 },
                { h: "Card", w: 70 },
                { h: "Expires", w: 104 },
                { h: "Status", w: 132 },
                { h: "On site", w: 64 },
              ]}
              rows={CARDS.map(([n, sch, num, exp, st, tone, site]) => [
                <Person key="p" name={n} />,
                sch,
                <Muted key="n">••{num}</Muted>,
                exp,
                <Badge key="s" tone={tone} dot>
                  {st}
                </Badge>,
                site ? (
                  <Badge key="o" tone="brand">
                    Yes
                  </Badge>
                ) : (
                  <Muted key="o">No</Muted>
                ),
              ])}
            />
          </Card>
        </div>
        <Card
          title="Jack Fox, CSCS"
          sub="Read from the photo at 09:12"
          className="h-full"
        >
          <div className="-mt-1 overflow-hidden rounded-[10px] bg-gradient-to-br from-[#1f8a4c] to-[#14663a] p-3 text-white shadow-[0_8px_20px_-10px_rgba(0,0,0,0.5)]">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold tracking-[0.06em]">
                CSCS
              </span>
              <span className="rounded bg-white/20 px-1.5 text-[9.5px]">
                Labourer
              </span>
            </div>
            <div className="mt-4 flex items-end gap-3">
              <span className="flex h-12 w-10 items-center justify-center rounded bg-white/25">
                <User className="h-6 w-6 text-white/80" />
              </span>
              <div className="text-[10.5px] leading-snug">
                <p className="font-semibold">JACK FOX</p>
                <p className="text-white/80">Card •••• 0917</p>
                <p className="text-white/80">Expires 11/09/2026</p>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <Kv
              labelW={86}
              rows={[
                ["Scheme", "CSCS"],
                ["Level", "Labourer"],
                ["Expires", "11 Sep 2026"],
                ["Read with", "High confidence"],
                ["Assignment", "Weald Civils 4480"],
              ]}
            />
          </div>
          <Banner tone="bad" className="mt-3" title="Expired 39 days ago.">
            He is on a live assignment. The renewal page link is ready to text
            when reminders are on.
          </Banner>
        </Card>
      </div>
    </AvolonApp>
  );
}

/* 17 · AI voice caller ----------------------------------------------------- */

function AiCaller() {
  return (
    <AvolonApp
      nav="calls"
      title="Calls"
      context="An AI voice agent rings candidates to ask whether they're free, and writes the answer back to Bullhorn."
      actions={
        <span className="inline-flex h-8 items-center gap-1.5 rounded-[var(--pv-radius-ctl)] bg-white/10 px-3 text-[12.5px] text-white/85">
          <PhoneOff className="h-4 w-4" /> Calling off
        </span>
      }
    >
      <div className="flex h-full flex-col gap-3">
        <Banner tone="warn" icon={ShieldOff} title="Built, not switched on.">
          Calling starts only once a consent policy is agreed. These are test
          calls from the build.
        </Banner>
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_390px] gap-3">
          <Card pad={false} className="h-full">
            <div className="border-b border-[var(--pv-divider)] px-4 pt-2.5">
              <Tabs items={["Test calls 12", "Never called 3", "Settings"]} />
            </div>
            <Table
              dense
              sel={0}
              cols={[
                { h: "Candidate" },
                { h: "Took", w: 60 },
                { h: "Outcome", w: 170 },
                { h: "Bullhorn", w: 112 },
              ]}
              rows={[
                [
                  <Person key="p" name="Gary Lane" sub="07700 900461" />,
                  "1:42",
                  <Badge key="o" tone="good" dot>
                    Free from Monday
                  </Badge>,
                  "Written",
                ],
                [
                  <Person key="p" name="Owen Pike" sub="07700 900533" />,
                  "0:58",
                  <Badge key="o">Not looking</Badge>,
                  "Written",
                ],
                [
                  <Person key="p" name="Tyler Brooks" sub="07700 900127" />,
                  "0:31",
                  <Badge key="o" tone="brand" dot>
                    Call back after 5
                  </Badge>,
                  "Task set",
                ],
                [
                  <Person key="p" name="Mihai Popescu" sub="07700 900218" />,
                  "0:12",
                  <Badge key="o">Voicemail, no message</Badge>,
                  "Nothing",
                ],
                [
                  <Person key="p" name="Jade Collins" sub="07700 900344" />,
                  "2:05",
                  <Badge key="o" tone="good" dot>
                    Free now
                  </Badge>,
                  "Written",
                ],
                [
                  <Person key="p" name="Ben Carter" sub="07700 900591" />,
                  "0:49",
                  <Badge key="o" tone="bad" dot>
                    Asked for no calls
                  </Badge>,
                  "Suppressed",
                ],
              ]}
            />
            <p className="px-4 py-2.5 text-[11.5px] text-[var(--pv-muted)]">
              Never calls anyone on a live shortlist: those people are for a
              person.
            </p>
          </Card>
          <Card
            title="Gary Lane, 1 minute 42"
            sub="Transcript, written back as a note"
            className="h-full"
          >
            <div className="-mt-1 space-y-2 text-[12px] leading-relaxed">
              {[
                [
                  "AI",
                  "Hi Gary, it's the Avolon availability line, an automated assistant. Have you got a minute?",
                ],
                ["Person", "Yeah, go on."],
                [
                  "AI",
                  "Are you free for groundworks over the next couple of weeks?",
                ],
                ["Person", "I finish where I am on Friday, so from Monday."],
                [
                  "AI",
                  "Thanks. I'll put you down as free from Monday 26 October. Anything else the team should know?",
                ],
                ["Person", "Got my CPCS dumper now as well."],
              ].map(([who, t], i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${who === "AI" ? "" : "flex-row-reverse text-right"}`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${who === "AI" ? "bg-[#e7f8f9] text-[#2f6a72]" : "bg-[var(--pv-surface)] text-[var(--pv-text2)]"}`}
                  >
                    {who === "AI" ? (
                      <Bot className="h-3.5 w-3.5" />
                    ) : (
                      <User className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <span
                    className={`rounded-xl px-3 py-1.5 ${who === "AI" ? "bg-[#e7f8f9]" : "bg-[var(--pv-surface)]"}`}
                  >
                    {t}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-[10px] border border-[var(--pv-border)] p-3">
              <p className="text-[12px] font-semibold">Written to Bullhorn</p>
              <Kv
                labelW={84}
                rows={[
                  ["Available", "From Mon 26 Oct"],
                  ["Note", "Has CPCS dumper ticket now"],
                ]}
              />
            </div>
          </Card>
        </div>
      </div>
    </AvolonApp>
  );
}

/* 18 · Texts and STOP ------------------------------------------------------ */

function Sms() {
  return (
    <AvolonApp
      nav="calls"
      title="Texts"
      context="Two-way texts. Replies are filed on the candidate's record; STOP is honoured the moment it arrives."
      actions={
        <span className="inline-flex h-8 items-center gap-1.5 rounded-[var(--pv-radius-ctl)] bg-white/10 px-3 text-[12.5px] text-white/85">
          <Power className="h-4 w-4" /> Texts off
        </span>
      }
    >
      <div className="flex h-full flex-col gap-3">
        <Banner tone="warn" icon={ShieldOff} title="Built and switched off">
          until the SMS supplier's connection is ready. These are test messages.
        </Banner>
        <div className="grid min-h-0 flex-1 grid-cols-[320px_minmax(0,1fr)] gap-3">
          <Card pad={false} className="h-full">
            {[
              {
                n: "07700 900812",
                t: "STOP",
                time: "14:02",
                tone: "bad" as Tone,
                b: "Suppressed",
              },
              {
                n: "Liam Ford",
                t: "Yes from Monday",
                time: "13:47",
                tone: "good" as Tone,
                b: "Filed",
              },
              {
                n: "Ryan Cole",
                t: "Can do Tues to Fri only",
                time: "13:20",
                tone: "good" as Tone,
                b: "Filed",
              },
              {
                n: "Tyler Brooks",
                t: "Who is this?",
                time: "12:58",
                tone: "brand" as Tone,
                b: "For Sam",
              },
              {
                n: "Owen Pike",
                t: "No thanks mate",
                time: "Mon",
                tone: "neutral" as Tone,
                b: "Filed",
              },
            ].map((m, i) => (
              <div
                key={m.n}
                className={`flex gap-3 border-b border-[var(--pv-divider)] px-4 py-2.5 ${i === 0 ? "bg-[var(--pv-primary-tint)] shadow-[inset_3px_0_0_var(--pv-dot)]" : ""}`}
              >
                <Avatar name={m.n} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[12.5px] font-semibold">
                      {m.n}
                    </span>
                    <span className="text-[11px] text-[var(--pv-muted)]">
                      {m.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[12px] text-[var(--pv-text2)]">
                      {m.t}
                    </span>
                    <Badge tone={m.tone}>{m.b}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </Card>
          <Card pad={false} className="flex h-full flex-col">
            <div className="flex items-center gap-3 border-b border-[var(--pv-divider)] px-4 py-3">
              <Avatar name="07700 900812" size={30} />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold">07700 900812</p>
                <p className="text-[11.5px] text-[var(--pv-muted)]">
                  Bullhorn: Darren Mills, groundworker
                </p>
              </div>
              <Badge tone="bad" dot>
                Suppressed
              </Badge>
            </div>
            <div className="flex-1 space-y-3 bg-[var(--pv-surface)] px-5 py-4 text-[12.5px]">
              <div className="ml-auto max-w-[70%] rounded-2xl rounded-tr-md bg-[#223754] px-3.5 py-2 text-white">
                Hi Darren, it's Avolon. Are you free for groundworks next week?
                Reply YES, NO or the date you're free. Reply STOP to opt out.
                <span className="mt-0.5 block text-right text-[10.5px] text-white/60">
                  13:55
                </span>
              </div>
              <div className="max-w-[40%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2 shadow-[0_1px_1px_rgba(16,24,40,0.06)]">
                STOP
                <span className="mt-0.5 block text-right text-[10.5px] text-[var(--pv-muted)]">
                  14:02
                </span>
              </div>
              <div className="mx-auto w-fit rounded-full border border-[var(--pv-border)] bg-white px-3 py-1 text-[11.5px] text-[var(--pv-text2)]">
                14:02 STOP received. Number suppressed, Bullhorn updated, no
                more texts or calls.
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 border-t border-[var(--pv-divider)] px-4 py-3">
              {[
                ["Suppressed", "At 14:02, in the same second"],
                ["Bullhorn", "Status set to Do not contact"],
                ["Everywhere", "Texts, calls and the sweep"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[12px] font-semibold">{k}</p>
                  <p className="text-[11.5px] text-[var(--pv-muted)]">{v}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AvolonApp>
  );
}

/* 19 · Jobs feed ----------------------------------------------------------- */

function JobsFeed() {
  return (
    <AvolonApp
      nav="feed"
      title="Jobs feed"
      context="Live Bullhorn jobs as pages of their own, with Google's job data, a feed for job boards, a sitemap and alerts."
      actions={
        <Btn v="band" icon={Rss}>
          Feed address
        </Btn>
      }
    >
      <div className="flex h-full flex-col gap-3">
        <Kpis
          items={[
            { label: "Live jobs", value: "34", hint: "From Bullhorn, hourly" },
            {
              label: "Job data valid",
              value: "34 of 34",
              tone: "good",
              hint: "Title, pay, place, dates",
            },
            { label: "Sitemap", value: "09:00", hint: "Updated and pinged" },
            {
              label: "Alert subscribers",
              value: "412",
              hint: "By trade and area",
            },
          ]}
        />
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_350px] gap-3">
          <Card pad={false} className="h-full">
            <Table
              dense
              sel={0}
              cols={[
                { h: "Job" },
                { h: "Place", w: 136 },
                { h: "Pay", w: 118 },
                { h: "Job data", w: 84 },
                { h: "Feed", w: 54 },
              ]}
              rows={[
                [
                  "Groundworker",
                  "Shoreham-by-Sea",
                  "£20.00 an hour",
                  <Badge key="g" tone="good" dot>
                    Valid
                  </Badge>,
                  <Badge key="f" tone="good">
                    In
                  </Badge>,
                ],
                [
                  "360 excavator driver",
                  "Lewes",
                  "£25.50 an hour",
                  <Badge key="g" tone="good" dot>
                    Valid
                  </Badge>,
                  <Badge key="f" tone="good">
                    In
                  </Badge>,
                ],
                [
                  "Ganger",
                  "Haywards Heath",
                  "£240 a day",
                  <Badge key="g" tone="good" dot>
                    Valid
                  </Badge>,
                  <Badge key="f" tone="good">
                    In
                  </Badge>,
                ],
                [
                  "Site engineer",
                  "Crawley",
                  "£48,000 a year",
                  <Badge key="g" tone="good" dot>
                    Valid
                  </Badge>,
                  <Badge key="f" tone="good">
                    In
                  </Badge>,
                ],
                [
                  "Dumper driver",
                  "Worthing",
                  "£19.00 an hour",
                  <Badge key="g" tone="good" dot>
                    Valid
                  </Badge>,
                  <Badge key="f" tone="good">
                    In
                  </Badge>,
                ],
                [
                  "Banksman",
                  "Newhaven",
                  "£17.50 an hour",
                  <Badge key="g" tone="good" dot>
                    Valid
                  </Badge>,
                  <Badge key="f" tone="good">
                    In
                  </Badge>,
                ],
                [
                  "Setting out engineer",
                  "Horsham",
                  "£260 a day",
                  <Badge key="g" tone="good" dot>
                    Valid
                  </Badge>,
                  <Badge key="f" tone="good">
                    In
                  </Badge>,
                ],
              ]}
            />
          </Card>
          <div className="flex min-h-0 flex-col gap-3">
            <Card
              title="How it shows in search"
              sub="Job results, as a candidate sees them"
            >
              <div className="-mt-1 rounded-[10px] border border-[var(--pv-border)] p-3">
                <p className="text-[13px] font-semibold text-[#1a0dab]">
                  Groundworker
                </p>
                <p className="text-[12px]">Avolon Group, Shoreham-by-Sea</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <Badge>£20.00 an hour</Badge>
                  <Badge>Contract</Badge>
                  <Badge>Posted 2 days ago</Badge>
                </div>
              </div>
            </Card>
            <Card
              title="Job data on the page"
              sub="Checked on every publish"
              className="min-h-0 flex-1"
            >
              <pre className="-mt-1 overflow-hidden whitespace-pre rounded-[8px] bg-[#0d1c38] p-3 font-mono text-[10.5px] leading-[1.55] text-[#cfe9ec]">{`{
  "@type": "JobPosting",
  "title": "Groundworker",
  "employmentType": "CONTRACTOR",
  "jobLocation": "Shoreham-by-Sea",
  "baseSalary": { "value": 20.00,
                  "unitText": "HOUR" },
  "datePosted": "2026-10-17",
  "validThrough": "2026-11-17"
}`}</pre>
            </Card>
          </div>
        </div>
      </div>
    </AvolonApp>
  );
}

/* 20 · Worker matching ----------------------------------------------------- */

function WorkerMatching() {
  return (
    <AvolonApp
      nav="merge"
      title="Name matching and merges"
      context="A name on a sheet goes to one person or to nobody. It is never guessed. Duplicates are merged with everything carried across."
      actions={
        <Btn v="bandPrimary" icon={GitMerge}>
          Merge into the first
        </Btn>
      }
    >
      <div className="grid h-full grid-cols-[minmax(0,1fr)_400px] gap-3">
        <Card
          title="Names on this week's sheets"
          sub="How each one was decided"
          pad={false}
          className="h-full"
        >
          <Table
            dense
            cols={[
              { h: "On the sheet", w: 104 },
              { h: "Matched to", w: 126 },
              { h: "How" },
              { h: "", w: 124 },
            ]}
            rowTone={[
              undefined,
              undefined,
              undefined,
              "bad",
              undefined,
              undefined,
            ]}
            rows={[
              [
                "Jamie Hart",
                "Jamie Hart",
                "Exact name",
                <Badge key="b" tone="good" dot>
                  Matched
                </Badge>,
              ],
              [
                "T. Nowak",
                "Tomasz Nowak",
                "The only Nowak on PO 4471",
                <Badge key="b" tone="good" dot>
                  Matched
                </Badge>,
              ],
              [
                "Marek Z.",
                "Marek Zielinski",
                "Initial and surname, one man",
                <Badge key="b" tone="good" dot>
                  Matched
                </Badge>,
              ],
              [
                "J. Smith",
                <Muted key="m">Nobody</Muted>,
                "3 J. Smiths, none on SI-208",
                <Badge key="b" tone="bad" dot>
                  Not guessed
                </Badge>,
              ],
              [
                "Danny Price",
                "Daniel Price",
                "Known as Danny, on his record",
                <Badge key="b" tone="good" dot>
                  Matched
                </Badge>,
              ],
              [
                "C Webb",
                "Connor Webb",
                "Two records for him",
                <Badge key="b" tone="warn" dot>
                  Duplicate
                </Badge>,
              ],
            ]}
          />
          <p className="px-4 py-2.5 text-[11.5px] text-[var(--pv-muted)]">
            Empty or short phone numbers never match two records together.
          </p>
        </Card>
        <Card
          title="Two records for Connor Webb"
          sub="Same mobile, same Bullhorn ID"
          className="h-full"
        >
          <div className="-mt-1 grid grid-cols-2 gap-2">
            {[
              {
                h: "Keep",
                n: "Connor Webb",
                r: [
                  "07700 900612",
                  "Bullhorn 40418",
                  "Groundworker",
                  "3 assignments",
                ],
                on: true,
              },
              {
                h: "Merge in",
                n: "C Webb",
                r: [
                  "07700 900612",
                  "Bullhorn 40418",
                  "No trade",
                  "11 timesheets",
                ],
              },
            ].map((c) => (
              <div
                key={c.n}
                className={`rounded-[10px] border p-3 ${c.on ? "border-[var(--pv-dot)] bg-[var(--pv-primary-tint)]" : "border-[var(--pv-border)]"}`}
              >
                <p className="text-[11px] font-medium text-[var(--pv-muted)]">
                  {c.h}
                </p>
                <p className="mt-0.5 text-[13px] font-semibold">{c.n}</p>
                <div className="mt-1.5 space-y-0.5 text-[11.5px] text-[var(--pv-text2)]">
                  {c.r.map((x) => (
                    <p key={x}>{x}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px] font-semibold">What moves across</p>
          <div className="mt-1.5 space-y-1.5 text-[12px]">
            {[
              "11 timesheet lines",
              "3 assignments and their rates",
              "2 POs on his record",
              "Aliases, so “C Webb” finds him next time",
            ].map((x) => (
              <span key={x} className="flex items-center gap-2">
                <CircleCheck className="h-3.5 w-3.5 text-[var(--pv-good)]" />{" "}
                {x}
              </span>
            ))}
          </div>
          <Banner
            tone="neutral"
            className="mt-3"
            title="Owner or approver only."
          >
            It moves pay history between records, so it is logged with who did
            it.
          </Banner>
        </Card>
      </div>
    </AvolonApp>
  );
}

/* 21 · Scheduled jobs ------------------------------------------------------ */

const JOBS: [string, string, string, string, string, "on" | "off", string][] = [
  [
    "Read the timesheet inbox",
    "Every minute",
    "10:41",
    "3.2 s",
    "Read 3 files",
    "on",
    "gggggggggggggggggggggggg",
  ],
  [
    "Push registrations to Bullhorn",
    "Hourly",
    "10:00",
    "6.1 s",
    "2 pushed",
    "on",
    "gggggggggggggggggggggggg",
  ],
  [
    "Build shortlists",
    "Every 15 min",
    "10:30",
    "4.8 s",
    "1 vacancy, 1 list",
    "on",
    "ggggggggggggggggggggggwg",
  ],
  [
    "Availability sweep emails",
    "Daily 07:30",
    "07:30",
    "12.0 s",
    "40 sent",
    "on",
    "ssssssssgsssssssssssssss",
  ],
  [
    "Write answers to Bullhorn",
    "Hourly",
    "10:05",
    "2.4 s",
    "7 written",
    "on",
    "gggggggggggggggggggggggg",
  ],
  [
    "Prospect alerts",
    "Every 15 min",
    "10:30",
    "1.9 s",
    "1 alert",
    "on",
    "gggggggggggggggggggggggg",
  ],
  [
    "Read card photos",
    "Hourly",
    "10:10",
    "8.7 s",
    "3 read",
    "on",
    "gggggggggggggggggggggggg",
  ],
  [
    "Nightly dormant pull",
    "Daily 02:10",
    "02:10",
    "41 s",
    "212 candidates",
    "on",
    "ssgsssssssssssssssssssss",
  ],
  [
    "Compliance reminders",
    "Daily 08:00",
    "08:00",
    "0.1 s",
    "Switch off, sent nothing",
    "off",
    "ssssssssosssssssssssssss",
  ],
  [
    "Texts",
    "Every 5 min",
    "10:40",
    "0.1 s",
    "Switch off, sent nothing",
    "off",
    "oooooooooooooooooooooooo",
  ],
];

function Scheduler() {
  return (
    <AvolonApp
      nav="jobs"
      title="Scheduled jobs"
      context="Every automation that runs by itself: when it last ran, how long it took and what it said. Times are UTC."
    >
      <div className="flex h-full flex-col gap-3">
        <Kpis
          items={[
            { label: "Jobs", value: "15", hint: "Inside the database" },
            { label: "Ran cleanly, last 24 h", value: "13", tone: "good" },
            {
              label: "Switched off",
              value: "2",
              hint: "Each behind its own switch",
            },
            { label: "Failed", value: "0", hint: "A failure emails the owner" },
          ]}
        />
        <Card pad={false} className="min-h-0 flex-1">
          <Table
            dense
            small
            cols={[
              { h: "Job" },
              { h: "Runs", w: 104 },
              { h: "Last run", w: 64 },
              { h: "Took", w: 54, align: "right" },
              { h: "What it said", w: 160 },
              { h: "Last 24 hours", w: 176 },
              { h: "Switch", w: 62 },
            ]}
            rows={JOBS.map(([n, runs, last, took, said, sw, strip]) => [
              <span key="n" className="font-medium">
                {n}
              </span>,
              runs,
              last,
              took,
              sw === "off" ? <Muted key="s">{said}</Muted> : said,
              <span key="h" className="flex gap-[2px]">
                {strip.split("").map((c, i) => (
                  <span
                    key={i}
                    className="h-3.5 w-[5px] rounded-[1.5px]"
                    style={{
                      background:
                        c === "g"
                          ? "#059669"
                          : c === "w"
                            ? "#f59e0b"
                            : c === "o"
                              ? "#cbd5e1"
                              : "#e3e8ea",
                    }}
                  />
                ))}
              </span>,
              sw === "on" ? (
                <Badge key="w" tone="good">
                  On
                </Badge>
              ) : (
                <Badge key="w">Off</Badge>
              ),
            ])}
          />
          <div className="flex items-center gap-4 px-4 py-2.5 text-[11.5px] text-[var(--pv-muted)]">
            {[
              ["#059669", "Ran"],
              ["#f59e0b", "Ran, with a warning"],
              ["#cbd5e1", "Skipped: switch off"],
              ["#e3e8ea", "Not due"],
            ].map(([c, l]) => (
              <span key={l} className="inline-flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-[2px]"
                  style={{ background: c }}
                />
                {l}
              </span>
            ))}
            <span className="ml-auto inline-flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" /> Five more below
            </span>
          </div>
        </Card>
      </div>
    </AvolonApp>
  );
}

export const screens = {
  "prospect-alerts": ProspectAlerts,
  compliance: Compliance,
  "ai-caller": AiCaller,
  sms: Sms,
  "jobs-feed": JobsFeed,
  "worker-matching": WorkerMatching,
  scheduler: Scheduler,
};
