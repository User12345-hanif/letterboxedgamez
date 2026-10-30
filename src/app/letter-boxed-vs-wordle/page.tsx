import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Letter Boxed vs Wordle",
  description: "Letter Box and Wordle are both word games, but they test different skills: chaining and coverage versus guessing a hidden word.",
  alternates: { canonical: canonical("/letter-boxed-vs-wordle") },
  openGraph: {
    title: "Letter Boxed vs Wordle",
    description: "Letter Box and Wordle are both word games, but they test different skills: chaining and coverage versus guessing a hidden word.",
    url: canonical("/letter-boxed-vs-wordle"),
  },
};

export default function GuidePage() {
  return (
    <ArticleClient kicker="Comparison" title="Letter Boxed vs Wordle" intro="Both games use letters and common English words, and both are free daily puzzles. That is where the similarity ends. This page compares the two honestly, without claiming any affiliation with either original publisher.">

      <h2>The core difference</h2>
      <p>Wordle gives you a hidden five-letter word and six guesses, with colour feedback on each guess. Letter Box Game gives you all twelve letters up front and asks you to use every one of them in a chain of words. One is a guessing game with feedback; the other is a construction game with a visible board.</p>
      <h2>What each game rewards</h2>
      <ul>
        <li>Wordle rewards a good first guess and careful elimination. You learn from each guess.</li>
        <li>Letter Box rewards planning: a first word that gathers letters, ends in a useful letter, and leaves a bridge that can finish the board.</li>
        <li>Wordle has one answer per day. Letter Box boards here have at least one checked solution, and often more — Puzzle 5 finishes with NATURE or NEUTRAL.</li>
      </ul>
      <h2>Which to play</h2>
      <p>If you like narrowing down a hidden answer, Wordle is the tighter puzzle. If you like building something from visible pieces, Letter Box is the more creative one. Many players enjoy both, for different reasons, and there is no reason to choose only one. Our version of Letter Box is original and independent — it is not Wordle, and it is not affiliated with the New York Times.</p>
    </ArticleClient>
  );
}
