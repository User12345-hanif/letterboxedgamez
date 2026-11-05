"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DICTIONARY } from "@/lib/dictionary";
import {
  canPickLetter,
  findHintWord,
  isSolved,
  progressPercent,
  remainingLetters,
  usedLetters,
  validateWord,
  verifySolution,
} from "@/lib/game";
import { formatCountdown, formatElapsed, formatPuzzleDate, nextDailyReset, puzzleDateKey, puzzleForDate } from "@/lib/daily";
import { PUZZLES, puzzleLetters, sideOf, type Puzzle } from "@/lib/puzzles";
import {
  clearProgress,
  loadProgress,
  loadSession,
  loadStats,
  progressKey,
  recordGameSolved,
  recordGameStarted,
  recordWordsFound,
  saveProgress,
  saveSession,
  saveStats,
  type Stats,
} from "@/lib/stats";
import { GameBoard, SIDE_META } from "./GameBoard";
import { HowToPlayModal, StatsModal } from "./Modals";
import {
  CONSENT_GRANTED_EVENT,
  trackHintUsed,
  trackPuzzleActivated,
  trackPuzzleCompleted,
  trackWordSubmitted,
} from "@/lib/analytics";

type Feedback = { kind: "error" | "success" | "info"; message: string } | null;
type Mode = "daily" | "practice";

const MAX_HINTS = 3;
const SIDE_GLYPHS = SIDE_META.map((side) => side.glyph);

/** Side glyphs for a word, e.g. CAPTURE → "●◆▲■●◆▲" (for the share text). */
function glyphRow(puzzle: Puzzle, word: string): string {
  const sides = sideOf(puzzle);
  return word
    .split("")
    .map((letter) => SIDE_GLYPHS[sides.get(letter) ?? 0])
    .join("");
}

function flatIndexOf(puzzle: Puzzle, letter: string): number {
  return puzzleLetters(puzzle).indexOf(letter);
}

