"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PUZZLES, type Puzzle } from "@/lib/puzzles";
import { todayPuzzle } from "@/lib/daily";
import {
  playableWords,
  sidePath,
  solveBoard,
  type BoardSides,
} from "@/lib/solver";

const SIDE_LABELS = ["Top side", "Right side", "Bottom side", "Left side"];

function sidesFromPuzzle(puzzle: Puzzle): Record<string, string> {
  return {
    top: puzzle.sides[0].join(""),
    right: puzzle.sides[1].join(""),
    bottom: puzzle.sides[2].join(""),
    left: puzzle.sides[3].join(""),
  };
}

function parseSides(raw: Record<string, string>): BoardSides | null {
  const keys = ["top", "right", "bottom", "left"] as const;
  const out = [] as unknown as BoardSides;
  for (const k of keys) {
    const letters = raw[k].toUpperCase().replace(/[^A-Z]/g, "").split("");
    if (letters.length !== 3) return null;
    out.push(letters);
  }
  const all = out.flat();
  if (new Set(all).size !== 12) return null;
  return out;
}

export default function SolverTool() {
  const today = todayPuzzle();
  const [inputs, setInputs] = useState<Record<string, string>>(() => sidesFromPuzzle(today));
  const [solved, setSolved] = useState<BoardSides | null>(null);
  const [error, setError] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!solved) return null;
    return { chains: solveBoard(solved, 6, 4), playable: playableWords(solved) };
  }, [solved]);

  const run = () => {
    const parsed = parseSides(inputs);
    if (!parsed) {
      setError("Enter exactly 3 different letters on each side — 12 different letters in total.");
      setSolved(null);
      return;
    }
    setError(null);
    setSolved(parsed);
  };

  const loadPuzzle = (id: string) => {
    const p = PUZZLES.find((x) => x.id === id) ?? today;
    setInputs(sidesFromPuzzle(p));
    setSolved(null);
    setError(null);
  };

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {(["top", "right", "bottom", "left"] as const).map((key, i) => (
          <div key={key}>
            <label htmlFor={`side-${key}`} className="text-xs font-bold uppercase tracking-[0.14em] text-forest">
              {SIDE_LABELS[i]} — 3 letters
            </label>
            <input
              id={`side-${key}`}
              value={inputs[key]}
              onChange={(e) => setInputs((s) => ({ ...s, [key]: e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3) }))}
              className="mt-1.5 w-full rounded-2xl border-2 border-forest/25 bg-cream px-4 py-3 font-mono text-xl font-bold tracking-[0.3em] text-ink"
              placeholder="ABC"
              maxLength={3}
              autoComplete="off"
            />
          </div>
        ))}
      </div>
      {error && <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-900">{error}</p>}
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={run} className="min-h-[52px] rounded-full bg-forest px-6 py-3 text-base font-bold text-white shadow-md transition hover:bg-pine">
          Solve my box
        </button>
        <button type="button" onClick={() => loadPuzzle(today.id)} className="min-h-[52px] rounded-full border-2 border-forest/25 bg-cream px-4 py-3 text-sm font-bold text-ink">
          Load today&rsquo;s board
        </button>
        <button type="button" onClick={() => { setInputs({ top: "", right: "", bottom: "", left: "" }); setSolved(null); }} className="min-h-[52px] rounded-full border-2 border-forest/25 bg-cream px-4 py-3 text-sm font-bold text-ink">
          Clear
        </button>
      </div>
      <p className="mt-3 text-sm text-moss">
        Or load a board from the rotation:{" "}
        <select
          aria-label="Load a board from the rotation"
          className="rounded-full border border-forest/25 bg-cream px-2 py-1.5 text-sm font-bold text-ink"
          defaultValue=""
          onChange={(e) => e.target.value && loadPuzzle(e.target.value)}
        >
          <option value="" disabled>Choose a puzzle…</option>
          {PUZZLES.map((p) => (
            <option key={p.id} value={p.id}>{p.label} — {p.solution.join(" → ")}</option>
          ))}
        </select>
      </p>

      {results && solved && (
        <div className="mt-8 space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Result</h2>
            <p className="mt-1 text-sm text-moss">
              {results.playable.length} legal words on this board in our word list.{" "}
              {results.chains.length > 0
                ? `Shortest chain found: ${results.chains[0].length} ${results.chains[0].length === 1 ? "word" : "words"}.`
                : "No chain covering all 12 letters was found in our word list — try a different board, or check a letter is on the right side."}
            </p>
            {results.chains.length > 0 && (
              <ol className="mt-4 space-y-3">
                {results.chains.map((chain, i) => (
                  <li key={i} className="rounded-2xl bg-cream px-4 py-3">
                    <p className="font-display text-lg font-bold tracking-wide text-ink">
                      {i === 0 ? "🏆 " : ""}{chain.join(" → ")}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-moss">
                      {chain.map((w) => `${w} (${sidePath(solved, w).join(" → ")})`).join(" · ")}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
          <p className="text-sm text-moss">
            <Link href="/unlimited" className="font-bold text-forest underline underline-offset-2">Practise on unlimited boards →</Link>
            {" · "}
            <Link href="/archive" className="font-bold text-forest underline underline-offset-2">Browse the archive →</Link>
          </p>
        </div>
      )}
    </div>
  );
}
