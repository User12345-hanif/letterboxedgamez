import Link from "next/link";
import { SITE } from "@/lib/site";
import { Sprinkles } from "./Decorations";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-parchment/60">
      <Sprinkles tone="ink" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold text-ink">
              Letter Box <span className="text-forest">Game</span>
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-moss">
              A calm, clear daily word puzzle. Twelve letters, four sides,
              and a fresh board every day — free to play, with no account needed.
            </p>
          </div>
          <nav aria-label="Learn">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-pine">Learn</p>
            <ul className="mt-3 space-y-2 text-sm">
              {SITE.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-pine underline-offset-4 hover:text-forest hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="About this site">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-pine">About this site</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-pine underline-offset-4 hover:text-forest hover:underline">
                  About Letter Box Game
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-pine underline-offset-4 hover:text-forest hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-pine underline-offset-4 hover:text-forest hover:underline">
                  Terms
                </Link>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="text-pine underline-offset-4 hover:text-forest hover:underline">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <p className="mt-10 border-t border-line pt-5 text-xs leading-relaxed text-moss">
          © {new Date().getFullYear()} {SITE.name}. Play is free and your progress
          stays in your own browser. Words are checked against a curated list of
          common words; a word missing from that list is not a judgement on the word itself.
        </p>
      </div>
    </footer>
  );
}
