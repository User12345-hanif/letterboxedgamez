import type { Metadata } from "next";
import Link from "next/link";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "How to Play",
  description:
    "The rules of Letter Box Game in two minutes: build words, change sides every letter, chain words, and use all twelve letters.",
  alternates: { canonical: canonical("/how-to-play") },
  openGraph: {
    title: "How to Play",
    description: "The full rules, with examples, keyboard controls and what every message means.",
    url: canonical("/how-to-play"),
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Play",
    description: "The full rules, with examples, keyboard controls and what every message means.",
  },
};

export default function HowToPlayPage() {
  return (
    <ArticleClient
      kicker="How to Play"
      title="How to play Letter Box Game"
      intro="Twelve letters, four sides, and one goal: use every letter. Here are the complete rules, exactly as the game enforces them."
    >
      <h2>The goal</h2>
      <p>
        Use <strong>all twelve letters</strong> on the board at least once, by building a chain of
        words. A puzzle is solved the moment the last unused letter appears in one of your words.
        There is no time limit and no penalty for extra words — but fewer words makes a neater solve,
        and two words is the benchmark to aim for.
      </p>

      <h2>The four rules</h2>
      <ol>
        <li>
          <strong>Words need at least three letters.</strong> Shorter fragments cannot be submitted.
          Each letter may be used at most once within a single word, so the path on the board is
          always easy to follow.
        </li>
        <li>
          <strong>Two letters in a row must come from different sides.</strong> The board has a Top,
          Right, Bottom and Left side, each with three letters. You may return to a side later in
          the same word — just never twice in a row. Sides are labelled by name, shape and pattern
          (Top ●, Right ◆, Bottom ▲, Left ■), never by colour alone.
        </li>
        <li>
          <strong>Chain your words.</strong> The first word may start with any letter. Every word
          after it must start with the last letter of the previous word. If your last word ended
          in “E”, your next word begins with “E”.
        </li>
        <li>
          <strong>Words must be in the curated word list.</strong> Letter Box Game checks words
          against a curated list of common English words. If a word is not recognised, the game
          says so plainly. That is a limit of the list, not a judgement on the word — and the
          list is expanded over time.
        </li>
      </ol>

      <h2>An example</h2>
      <p>
        Suppose the board contains the letters of <strong>CAPTURE</strong> and{" "}
        <strong>ENJOYS</strong>. You might play <strong>CAPTURE</strong> first — checking as you go
        that no two consecutive letters share a side — and then <strong>ENJOYS</strong>, which
        starts with the “E” that CAPTURE ends with. Between them, the two words use all twelve
        letters, so the puzzle is solved in two words.
      </p>
      <p>
        Your own solve does not need to match anyone else&apos;s. Any chain that follows the rules
        and covers all twelve letters counts.
      </p>

      <h2>Controls</h2>
      <ul>
        <li><strong>Tap a tile</strong> or <strong>type a letter</strong> on your keyboard to add it to the current word.</li>
        <li><strong>Enter</strong> submits the current word. <strong>Backspace</strong> removes the last letter. <strong>Esc</strong> clears the current word.</li>
        <li><strong>Undo</strong> removes one letter; <strong>Clear</strong> removes the whole current word. Neither affects words you have already submitted.</li>
        <li><strong>Hint</strong> suggests a word that uses a letter you still need. The first tap gives you its starting letter and length; a second tap reveals it. You have three hints per puzzle.</li>
        <li><strong>New Game</strong> starts a practice puzzle with a fresh board. It never overwrites your daily puzzle, which you can return to at any time.</li>
      </ul>

      <h2>What the messages mean</h2>
      <ul>
        <li><strong>“Words need at least 3 letters.”</strong> Add at least one more letter before submitting.</li>
        <li><strong>“Two letters in a row cannot come from the same side.”</strong> Your last two picks shared a side. Undo one letter and pick from a different side.</li>
        <li><strong>“Your next word must start with …”</strong> Chaining rule: begin with the required letter, shown on screen.</li>
        <li><strong>“That word is not in our curated word list yet.”</strong> Try a more common word with the same letters, if one exists.</li>
        <li><strong>“You have already used that word.”</strong> Each word counts once per puzzle.</li>
      </ul>

      <h2>Accessibility notes</h2>
      <p>
        Every tile is a real button, reachable by keyboard and labelled with its letter and side.
        Focus is always visible. The game honours your system&apos;s reduced-motion setting, and
        all essential information — which letters remain, how far you have progressed, what the
        next word must start with — is available as text, not only as colour or position. If
        anything about the board is hard to use, please{" "}
        <Link href="/about">tell us</Link> — accessibility is part of the design, not an extra.
      </p>
    </ArticleClient>
  );
}
