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
import { Sprinkles, SunDecoration } from "./Decorations";
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

const CONFETTI_COLORS = ["#e3b93e", "#c19a2e", "#2f7d4e", "#f8ecc9", "#b04a1f", "#d7e5d4"];

function flatIndexOf(puzzle: Puzzle, letter: string): number {
  return puzzleLetters(puzzle).indexOf(letter);
}

export function GameScreen({ onStatsChange }: { onStatsChange?: (s: Stats) => void }) {
  const [today] = useState(() => new Date());
  const dailyPuzzle = useMemo(() => puzzleForDate(today), [today]);
  const [mode, setMode] = useState<Mode>("daily");
  const [practiceOffset, setPracticeOffset] = useState(1);
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
    saveSession({ mode, practiceOffset });
  }, [mode, practiceOffset]);

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
    <section aria-label="Daily word puzzle game" className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      {/* Puzzle identity — deep forest storybook masthead with gold accents. */}
      <div className="relative mt-8 overflow-hidden rounded-[32px] border-[3px] border-gold/60 bg-gradient-to-br from-forest-deep via-forest-dark to-forest p-6 text-cream shadow-lift sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-gold-bright/25 blur-2xl animate-glow" />
          <span className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-forest-light/40 blur-2xl" />
          <span className="absolute right-8 top-6 hidden h-3 w-3 rotate-45 bg-gold-bright/70 sm:block" />
          <span className="absolute bottom-8 right-24 hidden h-2 w-2 rotate-45 bg-gold-light/60 sm:block" />
        </div>
        <Sprinkles tone="light" />
        <SunDecoration className="pointer-events-none absolute right-8 top-1/2 hidden h-20 w-20 -translate-y-1/2 opacity-90 lg:block" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-gold-light">
              <span aria-hidden="true">✳</span>
              {mode === "daily" ? "Daily Puzzle" : "Practice Puzzle"}
              <span className="font-normal normal-case tracking-normal text-sage">· {puzzle.label}</span>
            </p>
            <h1 className="mt-3 font-display text-[34px] font-bold leading-[1.05] tracking-tight text-cream sm:text-[48px]">
              {mode === "daily" ? "Letter Boxed — Play a Free Daily Word Puzzle" : "Practice word puzzle"}
            </h1>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-gold-light">
              {formatPuzzleDate(today)} · {puzzle.label}
            </p>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-sage sm:text-base">
              In this letter-box word puzzle, chain words around the square and use every letter at
              least once. Two letters in a row must come from different sides. Play online in your
              browser — no download, no account.
            </p>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-sage sm:text-base">
              Take your time — there is no time limit, and every puzzle has a verified solution
              waiting to be found.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {mode === "practice" && (
              <button
                type="button"
                onClick={backToDaily}
                className="min-h-11 cursor-pointer rounded-full border border-cream/40 bg-transparent px-4 text-sm font-semibold text-cream shadow-sm transition hover:bg-white/10 active:scale-[0.98]"
              >
                ← Back to daily
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowHowTo(true)}
              className="min-h-11 cursor-pointer rounded-full bg-cream px-4 text-sm font-bold text-forest-dark shadow-sm transition hover:bg-gold-light active:scale-[0.98]"
            >
              How to Play
            </button>
          </div>
        </div>
        <dl className="relative mt-5 flex flex-wrap gap-2">
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 backdrop-blur-sm">
            <span aria-hidden="true" className="text-sm leading-none text-sage">◷</span>
            <dt className="text-xs font-bold uppercase tracking-wider text-sage">Time</dt>
            <dd className="font-display text-[15px] font-bold tabular-nums text-cream">
              {formatElapsed(displayTimeMs)}
            </dd>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 backdrop-blur-sm">
            <span aria-hidden="true" className="text-sm leading-none text-sage">★</span>
            <dt className="text-xs font-bold uppercase tracking-wider text-sage">Par</dt>
            <dd className="font-display text-[15px] font-bold text-cream">
              {par} word{par === 1 ? "" : "s"}
            </dd>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 backdrop-blur-sm">
            <span aria-hidden="true" className="text-sm leading-none">🔥</span>
            <dt className="text-xs font-bold uppercase tracking-wider text-sage">Streak</dt>
            <dd className="font-display text-[15px] font-bold text-cream">
              {stats.currentStreak} day{stats.currentStreak === 1 ? "" : "s"}
            </dd>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-gold/50 bg-gold/15 px-3.5 py-1.5 backdrop-blur-sm">
            <span aria-hidden="true" className="text-sm leading-none">🏆</span>
            <dt className="text-xs font-bold uppercase tracking-wider text-gold-light">Best</dt>
            <dd className="font-display text-[15px] font-bold text-gold-light">
              {stats.fastestSolveMs === null ? "—" : formatElapsed(stats.fastestSolveMs)}
            </dd>
          </div>
        </dl>
      </div>

      {loadError ? (
        <div role="alert" className="mt-8 rounded-3xl border border-clay/30 bg-clay-light p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-ink">This puzzle could not be loaded</h2>
          <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-pine">{loadError}</p>
          <button
            type="button"
            onClick={startNewGame}
            className="mt-5 min-h-12 cursor-pointer rounded-full bg-forest px-6 font-bold text-white hover:bg-forest-dark"
          >
            Try a practice puzzle
          </button>
        </div>
      ) : isLoading ? (
        <div aria-busy="true" aria-label="Loading puzzle" className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="aspect-square w-full max-w-[540px] animate-pulse rounded-[28px] bg-parchment" />
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded-2xl bg-parchment" />
            <div className="h-12 animate-pulse rounded-full bg-parchment" />
            <div className="h-48 animate-pulse rounded-2xl bg-parchment" />
          </div>
          <p className="sr-only">Loading the puzzle…</p>
        </div>
      ) : (
        <div className="mt-7 rounded-[32px] border-2 border-dashed border-gold/50 bg-white/50 p-3 shadow-sm sm:p-5">
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
            <div className="mx-auto mt-5 w-full max-w-[540px]">
              <div className="rounded-[20px] border border-gold/40 bg-gradient-to-b from-cream to-[#fdf3d7] px-5 py-4 shadow-lift">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-moss">Current word</p>
                  {requiredStart && current.length === 0 && !solved && (
                    <p className="text-[13px] font-semibold text-forest">
                      Next word must start with “{requiredStart}”
                    </p>
                  )}
                </div>
                <p
                  aria-live="polite"
                  className={`mt-2 flex min-h-[52px] flex-wrap items-center gap-1.5 font-display text-[36px] font-bold leading-tight tracking-[0.08em] sm:text-[42px] ${current.length ? "text-ink" : "text-gold-deep/60"}`}
                >
                  {current.length ? (
                    current.map((letter, i) => (
                      <span
                        key={`${letter}-${i}`}
                        className="grid h-[52px] w-12 shrink-0 place-items-center rounded-xl border-2 border-gold-deep bg-gradient-to-b from-sunny-light to-sunny text-[28px] leading-none text-ink shadow-tile animate-tile-pop"
                      >
                        {letter}
                      </span>
                    ))
                  ) : (
                    "—"
                  )}
                  {current.length > 0 && (
                    <span className="ml-1 align-middle font-sans text-sm font-semibold tracking-normal text-moss">
                      {current.length} letter{current.length === 1 ? "" : "s"}
                    </span>
                  )}
                </p>
                {submitted.length > 0 && (
                  <p className="mt-2 truncate text-[15px] font-medium text-pine">
                    <span className="font-bold text-forest-dark">{submitted.join(" → ")}</span>
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
                  className="col-span-3 min-h-13 cursor-pointer rounded-full bg-gradient-to-b from-forest-light to-forest py-3.5 text-[16px] font-bold text-white shadow-lift transition hover:from-forest hover:to-forest-dark disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98] sm:col-span-1 sm:order-1"
                >
                  {isChecking ? "Checking…" : "Submit ✓"}
                </button>
                <button
                  type="button"
                  onClick={undo}
                  disabled={current.length === 0}
                  className="min-h-12 cursor-pointer rounded-full border border-line bg-white px-3 text-[15px] font-semibold text-pine transition hover:border-forest/40 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
                >
                  Undo
                </button>
                <button
                  type="button"
                  onClick={clearCurrent}
                  disabled={current.length === 0}
                  className="min-h-12 cursor-pointer rounded-full border border-line bg-white px-3 text-[15px] font-semibold text-pine transition hover:border-forest/40 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={useHint}
                  disabled={solved || hintsLeft <= 0}
                  className="min-h-12 cursor-pointer rounded-full border border-gold-deep/50 bg-gradient-to-b from-gold-light to-[#f3e2ac] px-3 text-[15px] font-semibold text-pine shadow-sm transition hover:border-gold-deep disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
                >
                  Hint ({hintsLeft} left)
                </button>
                <button
                  type="button"
                  onClick={startNewGame}
                  className="col-span-2 min-h-12 cursor-pointer rounded-full border-2 border-forest bg-cream px-3 text-[15px] font-bold text-forest-dark shadow-sm transition hover:bg-gold-light hover:border-gold-deep sm:col-span-1 active:scale-[0.98]"
                >
                  New Game
                </button>
              </div>
              <p className="mt-3 text-center text-[13px] leading-relaxed text-moss">
                Tap the board or type on your keyboard — and take your time: there is no time limit.{" "}
                <span className="font-semibold text-pine">Enter</span> submits,{" "}
                <span className="font-semibold text-pine">Backspace</span> undoes one letter,{" "}
                <span className="font-semibold text-pine">Esc</span> clears.
              </p>
            </div>
          </div>

          {/* Side panel */}
          <aside className="min-w-0 space-y-4 lg:sticky lg:top-24">
            {/* Feedback */}
            <div aria-live="polite">
              {feedback && (
                <div
                  role={feedback.kind === "error" ? "alert" : "status"}
                  className={`rounded-2xl border p-4 text-[15px] leading-relaxed animate-fade-up ${
                    feedback.kind === "error"
                      ? "border-clay/40 bg-clay-light text-pine animate-shake"
                      : feedback.kind === "success"
                        ? "border-mint-deep/30 bg-mint text-pine"
                        : "border-sky-deep/30 bg-sky-wash text-pine"
                  }`}
                >
                  <p>
                    <span aria-hidden="true" className="mr-2">
                      {feedback.kind === "error" ? "✕" : feedback.kind === "success" ? "✓" : "💡"}
                    </span>
                    {feedback.message}
                  </p>
                  {feedback.kind === "error" && (
                    <p className="mt-2 text-sm font-semibold text-coral-deep">
                      Every miss narrows it down — try a different angle.
                    </p>
                  )}
                  {hintTarget && hintStage === 2 && (
                    <p className="mt-2 font-display text-lg font-bold text-ink">
                      Suggested word: {hintTarget}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Win state */}
            {solved && (
              <div role="status" className="relative overflow-hidden rounded-3xl border-[3px] border-gold-deep bg-gradient-to-b from-sunny-light via-butter to-mint p-5 shadow-lift ring-4 ring-sunny/60 animate-fade-up">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                  {CONFETTI_COLORS.map((color, i) => (
                    <span
                      key={color}
                      className="absolute top-0 h-2.5 w-2 animate-confetti rounded-[2px]"
                      style={{
                        left: `${8 + i * 15}%`,
                        backgroundColor: color,
                        animationDelay: `${i * 0.18}s`,
                        ["--drift" as string]: `${i % 2 === 0 ? 36 : -36}px`,
                      }}
                    />
                  ))}
                </div>
                <div className="relative">
                  <p aria-hidden="true" className="text-[34px] leading-none tracking-[0.18em]">
                    {[1, 2, 3].map((n) => (
                      <span
                        key={n}
                        className={`animate-star-pop ${n <= stars ? "text-gold-deep" : "text-moss/50"}`}
                        style={{ animationDelay: `${(n - 1) * 120}ms` }}
                      >
                        ★
                      </span>
                    ))}
                  </p>
                  <h2 className="mt-1 font-display text-[26px] font-bold leading-tight text-ink">
                    Puzzle solved!
                  </h2>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-pine">
                    You used every letter in <strong>{submitted.length} word{submitted.length === 1 ? "" : "s"}</strong>{" "}
                    and <strong>{formatElapsed(solveTimeMs ?? 0)}</strong> — a{" "}
                    <strong>
                      {stars}-star solve{stars === 3 ? " (par or better!)" : ""}
                    </strong>
                    : {submitted.join(", ")}.
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-forest-dark">
                    <span aria-hidden="true">✦ </span>Every letter found — what a journey!<span aria-hidden="true"> ✦</span>
                  </p>
                  {puzzle.solution.join(" ") !== submitted.join(" ") && (
                    <p className="mt-2 text-sm leading-relaxed text-pine">
                      One verified two-word route was{" "}
                      <strong className="text-ink">{puzzle.solution.join(" → ")}</strong> — yours
                      counts just the same.
                    </p>
                  )}
                  {mode === "daily" && countdown && (
                    <p className="mt-3 rounded-xl border border-gold/40 bg-butter/90 px-3.5 py-2.5 text-sm font-semibold text-pine">
                      Next daily puzzle in <span className="tabular-nums text-forest-dark">{countdown}</span> — midnight Pakistan time.
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={shareResult}
                      className="min-h-11 cursor-pointer rounded-full border-2 border-gold-deep bg-gradient-to-b from-gold-bright to-gold px-4 text-sm font-bold text-ink shadow-lift transition hover:from-gold hover:to-gold-deep active:scale-[0.98]"
                    >
                      {shareCopied ? "Copied ✓" : "Share result"}
                    </button>
                    <button
                      type="button"
                      onClick={startNewGame}
                      className="min-h-11 cursor-pointer rounded-full border border-forest bg-cream px-4 text-sm font-bold text-forest-dark transition hover:bg-white active:scale-[0.98]"
                    >
                      Play a practice puzzle
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowStats(true)}
                      className="min-h-11 cursor-pointer rounded-full border border-line bg-white px-4 text-sm font-semibold text-pine transition hover:border-forest/40 active:scale-[0.98]"
                    >
                      View statistics
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Progress */}
            <div className="rounded-3xl border-2 border-line bg-cream p-5 shadow-soft">
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-lg font-bold text-ink">Your progress</h2>
                <p className="text-sm font-bold text-forest">{percent}%</p>
              </div>
              <div
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${used.size} of 12 letters used`}
                className="mt-3 h-3.5 overflow-hidden rounded-full border border-gold/30 bg-parchment shadow-[inset_0_1px_3px_rgb(29_43_32/0.18)]"
              >
                <div
                  className="progress-shimmer h-full rounded-full bg-gradient-to-r from-forest-light via-forest to-gold transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-moss">
                <strong className="text-ink">{used.size} of 12</strong> letters used ·{" "}
                <strong className="text-ink">{remaining.length}</strong> remaining ·{" "}
                <strong className="text-ink">{submitted.length}</strong> word{submitted.length === 1 ? "" : "s"} (par {par}) ·{" "}
                <strong className="tabular-nums text-ink">{formatElapsed(displayTimeMs)}</strong>
              </p>
              <p className="mt-2 text-sm font-semibold text-forest-dark">
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
                {used.size >= 6 && !solved && (
                  <span aria-hidden="true" className="ml-1.5 text-sunny animate-sparkle-pop">✦</span>
                )}
              </p>
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-moss">Letters used</p>
                <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Letters used">
                  {letters.map((letter) => {
                    const isUsed = used.has(letter);
                    return (
                      <li
                        key={letter}
                        aria-label={`${letter}: ${isUsed ? "used" : "still needed"}`}
                        className={`grid h-9 w-9 place-items-center rounded-lg border font-display text-[15px] font-bold ${
                          isUsed
                            ? "border-forest bg-forest text-white"
                            : "border-gold/50 bg-cream text-pine"
                        }`}
                      >
                        {letter}
                        <span className="sr-only">{isUsed ? "used" : "remaining"}</span>
                      </li>
                    );
                  })}
                </ul>
                {remaining.length > 0 && (
                  <p className="mt-3 text-[15px] text-pine">
                    Still to use: <strong className="font-display font-bold tracking-[0.06em] text-forest-dark">{remaining.join(", ")}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Choose a puzzle — all seven, any time, as practice. */}
            <div className="rounded-3xl border-2 border-line bg-gradient-to-b from-cream to-lavender-wash/70 p-5 shadow-soft">
              <h2 className="font-display text-lg font-bold text-ink">Practice More Letter Box Puzzles for Free</h2>
              <p className="mt-1 text-sm leading-relaxed text-pine">
                Pick any board to play as practice. Your daily puzzle stays untouched.
              </p>
              <p aria-hidden="true" className="mt-2 text-sm tracking-[0.3em] text-lavender-deep">● ◆ ▲ ■</p>
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
                            ? "border-gold-deep bg-gradient-to-b from-gold-bright to-gold text-ink shadow-sm"
                            : "border-line bg-white text-pine hover:border-forest/50 hover:bg-sage-light"
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
            <div className="rounded-3xl border-2 border-line bg-cream p-5 shadow-soft">
              <h2 className="font-display text-lg font-bold text-ink">
                Words found <span className="text-sm font-sans font-semibold text-moss">({submitted.length})</span>
              </h2>
              {submitted.length === 0 ? (
                <p className="mt-2 text-sm leading-relaxed text-moss">
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
                        className="flex items-center justify-between gap-3 rounded-xl border border-gold/40 bg-white px-3.5 py-2.5 shadow-sm animate-fade-up"
                      >
                        <span className="flex items-center gap-2.5">
                          <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-gold text-xs font-bold text-ink">
                            {i + 1}
                          </span>
                          <span className="font-display text-[19px] font-bold tracking-[0.06em] text-forest-dark">
                            {word}
                          </span>
                        </span>
                        <span className="shrink-0 rounded-full bg-gold-light px-2 py-0.5 text-xs font-bold text-gold-deep">
                          {fresh.length} new letter{fresh.length === 1 ? "" : "s"}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}
              <p className="mt-4 border-t border-line pt-3 text-[13px] leading-relaxed text-moss">
                Words are checked against a curated list of common words. If a word you
                know is not recognised, try a more common alternative — the list is
                still growing.
              </p>
            </div>

            {/* Quick rules */}
            <div className="rounded-3xl border-2 border-sky/50 bg-sky-wash/70 p-5">
              <h2 className="font-display text-lg font-bold text-ink">In short</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-pine marker:text-forest">
                <li>Words need at least 3 letters.</li>
                <li>Two in a row cannot share a side.</li>
                <li>Chain: start each word with the last letter of the one before.</li>
                <li>Use each letter at most once per word.</li>
                <li>Use all 12 letters to solve.</li>
              </ul>
              <button
                type="button"
                onClick={() => setShowHowTo(true)}
                className="mt-3 min-h-11 cursor-pointer text-sm font-bold text-forest underline underline-offset-4 hover:text-forest-dark"
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
