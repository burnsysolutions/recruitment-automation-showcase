import { asset } from "../lib/asset";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Check, ChevronLeft, HardHat, Hand, Inbox, MoreHorizontal, Plus, Reply, Star, Zap } from "lucide-react";

/*
  What a worker sees on their phone. The availability text and email both lead to /a/:code,
  a one-tap page that updates their record. /m/text and /m/email show the messages as they
  arrive on a phone, for demos and the film.
*/

type Pick = "now" | "from" | "working" | "not";
const OPTIONS: { k: Pick; label: string; sub: string; icon: typeof Zap }[] = [
  { k: "now", label: "Available now", sub: "Ready to start this week", icon: Zap },
  { k: "from", label: "Available from a date", sub: "Tell us when you finish", icon: CalendarDays },
  { k: "working", label: "Working at the moment", sub: "We will check back in a few weeks", icon: HardHat },
  { k: "not", label: "Not looking just now", sub: "We will leave you be", icon: Hand },
];

export function AvailabilityReply() {
  const { code } = useParams();
  const [params] = useSearchParams();
  const name = params.get("name") ?? "Jamie";
  const initial = params.get("pick") as Pick | null;
  const [pick, setPick] = useState<Pick | null>(null);
  const [from, setFrom] = useState("2026-10-26");
  const [askDate, setAskDate] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = "Are you free for work? | Demo Recruitment Co";
  }, []);

  const choose = (k: Pick) => {
    if (k === "from" && !askDate) {
      setAskDate(true);
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setPick(k);
    }, 650);
  };

  useEffect(() => {
    if (initial && OPTIONS.some((o) => o.k === initial)) choose(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const when = new Date(from).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const done: Record<Pick, [string, string]> = {
    now: ["You're down as available.", "Sam can see it now. We'll text you as soon as there's groundwork near Lancing."],
    from: [`You're down as free from ${when}.`, "We'll be in touch the week before with work near you."],
    working: ["Thanks, good to hear you're busy.", "We'll check back in a few weeks. Use this link any time your plans change."],
    not: ["No problem, we'll leave you be.", "If that changes, reply to any of our texts and we'll pick it up."],
  };

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-[440px] flex-col bg-white px-5 pb-8 pt-5 font-arch text-ink">
      <div className="flex items-center justify-between">
        <img src={asset("/brand/agency-logo.svg")} alt="Demo Recruitment Co" className="h-8 w-auto" />
        <span className="text-[13px] text-steel">Ref {code ?? "7Hq2"}</span>
      </div>

      {pick ? (
        <div className="flex flex-1 flex-col">
          <div className="mt-14 flex h-20 w-20 items-center justify-center rounded-full bg-signal text-white shadow-[0_18px_40px_rgba(222,19,20,0.35)] [animation:pop_0.5s_cubic-bezier(0.2,1.4,0.4,1)_both]">
            <Check className="h-10 w-10" strokeWidth={2.6} />
          </div>
          <p className="mt-8 text-[17px] text-steel">Thanks, {name}.</p>
          <h1 className="mt-1 text-[34px] font-[800] leading-[1.02] tracking-[-0.02em] [font-stretch:112%]">{done[pick][0]}</h1>
          <p className="mt-4 text-[17px] leading-[1.55] text-steel">{done[pick][1]}</p>
          <div className="mt-8 rounded-2xl bg-concrete/60 p-5">
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-steel">What happens next</p>
            <ul className="mt-3 space-y-3 text-[15.5px]">
              <li className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-signal" /> Your answer is on your record with us straight away</li>
              <li className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-signal" /> You're first in line for shifts near you</li>
              <li className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-signal" /> Nothing else to fill in</li>
            </ul>
          </div>
          <button onClick={() => { setPick(null); setAskDate(false); }} className="mt-auto pt-10 text-[15px] font-semibold underline underline-offset-4">
            Change my answer
          </button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col">
          <p className="mt-10 text-[18px] text-steel">Hi {name},</p>
          <h1 className="mt-1 text-[38px] font-[820] leading-[0.98] tracking-[-0.025em] [font-stretch:114%]">Are you free for work?</h1>
          <p className="mt-4 text-[16.5px] leading-[1.5] text-steel">One tap. It goes straight to Sam's desk.</p>
          <div className="mt-8 space-y-3">
            {OPTIONS.map((o) => (
              <button
                key={o.k}
                onClick={() => choose(o.k)}
                disabled={saving}
                className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-colors active:scale-[0.99] ${o.k === "now" ? "border-ink bg-ink text-white" : "border-ink/15 bg-white hover:border-ink/40"}`}
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${o.k === "now" ? "bg-signal" : "bg-concrete"}`}>
                  <o.icon className={`h-5 w-5 ${o.k === "now" ? "text-white" : "text-ink"}`} />
                </span>
                <span className="flex-1">
                  <span className="block text-[17px] font-[680]">{o.label}</span>
                  <span className={`block text-[14px] ${o.k === "now" ? "text-white/65" : "text-steel"}`}>{o.sub}</span>
                </span>
              </button>
            ))}
          </div>
          {askDate ? (
            <div className="mt-5 rounded-2xl border border-ink/15 p-4">
              <label className="block text-[15px] font-semibold" htmlFor="from">When can you start?</label>
              <input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-ink/20 px-3 text-[16px]" />
              <button onClick={() => choose("from")} className="mt-3 h-12 w-full rounded-full bg-signal text-[16px] font-semibold text-white">Save my date</button>
            </div>
          ) : null}
          {saving ? <p className="mt-6 text-center text-[15px] text-steel">Saving your answer…</p> : null}
          <p className="mt-auto pt-10 text-center text-[13px] leading-[1.5] text-steel">
            Demo Recruitment Co, 1 Example Street, Brighton
            <br />
            This link is just for you and expires in seven days.
          </p>
        </div>
      )}
    </div>
  );
}

