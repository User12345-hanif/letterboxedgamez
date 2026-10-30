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
    <div className="rounded-[24px] border-[3px] border-gold/40 bg-butter/60 p-5 sm:p-6">
      <h2 className="font-display text-xl font-bold text-ink">Hints, lightest first</h2>
      <p className="mt-1 text-sm text-moss">Stop as soon as one is enough. Each tap reveals one more clue, never the whole answer at once.</p>
      <ol className="mt-4 space-y-2">
        {hints.slice(0, stage).map((h, i) => (
          <li key={i} className="rounded-2xl bg-cream px-4 py-3 text-sm leading-relaxed text-ink">{h}</li>
        ))}
      </ol>
      {stage < hints.length && (
        <button
          type="button"
          onClick={() => setStage((s) => s + 1)}
          className="mt-4 min-h-[48px] rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-pine"
        >
          Reveal hint {stage + 1} of {hints.length}
        </button>
      )}
      <div className="mt-6 border-t border-gold/40 pt-4">
        <h3 className="font-bold text-ink">Reveal letter by letter</h3>
        <p className="mt-1 font-mono text-lg font-bold tracking-[0.2em] text-ink" aria-live="polite">
          {letters.split("").map((c, i) => (i < revealed ? c : "·")).join(" ")}
        </p>
        <p className="mt-1 text-xs text-moss">{revealed} of {letters.length} letters revealed. Spaces and arrows are not letters.</p>
        {revealed < letters.length && (
          <button
            type="button"
            onClick={() => setRevealed((r) => Math.min(letters.length, r + 1))}
            className="mt-3 min-h-[44px] rounded-full border-2 border-forest/30 bg-cream px-4 py-2 text-sm font-bold text-ink"
          >
            Reveal one more letter
          </button>
        )}
      </div>
      <details className="mt-6 rounded-2xl bg-cream px-4 py-3">
        <summary className="cursor-pointer text-sm font-bold text-ink">Show the full checked solution</summary>
        <p className="mt-2 font-display text-lg font-bold tracking-wide text-ink">{fullText}</p>
        <p className="mt-1 text-sm text-moss">
          Together these words use all 12 letters, obey the side rule and the no-repeat-in-a-word rule, and chain correctly.
          Other valid chains may exist — a different solve counts just the same.
        </p>
      </details>
    </div>
  );
}
