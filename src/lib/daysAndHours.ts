/**
 * Days and hours: how a man with both a day rate and an hourly rate is paid for a week.
 *
 * The rule (taken from the agency's own invoices, line for line):
 * - A "full day" is the hours his day rate is worth at his hourly rate, to the nearest half hour.
 *   £265 a day at £29.50 an hour is 9 hours; £208 at £26 is 8.
 * - A day with a full day's hours or more is ONE day at the day rate, plus any hours over it at the hourly rate.
 * - A shorter day is paid by the hour.
 * - Every hour worked is paid exactly once.
 *
 * Worked example: 5, 9, 9, 9, 9 hours at £265 / £29.50 is 4 days and 5 hours, £1,207.50.
 */

export interface DaysAndHoursInput {
  /** Hours worked on each day of the week, as written on the sheet. */
  hours: number[];
  /** Pay for a full day, in pounds. */
  dayRate: number;
  /** Pay for one hour, in pounds. */
  hourlyRate: number;
}

export interface DayLine {
  hours: number;
  days: 0 | 1;
  /** Hours paid at the hourly rate on this day. */
  byTheHour: number;
}

export interface DaysAndHoursResult {
  fullDayHours: number;
  days: number;
  byTheHour: number;
  /** Pence, so the sum is exact. */
  totalPence: number;
  lines: DayLine[];
}

/** Hours a day rate is worth at an hourly rate, to the nearest half hour. */
export function fullDayHours(dayRate: number, hourlyRate: number): number {
  if (!(dayRate > 0) || !(hourlyRate > 0))
    throw new Error("Both rates must be above zero");
  return Math.round((dayRate / hourlyRate) * 2) / 2;
}

const toPence = (pounds: number) => Math.round(pounds * 100);
/** Hours to two decimal places, so 0.1 + 0.2 never shows as 0.30000000000000004. */
const tidy = (h: number) => Math.round(h * 100) / 100;

export function daysAndHours({
  hours,
  dayRate,
  hourlyRate,
}: DaysAndHoursInput): DaysAndHoursResult {
  for (const h of hours) {
    if (!Number.isFinite(h) || h < 0)
      throw new Error(`Hours must be zero or more, got ${h}`);
    if (h > 24) throw new Error(`No day has more than 24 hours, got ${h}`);
  }
  const full = fullDayHours(dayRate, hourlyRate);

  const lines: DayLine[] = hours.map((h) =>
    h >= full
      ? { hours: h, days: 1, byTheHour: tidy(h - full) }
      : { hours: h, days: 0, byTheHour: tidy(h) },
  );

  const days = lines.reduce((n, l) => n + l.days, 0);
  const byTheHour = tidy(lines.reduce((n, l) => n + l.byTheHour, 0));
  const totalPence =
    days * toPence(dayRate) + Math.round(byTheHour * toPence(hourlyRate));

  return { fullDayHours: full, days, byTheHour, totalPence, lines };
}

/** Pence as pounds, e.g. 120750 is £1,207.50. */
export const pounds = (pence: number) =>
  `£${(pence / 100).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
