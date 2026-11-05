import Link from "next/link";
import { SITE } from "@/lib/site";

interface HeaderProps {
  onHowToPlay: () => void;
  onStatistics: () => void;
  solvedCount?: number;
}

/** Original text-based logo — no copied branding or graphics. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-baseline gap-2">
      <Link
        href="/"
        className="group inline-flex min-h-11 items-baseline gap-2 rounded-lg px-1 text-white no-underline"
        aria-label="L Letter Box Game — home"
      >
        <span
          aria-hidden="true"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-600 font-display text-[17px] font-bold leading-none text-white"
        >
          L
        </span>
        <span className="font-display text-[22px] font-bold leading-none tracking-tight text-white sm:text-[26px]">
          {" "}Letter Box
          <span className="text-emerald-400"> Game</span>
        </span>
      </Link>
      {!compact && (
        <span
          aria-hidden="true"
          className="hidden font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:inline"
        >
          Daily word puzzle
        </span>
      )}
    </span>
  );
}

export function Header({ onHowToPlay, onStatistics, solvedCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link
            href="/how-to-play"
            className="hidden min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white sm:inline-flex"
          >
            How to Play
          </Link>
          <button
            type="button"
            onClick={onHowToPlay}
            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-600 bg-transparent px-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98] sm:px-4"
          >
            <span aria-hidden="true">?</span> How to Play
          </button>
          <button
            type="button"
            onClick={onStatistics}
            aria-label={`Statistics${solvedCount ? `, ${solvedCount} puzzles solved` : ""}`}
            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98] sm:px-4"
          >
            <span aria-hidden="true">▦</span> Statistics
          </button>
        </nav>
      </div>
      <nav aria-label="Sections" className="border-t border-slate-800">
        <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-1.5 text-sm font-medium text-slate-300">
          {SITE.nav.slice(1).map((item) => (
            <li key={item.href} className="shrink-0">
              <Link href={item.href} className="inline-block rounded-lg px-3 py-1.5 hover:bg-slate-800 hover:text-white">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
