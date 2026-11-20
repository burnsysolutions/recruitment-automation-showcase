import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Check } from "lucide-react";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import { useStore, siteById } from "../data/store";
import { PayValue, salary } from "./pay";

export function JobDetail() {
  const { id } = useParams();
  const jobs = useStore((s) => s.jobs);
  const j = jobs.find((x) => x.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (j) document.title = `${j.publicTitle}, ${siteById(j.siteId).town} | Demo Recruitment Co`;
  }, [j]);

  if (!j || j.stage === "Filled") {
    return (
      <div className="bg-white font-arch text-ink">
        <SiteNav />
        <div className="mx-auto max-w-[1360px] px-5 pb-32 pt-40 md:px-10">
          <h1 className="text-[40px] font-[780] [font-stretch:112%]">This job has been filled.</h1>
          <p className="mt-3 text-[18px] text-steel">There is plenty more starting soon.</p>
          <Link to="/jobs" className="mt-8 inline-block rounded-full bg-ink px-6 py-3.5 font-semibold text-white">See open jobs</Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const site = siteById(j.siteId);
  const ld = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: j.publicTitle,
    description: j.summary,
    datePosted: j.createdAt,
    employmentType: j.type === "Permanent" ? "FULL_TIME" : j.type === "Contract" ? "CONTRACTOR" : "TEMPORARY",
    hiringOrganization: { "@type": "Organization", name: "Demo Recruitment Co Ltd", sameAs: "https://demo-recruitment.example" },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: site.town, addressCountry: "GB" } },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "GBP",
      value: j.type === "Permanent" ? { "@type": "QuantitativeValue", value: salary(j), unitText: "YEAR" } : { "@type": "QuantitativeValue", value: j.payRate, unitText: "HOUR" },
    },
  };

  const facts: [string, React.ReactNode][] = [
    ["Pay", <PayValue j={j} unitClass="text-[15px] font-normal text-steel" />],
    ["Location", site.town],
    ["Type", `${j.type}, ${j.duration.toLowerCase()}`],
    ["Starts", j.start],
    ["Places", `${j.headcount - j.filled} of ${j.headcount} open`],
  ];

  return (
    <div className="bg-white font-arch text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <SiteNav />
      <section className="bg-ink pt-[72px] text-white">
        <div className="mx-auto max-w-[1360px] px-5 pb-14 pt-14 md:px-10 md:pb-20 md:pt-20">
          <Link to="/jobs" className="text-[15px] text-white/60 hover:text-white">All jobs</Link>
          <h1 className="mt-5 max-w-[18ch] text-[clamp(2.4rem,5.4vw,4.8rem)] font-[800] leading-[0.96] tracking-[-0.025em] [font-stretch:114%]">{j.publicTitle}</h1>
          <p className="mt-4 text-[18px] text-white/70">{j.sector}, {site.town}</p>
          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/15 pt-6 md:grid-cols-5">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-[14px] text-white/55">{k}</dt>
                <dd className="mt-1 text-[19px] font-[620] tabular">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1360px] gap-14 px-5 py-16 md:grid-cols-12 md:px-10 md:py-24">
        <div className="md:col-span-7">
          <h2 className="text-[26px] font-[720] [font-stretch:108%]">The work</h2>
          <p className="mt-4 max-w-[60ch] text-[18px] leading-[1.65] text-steel">{j.summary}</p>
          <h2 className="mt-12 text-[26px] font-[720] [font-stretch:108%]">You will need</h2>
          <ul className="mt-5 space-y-3">
            {j.requirements.map((r) => (
              <li key={r} className="flex gap-3 text-[18px]">
                <Check className="mt-1 h-5 w-5 shrink-0 text-signal" />
                {r}
              </li>
            ))}
          </ul>
          <h2 className="mt-12 text-[26px] font-[720] [font-stretch:108%]">After you apply</h2>
          <p className="mt-4 max-w-[60ch] text-[18px] leading-[1.65] text-steel">
            Sam or Priya will call you the same day to check your tickets and talk through the start. Weekly pay through your umbrella company or CIS, with timesheets handled by us.
          </p>
        </div>
        <aside className="md:col-span-4 md:col-start-9">
          <div className="sticky top-28 rounded-[20px] bg-concrete p-7">
            <p className="text-[15px] text-steel">Ref {j.ref}</p>
            <p className="mt-2 text-[30px] font-[760] tabular [font-stretch:96%]"><PayValue j={j} unitClass="text-[16px] font-normal text-steel" /></p>
            <Link to={`/register?job=${j.id}`} className="mt-6 block rounded-full bg-signal py-4 text-center text-[16px] font-semibold text-white hover:bg-[#c20f10]">
              Apply for this job
            </Link>
            <p className="mt-5 text-[15px] leading-[1.55] text-steel">
              Rather talk? Call Sam on <a className="text-ink underline-offset-2 hover:underline" href="tel:+447700900123">07700 900123</a>
            </p>
          </div>
        </aside>
      </section>
      <SiteFooter />
    </div>
  );
}
