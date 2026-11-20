import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, Camera, ArrowLeft } from "lucide-react";
import { SiteNav } from "./SiteNav";
import { useStore, setState, siteById, TRADES, logActivity, nowHM } from "../data/store";
import { TOWNS, TODAY, type Candidate, type CardScheme } from "../data/seed";
import { payText } from "./pay";

const STEPS = ["About you", "Your trade", "Cards and right to work", "Check and send"];
const SCHEMES: CardScheme[] = ["CSCS", "CPCS", "NPORS", "ECS", "SMSTS", "SSSTS"];

interface Form {
  first: string;
  last: string;
  mobile: string;
  email: string;
  postcode: string;
  trade: string;
  years: string;
  availability: "now" | "from" | "working";
  from: string;
  scheme: CardScheme;
  level: string;
  number: string;
  expires: string;
  front?: string;
  back?: string;
  rtw: "uk" | "share";
  shareCode: string;
  umbrella: string;
  consentTexts: boolean;
  consentPrivacy: boolean;
}

const blank: Form = {
  first: "",
  last: "",
  mobile: "",
  email: "",
  postcode: "",
  trade: "",
  years: "5+",
  availability: "now",
  from: "",
  scheme: "CSCS",
  level: "Skilled worker (blue)",
  number: "",
  expires: "",
  rtw: "uk",
  shareCode: "",
  umbrella: "Not sure yet",
  consentTexts: true,
  consentPrivacy: false,
};

function locate(pc: string) {
  const out = pc.trim().toUpperCase().split(/\s+/)[0];
  const exact = TOWNS.find((t) => t[1] === out);
  if (exact) return exact;
  const area = out.replace(/\d.*$/, "");
  return TOWNS.find((t) => t[1].startsWith(area)) ?? TOWNS[0];
}

