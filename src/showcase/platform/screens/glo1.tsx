import {
  Building2,
  Check as CheckIcon,
  Clock,
  Eye,
  Film,
  Globe,
  Link2,
  Linkedin,
  Mail,
  MessageCircle,
  Monitor,
  Pencil,
  PhoneMissed,
  Plus,
  ReceiptText,
  Search,
  Settings2,
  Smartphone,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Fill, GloApp, GloHead } from "../shells";
import {
  Avatar,
  Badge,
  Btn,
  Card,
  Check,
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
import { Columns, LineChart } from "../charts";

/* 22 · Front Desk ---------------------------------------------------------- */

const QUEUE: {
  icon: typeof Mail;
  channel: string;
  who: string;
  text: string;
  time: string;
  badge: string;
  tone: Tone;
}[] = [
  {
    icon: MessageCircle,
    channel: "WhatsApp",
    who: "Mrs Patel",
    text: "Boiler making a banging noise, can someone look Thursday?",
    time: "07:52",
    badge: "Reply drafted",
    tone: "brand",
  },
  {
    icon: Mail,
    channel: "Email",
    who: "Lettings Direct",
    text: "Quote for 3 landlord gas safety certificates",
    time: "07:40",
    badge: "Reply drafted",
    tone: "brand",
  },
  {
    icon: ReceiptText,
    channel: "Accounts",
    who: "J. Morris",
    text: "Invoice 1042 is 14 days overdue, £480.00",
    time: "07:30",
    badge: "Reminder drafted",
    tone: "warn",
  },
  {
    icon: PhoneMissed,
    channel: "Missed call",
    who: "07700 900744",
    text: "Missed at 12:41 yesterday, no voicemail",
    time: "Mon",
    badge: "Text sent",
    tone: "good",
  },
  {
    icon: Users,
    channel: "Staff",
    who: "Tom, engineer",
    text: "Holiday: Mon 7 to Fri 11 December",
    time: "Mon",
    badge: "Diary checked",
    tone: "brand",
  },
  {
    icon: Mail,
    channel: "Email",
    who: "Arun Mehta",
    text: "Can you fit a smart thermostat next week?",
    time: "Mon",
    badge: "Reply drafted",
    tone: "brand",
  },
  {
    icon: MessageCircle,
    channel: "WhatsApp",
    who: "Ellie Grant",
    text: "Thanks, the radiator is fine now 👍",
    time: "Mon",
    badge: "No reply needed",
    tone: "neutral",
  },
];

function FrontDesk() {
  return (
    <GloApp nav="frontdesk">
      <GloHead
        title="Front Desk"
        meta="Hartley Plumbing (made up) · 6 waiting for you"
        actions={
          <>
            <Btn icon={Settings2}>Send rules</Btn>
            <Btn v="primary" icon={CheckIcon}>
              Approve 3 safe replies
            </Btn>
          </>
        }
      />
      <Fill className="grid grid-cols-[176px_352px_minmax(0,1fr)] gap-4">
        <div className="space-y-4 pt-1">
          <div>
            <p className="px-2 pb-1.5 text-[11.5px] font-medium text-[var(--pv-muted)]">
              Waiting
            </p>
            {[
              ["All", "6"],
              ["WhatsApp", "1"],
              ["Email", "2"],
              ["Accounts", "1"],
              ["Missed calls", "0"],
              ["Staff", "1"],
            ].map(([l, n], i) => (
              <span
                key={l}
                className={`flex h-8 items-center justify-between rounded-md px-2.5 text-[12.5px] ${i === 0 ? "bg-white font-semibold shadow-[0_1px_2px_rgba(16,24,40,0.06)] ring-1 ring-[var(--pv-border)]" : "text-[var(--pv-text2)]"}`}
              >
                {l}
                <span className="text-[11.5px] text-[var(--pv-muted)]">
                  {n}
                </span>
              </span>
            ))}
          </div>
          <div>
            <p className="px-2 pb-1.5 text-[11.5px] font-medium text-[var(--pv-muted)]">
              Sends by itself
            </p>
            {[
              ["Missed-call texts", true],
              ["Confirmations", true],
              ["Quotes", false],
              ["Invoice reminders", false],
            ].map(([l, on]) => (
              <span
                key={String(l)}
                className="flex h-8 items-center justify-between px-2.5 text-[12px] text-[var(--pv-text2)]"
              >
                {l}
                <span
                  className={`relative h-[18px] w-8 rounded-full ${on ? "bg-[#2b6bea]" : "bg-[#d5dbe3]"}`}
                >
                  <span
                    className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow ${on ? "left-[16px]" : "left-[2px]"}`}
                  />
                </span>
              </span>
            ))}
          </div>
        </div>

        <Card pad={false} className="h-full">
          {QUEUE.map((q, i) => (
            <div
              key={q.who + q.time}
              className={`flex gap-3 border-b border-[var(--pv-divider)] px-3.5 py-2.5 ${i === 0 ? "bg-[var(--pv-primary-tint)] shadow-[inset_3px_0_0_var(--pv-dot)]" : ""}`}
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--pv-surface)] text-[var(--pv-text2)]">
                <q.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[12.5px] font-semibold">
                    {q.who}
                  </span>
                  <span className="shrink-0 text-[11px] text-[var(--pv-muted)]">
                    {q.time}
                  </span>
                </div>
                <p className="truncate text-[12px] text-[var(--pv-text2)]">
                  {q.text}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[11px] text-[var(--pv-muted)]">
                    {q.channel}
                  </span>
                  <Badge tone={q.tone} dot>
                    {q.badge}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </Card>

        <div className="flex min-w-0 flex-col gap-4">
          <Card pad={false} className="flex-1">
            <div className="flex items-center gap-3 border-b border-[var(--pv-divider)] px-4 py-3">
              <Avatar name="Mrs Patel" size={32} />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold">Mrs Patel</p>
                <p className="text-[11.5px] text-[var(--pv-muted)]">
                  WhatsApp, 07700 900318
                </p>
              </div>
              <Badge tone="good" dot>
                Customer since 2024
              </Badge>
            </div>
            <div className="space-y-2.5 bg-[var(--pv-page)] px-4 py-3.5">
              <div className="max-w-[78%] rounded-2xl rounded-tl-md bg-white px-3 py-2 text-[12.5px] shadow-[0_1px_1px_rgba(16,24,40,0.06)]">
                Hi, the boiler is making a banging noise when the heating comes
                on. Can someone look Thursday?
                <span className="mt-0.5 block text-right text-[10.5px] text-[var(--pv-muted)]">
                  07:52
                </span>
              </div>
              <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-md border border-dashed border-[#2b6bea]/50 bg-[#eaf0fd] px-3 py-2 text-[12.5px]">
                <span className="mb-1 flex items-center gap-1 text-[11px] font-medium text-[#1f5ad9]">
                  <Sparkles className="h-3 w-3" /> Draft, waiting for you
                </span>
                Hi Mrs Patel, sorry to hear that. Banging usually means air or a
                sticking pump, and we can check both. We can come Thursday
                between 8 and 10am. Shall I book you in?
              </div>
              <p className="flex items-center justify-end gap-1 text-[11.5px] text-[var(--pv-muted)]">
                <Clock className="h-3.5 w-3.5" /> Thursday 8 to 10am is free in
                the diary
              </p>
            </div>
            <div className="border-t border-[var(--pv-divider)] px-4 py-3">
              <p className="text-[11.5px] font-medium text-[var(--pv-muted)]">
                What the draft used
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {[
                  "Diary: Thursday free",
                  "Her last three jobs",
                  "Boiler: combi, 2019",
                  "Call-out price list",
                  "House tone: friendly, short",
                ].map((c) => (
                  <Badge key={c}>{c}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 border-t border-[var(--pv-divider)] px-4 py-3">
              <Btn v="primary" icon={CheckIcon}>
                Approve and send
              </Btn>
              <Btn icon={Pencil}>Edit</Btn>
              <Btn v="danger" icon={X}>
                Don't send
              </Btn>
            </div>
          </Card>
          <Card
            title="About this customer"
            sub="From the accounts and the diary"
          >
            <Kv
              cols={2}
              labelW={84}
              rows={[
                ["Address", "14 Example Road"],
                ["Last visit", "Service, March"],
                ["Jobs", "3 since 2024"],
                ["Account", "All paid"],
                ["Boiler", "Combi, 2019"],
                ["Prefers", "WhatsApp"],
              ]}
            />
          </Card>
        </div>
      </Fill>
    </GloApp>
  );
}

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

/* 23 · Prospecting (business development autopilot) ------------------------ */

const LEADS: [string, string, string, Tone, string[], number, string, Tone][] =
  [
    [
      "Larkfield Heating Ltd",
      "Horsham",
      "Active",
      "good",
      ["No online booking", "Voicemail full"],
      82,
      "Drafted",
      "brand",
    ],
    [
      "Brookmere Plumb & Heat",
      "Crawley",
      "Active",
      "good",
      ["Contact form broken"],
      74,
      "Drafted",
      "brand",
    ],
    [
      "T. Wexley Plumbing",
      "Horsham",
      "Sole trader",
      "neutral",
      ["No website"],
      61,
      "Drafted",
      "brand",
    ],
    [
      "Horsham Heat Pumps Ltd",
      "Horsham",
      "Active",
      "good",
      ["Slow to reply"],
      58,
      "Scored",
      "neutral",
    ],
    [
      "Copthorne Heating",
      "Crawley",
      "Active",
      "good",
      ["Old site, no mobile"],
      52,
      "Scored",
      "neutral",
    ],
    [
      "Ashcombe Boilers Ltd",
      "Crawley",
      "Dissolved",
      "bad",
      ["Dissolved 2024"],
      0,
      "Left out",
      "bad",
    ],
    [
      "Southwater Gas Ltd",
      "Southwater",
      "Active",
      "good",
      ["Already books online"],
      31,
      "Low score",
      "neutral",
    ],
    [
      "Crawley Down Plumbing",
      "Crawley Down",
      "Active",
      "good",
      ["No reviews reply"],
      49,
      "Scored",
      "neutral",
    ],
  ];

function Prospecting() {
  return (
    <GloApp nav="prospecting">
      <GloHead
        title="Prospecting"
        meta="Plumbers and heating engineers, Horsham and Crawley"
        actions={
          <>
            <Btn icon={Search}>New search</Btn>
            <Btn v="primary" icon={CheckIcon}>
              Approve 3 drafts
            </Btn>
          </>
        }
        tabs={
          <Tabs
            items={[
              "Found 38",
              "Checked 34",
              "Scored 34",
              "Drafted 3",
              "Sent 41",
            ]}
            active={3}
          />
        }
      />
      <Fill className="grid grid-cols-[minmax(0,1fr)_356px] gap-4">
        <Card pad={false} className="h-full">
          <Table
            dense
            sel={0}
            cols={[
              { h: "Business" },
              { h: "Companies House", w: 118 },
              { h: "Signs of need", w: 150 },
              { h: "Score", w: 88 },
              { h: "Stage", w: 100 },
            ]}
            rows={LEADS.map(([n, town, ch, cht, sig, sc, st, stt]) => [
              <Two key="p" a={n} b={town} />,
              <Badge key="c" tone={cht} dot>
                {ch}
              </Badge>,
              <span key="s" className="flex gap-1 overflow-hidden">
                {sig.map((x) => (
                  <Badge key={x}>{x}</Badge>
                ))}
              </span>,
              sc ? (
                <span key="sc" className="flex items-center gap-2">
                  <Meter value={sc} w={44} />
                  <span className="font-semibold">{sc}</span>
                </span>
              ) : (
                <Muted key="sc">–</Muted>
              ),
              <Badge key="st" tone={stt}>
                {st}
              </Badge>,
            ])}
          />
          <p className="px-4 py-2.5 text-[11.5px] text-[var(--pv-muted)]">
            Checked against Companies House, enriched with a website and a named
            contact, then scored and de-duplicated.
          </p>
        </Card>
        <div className="flex min-h-0 flex-col gap-4">
          <Card
            title="Draft for Larkfield Heating"
            sub="To Dan Mercer, owner. Waiting for you."
            className="min-h-0 flex-1"
          >
            <p className="-mt-1 text-[12px] text-[var(--pv-muted)]">Subject</p>
            <p className="text-[12.5px] font-medium">Missed calls</p>
            <p className="mt-2 text-[12.5px] leading-relaxed">
              Hi Dan, I rang yesterday afternoon and your voicemail was full. If
              that happens with customers too, I set up a simple text-back so
              every missed caller hears from you within a minute. Worth a
              10-minute chat?
            </p>
            <p className="mt-2 text-[12.5px]">Scott</p>
            <div className="mt-3 flex gap-2">
              <Btn v="primary" icon={CheckIcon}>
                Approve
              </Btn>
              <Btn icon={Pencil}>Edit</Btn>
              <Btn v="danger" icon={X}>
                Skip
              </Btn>
            </div>
          </Card>
          <Card title="Inside the rules" sub="Checked before anything sends">
            <div className="-mt-1">
              <CheckLine note="Named owner, business address">
                Business recipient
              </CheckLine>
              <CheckLine note="One line, honoured at once">
                Opt-out in every email
              </CheckLine>
              <CheckLine note="09:00 to 17:00, weekdays">Quiet hours</CheckLine>
              <div className="flex items-center gap-2.5 py-[6px]">
                <span className="w-[15px]" />
                <span className="flex-1 text-[12.5px]">Today's cap</span>
                <Meter value={18} max={30} w={90} />
                <span className="text-[11.5px] text-[var(--pv-muted)]">
                  18 of 30
                </span>
              </div>
            </div>
          </Card>
        </div>
      </Fill>
    </GloApp>
  );
}

/* 24 · Sending domains ----------------------------------------------------- */

function DomainHealth() {
  return (
    <GloApp nav="outreach">
      <GloHead
        title="Outreach"
        meta="Sending domains"
        actions={<Btn icon={Plus}>Add a domain</Btn>}
        tabs={
          <Tabs items={["Email", "LinkedIn", "Sending domains"]} active={2} />
        }
      />
      <Fill className="flex flex-col gap-4">
        <Kpis
          items={[
            {
              label: "Bounce rate, 7 days",
              value: "0.8%",
              hint: "Pauses itself above 3%",
              tone: "good",
            },
            { label: "Complaints", value: "0.0%", hint: "Of 312 delivered" },
            { label: "Today's cap", value: "15", hint: "Day 9 of warming up" },
            {
              label: "Blocklists",
              value: "0 of 52",
              hint: "Checked at 06:00",
              tone: "good",
            },
          ]}
        />
        <div className="grid min-h-0 flex-1 grid-cols-[400px_minmax(0,1fr)] gap-4">
          <Card
            title="outreach.example"
            sub="Added 9 days ago, sending for Prospecting"
            right={
              <Badge tone="good" dot>
                Healthy
              </Badge>
            }
            className="h-full"
          >
            <div className="-mt-1 divide-y divide-[var(--pv-divider)]">
              <Check sub="Includes the sending service's servers">
                SPF passes
              </Check>
              <Check sub="Signed with selector s1, 2048-bit key">
                DKIM passes
              </Check>
              <Check
                ok="warn"
                sub="Policy is none. Move to quarantine once two weeks of reports are clean."
              >
                DMARC is set, at none
              </Check>
              <Check sub="Replies reach the inbox">MX records</Check>
              <Check sub="Opens and clicks on a domain of their own">
                Tracking domain
              </Check>
              <Check sub="0 of 52 lists, checked every morning">
                Not on any blocklist
              </Check>
            </div>
          </Card>
          <Card
            title="Warming up"
            sub="Daily cap and what was sent, 28 days"
            className="h-full"
          >
            <LineChart
              w={548}
              h={250}
              labels={Array.from({ length: 28 }, (_, i) =>
                i % 7 === 0 ? `Day ${i + 1}` : `${i + 1}`,
              )}
              series={[
                {
                  name: "Daily cap",
                  color: "var(--pv-chart-3)",
                  dashed: true,
                  data: [
                    5, 5, 6, 7, 8, 9, 10, 12, 15, 17, 19, 21, 23, 25, 27, 29,
                    31, 33, 35, 36, 37, 38, 39, 40, 40, 40, 40, 40,
                  ],
                },
                {
                  name: "Sent",
                  color: "var(--pv-chart-1)",
                  area: true,
                  data: [
                    5,
                    5,
                    6,
                    7,
                    7,
                    9,
                    10,
                    12,
                    14,
                    ...Array<null>(19).fill(null),
                  ],
                },
              ]}
            />
            <p className="mt-2 text-[12px] leading-relaxed text-[var(--pv-text2)]">
              The cap rises a little each day while bounces stay low. A bad day
              holds it where it is; a day over 3% pauses sending until a person
              looks.
            </p>
          </Card>
        </div>
      </Fill>
    </GloApp>
  );
}

/* 25 · LinkedIn queue ------------------------------------------------------ */

function LinkedinQueue() {
  return (
    <GloApp nav="outreach">
      <GloHead
        title="Outreach"
        meta="LinkedIn queue"
        actions={
          <Btn v="primary" icon={Plus}>
            Add people
          </Btn>
        }
        tabs={
          <Tabs items={["Email", "LinkedIn", "Sending domains"]} active={1} />
        }
      />
      <Fill className="flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-3">
          {[
            ["Connection requests today", 12, 20],
            ["This week", 61, 100],
          ].map(([l, v, m]) => (
            <div
              key={String(l)}
              className="rounded-[var(--pv-radius)] border border-[var(--pv-border)] bg-white px-4 py-3"
            >
              <p className="text-[12px] font-medium text-[var(--pv-text2)]">
                {l}
              </p>
              <p className="mt-1.5 text-[22px] font-semibold leading-none">
                {v}{" "}
                <span className="text-[13px] font-normal text-[var(--pv-muted)]">
                  of {m}
                </span>
              </p>
              <div className="mt-2.5">
                <Meter value={Number(v)} max={Number(m)} />
              </div>
            </div>
          ))}
          <div className="rounded-[var(--pv-radius)] border border-[var(--pv-border)] bg-white px-4 py-3">
            <p className="text-[12px] font-medium text-[var(--pv-text2)]">
              Accepted, last 30 days
            </p>
            <p className="mt-1.5 text-[22px] font-semibold leading-none">38%</p>
            <p className="mt-2 text-[11.5px] text-[var(--pv-muted)]">
              84 of 221 requests
            </p>
          </div>
          <div className="rounded-[var(--pv-radius)] border border-[var(--pv-border)] bg-white px-4 py-3">
            <p className="text-[12px] font-medium text-[var(--pv-text2)]">
              Replies to follow-ups
            </p>
            <p className="mt-1.5 text-[22px] font-semibold leading-none">9</p>
            <p className="mt-2 text-[11.5px] text-[var(--pv-muted)]">
              3 want a call
            </p>
          </div>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_340px] gap-4">
          <Card pad={false} className="h-full">
            <Table
              dense
              sel={1}
              cols={[
                { h: "Person" },
                { h: "Why them", w: 190 },
                { h: "Next", w: 84 },
                { h: "State", w: 136 },
              ]}
              rows={[
                [
                  <Two
                    key="p"
                    a="Owner, construction agency"
                    b="Kent, 12 staff (made up)"
                  />,
                  "Posts about timesheets",
                  "Request",
                  <Badge key="s" tone="brand" dot>
                    Queued, today
                  </Badge>,
                ],
                [
                  <Two
                    key="p"
                    a="MD, lettings agency"
                    b="Brighton (made up)"
                  />,
                  "Hiring an administrator",
                  "Follow-up",
                  <Badge key="s" tone="good" dot>
                    Accepted Mon
                  </Badge>,
                ],
                [
                  <Two
                    key="p"
                    a="Director, aesthetics clinic"
                    b="Hove (made up)"
                  />,
                  "No online booking",
                  "Request",
                  <Badge key="s" tone="neutral" dot>
                    Sent 09:12
                  </Badge>,
                ],
                [
                  <Two
                    key="p"
                    a="Ops lead, M&E contractor"
                    b="Crawley (made up)"
                  />,
                  "New contract win",
                  "Follow-up",
                  <Badge key="s" tone="good" dot>
                    Replied
                  </Badge>,
                ],
                [
                  <Two
                    key="p"
                    a="Owner, roofing firm"
                    b="Worthing (made up)"
                  />,
                  "Asked for CRM tips",
                  "Request",
                  <Badge key="s" tone="neutral" dot>
                    Sent Tue
                  </Badge>,
                ],
                [
                  <Two
                    key="p"
                    a="Practice manager, dental"
                    b="Lewes (made up)"
                  />,
                  "Missed-call complaints",
                  "Wait",
                  <Badge key="s" tone="neutral" dot>
                    No answer yet
                  </Badge>,
                ],
                [
                  <Two
                    key="p"
                    a="MD, staffing agency"
                    b="Chichester (made up)"
                  />,
                  "Hiring a resourcer",
                  "Request",
                  <Badge key="s" tone="brand" dot>
                    Queued, Thu
                  </Badge>,
                ],
              ]}
            />
          </Card>
          <div className="flex min-h-0 flex-col gap-4">
            <Card title="Accepted by week" sub="Requests sent within the caps">
              <Columns
                w={290}
                h={120}
                data={[
                  ["W38", 14],
                  ["W39", 18],
                  ["W40", 21],
                  ["W41", 19],
                  ["W42", 24],
                  ["W43", 23],
                ].map(([l, v]) => ({ label: String(l), v: Number(v) }))}
              />
            </Card>
            <Card
              title="Follow-up for the lettings MD"
              sub="Lined up for when she accepts"
              className="min-h-0 flex-1"
            >
              <div className="-mt-1 rounded-[10px] bg-[var(--pv-page)] p-3 text-[12.5px] leading-relaxed">
                Thanks for connecting, Priya. Saw you're hiring a property
                administrator. If most of the role is chasing maintenance and
                rent reminders, I can show you how that runs by itself. Worth a
                quick look?
              </div>
              <div className="mt-3 flex gap-2">
                <Btn v="primary" icon={Linkedin}>
                  Approve
                </Btn>
                <Btn icon={Pencil}>Edit</Btn>
              </div>
            </Card>
          </div>
        </div>
      </Fill>
    </GloApp>
  );
}

/* 26 · Buying signals ------------------------------------------------------ */

const POSTS: {
  who: string;
  where: string;
  text: string;
  tag: string;
  tone: Tone;
  score?: number;
}[] = [
  {
    who: "MD, staffing agency (made up)",
    where: "LinkedIn, 2 h ago",
    text: "Any recommendations for a CRM that actually works for temp desks? Ours can't do timesheets at all.",
    tag: "Genuine need",
    tone: "good",
    score: 91,
  },
  {
    who: "Owner, construction recruitment (made up)",
    where: "LinkedIn, 5 h ago",
    text: "Spent all Monday chasing timesheets again. There has to be a better way.",
    tag: "Genuine need",
    tone: "good",
    score: 88,
  },
  {
    who: "Software vendor (made up)",
    where: "LinkedIn, 6 h ago",
    text: "We're hiring a Head of AI to join our growing team!",
    tag: "Job ad",
    tone: "neutral",
  },
  {
    who: "Practice owner, Hove (made up)",
    where: "Local business group, yesterday",
    text: "Does anyone use something that texts back missed calls? We lose bookings every week.",
    tag: "Genuine need",
    tone: "good",
    score: 79,
  },
  {
    who: "Automation agency (made up)",
    where: "LinkedIn, yesterday",
    text: "DM us for a free automation audit 🚀",
    tag: "Vendor",
    tone: "neutral",
  },
];

function IntentFinder() {
  return (
    <GloApp nav="intel">
      <GloHead
        title="Intelligence"
        meta="Public posts from owners asking for help"
        tabs={
          <Tabs
            items={["Sites", "Buying signals", "Hiring signals"]}
            active={1}
          />
        }
      />
      <Fill className="grid grid-cols-[minmax(0,1fr)_300px] gap-4">
        <div className="flex min-h-0 flex-col gap-3 overflow-hidden">
          <Chips
            items={[
              ["All", 37],
              ["Genuine need", 9],
              ["Vendors", 18],
              ["Job ads", 10],
            ]}
            active={0}
          />
          {POSTS.map((p, i) => (
            <div
              key={i}
              className={`rounded-[var(--pv-radius)] border bg-white px-4 py-3 ${i === 0 ? "border-[var(--pv-dot)] shadow-[inset_3px_0_0_var(--pv-dot)]" : "border-[var(--pv-border)]"} ${p.tone === "neutral" ? "opacity-70" : ""}`}
            >
              <div className="flex items-center gap-2.5">
                <Avatar name={p.who} size={26} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold">
                    {p.who}
                  </p>
                  <p className="text-[11px] text-[var(--pv-muted)]">
                    {p.where}
                  </p>
                </div>
                {p.score ? (
                  <span className="text-[12px] font-semibold">{p.score}</span>
                ) : null}
                <Badge tone={p.tone} dot>
                  {p.tag}
                </Badge>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed">“{p.text}”</p>
              {p.tone === "good" ? (
                <div className="mt-2 flex gap-2">
                  <Btn size="sm" v="primary" icon={Plus}>
                    Add to prospects
                  </Btn>
                  <Btn size="sm" icon={Sparkles}>
                    Draft a reply
                  </Btn>
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="flex min-h-0 flex-col gap-4">
          <Card title="Today" sub="Read every two hours">
            <Kv
              labelW={150}
              rows={[
                ["Posts read", "212"],
                ["Asking for help", "9"],
                ["Added to prospects", "4"],
                ["Vendors and job ads", "28 left out"],
              ]}
            />
          </Card>
          <Card
            title="What counts as need"
            sub="So vendors never reach the list"
            className="min-h-0 flex-1"
          >
            <div className="-mt-1 space-y-2 text-[12px] leading-relaxed text-[var(--pv-text2)]">
              <p>
                An owner or manager describing a problem they have now, or
                asking for a recommendation.
              </p>
              <p>
                Left out: anyone selling, anyone hiring for the role itself, and
                posts older than a week.
              </p>
              <p>
                Each prospect keeps the post, so the first message can answer
                what they actually said.
              </p>
            </div>
          </Card>
        </div>
      </Fill>
    </GloApp>
  );
}

/* 27 · Trades & Labour Intelligence ---------------------------------------- */

function SatTile({ cleared, label }: { cleared?: boolean; label: string }) {
  return (
    <figure className="m-0">
      <svg viewBox="0 0 120 84" className="h-[84px] w-full rounded-[6px]">
        <rect width="120" height="84" fill={cleared ? "#b9a07c" : "#7fa36a"} />
        {cleared ? null : (
          <path
            d="M0 18 L120 30 M0 44 L120 58 M0 70 L120 80"
            stroke="#6f935c"
            strokeWidth="5"
          />
        )}
        <path
          d="M14 10 H104 V72 H14 Z"
          fill={cleared ? "#c9b28e" : "none"}
          stroke="#fff"
          strokeOpacity={0.85}
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        {cleared ? (
          <>
            <rect x="26" y="20" width="22" height="14" fill="#a8916d" />
            <rect x="58" y="20" width="22" height="14" fill="#a8916d" />
            <path d="M20 52 H98" stroke="#8c7756" strokeWidth="4" />
            <circle cx="88" cy="62" r="4" fill="#f59e0b" />
          </>
        ) : null}
        <path d="M0 4 H120" stroke="#5d6a52" strokeWidth="6" />
      </svg>
      <figcaption className="mt-1 text-[11px] text-[var(--pv-muted)]">
        {label}
      </figcaption>
    </figure>
  );
}

function SiteIntelligence() {
  return (
    <GloApp nav="intel">
      <GloHead
        title="Intelligence"
        meta="Sites within 15 miles of Crawley"
        actions={
          <Btn v="primary" icon={Link2}>
            Make a demo link
          </Btn>
        }
        tabs={
          <Tabs
            items={["Sites", "Buying signals", "Hiring signals"]}
            active={0}
          />
        }
      />
      <Fill className="grid grid-cols-[400px_minmax(0,1fr)] gap-4">
        <Card pad={false} className="h-full">
          {[
            {
              n: "48 homes, Pease Pottage",
              s: "Ground cleared",
              t: "good" as Tone,
              c: "Northgate Build",
              d: "Approved Aug",
            },
            {
              n: "Logistics unit, Manor Royal",
              s: "Contract awarded",
              t: "brand" as Tone,
              c: "Corvid M&E, services",
              d: "Awarded last week",
            },
            {
              n: "School extension, Horley",
              s: "Approved",
              t: "warn" as Tone,
              c: "No contractor yet",
              d: "Approved Sep",
            },
            {
              n: "Care home, Three Bridges",
              s: "In planning",
              t: "neutral" as Tone,
              c: "Developer only",
              d: "Validated Oct",
            },
            {
              n: "Retail park, County Oak",
              s: "On site",
              t: "good" as Tone,
              c: "Ridgeway Civils",
              d: "Started Sep",
            },
            {
              n: "72 flats, Horsham road",
              s: "Approved",
              t: "warn" as Tone,
              c: "Tender out",
              d: "Approved Jul",
            },
          ].map((r, i) => (
            <div
              key={r.n}
              className={`border-b border-[var(--pv-divider)] px-4 py-3 ${i === 0 ? "bg-[var(--pv-primary-tint)] shadow-[inset_3px_0_0_var(--pv-dot)]" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[13px] font-semibold">
                  {r.n}
                </span>
                <Badge tone={r.t} dot>
                  {r.s}
                </Badge>
              </div>
              <p className="mt-0.5 text-[12px] text-[var(--pv-muted)]">
                {r.c}. {r.d}.
              </p>
            </div>
          ))}
          <p className="px-4 py-2.5 text-[11.5px] text-[var(--pv-muted)]">
            Made-up sites. The real feed joins planning, land, company, contract
            and street-works records.
          </p>
        </Card>
        <div className="flex min-h-0 flex-col gap-4">
          <Card
            title="48 homes, Pease Pottage"
            sub="About to start: the labour isn't booked yet"
            right={
              <Badge tone="good" dot>
                Call this week
              </Badge>
            }
          >
            <div className="-mt-1 grid grid-cols-[1fr_1fr_1.3fr] gap-3">
              <SatTile label="June: field" />
              <SatTile cleared label="October: ground cleared" />
              <div className="text-[12px]">
                <p className="font-semibold">What changed</p>
                <p className="mt-1 leading-relaxed text-[var(--pv-text2)]">
                  2.1 hectares cleared, a haul road in and the first two plots
                  set out since the August approval.
                </p>
              </div>
            </div>
          </Card>
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
            <Card
              title="How we know"
              sub="Every source, with its date"
              className="h-full"
            >
              <Timeline
                items={[
                  {
                    time: "12 Aug",
                    title: "Planning approved",
                    sub: "48 homes, reserved matters",
                  },
                  {
                    time: "20 Aug",
                    title: "Land owner and developer",
                    sub: "From the land and company records",
                  },
                  {
                    time: "9 Sep",
                    title: "Contract awarded",
                    sub: "Northgate Build, main contractor",
                  },
                  {
                    time: "3 Oct",
                    title: "Ground cleared",
                    sub: "Seen on the latest satellite image",
                    tone: "good",
                  },
                  {
                    time: "14 Oct",
                    title: "Road closure filed",
                    sub: "Street works, for the site entrance",
                  },
                ]}
              />
            </Card>
            <Card
              title="Who to call"
              sub="Firms likely to be pricing labour"
              className="h-full"
            >
              <div className="-mt-1 space-y-3">
                {[
                  [
                    "Northgate Build",
                    "Main contractor. Site manager named on the road closure.",
                  ],
                  [
                    "Weald Civils",
                    "Groundworks on their last two Northgate sites.",
                  ],
                  ["Corvid M&E", "Services on Northgate's Lewes phase."],
                ].map(([n, why]) => (
                  <div key={n} className="flex gap-2.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--pv-surface)]">
                      <Building2 className="h-4 w-4 text-[var(--pv-text2)]" />
                    </span>
                    <span>
                      <span className="block text-[12.5px] font-semibold">
                        {n}
                      </span>
                      <span className="block text-[11.5px] leading-snug text-[var(--pv-muted)]">
                        {why}
                      </span>
                    </span>
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

/* 28 · Tracked proposal links ---------------------------------------------- */

function TrackedLinks() {
  return (
    <GloApp nav="tracking">
      <GloHead
        title="Link tracking"
        meta="Proposals and demos"
        actions={
          <Btn v="primary" icon={Plus}>
            New link
          </Btn>
        }
        tabs={<Tabs items={["Proposals", "Portfolio"]} active={0} />}
      />
      <Fill className="grid grid-cols-[minmax(0,1fr)_360px] gap-4">
        <Card pad={false} className="h-full">
          <Table
            dense
            sel={0}
            cols={[
              { h: "Prospect" },
              { h: "Sent", w: 54 },
              { h: "Opens", align: "right", w: 58 },
              { h: "Time spent", align: "right", w: 84 },
              { h: "Read longest", w: 120 },
              { h: "Last open", w: 124 },
            ]}
            rows={[
              [
                <Person key="p" name="Alex, MD" sub="Made-up agency" />,
                "Mon",
                3,
                "14 min",
                "Pricing",
                <Badge key="b" tone="good" dot>
                  Today 08:10
                </Badge>,
              ],
              [
                <Person
                  key="p"
                  name="Priya, lettings MD"
                  sub="Made-up lettings firm"
                />,
                "Tue",
                1,
                "4 min",
                "Rent reminders",
                "Tue 19:02",
              ],
              [
                <Person key="p" name="Dan, owner" sub="Larkfield Heating" />,
                "Tue",
                2,
                "6 min",
                "Missed calls",
                "Wed 07:45",
              ],
              [
                <Person
                  key="p"
                  name="Practice manager"
                  sub="Made-up dentist"
                />,
                "Wed",
                0,
                "–",
                <Muted key="m">Not opened</Muted>,
                <Muted key="m2">–</Muted>,
              ],
              [
                <Person key="p" name="Ops lead" sub="Made-up M&E firm" />,
                "Thu",
                1,
                "2 min",
                "Site intelligence",
                "Thu 12:30",
              ],
              [
                <Two key="p" a="Owner, roofing firm" b="Made up" />,
                "Fri",
                4,
                "19 min",
                "Pricing",
                "Fri 21:14",
              ],
            ]}
          />
        </Card>
        <div className="flex min-h-0 flex-col gap-4">
          <Card title="Alex, MD" sub="Opened 3 times, 14 minutes in all">
            <div className="-mt-1 space-y-2">
              {[
                ["Pricing", 4.5],
                ["Timesheet demo", 3],
                ["Payroll and invoicing", 2.5],
                ["Case study", 2],
                ["About", 1],
              ].map(([l, m]) => (
                <div
                  key={String(l)}
                  className="grid grid-cols-[140px_1fr_44px] items-center gap-2 text-[12px]"
                >
                  <span className="truncate">{l}</span>
                  <Meter value={Number(m)} max={5} h={8} />
                  <span className="text-right text-[var(--pv-muted)]">
                    {m} min
                  </span>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Visits" className="min-h-0 flex-1">
            <Timeline
              items={[
                {
                  time: "Mon 19:42",
                  title: "Opened on a phone",
                  sub: "11 minutes, longest on pricing",
                },
                {
                  time: "Mon 19:55",
                  title: "Summary emailed to you",
                  sub: "While it was fresh",
                  tone: "good",
                },
                {
                  time: "Today 08:10",
                  title: "Back on a laptop",
                  sub: "Pricing again, then the timesheet demo",
                },
              ]}
            />
            <div className="mt-3 flex gap-3 text-[11.5px] text-[var(--pv-muted)]">
              <span className="inline-flex items-center gap-1">
                <Smartphone className="h-3.5 w-3.5" /> Phone 1
              </span>
              <span className="inline-flex items-center gap-1">
                <Monitor className="h-3.5 w-3.5" /> Laptop 2
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> Shared with 1 other
              </span>
            </div>
          </Card>
        </div>
      </Fill>
    </GloApp>
  );
}

/* 29 · Portfolio and film tracking ----------------------------------------- */

function PortfolioTracking() {
  return (
    <GloApp nav="tracking">
      <GloHead
        title="Link tracking"
        meta="Portfolio, one named link per application"
        actions={
          <Btn v="primary" icon={Plus}>
            New named link
          </Btn>
        }
        tabs={<Tabs items={["Proposals", "Portfolio"]} active={1} />}
      />
      <Fill className="flex flex-col gap-4">
        <Kpis
          items={[
            {
              label: "Named links out",
              value: "18",
              hint: "One per application",
            },
            { label: "Opened", value: "11", hint: "Within 2 days, mostly" },
            { label: "Films watched past half", value: "7" },
            { label: "CV downloads", value: "5", hint: "From the portfolio" },
          ]}
        />
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_380px] gap-4">
          <Card pad={false} className="h-full">
            <Table
              dense
              sel={0}
              cols={[
                { h: "Reader" },
                { h: "Opened", w: 92 },
                { h: "Pages", align: "right", w: 56 },
                { h: "Film watched", w: 150 },
                { h: "CV", w: 70 },
              ]}
              rows={[
                [
                  <Person
                    key="p"
                    name="Hiring manager A"
                    sub="Made-up agency, Brighton"
                  />,
                  "Mon 09:40",
                  6,
                  <Watch key="w" v={92} />,
                  <Badge key="c" tone="good">
                    Yes
                  </Badge>,
                ],
                [
                  <Person
                    key="p"
                    name="Talent lead B"
                    sub="Made-up group, London"
                  />,
                  "Mon 14:02",
                  4,
                  <Watch key="w" v={60} />,
                  <Badge key="c" tone="good">
                    Yes
                  </Badge>,
                ],
                [
                  <Person
                    key="p"
                    name="Director C"
                    sub="Made-up firm, Crawley"
                  />,
                  "Tue 11:15",
                  2,
                  <Watch key="w" v={18} />,
                  <Muted key="c">No</Muted>,
                ],
                [
                  <Person
                    key="p"
                    name="Ops manager D"
                    sub="Made-up agency, Kent"
                  />,
                  "Wed 08:30",
                  7,
                  <Watch key="w" v={100} />,
                  <Badge key="c" tone="good">
                    Yes
                  </Badge>,
                ],
                [
                  <Person
                    key="p"
                    name="Recruiter E"
                    sub="Made-up search firm"
                  />,
                  <Muted key="o">Not yet</Muted>,
                  0,
                  <Muted key="w">–</Muted>,
                  <Muted key="c">–</Muted>,
                ],
                [
                  <Person key="p" name="Founder F" sub="Made-up start-up" />,
                  "Thu 19:51",
                  3,
                  <Watch key="w" v={45} />,
                  <Muted key="c">No</Muted>,
                ],
              ]}
            />
          </Card>
          <div className="flex min-h-0 flex-col gap-4">
            <Card title="Hiring manager A" sub="Pages in the order read">
              <div className="-mt-1 space-y-1.5 text-[12px]">
                {[
                  [Globe, "Recruitment automation", "2 min 40 s"],
                  [Film, "Payroll film", "92% watched"],
                  [Globe, "Payroll and invoicing", "1 min 55 s"],
                  [Globe, "Candidate matching", "1 min 10 s"],
                  [Mail, "CV download", "Opened"],
                ].map(([I, l, v], i) => {
                  const Icon = I as typeof Globe;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-[var(--pv-muted)]" />
                      <span className="flex-1">{String(l)}</span>
                      <Muted>{String(v)}</Muted>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card title="Views by day" className="min-h-0 flex-1">
              <Columns
                w={326}
                h={150}
                data={[
                  ["Mon", 9],
                  ["Tue", 6],
                  ["Wed", 11],
                  ["Thu", 4],
                  ["Fri", 7],
                  ["Sat", 1],
                  ["Sun", 2],
                ].map(([l, v]) => ({ label: String(l), v: Number(v) }))}
                label="max"
              />
            </Card>
          </div>
        </div>
      </Fill>
    </GloApp>
  );
}

function Watch({ v }: { v: number }) {
  return (
    <span className="flex items-center gap-2">
      <Meter value={v} w={70} tone={v >= 50 ? "brand" : "neutral"} />
      <span className="text-[11.5px]">{v}%</span>
    </span>
  );
}

export const screens = {
  "front-desk": FrontDesk,
  "bd-autopilot": Prospecting,
  "domain-health": DomainHealth,
  "linkedin-queue": LinkedinQueue,
  "intent-finder": IntentFinder,
  "site-intelligence": SiteIntelligence,
  "tracked-links": TrackedLinks,
  "portfolio-tracking": PortfolioTracking,
};
