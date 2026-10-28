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
        className="group inline-flex min-h-11 items-baseline gap-2 rounded-lg px-1 text-ink no-underline"
        aria-label="L Letterboxed Gamez — home"
      >
        <span
          aria-hidden="true"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border-2 border-gold-deep bg-gradient-to-br from-gold-bright to-gold font-display text-[17px] font-bold leading-none text-ink shadow-tile"
        >
          L
        </span>
        <span className="font-display text-[22px] font-bold leading-none tracking-tight text-ink sm:text-[26px]">
          {" "}Letterboxed
          <span className="text-forest"> Gamez</span>
        </span>
      </Link>
      {!compact && (
        <span
          aria-hidden="true"
          className="hidden font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-moss md:inline"
        >
          Daily word puzzle
        </span>
      )}
    </span>
  );
}

export function Header({ onHowToPlay, onStatistics, solvedCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-b-gold/60 bg-ivory/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link
            href="/how-to-play"
            className="hidden min-h-11 items-center rounded-full px-3 text-sm font-semibold text-pine hover:bg-sage-light hover:text-forest-dark sm:inline-flex"
          >
            How to Play
          </Link>
          <button
            type="button"
            onClick={onHowToPlay}
            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border border-line bg-cream px-3.5 text-sm font-semibold text-pine shadow-sm transition hover:border-forest/40 hover:text-forest-dark sm:px-4"
          >
            <span aria-hidden="true">?</span> How to Play
          </button>
          <button
            type="button"
            onClick={onStatistics}
            aria-label={`Statistics${solvedCount ? `, ${solvedCount} puzzles solved` : ""}`}
            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full bg-gradient-to-b from-forest-light to-forest px-3.5 text-sm font-semibold text-white shadow-sm transition hover:from-forest hover:to-forest-dark sm:px-4"
          >
            <span aria-hidden="true">▦</span> Statistics
          </button>
        </nav>
      </div>
      <nav aria-label="Sections" className="border-t border-line/70 md:hidden">
        <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-1.5 text-sm font-medium text-pine">
          {SITE.nav.slice(1).map((item) => (
            <li key={item.href} className="shrink-0">
              <Link href={item.href} className="inline-block rounded-full px-3 py-1.5 hover:bg-sage-light">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
