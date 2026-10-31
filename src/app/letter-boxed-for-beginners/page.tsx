import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Letter Boxed for Beginners",
  description: "A gentle first game of Letter Box: the rules in plain language, worked through on Puzzle 1, CAPTURE → ENJOYS.",
  alternates: { canonical: canonical("/letter-boxed-for-beginners") },
  openGraph: {
    title: "Letter Boxed for Beginners",
    description: "A gentle first game of Letter Box: the rules in plain language, worked through on Puzzle 1, CAPTURE → ENJOYS.",
    url: canonical("/letter-boxed-for-beginners"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Letter Boxed for Beginners",
    description: "A gentle first game of Letter Box: the rules in plain language, worked through on Puzzle 1, CAPTURE → ENJOYS.",
  },
};

export default function GuidePage() {
  return (
    <ArticleClient kicker="Guide" title="Letter Boxed for Beginners" intro="If you have never played a letter-box puzzle, start here. You need no vocabulary tricks — just twelve letters, four sides, and one goal: use every letter.">

      <h2>The goal in one sentence</h2>
      <p>Build a chain of words that uses all twelve letters on the board at least once. That is it. There is no time limit, no penalty for extra words, and no account to create.</p>
      <h2>A worked first game: Puzzle 1</h2>
      <p>The board is Top C, U, J; Right A, R, O; Bottom P, E, Y; Left T, N, S. Start with CAPTURE: C (Top), A (Right), P (Bottom), T (Left), U (Top), R (Right), E (Bottom). Notice the sides change every single letter, and no letter repeats inside the word. CAPTURE ends in E, so the next word must start with E. ENJOYS does: E (Bottom), N (Left), J (Top), O (Right), Y (Bottom), S (Left). Together, CAPTURE and ENJOYS use all twelve letters. Puzzle solved, in two words — par.</p>
      <h2>Your first three habits</h2>
      <ol>
        <li>Check the side rule as you pick: never pick two letters in a row from the same side.</li>
        <li>Check the chain rule before the second word: it must start with the last letter of the first.</li>
        <li>Watch the unused letters, not the word count. A solve is finished when no letters remain unused, however many words it took.</li>
      </ol>
      <p>Ready to try? <a href="/">Play today's puzzle</a>, or practise without pressure on <a href="/unlimited">unlimited boards</a>. If you get stuck, the <a href="/hints">hints page</a> explains how hints work without spoiling anything. For the complete rules, see <a href="/how-to-play">How to Play</a>.</p>
    </ArticleClient>
  );
}
