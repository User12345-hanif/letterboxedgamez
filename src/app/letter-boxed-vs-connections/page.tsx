import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Letter Boxed vs Connections",
  description:
    "Letter Boxed vs Connections: chaining words to cover a board versus sorting sixteen words into four hidden groups — rules, skills, mistakes and which game to play.",
  alternates: { canonical: canonical("/letter-boxed-vs-connections") },
  openGraph: {
    title: "Letter Boxed vs Connections",
    description: "Two NYT word games, two different skills: construction versus categorisation.",
    url: canonical("/letter-boxed-vs-connections"),
  },
};

export default function LetterBoxedVsConnectionsPage() {
  return (
    <ArticleClient
      kicker="Comparison"
      title="Letter Boxed vs Connections"
      intro="Both are daily word games from the same publisher, and both give you a fixed set of words or letters. One asks you to build a chain that uses everything; the other asks you to sort everything into hidden groups. This page compares them honestly, without claiming any affiliation."
    >
      <h2>How Connections works</h2>
      <p>
        Connections presents sixteen words and asks you to sort them into four groups of four, where
        each group shares a hidden category. You select four words, submit them as a group, and the
        game tells you whether the group is correct. You have a limited number of mistakes — four —
        before the game ends, and the categories range from straightforward (types of fruit) to
        deliberately tricky (words that follow another word, or words with a shared second meaning).
        There is no letter board, no chain, and no word-building: the words are already given, and
        the puzzle is what they have in common.
      </p>
      <h2>How Letter Box works</h2>
      <p>
        Letter Box Game gives you twelve letters, three on each of four sides, and asks you to build
        a chain of words that uses every letter at least once. Words need at least three letters, no
        two consecutive letters may come from the same side, no letter may repeat inside one word,
        and each new word must start with the last letter of the previous one. There is no mistake
        limit and no time limit — a rejected word simply tells you why, and you try again. Our
        version is original and independent, with its own seven boards in rotation, and is not
        affiliated with the New York Times.
      </p>
      <h2>The core difference</h2>
      <ul>
        <li>Connections tests categorisation: what do these words mean together? Letter Box tests construction: what words can I build from these letters, in this order?</li>
        <li>Connections hides its answer in the grouping. Letter Box shows you every letter up front; the answer is the chain you build, and more than one chain can solve a board.</li>
        <li>Connections punishes mistakes: four wrong groups end the game. Letter Box has no mistake limit — extra words cost you par and stars, not the puzzle itself.</li>
        <li>Connections groups are fixed: there is one correct grouping per puzzle. Letter Box boards here have at least one checked solution, and often more — Puzzle 5 finishes with NATURE or NEUTRAL.</li>
      </ul>
      <h2>Which skill each game builds</h2>
      <p>
        Connections builds associative thinking: synonyms, categories, wordplay and second meanings.
        Letter Box builds sequential thinking: planning a first word that leaves a bridge, and a
        bridge that covers what remains. Players who are good at one are not automatically good at
        the other, which is why the two games feel so different despite both being &quot;word games&quot;.
      </p>
      <h2>Which to play</h2>
      <p>
        If you enjoy the moment a hidden group clicks into place, Connections is the tighter puzzle.
        If you enjoy building something visible from visible pieces, Letter Box is the more creative
        one. Many players play both in the same sitting: Connections first, for the grouping hit,
        then Letter Box, for the chain. If you want to try Letter Box now, <a href="/">today&apos;s puzzle is free</a>, and <a href="/unlimited">unlimited practice boards</a> are available
        without an account. For other games like these, see <a href="/games-like-letter-boxed">games like Letter Boxed</a>.
      </p>
    </ArticleClient>
  );
}
