import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Check,
  Loader2,
  Mail,
  MessageCircle,
  MessageSquareText,
  Linkedin,
  Play,
  RotateCcw,
  FileText,
} from "lucide-react";
import type { Flow, View } from "./types";

const tone = {
  good: "bg-[#e8f4ee] text-gsuccess",
  warn: "bg-[#fbf3e2] text-gwarning",
  bad: "bg-[#fbeceb] text-gdanger",
  info: "bg-action-tint text-action",
};

export function Pill({
  children,
  t = "info",
}: {
  children: ReactNode;
  t?: keyof typeof tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11.5px] font-medium ${tone[t]}`}
    >
      {children}
    </span>
  );
}

export function Panel({
  label,
  children,
  className = "",
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-gborder bg-white ${className}`}>
      {label ? (
        <p className="border-b border-gborder px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-gmuted">
          {label}
        </p>
      ) : null}
      <div className="p-4">{children}</div>
    </div>
  );
}

const channelIcon = {
  email: Mail,
  sms: MessageSquareText,
  whatsapp: MessageCircle,
  linkedin: Linkedin,
};

/** Draws any one View. */
export function ViewBox({ v }: { v: View }) {
  switch (v.kind) {
    case "views":
      return (
        <div className="space-y-4">
          {v.views.map((x, i) => (
            <ViewBox key={i} v={x} />
          ))}
        </div>
      );
    case "table":
      return (
        <div>
          {v.title ? (
            <p className="mb-2 text-[13px] font-semibold text-gfg">{v.title}</p>
          ) : null}
          <div className="overflow-x-auto rounded-lg border border-gborder">
            <table className="w-full min-w-[360px] text-left text-[12.5px]">
              <thead className="bg-gsecondary text-gmuted">
                <tr>
                  {v.columns.map((c) => (
                    <th
                      key={c}
                      className="whitespace-nowrap px-3 py-2 font-medium"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {v.rows.map((r, i) => (
                  <tr
                    key={i}
                    className={`border-t border-gborder ${v.flag?.includes(i) ? "bg-[#fdf6ec]" : v.good?.includes(i) ? "bg-[#f1f8f4]" : ""}`}
                  >
                    {r.map((cell, j) => (
                      <td
                        key={j}
                        className={`px-3 py-2 ${typeof cell === "number" ? "tabular-nums" : ""} ${j === 0 ? "font-medium text-gfg" : "text-gfg/85"}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case "message": {
      const Icon = channelIcon[v.channel];
      const bubble = v.channel === "sms" || v.channel === "whatsapp";
      return (
        <div className="rounded-lg border border-gborder bg-gbg">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 border-b border-gborder px-3 py-2 text-[12px] text-gmuted">
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="break-all font-medium text-gfg">{v.from}</span>
            <span className="break-all">to {v.to}</span>
          </div>
          <div className="p-3">
            {v.subject ? (
              <p className="mb-2 text-[13.5px] font-semibold text-gfg">
                {v.subject}
              </p>
            ) : null}
            <p
              className={`whitespace-pre-line text-[13px] leading-[1.55] text-gfg ${
                bubble
                  ? `inline-block max-w-[92%] rounded-2xl px-3.5 py-2 ${v.channel === "whatsapp" ? "bg-[#dcf8c6]" : "bg-white shadow-sm"}`
                  : ""
              }`}
            >
              {v.body}
            </p>
          </div>
        </div>
      );
    }
    case "kv":
      return (
        <div>
          {v.title ? (
            <p className="mb-2 text-[13px] font-semibold text-gfg">{v.title}</p>
          ) : null}
          <dl className="divide-y divide-gborder rounded-lg border border-gborder">
            {v.rows.map(([k, val]) => (
              <div
                key={k}
                className="grid grid-cols-[minmax(110px,38%)_1fr] gap-3 px-3 py-2 text-[12.5px]"
              >
                <dt className="text-gmuted">{k}</dt>
                <dd className="text-gfg">{val}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case "list":
      return (
        <div>
          {v.title ? (
            <p className="mb-2 text-[13px] font-semibold text-gfg">{v.title}</p>
          ) : null}
          <ul className="divide-y divide-gborder rounded-lg border border-gborder">
            {v.items.map((it, i) => (
              <li key={i} className="flex items-start gap-3 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-gfg">{it.title}</p>
                  {it.sub ? (
                    <p className="mt-0.5 text-[12px] leading-[1.5] text-gmuted">
                      {it.sub}
                    </p>
                  ) : null}
                </div>
                {it.tag ? <Pill t={it.tone ?? "info"}>{it.tag}</Pill> : null}
              </li>
            ))}
          </ul>
        </div>
      );
    case "doc":
      return (
        <div className="rounded-lg border border-gborder bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 border-b border-gborder px-3 py-2">
            <FileText className="h-4 w-4 text-gmuted" />
            <p className="text-[13px] font-semibold text-gfg">{v.title}</p>
            {v.meta ? (
              <span className="ml-auto text-[11.5px] text-gmuted">
                {v.meta}
              </span>
            ) : null}
          </div>
          <div className="space-y-1.5 p-4 text-[12.5px] leading-[1.55] text-gfg">
            {v.lines.map((l, i) =>
              l.startsWith("# ") ? (
                <p key={i} className="pt-1 text-[13px] font-semibold">
                  {l.slice(2)}
                </p>
              ) : l.startsWith("- ") ? (
                <p
                  key={i}
                  className="pl-3 before:-ml-3 before:mr-1.5 before:content-['•']"
                >
                  {l.slice(2)}
                </p>
              ) : (
                <p key={i}>{l}</p>
              ),
            )}
          </div>
        </div>
      );
    case "timesheet":
      return (
        <div className="rotate-[-0.4deg] rounded-sm border border-[#d9d2c3] bg-[#fdfbf5] p-4 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]">
          <div className="flex items-start justify-between gap-4 border-b border-[#d9d2c3] pb-2">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-wide text-[#3a3428]">
                Weekly timesheet
              </p>
              <p className="text-[11px] text-[#6b6455]">{v.client}</p>
            </div>
            <div className="text-right text-[11px] text-[#6b6455]">
              <p>
                Site:{" "}
                <span className="font-hand text-[16px] text-[#1f3a8a]">
                  {v.site}
                </span>
              </p>
              <p>
                W/E:{" "}
                <span className="font-hand text-[16px] text-[#1f3a8a]">
                  {v.weekEnding}
                </span>
              </p>
              <p>
                PO:{" "}
                <span className="font-hand text-[16px] text-[#1f3a8a]">
                  {v.po}
                </span>
              </p>
            </div>
          </div>
          <table className="mt-2 w-full text-[11px] text-[#3a3428]">
            <thead>
              <tr className="text-[#6b6455]">
                <th className="py-1 text-left font-medium">Name</th>
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <th key={i} className="w-7 font-medium">
                    {d}
                  </th>
                ))}
                <th className="text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {v.rows.map((r) => (
                <tr
                  key={r.name}
                  className="border-t border-dashed border-[#d9d2c3]"
                >
                  <td className="py-1 font-hand text-[16px] text-[#1f3a8a]">
                    {r.name}
                  </td>
                  {r.days.map((d, i) => (
                    <td
                      key={i}
                      className="text-center font-hand text-[16px] text-[#1f3a8a]"
                    >
                      {d}
                    </td>
                  ))}
                  <td className="text-right font-hand text-[16px] text-[#1f3a8a]">
                    {r.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-right text-[11px] text-[#6b6455]">
            Signed:{" "}
            <span className="font-hand text-[18px] text-[#1f3a8a]">
              {v.signedBy}
            </span>
          </p>
        </div>
      );
    case "bars": {
      const max = Math.max(...v.bars.map((b) => b.value), 1);
      return (
        <div>
          {v.title ? (
            <p className="mb-3 text-[13px] font-semibold text-gfg">{v.title}</p>
          ) : null}
          <div className="space-y-2">
            {v.bars.map((b) => (
              <div
                key={b.label}
                className="grid grid-cols-[110px_1fr_auto] items-center gap-3 text-[12.5px]"
              >
                <span className="truncate text-gmuted">{b.label}</span>
                <div className="h-2.5 rounded-full bg-gsecondary">
                  <div
                    className={`h-2.5 rounded-full ${b.tone === "bad" ? "bg-gdanger" : b.tone === "warn" ? "bg-[#c48a1b]" : b.tone === "good" ? "bg-gsuccess" : "bg-action"}`}
                    style={{ width: `${(b.value / max) * 100}%` }}
                  />
                </div>
                <span className="tabular-nums text-gfg">
                  {v.unit === "£"
                    ? `£${b.value.toLocaleString("en-GB")}`
                    : `${b.value.toLocaleString("en-GB")}${v.unit ?? ""}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "card":
      return (
        <div className="mx-auto w-full max-w-[340px] rounded-xl bg-gradient-to-br from-[#1d4f91] to-[#123465] p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-bold tracking-wide">{v.scheme}</p>
            <span className="rounded bg-white/15 px-2 py-0.5 text-[10.5px]">
              {v.level}
            </span>
          </div>
          <div className="mt-6 flex items-end gap-3">
            <div
              className="h-14 w-11 rounded-md bg-white/20"
              aria-hidden="true"
            />
            <div className="text-[12px] leading-[1.6]">
              <p className="text-[14px] font-semibold">{v.name}</p>
              <p className="text-white/75">Card no. {v.number}</p>
              <p className="text-white/75">Expires {v.expires}</p>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-white/50">
            Made-up card for the demo
          </p>
        </div>
      );
    case "transcript":
      return (
        <div className="space-y-2">
          {v.lines.map((l, i) => (
            <div
              key={i}
              className={`flex ${l.who === "AI" ? "justify-start" : "justify-end"}`}
            >
              <p
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] leading-[1.5] ${l.who === "AI" ? "bg-action-tint text-gfg" : "bg-action text-white"}`}
              >
                <span className="mb-0.5 block text-[10.5px] font-semibold uppercase tracking-wide opacity-60">
                  {l.who === "AI" ? "AI caller" : "Candidate"}
                </span>
                {l.text}
              </p>
            </div>
          ))}
        </div>
      );
  }
}

/** Runs a flow: shows what comes in, ticks through the steps, then shows what comes out. */
export function FlowRunner({ flow }: { flow: Flow }) {
  const [done, setDone] = useState(-1); // index of the last step finished; -1 = not started
  const [running, setRunning] = useState(false);
  const out = useRef<HTMLDivElement>(null);
  const finished = done >= flow.steps.length - 1;

  useEffect(() => {
    if (!running) return;
    if (finished) {
      setRunning(false);
      setTimeout(
        () =>
          out.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
        80,
      );
      return;
    }
    const t = setTimeout(() => setDone((d) => d + 1), 650);
    return () => clearTimeout(t);
  }, [running, done, finished]);

  const start = () => {
    setDone(-1);
    setRunning(true);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_260px_minmax(0,1.35fr)]">
      <Panel label={flow.inputLabel}>
        <ViewBox v={flow.input} />
      </Panel>

      <div className="rounded-xl border border-gborder bg-white p-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-gmuted">
          What the automation does
        </p>
        <ol className="mt-3 space-y-3">
          {flow.steps.map((s, i) => {
            const state =
              i <= done ? "done" : running && i === done + 1 ? "now" : "todo";
            return (
              <li key={i} className="flex gap-2.5">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10.5px] font-semibold ${
                    state === "done"
                      ? "bg-gsuccess text-white"
                      : state === "now"
                        ? "bg-action text-white"
                        : "bg-gsecondary text-gmuted"
                  }`}
                >
                  {state === "done" ? (
                    <Check className="h-3 w-3" />
                  ) : state === "now" ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    i + 1
                  )}
                </span>
                <div>
                  <p
                    className={`text-[13px] leading-[1.45] ${state === "todo" ? "text-gmuted" : "text-gfg"}`}
                  >
                    {s.label}
                  </p>
                  {s.detail && state === "done" ? (
                    <p className="mt-0.5 text-[12px] text-gsuccess">
                      {s.detail}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
        <button
          onClick={start}
          disabled={running}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-action px-4 py-2.5 text-[13.5px] font-medium text-white transition-colors hover:bg-action-hover disabled:opacity-60"
        >
          {finished ? (
            <RotateCcw className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {running ? "Running" : finished ? "Run it again" : "Run it"}
        </button>
      </div>

      <div ref={out}>
        <Panel
          label={flow.outputLabel}
          className={finished ? "" : "opacity-50"}
        >
          {finished ? (
            <ViewBox v={flow.output} />
          ) : (
            <div className="flex min-h-[180px] items-center justify-center text-center text-[13px] text-gmuted">
              Press Run it to see the result.
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
