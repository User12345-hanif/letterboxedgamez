/**
 * Boundary tests for the Pakistan-midnight daily reset.
 *
 * The daily puzzle must change at 00:00 Asia/Karachi, which is
 * 19:00:00 UTC on the previous calendar day (Pakistan is UTC+05:00
 * year-round, with no daylight saving). These tests pin that
 * boundary to the millisecond: one millisecond before it the
 * previous day's puzzle must still be served, at the boundary
 * instant the next day's puzzle must be served.
 *
 * Run: node --experimental-strip-types --test scripts/daily.test.mjs
 * (also covered by `npm test`).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PUZZLES } from "../src/lib/puzzles.ts";
import {
  DAILY_TIMEZONE,
  dayNumber,
  formatCountdown,
  formatElapsed,
  formatPuzzleDate,
  karachiDateParts,
  nextDailyReset,
  puzzleDateKey,
  puzzleForDate,
  todayPuzzle,
} from "../src/lib/daily.ts";

const at = (iso) => new Date(iso);

describe("daily reset — Asia/Karachi midnight", () => {
  it("uses the Asia/Karachi timezone", () => {
    assert.equal(DAILY_TIMEZONE, "Asia/Karachi");
  });

  it("does not change at 18:59:59 UTC, changes at exactly 19:00:00 UTC", () => {
    const before = at("2026-10-28T18:59:59.999Z");
    const atBoundary = at("2026-10-28T19:00:00.000Z");
    assert.equal(puzzleDateKey(before), "2026-10-28");
    assert.equal(puzzleDateKey(atBoundary), "2026-10-29");
    assert.equal(dayNumber(atBoundary) - dayNumber(before), 1);
    assert.notEqual(puzzleForDate(before).id, puzzleForDate(atBoundary).id);
    assert.deepEqual(karachiDateParts(before), { year: 2026, month: 10, day: 28 });
    assert.deepEqual(karachiDateParts(atBoundary), { year: 2026, month: 10, day: 29 });
  });

  it("holds the same boundary on the next day", () => {
    const before = at("2026-10-29T18:59:59Z");
    const atBoundary = at("2026-10-29T19:00:00Z");
    assert.equal(puzzleDateKey(before), "2026-10-29");
    assert.equal(puzzleDateKey(atBoundary), "2026-10-30");
    assert.equal(dayNumber(atBoundary) - dayNumber(before), 1);
  });

  it("advances exactly one step in the rotation across the boundary", () => {
    const before = puzzleForDate(at("2026-10-28T18:59:59Z"));
    const after = puzzleForDate(at("2026-10-28T19:00:00Z"));
    const beforeIndex = PUZZLES.indexOf(before);
    const afterIndex = PUZZLES.indexOf(after);
    assert.equal(afterIndex, (beforeIndex + 1) % PUZZLES.length);
  });

  it("keeps the same puzzle for two instants on the same Karachi day", () => {
    const morning = at("2026-10-28T00:00:00Z"); // 05:00 PKT, 28 Oct
    const evening = at("2026-10-28T18:00:00Z"); // 23:00 PKT, 28 Oct
    assert.equal(puzzleForDate(morning).id, puzzleForDate(evening).id);
    assert.equal(puzzleDateKey(morning), puzzleDateKey(evening));

    const afterMidnight = at("2026-10-28T19:00:01Z"); // 00:00:01 PKT, 29 Oct
    const nextMorning = at("2026-10-29T10:00:00Z"); // 15:00 PKT, 29 Oct
    assert.equal(puzzleForDate(afterMidnight).id, puzzleForDate(nextMorning).id);
    assert.notEqual(puzzleForDate(morning).id, puzzleForDate(afterMidnight).id);
  });

  it("formats the Karachi date, not the UTC date", () => {
    // 19:00 UTC on 28 Oct is already 29 Oct in Karachi.
    assert.match(formatPuzzleDate(at("2026-10-28T19:00:00Z")), /October 29, 2026/);
    assert.match(formatPuzzleDate(at("2026-10-28T18:59:59Z")), /October 28, 2026/);
  });

  it("keeps the same +05:00 offset in winter (no daylight saving)", () => {
    assert.equal(puzzleDateKey(at("2027-01-15T18:59:59Z")), "2027-01-15");
    assert.equal(puzzleDateKey(at("2027-01-15T19:00:00Z")), "2027-01-16");
    assert.equal(dayNumber(at("2027-01-15T19:00:00Z")) - dayNumber(at("2027-01-15T18:59:59Z")), 1);
  });

  it("todayPuzzle agrees with puzzleForDate for the same instant", () => {
    const now = at("2026-10-28T20:30:00Z");
    assert.equal(todayPuzzle(now).id, puzzleForDate(now).id);
  });

  it("nextDailyReset is the coming 19:00 UTC (00:00 Karachi)", () => {
    assert.equal(
      nextDailyReset(at("2026-10-28T10:00:00Z")).toISOString(),
      "2026-10-28T19:00:00.000Z",
    );
    assert.equal(
      nextDailyReset(at("2026-10-28T18:59:59Z")).toISOString(),
      "2026-10-28T19:00:00.000Z",
    );
    // At or after the reset, it is the next day's reset.
    assert.equal(
      nextDailyReset(at("2026-10-28T19:00:00Z")).toISOString(),
      "2026-10-29T19:00:00.000Z",
    );
    assert.equal(
      nextDailyReset(at("2026-10-28T23:30:00Z")).toISOString(),
      "2026-10-29T19:00:00.000Z",
    );
  });

  it("formats countdown and elapsed durations", () => {
    assert.equal(formatCountdown(7 * 3_600_000 + 5 * 60_000 + 9_000), "7h 05m 09s");
    assert.equal(formatCountdown(0), "0h 00m 00s");
    assert.equal(formatElapsed(84_000), "1:24");
    assert.equal(formatElapsed(0), "0:00");
  });

  it("wraps the 7-puzzle rotation without going out of range", () => {
    for (let d = 0; d < 14; d += 1) {
      const date = new Date(Date.UTC(2026, 9, 28 + d, 19, 0, 0));
      const puzzle = puzzleForDate(date);
      assert.ok(PUZZLES.includes(puzzle), `puzzle for ${date.toISOString()} is in the rotation`);
    }
    assert.equal(
      puzzleForDate(at("2026-10-28T19:00:00Z")).id,
      puzzleForDate(at("2026-11-04T19:00:00Z")).id,
      "after 7 Karachi days the rotation returns to the same puzzle",
    );
  });
});
