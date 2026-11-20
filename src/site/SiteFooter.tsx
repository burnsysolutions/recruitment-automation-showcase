import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { asset } from "../lib/asset";

export function SiteFooter() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-ink font-arch text-white">
      <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-16 md:grid-cols-12 md:px-10">
        <div className="md:col-span-6">
          <img src={asset("/brand/agency-logo-reversed.svg")} alt="Demo Recruitment Co" className="h-10 w-auto" />
          <p className="mt-5 max-w-md text-[15px] leading-[1.6] text-white/60">
            Demo Recruitment Co is made up. It exists to show the candidate side of the automations: registering, answering an
            availability check, and the texts and emails people receive.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-10 gap-y-3 text-[16px] md:col-span-6 md:justify-end" aria-label="Footer">
          <Link className="hover:text-signal" to="/jobs">Jobs</Link>
          <Link className="hover:text-signal" to="/register">Register for work</Link>
          <Link className="hover:text-signal" to="/">Automation showcase</Link>
        </nav>
      </div>
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-white/10 px-5 py-6 text-[14px] text-white/45 md:px-10">
        <p>Fictional demo. No real person, client or figure appears.</p>
        <Link to="/login" className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1.5 text-white/80 transition-colors hover:border-white hover:text-white">
          <LogIn className="h-3.5 w-3.5" /> Staff log in
        </Link>
      </div>
    </footer>
  );
}
