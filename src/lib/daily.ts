import { PUZZLES, type Puzzle } from "./puzzles";

/**
 * Daily puzzle selection — deterministic, one puzzle per Pakistan day.
 *
 * The puzzle for an instant depends only on the calendar date of that
 * instant in Asia/Karachi (DAILY_TIMEZONE), so every player sees the
 * same daily puzzle and the puzzle changes at 00:00 Pakistan time
 * (19:00 UTC the previous day). Tomorrow's puzzle is known in advance.
 * No randomness at render time.
 *
 * Pakistan observes no daylight saving, so the fallback fixed offset
 * (UTC+05:00) always agrees with the Intl timezone calculation; the
 * Intl path is primary so the named timezone, not an assumed offset,
 * is what the code means.
 */
export const DAILY_TIMEZONE = "Asia/Karachi";

/** Fixed UTC+05:00 offset, used only if Intl timezone support is unavailable. */
const KARACHI_OFFSET_MS = 5 * 3_600_000;

export interface CivilDate {
  year: number;
  month: number;
  day: number;
}

/** The calendar date of `date` in Asia/Karachi. */
export function karachiDateParts(date: Date): CivilDate {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: DAILY_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const get = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((p) => p.type === type)?.value);
    const year = get("year");
    const month = get("month");
    const day = get("day");
    if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) {
      return { year, month, day };
    }
  } catch {
    // Fall through to the fixed-offset calculation below.
  }
  const shifted = new Date(date.getTime() + KARACHI_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

/** Day number of the Karachi calendar date containing `date`. */
export function dayNumber(date: Date): number {
  const { year, month, day } = karachiDateParts(date);
  const utc = Date.UTC(year, month - 1, day);
  return Math.floor(utc / 86_400_000);
}

export function puzzleForDate(date: Date): Puzzle {
  const index = ((dayNumber(date) % PUZZLES.length) + PUZZLES.length) % PUZZLES.length;
  return PUZZLES[index];
}

export function todayPuzzle(now = new Date()): Puzzle {
  return puzzleForDate(now);
}

/** "Wednesday, October 28, 2026" — the Karachi calendar date of `date`. */
export function formatPuzzleDate(date: Date, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: DAILY_TIMEZONE,
  }).format(date);
}

/** "2026-10-28" — the Karachi calendar date of `date`, used as a storage key. */
export function puzzleDateKey(date: Date): string {
  const { year, month, day } = karachiDateParts(date);
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

/**
 * The next instant the daily puzzle changes: 00:00 Asia/Karachi,
 * which is 19:00 UTC. If `now` is exactly on a reset instant, the
 * reset returned is the following day's.
 */
export function nextDailyReset(now: Date): Date {
  const reset = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 19, 0, 0, 0),
  );
  if (reset.getTime() <= now.getTime()) {
    reset.setUTCDate(reset.getUTCDate() + 1);
  }
  return reset;
}

/** "7h 05m 09s" for a millisecond duration. */
export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

/** "1:24" for a millisecond duration (timer display). */
export function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
