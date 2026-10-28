import type { Metadata } from "next";
import Link from "next/link";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hints",
  description:
    "How hints work in Letterboxed Gamez, how to use them without spoiling the puzzle, and gentle, spoiler-free ways to get unstuck.",
  alternates: { canonical: canonical("/hints") },
  openGraph: {
    title: "Hints",
    description: "Three hints per puzzle, in two stages — plus spoiler-free ways to think your way out of a dead end.",
    url: canonical("/hints"),
  },
};

export default function HintsPage() {
  return (
    <ArticleClient
      kicker="Hints"
      title="Hints, without spoilers"
      intro="Hints in Letterboxed Gamez are designed to nudge, not to answer for you. Here is how they work, and what to try before you use one."
    >
      <h2>How the in-game hint works</h2>
      <ol>
        <li>
          <strong>You have three hints per puzzle.</strong> The counter is shown on the Hint
          button, and hints are counted in your statistics — nothing else about your solve changes.
        </li>
        <li>
          <strong>The first tap is a nudge.</strong> It tells you the starting letter and length
          of a word that would work from where you are, and highlights that letter on the board.
          It also guarantees the word uses at least one letter you still need.
        </li>
        <li>
          <strong>The second tap reveals the word.</strong> Tap Hint again for the same suggestion
          and the full word is shown. It is only one option — a word you find yourself is always
          just as valid.
        </li>
        <li>
          <strong>Hints respect the chain.</strong> If you have already submitted a word, a hint
          starts with the letter your next word must start with. If you are halfway through a
          word, it looks for a completion of that word first.
        </li>
      </ol>
      <p>
        Hints are computed live from the curated word list and the rules of the board. They are
        never a stored answer key, and they never reveal the puzzle&apos;s verified solution
        unless that solution happens to be the best hint for your position.
      </p>

      <h2>Before you use a hint, try these</h2>
      <ul>
        <li>
          <strong>Read the remaining letters aloud.</strong> Saying them often surfaces a word
          that scanning silently misses. The game lists the remaining letters under the progress
          bar, in plain text.
        </li>
        <li>
          <strong>List words that start with the required letter.</strong> If your next word must
          start with “S”, write down — mentally or on paper — every S-word you can make from the
          board. One of them will usually reach the letters you need.
        </li>
        <li>
          <strong>Swap the order.</strong> If a word almost works but two letters share a side,
          try a synonym, a different tense, or the same letters in a different order. The board
          rewards flexibility more than vocabulary size.
        </li>
        <li>
          <strong>Undo, don&apos;t restart.</strong> Removing the last letter or two often rescues
          a word that went wrong. Your submitted words are safe while you experiment.
        </li>
        <li>
          <strong>Step away.</strong> These puzzles are small enough to hold in the back of your
          mind. A fresh look after a cup of tea solves more boards than staring does.
        </li>
      </ul>

      <h2>If you are truly stuck</h2>
      <p>
        Use the hint, then study the word it suggests: which sides did it visit, and which letters
        did it leave behind? That pattern is the lesson the board was teaching. And if a puzzle
        still will not yield, a practice puzzle with fresh letters is a good reset — the daily
        board will be there when you come back to it.
      </p>
      <p>
        For the bigger picture, read <Link href="/strategies">Strategies that actually help</Link>,
        or revisit the <Link href="/how-to-play">full rules</Link> to check a rule you may be
        misremembering.
      </p>
    </ArticleClient>
  );
}
