import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { SITE, canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms for Letter Box Game: free personal play, fair use, and the limits of the curated word list and puzzle verification.",
  alternates: { canonical: canonical("/terms") },
  openGraph: {
    title: "Terms",
    description: "Free personal play, fair use, and honest limits — in plain language.",
    url: canonical("/terms"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms",
    description: "Free personal play, fair use, and honest limits — in plain language.",
  },
};

export default function TermsPage() {
  return (
    <ArticleClient
      kicker="Terms"
      title="Terms of use"
      intro="Plain-language terms for a plain, free game. By playing Letter Box Game you agree to the short list below."
    >
      <p className="text-sm text-moss">Last updated: October 28, 2026.</p>

      <h2>1. The game</h2>
      <p>
        Letter Box Game is a free daily word puzzle provided for personal enjoyment. No account
        is required, and no purchase is necessary to play the daily or practice puzzles. We may
        update the puzzles, the word list, or the site itself at any time.
      </p>

      <h2>2. Fair play</h2>
      <p>
        Play for yourself, and share results honestly. Do not attempt to disrupt the site, probe
        its infrastructure, or misrepresent the game — for example by presenting someone
        else&apos;s solve as your own. Automated bulk play that degrades the service for others
        is not permitted.
      </p>

      <h2>3. Content and ownership</h2>
      <p>
        The site&apos;s design, code, copy and puzzles are original works of Letter Box Game.
        You may play, share links to the site, and share your own solve summaries. You may not
        copy the site&apos;s design or copy wholesale, republish the puzzle data as your own, or
        present the game as affiliated with another publisher.
      </p>

      <h2>4. Honest limits</h2>
      <p>
        Words are checked against a curated list of common words, which is not a complete
        dictionary; a word being absent from the list is not a statement about the word.
        Puzzles are verified solvable by script against that list and the game rules before
        publication. The game is provided “as is”, without warranties of any kind, to the extent
        permitted by law.
      </p>

      <h2>5. Privacy</h2>
      <p>
        Your progress and statistics are stored only in your browser. The{" "}
        <a href="/privacy-policy">Privacy Policy</a> describes this in full and forms part of
        these terms.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </ArticleClient>
  );
}
