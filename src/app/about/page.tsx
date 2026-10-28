import type { Metadata } from "next";
import Link from "next/link";
import { ArticleClient } from "@/components/ArticleClient";
import { SITE, canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Letterboxed Gamez: an independent, original daily word puzzle built to be clear, calm and accessible — no account, no tracking.",
  alternates: { canonical: canonical("/about") },
  openGraph: {
    title: "About",
    description: "An original daily word puzzle, built to be read at a glance and played in minutes.",
    url: canonical("/about"),
  },
};

export default function AboutPage() {
  return (
    <ArticleClient
      kicker="About"
      title="About Letterboxed Gamez"
      intro="Letterboxed Gamez is an independent daily word puzzle. It was built from scratch — original design, original code, original puzzles — with one idea at its centre: the board should be the clearest thing on the page."
    >
      <h2>Why another word game?</h2>
      <p>
        Letter-box puzzles are lovely: twelve letters, a handful of rules, and a finish that feels
        like a small piece of carpentry clicking into place. But many versions of the game bury
        that pleasure under cramped tiles, identical sides and cryptic feedback. We wanted a
        version that a first-time player could understand in a minute, that a returning player
        could finish in three, and that anyone could read without squinting.
      </p>
      <p>
        So the board is large and centred. Each side is named, shaped and patterned, not just
        coloured. Your current word is drawn as a path. Your progress — which letters are used,
        which remain, what your next word must start with — is always written out in words. The
        rest of the page stays quiet and lets the puzzle do the talking.
      </p>

      <h2>How puzzles are made</h2>
      <p>
        Puzzles are kept as data, separate from the interface. Each one has twelve distinct
        letters, three per side, and a stored solution. Before a puzzle is published, a
        verification script checks that solution against the game&apos;s rules and the curated
        word list: every word in the dictionary, no two consecutive letters from the same side,
        correct chaining, and all twelve letters covered. A puzzle that fails any of those checks
        does not ship.
      </p>
      <p>
        The word list itself is curated and deliberately modest — common English words, listed in
        the open in the project&apos;s dictionary file. It is not a complete dictionary, and we do
        not pretend otherwise. When a real word is missing, the game says the list does not contain
        it yet, and the list grows by adding verified common words.
      </p>

      <h2>Privacy, plainly</h2>
      <p>
        There are no accounts, no analytics trackers and no advertising profiles. Your
        statistics and in-progress puzzles are stored in your own browser, and only there. The
        full details are in the <Link href="/privacy-policy">Privacy Policy</Link>, which is short
        because there is very little to say.
      </p>

      <h2>Contact</h2>
      <p>
        Questions, corrections, accessibility problems, or a word you think the list should
        include? Write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We read every message,
        and accessibility reports are treated as the highest priority.
      </p>
      <p>
        Letterboxed Gamez is an original game and site. It is not affiliated with, endorsed by, or
        copied from any other word game or publisher.
      </p>
    </ArticleClient>
  );
}
