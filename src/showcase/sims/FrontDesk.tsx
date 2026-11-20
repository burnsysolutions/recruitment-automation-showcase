import { useState } from "react";
import {
  Check,
  Mail,
  MessageCircle,
  PhoneMissed,
  ReceiptText,
  Users,
  X,
  Pencil,
} from "lucide-react";

type Item = {
  id: string;
  channel: "Email" | "WhatsApp" | "Accounts" | "Missed call" | "Staff";
  who: string;
  title: string;
  draft: string;
};

const ICON = {
  Email: Mail,
  WhatsApp: MessageCircle,
  Accounts: ReceiptText,
  "Missed call": PhoneMissed,
  Staff: Users,
};

const START: Item[] = [
  {
    id: "1",
    channel: "WhatsApp",
    who: "Mrs Patel",
    title: "Boiler making a banging noise, can someone look Thursday?",
    draft:
      "Hi Mrs Patel, sorry to hear that. We can come Thursday between 8 and 10am. Shall I book you in?",
  },
  {
    id: "2",
    channel: "Email",
    who: "Lettings Direct",
    title: "Quote for 3 landlord gas safety certificates",
    draft:
      "Hi, happy to help. Three certificates at one address are £65 each, or we can do them across addresses the same week. Which dates suit?",
  },
  {
    id: "3",
    channel: "Accounts",
    who: "J. Morris",
    title: "Invoice 1042 is 14 days overdue (£480.00)",
    draft:
      "Hi John, a quick reminder that invoice 1042 for £480.00 was due on the 3rd. You can pay by the link below. Thanks.",
  },
  {
    id: "4",
    channel: "Missed call",
    who: "07700 900744",
    title: "Missed call at 12:41, no voicemail",
    draft:
      "Sorry we missed your call. We're on a job and will ring you back within the hour, or reply here with what you need.",
  },
  {
    id: "5",
    channel: "Staff",
    who: "Tom (engineer)",
    title: "Holiday request: Monday 9 to Friday 13 December",
    draft: "Approve and add to the diary. Nobody else is off that week.",
  },
];

/** The approve-first queue. A made-up plumbing firm's morning. */
export function FrontDeskDemo() {
  const [items, setItems] = useState(START);
  const [done, setDone] = useState<
    { item: Item; result: "Sent" | "Declined" }[]
  >([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [auto, setAuto] = useState(false);

  const resolve = (it: Item, result: "Sent" | "Declined") => {
    setItems((xs) => xs.filter((x) => x.id !== it.id));
    setDone((d) => [{ item: it, result }, ...d]);
    setEditing(null);
  };

  const switchAuto = () => {
    if (!auto) {
      // In automatic mode, missed calls get their text straight away. Everything else still waits.
      const calls = items.filter((i) => i.channel === "Missed call");
      calls.forEach((c) => resolve(c, "Sent"));
    }
    setAuto((a) => !a);
  };

  return (
    <div className="rounded-xl border border-gborder bg-white">
      <div className="flex flex-wrap items-center gap-3 border-b border-gborder px-5 py-3">
        <p className="text-[15px] font-semibold">
          Front Desk · Hartley Plumbing (made up)
        </p>
        <span className="rounded-full bg-action-tint px-2 py-0.5 text-[12px] font-medium text-action">
          {items.length} to review
        </span>
        <label className="ml-auto flex cursor-pointer items-center gap-2 text-[13px] text-gmuted">
          Missed calls: {auto ? "text back automatically" : "approve first"}
          <button
            onClick={switchAuto}
            className={`relative h-5 w-9 rounded-full transition-colors ${auto ? "bg-gsuccess" : "bg-gborder"}`}
            aria-label="Switch missed calls to automatic"
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${auto ? "left-[18px]" : "left-0.5"}`}
            />
          </button>
        </label>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_300px]">
        <ul className="divide-y divide-gborder">
          {items.length === 0 ? (
            <li className="px-5 py-10 text-center text-[13.5px] text-gmuted">
              All clear. Nothing waiting for you.
            </li>
          ) : null}
          {items.map((it) => {
            const Icon = ICON[it.channel];
            return (
              <li key={it.id} className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gsecondary text-gfg">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] text-gmuted">
                      {it.channel} · {it.who}
                    </p>
                    <p className="text-[14px] font-medium">{it.title}</p>
                    {editing === it.id ? (
                      <textarea
                        defaultValue={it.draft}
                        onChange={(e) =>
                          setItems((xs) =>
                            xs.map((x) =>
                              x.id === it.id
                                ? { ...x, draft: e.target.value }
                                : x,
                            ),
                          )
                        }
                        className="mt-2 w-full rounded-lg border border-action p-2.5 text-[13px] leading-[1.5] focus:outline-none"
                        rows={3}
                      />
                    ) : (
                      <p className="mt-2 rounded-lg bg-gbg px-3 py-2 text-[13px] leading-[1.5] text-gfg">
                        {it.draft}
                      </p>
                    )}
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <button
                        onClick={() => resolve(it, "Sent")}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-action px-3 py-1.5 text-[12.5px] font-medium text-white hover:bg-action-hover"
                      >
                        <Check className="h-3.5 w-3.5" />{" "}
                        {it.channel === "Staff"
                          ? "Approve"
                          : "Approve and send"}
                      </button>
                      <button
                        onClick={() =>
                          setEditing(editing === it.id ? null : it.id)
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gborder px-3 py-1.5 text-[12.5px] font-medium hover:border-action"
                      >
                        <Pencil className="h-3.5 w-3.5" />{" "}
                        {editing === it.id ? "Done" : "Edit"}
                      </button>
                      <button
                        onClick={() => resolve(it, "Declined")}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gborder px-3 py-1.5 text-[12.5px] font-medium text-gdanger hover:border-gdanger"
                      >
                        <X className="h-3.5 w-3.5" />{" "}
                        {it.channel === "Staff" ? "Decline" : "Don't send"}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <aside className="border-t border-gborder bg-gbg p-5 lg:border-l lg:border-t-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-gmuted">
            Done
          </p>
          {done.length === 0 ? (
            <p className="mt-3 text-[13px] text-gmuted">
              Approve something to see it here.
            </p>
          ) : null}
          <ul className="mt-3 space-y-2">
            {done.map(({ item, result }) => (
              <li
                key={item.id}
                className="rounded-lg border border-gborder bg-white px-3 py-2 text-[12.5px]"
              >
                <span
                  className={
                    result === "Sent"
                      ? "font-medium text-gsuccess"
                      : "font-medium text-gmuted"
                  }
                >
                  {item.channel === "Staff"
                    ? result === "Sent"
                      ? "Approved, diary updated"
                      : "Declined"
                    : result === "Sent"
                      ? "Sent"
                      : "Not sent"}
                </span>
                <span className="text-gmuted"> · {item.who}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              setItems(START);
              setDone([]);
              setAuto(false);
            }}
            className="mt-4 text-[12.5px] font-medium text-action hover:underline"
          >
            Reset the demo
          </button>
        </aside>
      </div>
    </div>
  );
}
