"use client";

import { useEffect, useRef } from "react";
import { formatElapsed } from "@/lib/daily";

function useModal(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>("button, a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);
  return ref;
}

export function ModalShell({
  open,
  onClose,
  labelledBy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: React.ReactNode;
}) {
  const ref = useModal(open, onClose);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end bg-slate-900/45 p-0 sm:place-items-center sm:p-6"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-6 animate-fade-up sm:rounded-2xl sm:p-7"
      >
        {children}
      </div>
    </div>
  );
}

export function HowToPlayModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <ModalShell open={open} onClose={onClose} labelledBy="how-to-play-title">
      <div className="flex items-start justify-between gap-4">
        <h2 id="how-to-play-title" className="font-display text-2xl font-bold text-slate-900">
          How to play
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close How to Play"
          className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-slate-200 bg-white text-lg font-bold text-slate-700 hover:bg-slate-50"
        >
          ×
        </button>
      </div>
      <ol className="mt-4 list-none space-y-4 text-[15px] leading-relaxed text-slate-700">
        <li className="flex gap-3">
          <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-600 font-display font-bold text-white">1</span>
          <span><strong className="text-slate-900">Build a word of 3 or more letters</strong> by tapping letters on the board, or typing on your keyboard.</span>
        </li>
        <li className="flex gap-3">
          <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-600 font-display font-bold text-white">2</span>
          <span><strong className="text-slate-900">Never pick two letters in a row from the same side.</strong> Sides are labelled Top, Right, Bottom and Left — by name, shape and pattern, not colour alone.</span>
        </li>
        <li className="flex gap-3">
          <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-600 font-display font-bold text-white">3</span>
          <span><strong className="text-slate-900">Chain your words.</strong> Each new word must start with the last letter of the word before it.</span>
        </li>
        <li className="flex gap-3">
          <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-600 font-display font-bold text-white">4</span>
          <span><strong className="text-slate-900">Use all 12 letters at least once</strong> to solve the puzzle. Fewer words is better — two words is an excellent solve.</span>
        </li>
      </ol>
      <p className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm leading-relaxed text-slate-700">
        Keyboard: type letters to pick them, <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-sans text-xs font-semibold">Enter</kbd> to submit,{" "}
        <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-sans text-xs font-semibold">Backspace</kbd> to undo one letter, and{" "}
        <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-sans text-xs font-semibold">Esc</kbd> to clear the current word.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-5 min-h-12 w-full cursor-pointer rounded-full bg-emerald-600 px-5 text-[15px] font-bold text-white transition hover:bg-emerald-700"
      >
        Got it — back to the puzzle
      </button>
    </ModalShell>
  );
}

export function StatsModal({
  open,
  onClose,
  stats,
}: {
  open: boolean;
  onClose: () => void;
  stats: {
    gamesPlayed: number;
    gamesSolved: number;
    currentStreak: number;
    bestStreak: number;
    fewestWords: number | null;
    totalWordsFound: number;
    hintsUsed: number;
    fastestSolveMs?: number | null;
  };
}) {
  const rate = stats.gamesPlayed ? Math.round((stats.gamesSolved / stats.gamesPlayed) * 100) : 0;
  const rows: Array<[string, string]> = [
    ["Puzzles played", String(stats.gamesPlayed)],
    ["Puzzles solved", String(stats.gamesSolved)],
    ["Solve rate", `${rate}%`],
    ["Current streak", String(stats.currentStreak)],
    ["Best streak", String(stats.bestStreak)],
    ["Fewest words in a solve", stats.fewestWords === null ? "—" : String(stats.fewestWords)],
    ["Fastest solve", stats.fastestSolveMs == null ? "—" : formatElapsed(stats.fastestSolveMs)],
    ["Words found in total", String(stats.totalWordsFound)],
    ["Hints used", String(stats.hintsUsed)],
  ];
  return (
    <ModalShell open={open} onClose={onClose} labelledBy="stats-title">
      <div className="flex items-start justify-between gap-4">
        <h2 id="stats-title" className="font-display text-2xl font-bold text-slate-900">Your statistics</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close statistics"
          className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-slate-200 bg-white text-lg font-bold text-slate-700 hover:bg-slate-50"
        >
          ×
        </button>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        Stored only in this browser. Nothing is sent anywhere, and no account is needed.
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
            <dd className="mt-1 font-display text-2xl font-bold text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
      {stats.gamesPlayed === 0 && (
        <p className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm leading-relaxed text-slate-700">
          No puzzles played yet. Your first solve will start your streak.
        </p>
      )}
      <button
        type="button"
        onClick={onClose}
        className="mt-5 min-h-12 w-full cursor-pointer rounded-full bg-emerald-600 px-5 text-[15px] font-bold text-white transition hover:bg-emerald-700"
      >
        Back to the puzzle
      </button>
    </ModalShell>
  );
}
