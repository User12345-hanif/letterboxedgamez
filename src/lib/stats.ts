/**
 * Player statistics, stored only in the player's own browser
 * (localStorage). Nothing is sent anywhere. The shape is versioned
 * so future changes can migrate old data instead of discarding it.
 */
export interface Stats {
  version: 1;
  gamesPlayed: number;
  gamesSolved: number;
  currentStreak: number;
  bestStreak: number;
  fewestWords: number | null;
  totalWordsFound: number;
  hintsUsed: number;
  /** Fastest solve in milliseconds, or null if no puzzle solved yet. */
  fastestSolveMs: number | null;
  /** ISO dates (YYYY-MM-DD) on which a daily puzzle was solved. */
  solvedDailyDates: string[];
}

export const EMPTY_STATS: Stats = {
  version: 1,
  gamesPlayed: 0,
  gamesSolved: 0,
  currentStreak: 0,
  bestStreak: 0,
  fewestWords: null,
  totalWordsFound: 0,
  hintsUsed: 0,
  fastestSolveMs: null,
  solvedDailyDates: [],
};

const STATS_KEY = "letterboxed-gamez:stats:v1";

export function loadStats(): Stats {
  if (typeof window === "undefined") return EMPTY_STATS;
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    if (!raw) return EMPTY_STATS;
    const parsed = JSON.parse(raw) as Partial<Stats>;
    return { ...EMPTY_STATS, ...parsed, version: 1 };
  } catch {
    return EMPTY_STATS;
  }
}

export function saveStats(stats: Stats): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Storage full or unavailable — the game still works.
  }
}

export function recordGameStarted(stats: Stats): Stats {
  return { ...stats, gamesPlayed: stats.gamesPlayed + 1 };
}

export function recordGameSolved(
  stats: Stats,
  opts: { wordCount: number; isDaily: boolean; dateKey: string; hintsUsedInGame: number; solveTimeMs?: number | null },
): Stats {
  const solvedDailyDates = opts.isDaily
    ? Array.from(new Set([...stats.solvedDailyDates, opts.dateKey]))
    : stats.solvedDailyDates;
  const currentStreak = opts.isDaily ? stats.currentStreak + 1 : stats.currentStreak;
  const fastestSolveMs =
    opts.solveTimeMs === undefined || opts.solveTimeMs === null
      ? stats.fastestSolveMs
      : stats.fastestSolveMs === null
        ? opts.solveTimeMs
        : Math.min(stats.fastestSolveMs, opts.solveTimeMs);
  return {
    ...stats,
    gamesSolved: stats.gamesSolved + 1,
    currentStreak,
    bestStreak: Math.max(stats.bestStreak, currentStreak),
    fewestWords:
      stats.fewestWords === null ? opts.wordCount : Math.min(stats.fewestWords, opts.wordCount),
    hintsUsed: stats.hintsUsed + opts.hintsUsedInGame,
    fastestSolveMs,
    solvedDailyDates,
  };
}

export function recordWordsFound(stats: Stats, count: number): Stats {
  return { ...stats, totalWordsFound: stats.totalWordsFound + count };
}

export function solveRate(stats: Stats): number {
  if (stats.gamesPlayed === 0) return 0;
  return Math.round((stats.gamesSolved / stats.gamesPlayed) * 100);
}

/** Which puzzle the player was on, so a reload returns to the same board. */
export interface GameSession {
  mode: "daily" | "practice";
  practiceOffset: number;
}

const SESSION_KEY = "letterboxed-gamez:session:v1";

export function loadSession(): GameSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GameSession>;
    if (parsed.mode !== "daily" && parsed.mode !== "practice") return null;
    if (typeof parsed.practiceOffset !== "number" || parsed.practiceOffset < 1) return null;
    return { mode: parsed.mode, practiceOffset: parsed.practiceOffset };
  } catch {
    return null;
  }
}

export function saveSession(session: GameSession): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage failures.
  }
}

/** Progress for one puzzle, so a refresh resumes the game. */
export interface SavedProgress {
  puzzleId: string;
  submitted: string[];
  hintsUsed: number;
}

export function progressKey(puzzleId: string, mode: "daily" | "practice"): string {
  return `letterboxed-gamez:progress:${mode}:${puzzleId}`;
}

export function loadProgress(key: string): SavedProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as SavedProgress) : null;
  } catch {
    return null;
  }
}

export function saveProgress(key: string, progress: SavedProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    // Ignore storage failures.
  }
}

export function clearProgress(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore.
  }
}
