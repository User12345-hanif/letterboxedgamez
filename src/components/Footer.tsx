import Link from "next/link";
import { SITE } from "@/lib/site";
import { CookieChoicesButton } from "./CookieChoicesButton";
import { Sprinkles } from "./Decorations";

const linkClassName =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-cream/90 underline-offset-4 transition hover:bg-white/10 hover:text-gold-light hover:underline";

export function Footer() {
  return (
    <footer>
      {/* Wave edge: the storybook closes where the forest begins. */}
      <div aria-hidden="true" className="pointer-events-none w-full overflow-hidden">
        <svg
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
          className="block h-6 w-full sm:h-8"
          focusable="false"
        >
          <path
            d="M0,28 C240,2 480,2 720,20 C960,38 1200,38 1440,6 L1440,40 L0,40 Z"
            fill="#0f3d22"
          />
        </svg>
      </div>
      <div className="relative overflow-hidden bg-gradient-to-b from-forest-deep via-forest-dark to-forest text-cream">
        <Sprinkles tone="light" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-8 sm:px-6">
          <p className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/15 px-4 py-1.5 text-sm font-bold text-gold-light">
              <span aria-hidden="true">✦</span>
              Thanks for playing
              <span aria-hidden="true">✦</span>
            </span>
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="flex items-center gap-2 font-display text-[22px] font-bold text-cream">
                <span
                  aria-hidden="true"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-gold-deep bg-gradient-to-b from-gold-bright to-gold font-display text-lg font-bold text-ink shadow-tile"
                >
                  L
                </span>
                Letter Box <span className="text-gold-light">Game</span>
              </p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/80">
                A calm, clear daily word puzzle. Twelve letters, four sides,
                and a fresh board every day — free to play, with no account needed.
              </p>
            </div>
            <nav aria-label="Game">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-light">Game</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {[
                  { label: "Play today's puzzle", href: "/" },
                  { label: "Unlimited practice", href: "/unlimited" },
                  { label: "Solver", href: "/solver" },
                  { label: "Puzzle archive", href: "/archive" },
                  { label: "Daily puzzles by date", href: "/daily" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClassName}>
                      <span aria-hidden="true" className="text-[10px] leading-none text-gold">
                        ✦
                      </span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Learn">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-light">Learn</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {[
                  { label: "How to Play", href: "/how-to-play" },
                  { label: "Strategies", href: "/strategies" },
                  { label: "Hints", href: "/hints" },
                  { label: "FAQ", href: "/faq" },
                  { label: "Games like Letter Boxed", href: "/games-like-letter-boxed" },
                  { label: "Rare Letters", href: "/rare-letters" },
                  { label: "Common Mistakes", href: "/common-mistakes" },
                  { label: "History", href: "/history" },
                  { label: "Word List", href: "/word-list" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClassName}>
                      <span aria-hidden="true" className="text-[10px] leading-none text-gold">
                        ✦
                      </span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Info">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-light">Info</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                <li>
                  <Link href="/about" className={linkClassName}>
                    <span aria-hidden="true" className="text-[10px] leading-none text-gold">
                      ✦
                    </span>
                    About Letter Box Game
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className={linkClassName}>
                    <span aria-hidden="true" className="text-[10px] leading-none text-gold">
                      ✦
                    </span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className={linkClassName}>
                    <span aria-hidden="true" className="text-[10px] leading-none text-gold">
                      ✦
                    </span>
                    Terms
                  </Link>
                </li>
                <li>
                  <CookieChoicesButton />
                </li>
                <li>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/15 px-3.5 py-1.5 font-semibold text-gold-light transition hover:bg-gold/25"
                  >
                    <span aria-hidden="true">✉</span>
                    {SITE.email}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <p className="mt-10 border-t border-white/15 pt-5 text-xs leading-relaxed text-cream/70">
            © {new Date().getFullYear()} {SITE.name}. Play is free and your progress
            stays in your own browser. Words are checked against a curated list of
            common words; a word missing from that list is not a judgement on the word itself.
          </p>
        </div>
      </div>
    </footer>
  );
}
