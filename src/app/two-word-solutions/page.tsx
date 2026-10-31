import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Two-Word Letter Box Solutions",
  description: "How two-word solves work in Letter Box Game, with all seven live puzzles as worked examples.",
  alternates: { canonical: canonical("/two-word-solutions") },
  openGraph: {
    title: "Two-Word Letter Box Solutions",
    description: "How two-word solves work in Letter Box Game, with all seven live puzzles as worked examples.",
    url: canonical("/two-word-solutions"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Two-Word Letter Box Solutions",
    description: "How two-word solves work in Letter Box Game, with all seven live puzzles as worked examples.",
  },
};

export default function GuidePage() {
  return (
    <ArticleClient kicker="Strategy" title="Two-Word Letter Box Solutions" intro="Every puzzle in the live rotation is solved in two words. That is not a coincidence: the boards were built so a strong first word gathers most of the letters and a second word, starting with the first word's final letter, mops up the rest.">

      <h2>The pattern</h2>
      <p>Take Puzzle 1: CAPTURE, then ENJOYS. CAPTURE uses C, A, P, T, U, R, E. ENJOYS starts with E, the last letter of CAPTURE, and adds N, J, O, Y, S. Together they cover all twelve letters, and neither word breaks the side rule or repeats a letter.</p>
      <h2>All seven live two-word solves</h2>
      <ul>
        <li>Puzzle 1: CAPTURE → ENJOYS</li>
        <li>Puzzle 2: GARDENS → SWITCH</li>
        <li>Puzzle 3: JOURNEY → YACHTS</li>
        <li>Puzzle 4: FATHOMS → SLICED</li>
        <li>Puzzle 5: DOLPHIN → NATURE — and DOLPHIN → NEUTRAL also works</li>
        <li>Puzzle 6: CRYSTAL → LOUNGE</li>
        <li>Puzzle 7: OVERLAP → PUNCHY</li>
      </ul>
      <h2>How to hunt for one</h2>
      <p>Look for a first word of six or seven letters that uses letters from at least three sides and ends in a letter that starts many common words — E, S, N, Y and L are friendly. Then ask: what words start with that letter and contain the letters you still need? If the second word needs a letter from the same side as the first word's last letter, it cannot start there — pick a different first word. The <a href="/solver">solver</a> shows the shortest chain for any board, so you can study the shape of a two-word solve and then try to find your own. The full opener method — awkward letters first, planning backwards from the link — is set out on the <a href="/strategies">Strategies</a> page.</p>
      <p>Any chain that uses all twelve letters counts, even if it takes three or four words. Two words is the benchmark, not a requirement.</p>
    </ArticleClient>
  );
}