/** The availability text as it lands on a worker's phone. Tapping the link opens the one-tap page. */
export function PhoneText() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const name = params.get("name") ?? "Jamie";
  const [shown, setShown] = useState(false);
  useEffect(() => {
    document.title = "Text from Demo Recruitment Co";
    const t = window.setTimeout(() => setShown(true), 700);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <div className="mx-auto flex min-h-[100svh] max-w-[440px] flex-col bg-white font-[system-ui,-apple-system,'Segoe_UI',sans-serif] text-black">
      <header className="sticky top-0 z-10 flex items-center border-b border-black/[0.06] bg-white/90 px-3 pb-2 pt-2 backdrop-blur">
        <ChevronLeft className="h-7 w-7 text-[#0a66d8]" />
        <div className="mx-auto flex -translate-x-3 flex-col items-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink">
            <img src={asset("/brand/agency-logo-reversed.svg")} alt="" className="h-3.5 w-auto" />
          </span>
          <span className="mt-1 text-[12px] font-medium">Demo Recruitment Co</span>
        </div>
      </header>
      <div className="flex flex-1 flex-col justify-end gap-2 px-3 pb-4">
        <p className="text-center text-[11.5px] text-black/45">Tue 6 Oct, 14:02</p>
        <Bubble>Thanks {name}, you're registered with Demo Recruitment Co. Your card is checked and in date.</Bubble>
        <p className="mt-3 text-center text-[11.5px] text-black/45">Today 08:30</p>
        <div className={`transition-all duration-500 ${shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
          <Bubble>
            Hi {name}, it's Sam at Demo Recruitment Co. Are you free for work next week? Tap to tell us, it takes one second:{" "}
            <button onClick={() => nav(`/a/7Hq2?name=${encodeURIComponent(name)}`)} className="text-[#0a66d8] underline">demo-recruitment.example/a/7Hq2</button>
            <br />
            <span className="text-black/55">Reply STOP to opt out.</span>
          </Bubble>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-black/[0.05] px-3 py-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.06]"><Plus className="h-4 w-4 text-black/50" /></span>
        <span className="flex-1 rounded-full border border-black/15 px-4 py-1.5 text-[15px] text-black/35">Text message</span>
      </div>
    </div>
  );
}

function Bubble({ children }: { children: React.ReactNode }) {
  return <div className="max-w-[82%] rounded-[20px] rounded-bl-[6px] bg-[#e9e9eb] px-3.5 py-2.5 text-[16px] leading-[1.35]">{children}</div>;
}

/** The same check sent by email, as it reads in a phone's mail app. */
export function PhoneEmail() {
  const [params] = useSearchParams();
  const name = params.get("name") ?? "Jamie";
  useEffect(() => {
    document.title = "Email from Demo Recruitment Co";
  }, []);
  const opts: [Pick, string][] = [
    ["now", "I'm available now"],
    ["from", "Available from a date"],
    ["working", "Working at the moment"],
    ["not", "Not looking just now"],
  ];
  return (
    <div className="mx-auto min-h-[100svh] max-w-[440px] bg-white font-[system-ui,-apple-system,'Segoe_UI',sans-serif] text-black">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/[0.06] bg-white/90 px-3 py-2.5 backdrop-blur">
        <span className="flex items-center gap-1 text-[16px] text-[#0a66d8]"><ArrowLeft className="h-5 w-5" /><Inbox className="h-4 w-4" /> Inbox</span>
        <span className="flex items-center gap-4 text-black/50"><Star className="h-5 w-5" /><Reply className="h-5 w-5" /><MoreHorizontal className="h-5 w-5" /></span>
      </header>
      <div className="px-4 pt-4">
        <h1 className="text-[22px] font-semibold leading-tight">{name}, are you free for work next week?</h1>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-signal text-[15px] font-semibold text-white">M</span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold">Demo Recruitment Co</p>
            <p className="text-[13px] text-black/50">to me · 08:30</p>
          </div>
        </div>
      </div>
      <div className="mx-4 mb-8 mt-5 overflow-hidden rounded-2xl border border-black/10 font-arch">
        <div className="bg-ink px-5 py-4">
          <img src={asset("/brand/agency-logo-reversed.svg")} alt="Demo Recruitment Co" className="h-7 w-auto" />
        </div>
        <div className="px-5 pb-6 pt-5 text-ink">
          <p className="text-[17px]">Hi {name},</p>
          <p className="mt-3 text-[16px] leading-[1.55] text-steel">We've got groundwork coming up around Lancing and you're one of the first people we'd call. Tap the one that fits and we'll do the rest.</p>
          <div className="mt-5 space-y-2.5">
            {opts.map(([k, l], i) => (
              <Link key={k} to={`/a/7Hq2?name=${encodeURIComponent(name)}&pick=${k}`} className={`block rounded-full py-3.5 text-center text-[16px] font-semibold ${i === 0 ? "bg-signal text-white" : "border border-ink/15"}`}>
                {l}
              </Link>
            ))}
          </div>
          <p className="mt-6 text-[14px] leading-[1.5] text-steel">Sam<br />Demo Recruitment Co · 07700 900123</p>
        </div>
        <p className="border-t border-black/[0.06] px-5 py-3 text-[11.5px] leading-[1.5] text-black/45">Demo Recruitment Co Ltd, 1 Example Street, Brighton. You're getting this because you registered with us. Unsubscribe.</p>
      </div>
    </div>
  );
}
