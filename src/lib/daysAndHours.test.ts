import { describe, expect, it } from "vitest";
import { daysAndHours, fullDayHours, pounds } from "./daysAndHours";

describe("fullDayHours", () => {
  it("is the day rate's worth in hours, to the half hour", () => {
    expect(fullDayHours(265, 29.5)).toBe(9);
    expect(fullDayHours(252, 28)).toBe(9);
    expect(fullDayHours(208, 26)).toBe(8);
    expect(fullDayHours(195, 23)).toBe(8.5);
  });

  it("refuses a rate of zero", () => {
    expect(() => fullDayHours(0, 25)).toThrow();
    expect(() => fullDayHours(200, 0)).toThrow();
  });
});

describe("daysAndHours", () => {
  it("pays a short day by the hour and full days by the day", () => {
    const r = daysAndHours({
      hours: [5, 9, 9, 9, 9],
      dayRate: 265,
      hourlyRate: 29.5,
    });
    expect(r.days).toBe(4);
    expect(r.byTheHour).toBe(5);
    expect(pounds(r.totalPence)).toBe("£1,207.50");
  });

  it("pays the hours over a full day by the hour", () => {
    const r = daysAndHours({
      hours: [10, 9.5, 9.5, 9],
      dayRate: 265,
      hourlyRate: 29.5,
    });
    expect(r.days).toBe(4);
    expect(r.byTheHour).toBe(2);
    expect(pounds(r.totalPence)).toBe("£1,119.00");
  });

  it("pays every hour exactly once", () => {
    const hours = [7.5, 8, 10.25, 0, 12];
    const r = daysAndHours({ hours, dayRate: 208, hourlyRate: 26 });
    const paidHours = r.days * r.fullDayHours + r.byTheHour;
    expect(paidHours).toBeCloseTo(
      hours.reduce((a, b) => a + b, 0),
      10,
    );
  });

  it("is the same money as every hour by the hour when the rates agree", () => {
    const r = daysAndHours({ hours: [9, 9, 9], dayRate: 208, hourlyRate: 26 });
    expect(r.totalPence).toBe(27 * 2600);
  });

  it("pays nothing for an empty week", () => {
    expect(
      daysAndHours({ hours: [], dayRate: 200, hourlyRate: 25 }).totalPence,
    ).toBe(0);
  });

  it("refuses impossible hours instead of guessing", () => {
    expect(() =>
      daysAndHours({ hours: [25], dayRate: 200, hourlyRate: 25 }),
    ).toThrow();
    expect(() =>
      daysAndHours({ hours: [-1], dayRate: 200, hourlyRate: 25 }),
    ).toThrow();
    expect(() =>
      daysAndHours({ hours: [Number.NaN], dayRate: 200, hourlyRate: 25 }),
    ).toThrow();
  });
});
