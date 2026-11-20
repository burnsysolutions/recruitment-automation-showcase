import { asset } from "../lib/asset";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Loader2, Lock, Mail } from "lucide-react";

/** Staff sign-in for the agency workspace. Demo only: any password opens the CRM. */
export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("sam@demo-recruitment.example");
  const [password, setPassword] = useState("site-ready-2026");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Sign in | Demo Recruitment Co workspace";
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    window.setTimeout(() => nav("/crm"), 700);
  };

  const field = "h-11 w-full rounded-lg border border-gborder bg-white pl-10 pr-3 text-[14px] text-gfg outline-none transition-[border-color,box-shadow] focus:border-action focus:shadow-[0_0_0_3px_rgba(0,33,73,0.12)]";

  return (
    <div className="grid min-h-[100svh] bg-gbg font-glo text-gfg lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-midnight p-12 text-white lg:flex lg:flex-col">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(233,30,140,0.35),transparent_65%)]" />
        <div className="pointer-events-none absolute -bottom-48 right-[-120px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(255,140,0,0.22),transparent_65%)]" />
        <img src={asset("/brand/glo-mark-pink.png")} alt="Glo" className="relative h-11 w-auto self-start" />
        <div className="relative mt-auto max-w-[30rem]">
          <p className="text-[13px] font-medium text-white/55">Demo Recruitment Co workspace</p>
          <h1 className="mt-3 text-[38px] font-semibold leading-[1.12] tracking-[-0.01em]">Your desk, timesheets, payroll and invoices in one place.</h1>
          <p className="mt-5 text-[15px] leading-[1.65] text-white/65">Candidates registered on the website arrive here with their cards already read. Shortlists, texts, timesheets and invoices all run from the same record.</p>
        </div>
        <p className="relative mt-12 text-[12.5px] text-white/40">Glo Business Solutions</p>
      </aside>

      <main className="flex flex-col px-5 py-8 sm:px-10">
        <Link to="/" className="inline-flex items-center gap-2 self-start text-[13px] text-gmuted hover:text-gfg">
          <ArrowLeft className="h-4 w-4" /> Back to the website
        </Link>
        <div className="mx-auto my-auto w-full max-w-[380px] py-10">
          <div className="flex items-center gap-3">
            <img src={asset("/brand/agency-logo.svg")} alt="Demo Recruitment Co" className="h-8 w-auto" />
            <span className="h-6 w-px bg-gborder" />
            <img src={asset("/brand/glo-mark-pink.png")} alt="Glo" className="h-7 w-auto lg:hidden" />
            <span className="hidden text-[13px] text-gmuted lg:inline">Staff sign-in</span>
          </div>
          <h2 className="mt-8 text-[26px] font-semibold tracking-[-0.01em] text-navy">Sign in</h2>
          <p className="mt-1.5 text-[14px] text-gmuted">Use your work email address.</p>
          <form onSubmit={submit} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Email</span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gmuted" />
                <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
              </span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Password</span>
              <span className="relative block">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gmuted" />
                <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
              </span>
            </label>
            <label className="flex items-center gap-2 text-[13px] text-gmuted">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gborder accent-[#002149]" />
              Keep me signed in on this device
            </label>
            <button type="submit" disabled={busy} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-action text-[14px] font-medium text-white transition-colors hover:bg-action-hover disabled:opacity-80">
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in</> : "Sign in"}
            </button>
          </form>
          <p data-demo className="mt-6 rounded-lg bg-gsecondary px-3.5 py-2.5 text-[12.5px] leading-relaxed text-gmuted">Demo workspace with fictional data. Any password signs you in.</p>
        </div>
        <p className="text-center text-[12px] text-gmuted">
          Built by{" "}
          <a href="https://globusinesssolution.com/" target="_blank" rel="noopener" className="font-medium text-navy hover:underline">
            Glo Business Solutions
          </a>
        </p>
      </main>
    </div>
  );
}
