"use client";

import { useMemo, useState } from "react";
import type { Puzzle } from "@/lib/puzzles";

/** Tiered hints for one puzzle, lightest first, in the order players
 *  actually use them: the puzzle's own short hint, then word count,
 *  word lengths, first letter, linking letter, first word — and a
 *  letter-by-letter reveal. The full solution lives in a <details>
 *  element, so it is in the page HTML without spoiling the page at
 *  a glance. Nothing is revealed until the player asks for it. */
export default function DailyHints({ puzzle }: { puzzle: Puzzle }) {
  const [stage, setStage] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const solution = puzzle.solution;
  const fullText = solution.join(" → ");
  const letters = useMemo(() => fullText.replace(/[^A-Z]/g, ""), [fullText]);

  const hints: string[] = [
    `Hint 1 — the puzzle's own clue: ${puzzle.hint}`,
    `Hint 2 — word count: the checked solution uses ${solution.length} ${solution.length === 1 ? "word" : "words"}. Par is ${solution.length}.`,
    `Hint 3 — word lengths: ${solution.map((w) => w.length).join(" + ")} letters, in order.`,
    `Hint 4 — first letter: the first word starts with ${solution[0][0]}.`,
    solution.length > 1
      ? `Hint 5 — linking letter: the first word ends with ${solution[0].slice(-1)}, so the second word starts with ${solution[0].slice(-1)}.`
      : `Hint 5 — the single word starts with ${solution[0][0]} and ends with ${solution[0].slice(-1)}.`,
    `Hint 6 — first word: ${solution[0]}.`,
  ];

  return (
    <div className="rounded-[24px] border-[3px] border-amber-500/40 bg-amber-500/10 p-5 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.8)] sm:p-6">
      <h2 className="font-display text-xl font-bold text-white">Hints, lightest first</h2>
      <p className="mt-1 text-sm text-slate-400">Stop as soon as one is enough. Each tap reveals one more clue, never the whole answer at once.</p>
      <ol className="mt-4 space-y-2">
        {hints.slice(0, stage).map((h, i) => (
          <li key={i} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm leading-relaxed text-white">{h}</li>
        ))}
      </ol>
      {stage < hints.length && (
        <button
          type="button"
          onClick={() => setStage((s) => s + 1)}
          className="mt-4 min-h-[48px] rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-[0_8px_20px_-8px_rgba(245,158,11,0.7)] transition hover:bg-amber-400"
        >
          Reveal hint {stage + 1} of {hints.length}
        </button>
      )}
      <div className="mt-6 border-t border-emerald-600/40 pt-4">
        <h3 className="font-bold text-white">Reveal letter by letter</h3>
        <p className="mt-1 font-mono text-lg font-bold tracking-[0.2em] text-white" aria-live="polite">
          {letters.split("").map((c, i) => (i < revealed ? c : "·")).join(" ")}
        </p>
        <p className="mt-1 text-xs text-slate-400">{revealed} of {letters.length} letters revealed. Spaces and arrows are not letters.</p>
        {revealed < letters.length && (
          <button
            type="button"
            onClick={() => setRevealed((r) => Math.min(letters.length, r + 1))}
            className="mt-3 min-h-[44px] rounded-full border-2 border-amber-500/50 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-300"
          >
            Reveal one more letter
          </button>
        )}
      </div>
      <details className="mt-6 rounded-2xl bg-slate-900 px-4 py-3">
        <summary className="cursor-pointer text-sm font-bold text-white">Show the full checked solution</summary>
        <p className="mt-2 font-display text-lg font-bold tracking-wide text-white">{fullText}</p>
        <p className="mt-1 text-sm text-slate-400">
          Together these words use all 12 letters, obey the side rule and the no-repeat-in-a-word rule, and chain correctly.
          Other valid chains may exist — a different solve counts just the same.
        </p>
      </details>
    </div>
  );
}
