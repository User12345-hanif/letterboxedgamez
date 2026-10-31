import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Letter Boxed vs Strands",
  description:
    "Letter Boxed vs Strands: chaining words to cover twelve letters versus hunting theme words and a spangram in a letter grid — rules, skills and which game to play.",
  alternates: { canonical: canonical("/letter-boxed-vs-strands") },
  openGraph: {
    title: "Letter Boxed vs Strands",
    description: "Two word games, two searches: a chain versus a themed grid.",
    url: canonical("/letter-boxed-vs-strands"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Letter Boxed vs Strands",
    description: "Two word games, two searches: a chain versus a themed grid.",
  },
};

export default function LetterBoxedVsStrandsPage() {
  return (
    <ArticleClient
      kicker="Comparison"
      title="Letter Boxed vs Strands"
      intro="Both games hide words in letters and reward finding them, but they hide them in opposite ways. Strands hides theme words in a grid for you to discover; Letter Box shows you every letter and asks you to build the words yourself. This page compares them honestly, without claiming any affiliation."
    >
      <h2>How Strands works</h2>
      <p>
        Strands presents a grid of letters with a theme. Your job is to find the theme words hidden
        in the grid, connected in any direction, plus one special word — the spangram — that spans
        the board and describes the theme. Words that are not theme words can earn hints: find
        enough of them and you can reveal a theme word&apos;s letters. The puzzle is therefore a
        search with a theme as your clue: you are looking for words you cannot see, guided by what
        the theme suggests.
      </p>
      <h2>How Letter Box works</h2>
      <p>
        Letter Box Game gives you twelve letters, three on each of four sides, and asks you to build
        a chain of words that uses every letter at least once. Words need at least three letters, no
        two consecutive letters may come from the same side, no letter may repeat inside one word,
        and each new word must start with the last letter of the previous one. There is no theme,
        no grid to search, and no hidden word to find — every letter is visible from the start,
        and the puzzle is the order in which you use them. Our version is original and independent,
        with its own seven boards in rotation, and is not affiliated with the New York Times.
      </p>
      <h2>The core difference</h2>
      <ul>
        <li>Strands is a search: the words exist in the grid, and you hunt them. Letter Box is a construction: the words do not exist until you build them, in chain order.</li>
        <li>Strands gives you a theme as a clue. Letter Box gives you no theme — only letters, sides and rules.</li>
        <li>Strands has a spangram: one long word that ties the theme together. Letter Box has par: a benchmark word count (two words on every live board here), not a single special word.</li>
        <li>Strands rewards finding non-theme words to earn hints. Letter Box rewards planning: a first word that gathers letters and ends in a useful letter, and a bridge word that finishes the board.</li>
      </ul>
      <h2>Which skill each game builds</h2>
      <p>
        Strands builds thematic and visual thinking: what words fit this theme, and where could they
        hide in a grid? Letter Box builds sequential and spatial thinking: which side can I use
        next, what letter must the next word start with, and which letters are still unused? A
        strong Strands player scans well; a strong Letter Box player plans well.
      </p>
      <h2>Which to play</h2>
      <p>
        If you enjoy hunting for hidden words with a theme as your guide, Strands is the more
        exploratory game. If you enjoy building a clean chain from visible letters, Letter Box is
        the more satisfying construction. Many players enjoy both for different reasons — a grid
        search first, then a chain build. If you want to try Letter Box now, <a href="/">today&apos;s puzzle is free</a>, and <a href="/unlimited">unlimited practice boards</a> are
        available without an account. For other games like these, see <a href="/games-like-letter-boxed">games like Letter Boxed</a>.
      </p>
    </ArticleClient>
  );
}
