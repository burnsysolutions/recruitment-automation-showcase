import type { ReactNode } from "react";
import { asset } from "../../../lib/asset";

// Documents that appear inside the platforms: a scanned timesheet, an invoice
// page, a CV page. Drawn, not photographed, and every name on them is made up.

export function ScanSheet({
  client,
  site,
  we,
  po,
  rows,
  signed,
  width = 250,
  mark,
}: {
  client: string;
  site: string;
  we: string;
  po: string;
  rows: { name: string; days: string[]; total: string; flag?: boolean }[];
  signed: string;
  width?: number;
  mark?: { row: number; day: number };
}) {
  return (
    <div
      className="pv-paper pv-scan relative rotate-[-0.6deg] rounded-[3px] p-3.5 text-[#2d2a24]"
      style={{ width }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold tracking-[0.04em]">
            WEEKLY TIMESHEET
          </p>
          <p className="text-[9px] text-[#6d665a]">{client}</p>
        </div>
        <div className="text-right text-[8.5px] leading-[1.5] text-[#6d665a]">
          <p>
            Site{" "}
            <span className="font-hand text-[13px] leading-none text-[#1e3a8a]">
              {site}
            </span>
          </p>
          <p>
            W/E{" "}
            <span className="font-hand text-[13px] leading-none text-[#1e3a8a]">
              {we}
            </span>
          </p>
          <p>
            PO{" "}
            <span className="font-hand text-[13px] leading-none text-[#1e3a8a]">
              {po}
            </span>
          </p>
        </div>
      </div>
      <table className="mt-2 w-full border-collapse text-[8.5px]">
        <thead>
          <tr className="border-b border-[#cfc6b4] text-[#6d665a]">
            <th className="py-0.5 text-left font-medium">Name</th>
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <th key={i} className="w-[15px] py-0.5 text-center font-medium">
                {d}
              </th>
            ))}
            <th className="w-[24px] py-0.5 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr
              key={r.name}
              className="border-b border-dashed border-[#d9d1c0]"
            >
              <td className="py-[3px] font-hand text-[13px] leading-none text-[#1e3a8a]">
                {r.name}
              </td>
              {Array.from({ length: 7 }, (_, di) => (
                <td
                  key={di}
                  className="relative text-center font-hand text-[13px] leading-none text-[#1e3a8a]"
                >
                  {r.days[di] ?? ""}
                  {mark && mark.row === ri && mark.day === di ? (
                    <span className="absolute inset-x-[1px] inset-y-[-1px] rounded-[3px] ring-2 ring-[#f59e0b]" />
                  ) : null}
                </td>
              ))}
              <td
                className={`text-right font-hand text-[13px] leading-none ${r.flag ? "text-[#b91c1c]" : "text-[#1e3a8a]"}`}
              >
                {r.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2.5 text-right text-[8.5px] text-[#6d665a]">
        Signed{" "}
        <span className="font-hand text-[14px] text-[#1e3a8a]">{signed}</span>
      </p>
    </div>
  );
}

export function AvolonInvoicePage({
  number,
  client,
  po,
  site,
  we,
  lines,
  net,
  vat,
  total,
  due,
  draft,
  width = 330,
}: {
  number: string;
  client: string;
  po: string;
  site: string;
  we: string;
  lines: [string, string, string, string][];
  net: string;
  vat: string;
  total: string;
  due: string;
  draft?: boolean;
  width?: number;
}) {
  return (
    <div
      className="pv-paper relative overflow-hidden rounded-[3px] px-5 pb-4 pt-5 text-[#223754]"
      style={{ width }}
    >
      <div className="flex items-start justify-between">
        <img
          src={asset("/brand/avolon/avolon-logo.png")}
          alt=""
          className="h-[22px] w-auto"
        />
        <div className="text-right">
          <p className="font-[family-name:var(--pv-display)] text-[13px] font-semibold">
            Invoice
            {draft ? (
              <span className="ml-1.5 rounded bg-[#f6f8f9] px-1.5 py-px align-middle text-[7.5px] font-semibold text-[#5f7186]">
                Draft
              </span>
            ) : null}
          </p>
          <p className="text-[8.5px] text-[#5f7186]">{number}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-[8.5px] leading-[1.5]">
        <div>
          <p className="text-[#5f7186]">Bill to</p>
          <p className="font-semibold">{client}</p>
          <p className="text-[#5f7186]">{site}</p>
        </div>
        <div className="text-right">
          <p>
            <span className="text-[#5f7186]">PO</span> {po}
          </p>
          <p>
            <span className="text-[#5f7186]">Week ending</span> {we}
          </p>
          <p>
            <span className="text-[#5f7186]">Due</span> {due}
          </p>
        </div>
      </div>
      <table className="mt-3 w-full border-collapse text-[8.5px]">
        <thead>
          <tr className="border-b border-[#223754] text-left">
            <th className="py-1 font-semibold">Worker</th>
            <th className="py-1 text-right font-semibold">Units</th>
            <th className="py-1 text-right font-semibold">Rate</th>
            <th className="py-1 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l[0]} className="border-b border-[#e3e8ea]">
              <td className="py-1">{l[0]}</td>
              <td className="py-1 text-right tabular-nums">{l[1]}</td>
              <td className="py-1 text-right tabular-nums">{l[2]}</td>
              <td className="py-1 text-right tabular-nums">{l[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="ml-auto mt-2 w-[150px] text-[8.5px] leading-[1.7]">
        <p className="flex justify-between">
          <span className="text-[#5f7186]">Net</span>
          <span className="tabular-nums">{net}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-[#5f7186]">VAT 20%</span>
          <span className="tabular-nums">{vat}</span>
        </p>
        <p className="mt-0.5 flex justify-between border-t border-[#223754] pt-0.5 text-[10px] font-semibold">
          <span>Total due</span>
          <span className="tabular-nums">{total}</span>
        </p>
      </div>
      <div className="mt-3 h-[3px] w-full rounded bg-[#10C4CE]" />
    </div>
  );
}

export function CvPage({
  name,
  role,
  lines,
  brandBar,
  width = 260,
  children,
  text = 8.5,
}: {
  name: string;
  role: string;
  lines: ReactNode[];
  brandBar?: ReactNode;
  width?: number;
  children?: ReactNode;
  text?: number;
}) {
  return (
    <div
      className="pv-paper rounded-[3px] px-5 pb-5 pt-4 text-[#1f2937]"
      style={{ width }}
    >
      {brandBar}
      <p className="text-[15px] font-semibold tracking-[-0.01em]">{name}</p>
      <p className="text-[9.5px] text-[#6b7280]">{role}</p>
      <div
        className="mt-2.5 space-y-1.5 leading-[1.55]"
        style={{ fontSize: text }}
      >
        {lines}
      </div>
      {children}
    </div>
  );
}

export function Hl({
  children,
  tone = "good",
}: {
  children: ReactNode;
  tone?: "good" | "warn" | "bad";
}) {
  const bg =
    tone === "good"
      ? "bg-[#d1fae5]"
      : tone === "warn"
        ? "bg-[#fef3c7]"
        : "bg-[#fee2e2]";
  return (
    <mark className={`rounded-[2px] px-0.5 text-inherit ${bg}`}>
      {children}
    </mark>
  );
}