export function Register() {
  const [params] = useSearchParams();
  const jobs = useStore((s) => s.jobs);
  const job = jobs.find((j) => j.id === params.get("job"));
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Form>(() => ({ ...blank, trade: job?.trade ?? "" }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [doneId, setDoneId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Register for work | Demo Recruitment Co";
  }, []);
  useEffect(() => window.scrollTo(0, 0), [step, doneId]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }));

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!f.first.trim()) e.first = "Enter your first name";
      if (!f.last.trim()) e.last = "Enter your last name";
      if (f.mobile.replace(/\D/g, "").length < 10) e.mobile = "Enter a UK mobile number, for example 07700 900123";
      if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter an email address like name@example.com";
      if (!/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(f.postcode.trim())) e.postcode = "Enter your full postcode, for example BN3 5AB";
    }
    if (s === 1) {
      if (!f.trade) e.trade = "Choose the trade you mostly work in";
      if (f.availability === "from" && !f.from) e.from = "Choose the date you can start";
    }
    if (s === 2) {
      if (f.number.replace(/\s/g, "").length < 6) e.number = "Enter the number printed on your card";
      if (!f.expires) e.expires = "Enter the expiry date shown on the card";
      else if (new Date(f.expires) < TODAY) e.expires = "This card has expired. Register anyway and we will help you renew it";
      if (f.rtw === "share" && f.shareCode.replace(/\s/g, "").length !== 9) e.shareCode = "Share codes are 9 characters, for example W4K 7RD 2PQ";
    }
    if (s === 3 && !f.consentPrivacy) e.consentPrivacy = "Tick to confirm you have read how we use your details";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    if (step < 3) setStep(step + 1);
    else submit();
  };

  const submit = () => {
    const town = locate(f.postcode);
    const t = TRADES.find((x) => x.trade === f.trade)!;
    const id = `c${Date.now()}`;
    const c: Candidate = {
      id,
      first: f.first.trim(),
      last: f.last.trim(),
      trade: f.trade,
      sector: t.sector,
      postcode: f.postcode.trim().toUpperCase(),
      town: town[0],
      lat: town[2],
      lng: town[3],
      mobile: f.mobile.trim(),
      email: f.email.trim() || `${f.first.toLowerCase()}@example.com`,
      status: f.availability === "now" ? "Available" : "Available from",
      availableFrom: f.availability === "from" ? f.from : f.availability === "working" ? new Date(TODAY.getTime() + 28 * 86400000).toISOString().slice(0, 10) : undefined,
      payRate: t.rate[0],
      shiftsWorked: 0,
      lastContact: TODAY.toISOString().slice(0, 10),
      cards: [{ scheme: f.scheme, level: f.level, number: f.number.trim(), expires: f.expires }],
      rtw: f.rtw === "uk" ? "Verified" : "Pending",
      umbrella: f.umbrella,
      source: "Website",
      owner: "Sam",
      createdAt: TODAY.toISOString().slice(0, 10),
      cardPhotos: f.front || f.back ? { front: f.front, back: f.back } : undefined,
      notes: `${f.years} years in the trade.${f.front ? " Card photos uploaded." : ""}`,
    };
    setState((s) => ({
      ...s,
      candidates: [c, ...s.candidates],
      newCandidates: [id, ...s.newCandidates],
      shortlist: job ? { ...s.shortlist, [job.id]: { ...(s.shortlist[job.id] ?? {}), [id]: "Available" } } : s.shortlist,
    }));
    logActivity({ who: "System", kind: "registration", text: `New registration from the website: ${c.first} ${c.last}, ${c.trade.toLowerCase()}, ${c.town}${job ? `. Applied for ${job.publicTitle}` : ""}.`, candidateId: id, at: nowHM() });
    setDoneId(id);
  };

  const trades = useMemo(() => [...TRADES].sort((a, b) => a.trade.localeCompare(b.trade)), []);

  if (doneId) {
    return (
      <div className="min-h-screen bg-white font-arch text-ink">
        <SiteNav />
        <div className="mx-auto max-w-[760px] px-5 pb-24 pt-36 md:pt-44">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-signal text-white">
            <Check className="h-7 w-7" />
          </span>
          <h1 className="mt-8 text-[clamp(2.2rem,5vw,3.6rem)] font-[800] leading-[1] tracking-[-0.02em] [font-stretch:114%]">You are registered, {f.first}.</h1>
          <p className="mt-5 text-[19px] leading-[1.6] text-steel">
            {job
              ? `We have your application for ${job.publicTitle.toLowerCase()} in ${siteById(job.siteId).town}. Sam will call you today on ${f.mobile}.`
              : `We will text ${f.mobile} when there is ${f.trade.toLowerCase()} work near ${locate(f.postcode)[0]}. Reply with one tap to say if you are free.`}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/jobs" className="rounded-full bg-ink px-6 py-3.5 font-semibold text-white">See open jobs</Link>
            <Link to="/" className="rounded-full border border-ink/20 px-6 py-3.5 font-semibold">Back to home</Link>
          </div>
          <p data-demo className="mt-16 border-t border-ink/10 pt-5 text-[14px] text-steel">
            Demo: this registration is now a candidate record in the CRM.{" "}
            <Link to={`/crm/candidates/${doneId}`} className="font-semibold text-ink underline underline-offset-2">Open it</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-arch text-ink">
      <SiteNav />
      <div className="mx-auto grid max-w-[1360px] gap-10 px-5 pb-24 pt-28 md:px-10 lg:grid-cols-12 lg:pt-36">
        <aside className="lg:col-span-4">
          <h1 className="text-[clamp(2.2rem,4.4vw,3.6rem)] font-[800] leading-[0.98] tracking-[-0.02em] [font-stretch:114%]">Register for work</h1>
          <p className="mt-4 max-w-[38ch] text-[17px] leading-[1.6] text-steel">Four short steps. Have your card to hand; it takes about two minutes.</p>
          {job ? (
            <div className="mt-8 rounded-2xl bg-concrete p-5">
              <p className="text-[14px] text-steel">Applying for</p>
              <p className="mt-1 text-[19px] font-[680] [font-stretch:106%]">{job.publicTitle}</p>
              <p className="text-[15px] text-steel">
                {siteById(job.siteId).town}, {payText(job)}, starts {job.start}
              </p>
            </div>
          ) : null}
          <ol className="mt-10 hidden space-y-1 lg:block">
            {STEPS.map((s, i) => (
              <li key={s} className={`flex items-center gap-3 py-2 text-[16px] ${i === step ? "font-semibold text-ink" : i < step ? "text-ink/70" : "text-steel/70"}`}>
                <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-[13px] tabular ${i < step ? "border-ink bg-ink text-white" : i === step ? "border-ink" : "border-ink/20"}`}>
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </aside>

        <div className="lg:col-span-7 lg:col-start-6">
          <p className="text-[15px] text-steel lg:hidden">Step {step + 1} of 4</p>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-concrete lg:hidden">
            <div className="h-full bg-signal transition-[width]" style={{ width: `${((step + 1) / 4) * 100}%` }} />
          </div>
          <h2 className="mt-4 text-[28px] font-[740] [font-stretch:108%] lg:mt-0">{STEPS[step]}</h2>

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
            className="mt-8 space-y-6"
          >
            {step === 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <In label="First name" error={errors.first}><input autoComplete="given-name" value={f.first} onChange={(e) => set("first", e.target.value)} className={ic(errors.first)} /></In>
                  <In label="Last name" error={errors.last}><input autoComplete="family-name" value={f.last} onChange={(e) => set("last", e.target.value)} className={ic(errors.last)} /></In>
                </div>
                <In label="Mobile" hint="We text you about work. Nothing else." error={errors.mobile}><input type="tel" autoComplete="tel" value={f.mobile} onChange={(e) => set("mobile", e.target.value)} className={ic(errors.mobile)} /></In>
                <In label="Email (optional)" error={errors.email}><input type="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} className={ic(errors.email)} /></In>
                <In label="Home postcode" hint="So we only offer you work you can get to." error={errors.postcode}><input autoComplete="postal-code" value={f.postcode} onChange={(e) => set("postcode", e.target.value)} className={`${ic(errors.postcode)} uppercase sm:max-w-[220px]`} /></In>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <In label="Main trade" error={errors.trade}>
                  <select value={f.trade} onChange={(e) => set("trade", e.target.value)} className={ic(errors.trade)}>
                    <option value="">Choose a trade</option>
                    {trades.map((t) => (
                      <option key={t.trade} value={t.trade}>{t.trade}</option>
                    ))}
                  </select>
                </In>
                <Choice label="Years in the trade" value={f.years} onChange={(v) => set("years", v)} options={["Under 1", "1 to 2", "3 to 5", "5+"]} />
                <Choice
                  label="When can you start?"
                  value={f.availability}
                  onChange={(v) => set("availability", v as Form["availability"])}
                  options={[["now", "Straight away"], ["from", "From a date"], ["working", "Working now, keep me in mind"]]}
                />
                {f.availability === "from" ? (
                  <In label="Available from" error={errors.from}><input type="date" value={f.from} onChange={(e) => set("from", e.target.value)} className={`${ic(errors.from)} sm:max-w-[240px]`} /></In>
                ) : null}
              </>
            ) : null}

            {step === 2 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <In label="Card scheme">
                    <select value={f.scheme} onChange={(e) => set("scheme", e.target.value as CardScheme)} className={ic()}>
                      {SCHEMES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </In>
                  <In label="Card type or colour"><input value={f.level} onChange={(e) => set("level", e.target.value)} className={ic()} /></In>
                  <In label="Card number" error={errors.number}><input inputMode="numeric" value={f.number} onChange={(e) => set("number", e.target.value)} className={ic(errors.number)} /></In>
                  <In label="Expiry date" error={errors.expires}><input type="date" value={f.expires} onChange={(e) => set("expires", e.target.value)} className={ic(errors.expires)} /></In>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <PhotoPick label="Front of card" value={f.front} onPick={(u) => set("front", u)} />
                  <PhotoPick label="Back of card" value={f.back} onPick={(u) => set("back", u)} />
                </div>
                <Choice label="Right to work in the UK" value={f.rtw} onChange={(v) => set("rtw", v as Form["rtw"])} options={[["uk", "British or Irish passport"], ["share", "Home Office share code"]]} />
                {f.rtw === "share" ? (
                  <In label="Share code" hint="Get one from gov.uk/prove-right-to-work" error={errors.shareCode}><input value={f.shareCode} onChange={(e) => set("shareCode", e.target.value)} className={`${ic(errors.shareCode)} uppercase sm:max-w-[240px]`} /></In>
                ) : null}
                <In label="How do you get paid?">
                  <select value={f.umbrella} onChange={(e) => set("umbrella", e.target.value)} className={ic()}>
                    {["Not sure yet", "Paystream", "Brookson One", "Parasol", "Giant", "CIS (self-employed)"].map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </In>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <dl className="divide-y divide-ink/10 border-y border-ink/10 text-[16px]">
                  {[
                    ["Name", `${f.first} ${f.last}`, 0],
                    ["Mobile", f.mobile, 0],
                    ["Postcode", f.postcode.toUpperCase(), 0],
                    ["Trade", `${f.trade}, ${f.years} years`, 1],
                    ["Start", f.availability === "now" ? "Straight away" : f.availability === "from" ? `From ${new Date(f.from).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}` : "Working now", 1],
                    ["Card", `${f.scheme} ${f.level}, expires ${f.expires ? new Date(f.expires).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : ""}`, 2],
                    ["Right to work", f.rtw === "uk" ? "British or Irish passport" : `Share code ${f.shareCode.toUpperCase()}`, 2],
                  ].map(([k, v, s]) => (
                    <div key={k as string} className="grid grid-cols-[8rem_1fr_auto] items-baseline gap-4 py-3.5">
                      <dt className="text-steel">{k}</dt>
                      <dd>{v}</dd>
                      <button type="button" onClick={() => setStep(s as number)} className="text-[14px] text-steel underline-offset-2 hover:text-ink hover:underline">Change</button>
                    </div>
                  ))}
                </dl>
                <Tick checked={f.consentTexts} onChange={(v) => set("consentTexts", v)}>Text me when there is work near me. Reply STOP at any time.</Tick>
                <Tick checked={f.consentPrivacy} onChange={(v) => set("consentPrivacy", v)} error={errors.consentPrivacy}>
                  I have read how Demo Recruitment Co uses my details in the <a href="#" className="underline underline-offset-2">privacy notice</a>.
                </Tick>
              </>
            ) : null}

            <div className="flex items-center gap-4 pt-4">
              {step > 0 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="inline-flex h-14 items-center gap-2 rounded-full border border-ink/20 px-6 text-[16px] font-semibold hover:border-ink">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              ) : null}
              <button type="submit" className="h-14 flex-1 rounded-full bg-ink px-8 text-[16px] font-semibold text-white hover:bg-ink/85 sm:flex-none">
                {step < 3 ? "Continue" : "Send registration"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const ic = (err?: string) =>
  `h-14 w-full rounded-xl border bg-white px-4 text-[17px] text-ink focus:outline-none focus:ring-2 ${err ? "border-signal focus:ring-signal/20" : "border-ink/20 focus:border-ink focus:ring-ink/10"}`;

function In({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[16px] font-semibold">{label}</span>
      {hint ? <span className="block text-[15px] text-steel">{hint}</span> : null}
      <span className="mt-2 block">{children}</span>
      {error ? <span className="mt-2 block text-[15px] font-medium text-signal">{error}</span> : null}
    </label>
  );
}

function Choice({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: (string | [string, string])[] }) {
  return (
    <fieldset>
      <legend className="text-[16px] font-semibold">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const [v, l] = Array.isArray(o) ? o : [o, o];
          const on = value === v;
          return (
            <button
              type="button"
              key={v}
              onClick={() => onChange(v)}
              aria-pressed={on}
              className={`h-12 rounded-full px-5 text-[16px] transition-colors ${on ? "bg-ink text-white" : "border border-ink/20 hover:border-ink"}`}
            >
              {l}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Tick({ checked, onChange, children, error }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; error?: string }) {
  return (
    <div>
      <label className="flex cursor-pointer gap-4 text-[16px] leading-[1.5]">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-6 w-6 shrink-0 accent-[#0A0A0A]" />
        <span>{children}</span>
      </label>
      {error ? <p className="ml-10 mt-1 text-[15px] font-medium text-signal">{error}</p> : null}
    </div>
  );
}

function PhotoPick({ label, value, onPick }: { label: string; value?: string; onPick: (url: string) => void }) {
  return (
    <label className="group block cursor-pointer">
      <span className="block text-[16px] font-semibold">{label}</span>
      <span className="mt-2 flex aspect-[85/54] items-center justify-center overflow-hidden rounded-xl border border-dashed border-ink/25 bg-concrete/50 transition-colors group-hover:border-ink/50">
        {value ? (
          <img src={value} alt={label} className="h-full w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-2 text-[15px] text-steel">
            <Camera className="h-6 w-6" />
            Take a photo or upload
          </span>
        )}
      </span>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          // shrink to a sensible size so it can live on the record
          const r = new FileReader();
          r.onload = () => {
            const img = new Image();
            img.onload = () => {
              const k = Math.min(1, 900 / Math.max(img.width, img.height));
              const cv = document.createElement("canvas");
              cv.width = Math.round(img.width * k);
              cv.height = Math.round(img.height * k);
              cv.getContext("2d")!.drawImage(img, 0, 0, cv.width, cv.height);
              onPick(cv.toDataURL("image/jpeg", 0.82));
            };
            img.onerror = () => onPick(String(r.result));
            img.src = String(r.result);
          };
          r.readAsDataURL(file);
        }}
      />
    </label>
  );
}