export function GameScreen({
  onStatsChange,
  initialMode,
  initialPracticeOffset,
  ignoreSession,
}: {
  onStatsChange?: (s: Stats) => void;
  /** Start in practice mode (used by /unlimited). Homepage omits this and keeps daily-first behaviour. */
  initialMode?: Mode;
  initialPracticeOffset?: number;
  /** When true, do not restore or save the homepage session — /unlimited must not hijack the daily session. */
  ignoreSession?: boolean;
}) {
  const [today] = useState(() => new Date());
  const dailyPuzzle = useMemo(() => puzzleForDate(today), [today]);
  const [mode, setMode] = useState<Mode>(initialMode ?? "daily");
  const [practiceOffset, setPracticeOffset] = useState(initialPracticeOffset ?? 1);
  const puzzle: Puzzle = useMemo(
    () =>
      mode === "daily"
        ? dailyPuzzle
        : PUZZLES[(PUZZLES.indexOf(dailyPuzzle) + practiceOffset) % PUZZLES.length],
    [mode, dailyPuzzle, practiceOffset],
  );

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [current, setCurrent] = useState<string[]>([]);
  const [currentIndices, setCurrentIndices] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [solved, setSolved] = useState(false);
  const [stats, setStats] = useState<Stats>(() => EMPTY_FALLBACK);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [hintsUsedInGame, setHintsUsedInGame] = useState(0);
  const [hintTarget, setHintTarget] = useState<string | null>(null);
  const [hintStage, setHintStage] = useState<0 | 1 | 2>(0);
  const [hintIndex, setHintIndex] = useState<number | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [solveTimeMs, setSolveTimeMs] = useState<number | null>(null);
  const [countdown, setCountdown] = useState("");
  const gameSectionRef = useRef<HTMLElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement !== null);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }
    const el = gameSectionRef.current;
    if (!el) return;
    try {
      const result = el.requestFullscreen() as unknown as Promise<void> | void;
      if (result && typeof (result as Promise<void>).catch === "function") {
        (result as Promise<void>).catch(() => {});
      }
    } catch {
      // Fullscreen is unavailable in this browser (e.g. some iOS browsers);
      // the game simply stays at its normal size.
    }
  }, []);
  const solvedRecordedRef = useRef(false);
  const startedRecordedRef = useRef<string | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const activationFiredRef = useRef<string | null>(null);

  const storageKey = useMemo(() => progressKey(puzzle.id, mode), [puzzle.id, mode]);
  const letters = useMemo(() => puzzleLetters(puzzle), [puzzle]);
  const used = useMemo(() => usedLetters(submitted), [submitted]);
  const remaining = useMemo(() => remainingLetters(puzzle, submitted), [puzzle, submitted]);
  const percent = useMemo(() => progressPercent(puzzle, submitted), [puzzle, submitted]);
  const requiredStart = submitted.length > 0 ? submitted[submitted.length - 1].slice(-1) : null;

  // Restore the board the player was on, so a reload returns to the
  // same daily/practice puzzle instead of always resetting to daily.
  const sessionRestoredRef = useRef(false);
  useEffect(() => {
    if (ignoreSession) return;
    if (sessionRestoredRef.current) return;
    sessionRestoredRef.current = true;
    const session = loadSession();
    if (session) {
      setMode(session.mode);
      setPracticeOffset(session.practiceOffset);
    }
  }, []);

  // Remember the current board for the next visit.
  useEffect(() => {
    if (ignoreSession) return;
    saveSession({ mode, practiceOffset });
  }, [mode, practiceOffset, ignoreSession]);

  // Load saved progress + stats, and validate the puzzle on every change.
  useEffect(() => {
    setIsLoading(true);
    setLoadError(null);
    const check = verifySolution(puzzle);
    if (!check.ok || !check.coversAll) {
      setLoadError(
        "This puzzle could not be verified as solvable. Please try another puzzle — the daily puzzle will be back shortly.",
      );
      setIsLoading(false);
      return;
    }
    const saved = loadProgress(storageKey);
    const freshStats = loadStats();
    setStats(freshStats);
    onStatsChange?.(freshStats);
    if (saved && saved.puzzleId === puzzle.id) {
      setSubmitted(saved.submitted);
      setHintsUsedInGame(saved.hintsUsed);
      setSolved(isSolved(puzzle, saved.submitted));
      solvedRecordedRef.current = isSolved(puzzle, saved.submitted);
      if (saved.submitted.length > 0) {
        setFeedback({
          kind: "info",
          message: "Welcome back — your words for this puzzle were restored.",
        });
      }
    } else {
      setSubmitted([]);
      setHintsUsedInGame(0);
      setSolved(false);
      solvedRecordedRef.current = false;
    }
    setCurrent([]);
    setCurrentIndices([]);
    setHintTarget(null);
    setHintStage(0);
    setHintIndex(null);
    startedAtRef.current = null;
    setElapsedMs(0);
    setSolveTimeMs(null);
    setCountdown("");
    setFeedback((f) => (saved ? f : null));
    setIsLoading(false);
  }, [puzzle, storageKey, onStatsChange]);

  // Analytics: one puzzle_started / practice_puzzle_started event per
  // puzzle activation, once the puzzle has finished loading. The
  // isLoading guard skips the first render pass, when a restored
  // session may still replace the puzzle being shown. The ref is
  // only marked when the event was actually sent, so a puzzle that
  // was presented before consent is reported when consent is granted.
  const activationKey = `${mode}:${puzzle.id}`;
  useEffect(() => {
    if (isLoading) return;
    if (activationFiredRef.current === activationKey) return;
    if (trackPuzzleActivated(mode, puzzle.id)) activationFiredRef.current = activationKey;
  }, [isLoading, activationKey, mode, puzzle.id]);

  // If consent is granted while this puzzle is already on screen, the
  // activation above was gated; report the current puzzle now, once.
  useEffect(() => {
    const onGranted = () => {
      if (activationFiredRef.current === activationKey) return;
      if (trackPuzzleActivated(mode, puzzle.id)) activationFiredRef.current = activationKey;
    };
    window.addEventListener(CONSENT_GRANTED_EVENT, onGranted);
    return () => window.removeEventListener(CONSENT_GRANTED_EVENT, onGranted);
  }, [activationKey, mode, puzzle.id]);

  // Persist progress.
  useEffect(() => {
    if (isLoading) return;
    if (submitted.length === 0 && hintsUsedInGame === 0) {
      clearProgress(storageKey);
      return;
    }
    saveProgress(storageKey, { puzzleId: puzzle.id, submitted, hintsUsed: hintsUsedInGame });
  }, [submitted, hintsUsedInGame, storageKey, isLoading, puzzle.id]);

  // Solve timer: starts on the first picked letter, ticks while playing.
  useEffect(() => {
    if (solved || startedAtRef.current === null) return;
    const id = window.setInterval(() => {
      setElapsedMs(Date.now() - (startedAtRef.current ?? Date.now()));
    }, 500);
    return () => window.clearInterval(id);
  }, [solved, submitted.length, current.length]);

  // Countdown to the next daily puzzle, shown once the daily is solved.
  useEffect(() => {
    if (!solved || mode !== "daily") return;
    const update = () =>
      setCountdown(formatCountdown(nextDailyReset(new Date()).getTime() - Date.now()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [solved, mode]);

  const canPick = useCallback(
    (flatIndex: number) => {
      if (solved) return false;
      return canPickLetter(puzzle, letters[flatIndex], current, submitted);
    },
    [puzzle, letters, current, submitted, solved],
  );

  const pickLetter = useCallback(
    (flatIndex: number) => {
      if (!canPick(flatIndex)) return;
      if (startedAtRef.current === null) startedAtRef.current = Date.now();
      const letter = letters[flatIndex];
      setCurrent((prev) => [...prev, letter]);
      setCurrentIndices((prev) => [...prev, flatIndex]);
      setFeedback(null);
      setHintIndex(null);
    },
    [canPick, letters],
  );

  const undo = useCallback(() => {
    setCurrent((prev) => prev.slice(0, -1));
    setCurrentIndices((prev) => prev.slice(0, -1));
    setFeedback(null);
  }, []);

  const clearCurrent = useCallback(() => {
    setCurrent([]);
    setCurrentIndices([]);
    setFeedback(null);
    setHintIndex(null);
  }, []);

  const submitWord = useCallback(() => {
    const word = current.join("");
    if (word.length < 3 || isChecking || solved) return;
    setIsChecking(true);
    // Validation runs synchronously against the curated list; the
    // checking state keeps the button honest while feedback renders.
    window.setTimeout(() => {
      const result = validateWord(puzzle, word, submitted);
      setIsChecking(false);
      if (!result.ok) {
        setFeedback({ kind: "error", message: result.message ?? "That word cannot be played." });
        return;
      }
      const next = [...submitted, word];
      const newlySolved = isSolved(puzzle, next);
      const solveMs = startedAtRef.current === null ? 0 : Date.now() - startedAtRef.current;
      // Analytics payloads never include the word itself.
      trackWordSubmitted(mode, puzzle.id, word.length, next.length);
      setSubmitted(next);
      setCurrent([]);
      setCurrentIndices([]);
      setHintTarget(null);
      setHintStage(0);
      setHintIndex(null);

      const baseStats = loadStats();
      let nextStats = recordWordsFound(baseStats, 1);
      if (startedRecordedRef.current !== storageKey) {
        startedRecordedRef.current = storageKey;
        nextStats = recordGameStarted(nextStats);
      }
      if (newlySolved && !solvedRecordedRef.current) {
        solvedRecordedRef.current = true;
        nextStats = recordGameSolved(nextStats, {
          wordCount: next.length,
          isDaily: mode === "daily",
          dateKey: puzzleDateKey(today),
          hintsUsedInGame,
          solveTimeMs: solveMs,
        });
        setSolved(true);
        setElapsedMs(solveMs);
        setSolveTimeMs(solveMs);
        trackPuzzleCompleted(mode, puzzle.id, next.length, hintsUsedInGame, Math.round(solveMs / 1000));
        setFeedback({
          kind: "success",
          message: `Solved in ${next.length} word${next.length === 1 ? "" : "s"} and ${formatElapsed(solveMs)} — every letter used. Well played.`,
        });
      } else {
        setFeedback({
          kind: "success",
          message: `“${word}” accepted. ${remainingLetters(puzzle, next).length} letter${remainingLetters(puzzle, next).length === 1 ? "" : "s"} still to use.`,
        });
      }
      setStats(nextStats);
      saveStats(nextStats);
      onStatsChange?.(nextStats);
    }, 120);
  }, [current, isChecking, solved, puzzle, submitted, storageKey, mode, today, hintsUsedInGame, onStatsChange]);

  const useHint = useCallback(() => {
    if (solved) return;
    if (hintsUsedInGame >= MAX_HINTS) {
      setFeedback({ kind: "info", message: "You have used all 3 hints for this puzzle." });
      return;
    }
    // Second tap on the same hint reveals the whole word.
    if (hintTarget && hintStage === 1) {
      setHintStage(2);
      setHintsUsedInGame((n) => n + 1);
      trackHintUsed(mode, puzzle.id, hintsUsedInGame + 1);
      setFeedback({
        kind: "info",
        message: `Hint revealed: “${hintTarget}” would work here. It is only one option — your own word is just as good.`,
      });
      return;
    }
    const target = findHintWord(puzzle, submitted, current, DICTIONARY);
    if (!target) {
      setFeedback({
        kind: "info",
        message: `No hint word found for this position. Puzzle hint: ${puzzle.hint}`,
      });
      return;
    }
    setHintTarget(target);
    setHintStage(1);
    setHintsUsedInGame((n) => n + 1);
    trackHintUsed(mode, puzzle.id, hintsUsedInGame + 1);
    const firstLetterIndex = flatIndexOf(puzzle, target[0]);
    setHintIndex(firstLetterIndex);
    const prefix = current.length > 0 ? ` Continue “${current.join("")}”` : "";
    setFeedback({
      kind: "info",
      message: `Hint: try a ${target.length}-letter word starting with “${target[0]}” that uses a letter you still need.${prefix} Tap Hint again to reveal it.`,
    });
  }, [solved, hintsUsedInGame, hintTarget, hintStage, puzzle, submitted, current]);

  const startNewGame = useCallback(() => {
    setIsLoading(true);
    setPracticeOffset((n) => n + 1);
    setMode("practice");
    setFeedback({ kind: "info", message: "Practice puzzle loaded. Your daily puzzle is untouched." });
    window.setTimeout(() => setIsLoading(false), 200);
  }, []);

  const backToDaily = useCallback(() => {
    setMode("daily");
    setFeedback(null);
  }, []);

  const dailyIndex = PUZZLES.indexOf(dailyPuzzle);
  const par = puzzle.solution.length;
  const stars = solved ? (submitted.length <= par ? 3 : submitted.length === par + 1 ? 2 : 1) : 0;
  const displayTimeMs = solveTimeMs ?? elapsedMs;

  const selectPuzzle = useCallback(
    (index: number) => {
      const offset =
        ((index - dailyIndex) % PUZZLES.length + PUZZLES.length) % PUZZLES.length ||
        PUZZLES.length;
      setPracticeOffset(offset);
      setMode("practice");
      setFeedback({
        kind: "info",
        message: `Practice puzzle ${index + 1} loaded: ${PUZZLES[index].label}. Your daily puzzle is untouched.`,
      });
    },
    [dailyIndex],
  );

  const shareResult = useCallback(async () => {
    const starLine = "★".repeat(stars) + "☆".repeat(3 - stars);
    const glyphLines = submitted.map((word) => `${word}  ${glyphRow(puzzle, word)}`).join("\n");
    const text = `Letter Box Game — ${mode === "daily" ? "Daily Puzzle" : "Practice"} (${formatPuzzleDate(today)})\n${starLine} · ${submitted.length} word${submitted.length === 1 ? "" : "s"} · ${formatElapsed(displayTimeMs)}\n${glyphLines}\nhttps://letterboxedgamez.com`;
    try {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2500);
    } catch {
      setFeedback({ kind: "info", message: "Copy did not work in this browser. Your words are listed above — feel free to share them yourself." });
    }
  }, [mode, today, submitted, stars, displayTimeMs, puzzle]);

  // Physical keyboard support.
  useEffect(() => {
    if (showHowTo || showStats) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Enter") {
        e.preventDefault();
        submitWord();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        undo();
      } else if (e.key === "Escape") {
        if (document.fullscreenElement) return;
        clearCurrent();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        const idx = letters.indexOf(e.key.toUpperCase());
        if (idx !== -1) pickLetter(idx);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showHowTo, showStats, submitWord, undo, clearCurrent, letters, pickLetter]);

  const hintsLeft = MAX_HINTS - hintsUsedInGame;

  return (
    <section ref={gameSectionRef} aria-label="Daily word puzzle game" className={isFullscreen ? "mx-auto w-full max-w-none overflow-y-auto bg-slate-50 px-4 py-6 sm:px-6" : "mx-auto w-full max-w-6xl px-4 sm:px-6"}>
      {/* Puzzle identity — flat hero with a pill badge. */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
              {mode === "daily" ? "Daily Puzzle" : "Practice"}
            </p>
            <h1 className="mt-2 font-display text-[30px] font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-[48px]">
              {mode === "daily" ? "Play Letter Box Game Online Free – Daily & Unlimited" : "Practice Letter Box Puzzles – Unlimited & Free"}
            </h1>
            <p className="mt-1.5 text-sm font-bold uppercase tracking-[0.12em] text-emerald-700">
              {formatPuzzleDate(today)} · {puzzle.label}
            </p>
            <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-base">
              In this letter-box word puzzle, chain words around the square and use every letter at
              least once. Two letters in a row must come from different sides. Play online in your
              browser — no download, no account.
            </p>
            <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-base">
              Take your time — there is no time limit, and every puzzle has a verified solution
              waiting to be found.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {mode === "practice" && (
              <button
                type="button"
                onClick={backToDaily}
                className="min-h-11 cursor-pointer rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-600/50 active:scale-[0.98]"
              >
                ← Back to daily
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowHowTo(true)}
              className="min-h-11 cursor-pointer rounded-full bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              How to Play
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-pressed={isFullscreen}
              className="min-h-11 cursor-pointer rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-600/50 active:scale-[0.98]"
            >
              {isFullscreen ? "Exit full screen" : "⛶ Full screen"}
            </button>
          </div>
        </div>
        <dl className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="text-sm leading-none text-slate-500">◷</span>
            <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Time</dt>
            <dd className="font-display text-[15px] font-bold tabular-nums text-slate-900">
              {formatElapsed(displayTimeMs)}
            </dd>
          </div>
          <span aria-hidden="true" className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="text-sm leading-none text-slate-500">★</span>
            <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Par</dt>
            <dd className="font-display text-[15px] font-bold text-slate-900">
              {par} word{par === 1 ? "" : "s"}
            </dd>
          </div>
          <span aria-hidden="true" className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="text-sm leading-none text-slate-500">↗</span>
            <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Streak</dt>
            <dd className="font-display text-[15px] font-bold text-slate-900">
              {stats.currentStreak} day{stats.currentStreak === 1 ? "" : "s"}
            </dd>
          </div>
          <span aria-hidden="true" className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="text-sm leading-none text-slate-500">★</span>
            <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Best</dt>
            <dd className="font-display text-[15px] font-bold text-slate-900">
              {stats.fastestSolveMs === null ? "—" : formatElapsed(stats.fastestSolveMs)}
            </dd>
          </div>
        </dl>
      </div>

      {loadError ? (
        <div role="alert" className="mt-4 rounded-2xl border border-red-600/30 bg-red-50 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-slate-900">This puzzle could not be loaded</h2>
          <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-slate-700">{loadError}</p>
          <button
            type="button"
            onClick={startNewGame}
            className="mt-5 min-h-12 cursor-pointer rounded-full bg-emerald-600 px-6 font-bold text-white hover:bg-emerald-700"
          >
            Try a practice puzzle
          </button>
        </div>
      ) : isLoading ? (
        <div aria-busy="true" aria-label="Loading puzzle" className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="aspect-square w-full max-w-[540px] animate-pulse rounded-[28px] bg-slate-100" />
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-full bg-slate-100" />
            <div className="h-48 animate-pulse rounded-2xl bg-slate-100" />
          </div>
          <p className="sr-only">Loading the puzzle…</p>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 sm:p-5">
        <div className="grid items-start gap-6 pb-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
          {/* Board column */}
          <div className="min-w-0">
            <GameBoard
              puzzle={puzzle}
              selectedIndices={currentIndices}
              canPick={canPick}
              onPick={pickLetter}
              hintIndex={hintIndex}
              solved={solved}
            />

            {/* Current word */}
            <div className="mx-auto mt-4 w-full max-w-[540px]">
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Current word</p>
                  {requiredStart && current.length === 0 && !solved && (
                    <p className="text-[13px] font-semibold text-emerald-700">
                      Next word must start with “{requiredStart}”
                    </p>
                  )}
                </div>
                <p
                  aria-live="polite"
                  className={`mt-2 flex min-h-[52px] flex-wrap items-center gap-1.5 font-display text-[36px] font-bold leading-tight tracking-[0.08em] sm:text-[42px] ${current.length ? "text-slate-900" : "text-slate-400"}`}
                >
                  {current.length ? (
                    current.map((letter, i) => (
                      <span
                        key={`${letter}-${i}`}
                        className="grid h-[52px] w-12 shrink-0 place-items-center rounded-lg border-2 border-emerald-700 bg-emerald-600 text-[28px] leading-none text-white animate-tile-pop"
                      >
                        {letter}
                      </span>
                    ))
                  ) : (
                    "—"
                  )}
                  {current.length > 0 && (
                    <span className="ml-1 align-middle font-sans text-sm font-semibold tracking-normal text-slate-500">
                      {current.length} letter{current.length === 1 ? "" : "s"}
                    </span>
                  )}
                </p>
                {submitted.length > 0 && (
                  <p className="mt-2 truncate text-[15px] font-medium text-slate-700">
                    <span className="font-bold text-emerald-800">{submitted.join(" → ")}</span>
                    {current.length > 0 && <span aria-hidden="true"> → {current.join("")}</span>}
                  </p>
                )}
              </div>

              {/* Controls */}
              <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3" role="group" aria-label="Game controls">
                <button
                  type="button"
                  onClick={submitWord}
                  disabled={current.length < 3 || isChecking || solved}
                  className="col-span-3 min-h-13 cursor-pointer rounded-full bg-emerald-600 py-3.5 text-[16px] font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98] sm:col-span-1 sm:order-1"
                >
                  {isChecking ? "Checking…" : "Submit ✓"}
                </button>
                <button
                  type="button"
                  onClick={undo}
                  disabled={current.length === 0}
                  className="min-h-12 cursor-pointer rounded-full border border-slate-200 bg-white px-3 text-[15px] font-semibold text-slate-700 transition hover:border-emerald-600/50 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
                >
                  Undo
                </button>
                <button
                  type="button"
                  onClick={clearCurrent}
                  disabled={current.length === 0}
                  className="min-h-12 cursor-pointer rounded-full border border-slate-200 bg-white px-3 text-[15px] font-semibold text-slate-700 transition hover:border-emerald-600/50 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={useHint}
                  disabled={solved || hintsLeft <= 0}
                  className="min-h-12 cursor-pointer rounded-full border border-emerald-700/50 bg-emerald-50 px-3 text-[15px] font-semibold text-slate-700 transition hover:border-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
                >
                  Hint ({hintsLeft} left)
                </button>
                <button
                  type="button"
                  onClick={startNewGame}
                  className="col-span-2 min-h-12 cursor-pointer rounded-full border border-slate-300 bg-white px-3 text-[15px] font-bold text-slate-900 transition hover:border-emerald-600/50 sm:col-span-1 active:scale-[0.98]"
                >
                  New Game
                </button>
              </div>
              <p className="mt-3 text-center text-[13px] leading-relaxed text-slate-500">
                Tap the board or type on your keyboard — and take your time: there is no time limit.{" "}
                <span className="font-semibold text-slate-700">Enter</span> submits,{" "}
                <span className="font-semibold text-slate-700">Backspace</span> undoes one letter,{" "}
                <span className="font-semibold text-slate-700">Esc</span> clears.
              </p>
            </div>
          </div>

          {/* Side panel */}
          <aside className="min-w-0 space-y-3 rounded-[10px] bg-slate-100 p-3 lg:sticky lg:top-24">
            {/* Feedback */}
            <div aria-live="polite">
              {feedback && (
                <div
                  role={feedback.kind === "error" ? "alert" : "status"}
                  className={`rounded-[10px] border p-4 text-[15px] leading-relaxed animate-fade-up ${
                    feedback.kind === "error"
                      ? "border-red-600/40 bg-red-50 text-slate-700 animate-shake"
                      : feedback.kind === "success"
                        ? "border-emerald-700/30 bg-emerald-50 text-slate-700"
                        : "border-sky-200 bg-sky-50 text-slate-700"
                  }`}
                >
                  <p>
                    <span aria-hidden="true" className="mr-2">
                      {feedback.kind === "error" ? "✕" : feedback.kind === "success" ? "✓" : "i"}
                    </span>
                    {feedback.message}
                  </p>
                  {feedback.kind === "error" && (
                    <p className="mt-2 text-sm font-semibold text-red-700">
                      Every miss narrows it down — try a different angle.
                    </p>
                  )}
                  {hintTarget && hintStage === 2 && (
                    <p className="mt-2 font-display text-lg font-bold text-slate-900">
                      Suggested word: {hintTarget}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Win state */}
            {solved && (
              <div role="status" className="rounded-[10px] border-2 border-emerald-600 bg-white p-5 animate-fade-up">
                <div className="relative">
                  <p aria-hidden="true" className="text-[34px] leading-none tracking-[0.18em]">
                    {[1, 2, 3].map((n) => (
                      <span
                        key={n}
                        className={`animate-star-pop ${n <= stars ? "text-emerald-600" : "text-slate-300"}`}
                        style={{ animationDelay: `${(n - 1) * 120}ms` }}
                      >
                        ★
                      </span>
                    ))}
                  </p>
                  <h2 className="mt-1 font-display text-[26px] font-bold leading-tight text-slate-900">
                    Puzzle solved!
                  </h2>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-slate-700">
                    You used every letter in <strong>{submitted.length} word{submitted.length === 1 ? "" : "s"}</strong>{" "}
                    and <strong>{formatElapsed(solveTimeMs ?? 0)}</strong> — a{" "}
                    <strong>
                      {stars}-star solve{stars === 3 ? " (par or better!)" : ""}
                    </strong>
                    : {submitted.join(", ")}.
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-emerald-800">
                    <span aria-hidden="true">✦ </span>Every letter found — what a journey!<span aria-hidden="true"> ✦</span>
                  </p>
                  {puzzle.solution.join(" ") !== submitted.join(" ") && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      One verified two-word route was{" "}
                      <strong className="text-slate-900">{puzzle.solution.join(" → ")}</strong> — yours
                      counts just the same.
                    </p>
                  )}
                  {mode === "daily" && countdown && (
                    <p className="mt-3 rounded-xl border border-emerald-600/40 bg-emerald-50 px-3.5 py-2.5 text-sm font-semibold text-slate-700">
                      Next daily puzzle in <span className="tabular-nums text-emerald-800">{countdown}</span> — midnight Pakistan time.
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={shareResult}
                      className="min-h-11 cursor-pointer rounded-full border-2 border-emerald-700 bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
                    >
                      {shareCopied ? "Copied ✓" : "Share result"}
                    </button>
                    <button
                      type="button"
                      onClick={startNewGame}
                      className="min-h-11 cursor-pointer rounded-full border border-slate-300 bg-white px-4 text-sm font-bold text-slate-900 transition hover:border-emerald-600/50 active:scale-[0.98]"
                    >
                      Play a practice puzzle
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowStats(true)}
                      className="min-h-11 cursor-pointer rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-600/50 active:scale-[0.98]"
                    >
                      View statistics
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Progress */}
            <div className="rounded-[10px] border border-slate-200 bg-white p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-lg font-bold text-slate-900">Your progress</h2>
                <p className="text-sm font-bold text-emerald-700">{percent}%</p>
              </div>
              <div
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${used.size} of 12 letters used`}
                className="mt-3 h-2 overflow-hidden bg-slate-200"
              >
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-slate-500">
                <strong className="text-slate-900">{used.size} of 12</strong> letters used ·{" "}
                <strong className="text-slate-900">{remaining.length}</strong> remaining ·{" "}
                <strong className="text-slate-900">{submitted.length}</strong> word{submitted.length === 1 ? "" : "s"} (par {par}) ·{" "}
                <strong className="tabular-nums text-slate-900">{formatElapsed(displayTimeMs)}</strong>
              </p>
              <p className="mt-2 text-sm font-semibold text-emerald-800">
                <span aria-hidden="true" className="mr-1.5">✦</span>
                {solved
                  ? "All twelve letters found!"
                  : remaining.length === 1
                    ? "One letter to go — you've got this!"
                    : used.size >= 6
                      ? "Halfway there — keep going!"
                      : used.size === 0
                        ? "A fresh board — pick any letter to begin."
                        : "Warming up — nice chaining!"}
              </p>
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Letters used</p>
                <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Letters used">
                  {letters.map((letter) => {
                    const isUsed = used.has(letter);
                    return (
                      <li
                        key={letter}
                        aria-label={`${letter}: ${isUsed ? "used" : "still needed"}`}
                        className={`grid h-9 w-9 place-items-center rounded-lg border font-display text-[15px] font-bold ${
                          isUsed
                            ? "border-emerald-700 bg-emerald-600 text-white"
                            : "border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        {letter}
                        <span className="sr-only">{isUsed ? "used" : "remaining"}</span>
                      </li>
                    );
                  })}
                </ul>
                {remaining.length > 0 && (
                  <p className="mt-3 text-[15px] text-slate-700">
                    Still to use: <strong className="font-display font-bold tracking-[0.06em] text-emerald-800">{remaining.join(", ")}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Choose a puzzle — all seven, any time, as practice. */}
            <div className="rounded-[10px] border border-slate-200 bg-white p-5">
              <h2 className="font-display text-lg font-bold text-slate-900">Practice More Letter Box Puzzles for Free</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">
                Pick any board to play as practice. Your daily puzzle stays untouched.
              </p>
              <p aria-hidden="true" className="mt-2 text-sm tracking-[0.3em] text-slate-400">● ◆ ▲ ■</p>
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {PUZZLES.map((candidate, index) => {
                  const isCurrent = candidate.id === puzzle.id;
                  return (
                    <li key={candidate.id}>
                      <button
                        type="button"
                        onClick={() => selectPuzzle(index)}
                        aria-label={`${index + 1}. ${candidate.label}${index === dailyIndex ? " · daily" : ""}${isCurrent ? " (current puzzle)" : ""}`}
                        aria-current={isCurrent ? "true" : undefined}
                        className={`min-h-11 w-full cursor-pointer rounded-full border px-3 py-2 text-left text-[13px] font-semibold transition active:scale-[0.98] ${
                          isCurrent
                            ? "border-emerald-700 bg-emerald-600 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-emerald-600/50 hover:bg-slate-50"
                        }`}
                      >
                        <span className="font-display font-bold">{index + 1}.</span> {candidate.label}
                        {index === dailyIndex && (
                          <span className="ml-1 text-[11px] font-bold uppercase tracking-wide">· daily</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Submitted words */}
            <div className="rounded-[10px] border border-slate-200 bg-white p-5">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Words found <span className="text-sm font-sans font-semibold text-slate-500">({submitted.length})</span>
              </h2>
              {submitted.length === 0 ? (
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  No words yet. Your first word can start with any letter — every word
                  after it must start with the previous word&apos;s last letter.
                </p>
              ) : (
                <ol className="mt-3 space-y-2">
                  {submitted.map((word, i) => {
                    const prevUsed = usedLetters(submitted.slice(0, i));
                    const fresh = word.split("").filter((l) => !prevUsed.has(l));
                    return (
                      <li
                        key={`${word}-${i}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 animate-fade-up"
                      >
                        <span className="flex items-center gap-2.5">
                          <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                            {i + 1}
                          </span>
                          <span className="font-display text-[19px] font-bold tracking-[0.06em] text-emerald-800">
                            {word}
                          </span>
                        </span>
                        <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                          {fresh.length} new letter{fresh.length === 1 ? "" : "s"}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}
              <p className="mt-4 border-t border-slate-200 pt-3 text-[13px] leading-relaxed text-slate-500">
                Words are checked against a curated list of common words. If a word you
                know is not recognised, try a more common alternative — the list is
                still growing.
              </p>
            </div>

            {/* Quick rules */}
            <div className="rounded-[10px] border border-slate-200 bg-white p-5">
              <h2 className="font-display text-lg font-bold text-slate-900">In short</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 marker:text-emerald-700">
                <li>Words need at least 3 letters.</li>
                <li>Two in a row cannot share a side.</li>
                <li>Chain: start each word with the last letter of the one before.</li>
                <li>Use each letter at most once per word.</li>
                <li>Use all 12 letters to solve.</li>
              </ul>
              <button
                type="button"
                onClick={() => setShowHowTo(true)}
                className="mt-3 min-h-11 cursor-pointer text-sm font-bold text-emerald-700 underline underline-offset-4 hover:text-emerald-800"
              >
                Read the full How to Play →
              </button>
            </div>
          </aside>
        </div>
        </div>
      )}

      <HowToPlayModal open={showHowTo} onClose={() => setShowHowTo(false)} />
      <StatsModal open={showStats} onClose={() => setShowStats(false)} stats={stats} />
    </section>
  );
}

const EMPTY_FALLBACK: Stats = {
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
