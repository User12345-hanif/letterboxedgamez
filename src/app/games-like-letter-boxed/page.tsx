import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Games Like Letter Boxed",
  description:
    "Games like Letter Boxed, compared honestly: Spelling Bee, Wordle, Connections, Strands, Edgewords and Wordscapes — what each one tests, and how it differs from Letter Box Game.",
  alternates: { canonical: canonical("/games-like-letter-boxed") },
  openGraph: {
    title: "Games Like Letter Boxed",
    description: "Six word games like Letter Boxed, compared by skill, rules and feel — with links back to free Letter Box puzzles.",
    url: canonical("/games-like-letter-boxed"),
  },
};

export default function GamesLikeLetterBoxedPage() {
  return (
    <ArticleClient
      kicker="Related games"
      title="Games like Letter Boxed"
      intro="If you like Letter Box, you like building words under constraints. These six games scratch the same itch in different ways — and every one of them leads back to a free Letter Box board here, because that is the game this site is about."
    >
      <h2>Start here: Letter Box Game itself</h2>
      <p>
        Letter Box Game gives you twelve letters, three on each of four sides, and one goal: use every
        letter in a chain of words, changing sides every letter and chaining each new word from the
        last letter of the previous one. It is free, it needs no account, and it has <a href="/unlimited">unlimited practice boards</a> as well as a daily puzzle. Everything below is a comparison to
        that game — not a replacement for it, and not a list of daily answers for other publishers&apos; games.
      </p>
      <h2>Spelling Bee</h2>
      <p>
        Spelling Bee gives you seven letters, one required centre letter, and asks for as many words as
        you can find. Like Letter Box, it rewards finding words from a small fixed set. Unlike Letter
        Box, letters can repeat, there is no chain, and there is no board to cover — quantity beats
        construction. Full comparison: <a href="/letter-boxed-vs-spelling-bee">Letter Boxed vs Spelling Bee</a>.
      </p>
      <h2>Wordle</h2>
      <p>
        Wordle gives you a hidden five-letter word and six guesses, with colour feedback on each guess.
        It is a guessing game, not a construction game: you learn from each guess, and there is exactly
        one answer. Letter Box shows you all twelve letters up front and accepts any chain that covers
        them. Full comparison: <a href="/letter-boxed-vs-wordle">Letter Boxed vs Wordle</a>.
      </p>
      <h2>Connections</h2>
      <p>
        Connections gives you sixteen words and asks you to sort them into four groups of four that
        share a hidden category, with a limited number of mistakes. It tests categorisation and
        spotting a theme, not word-building. If you enjoy the &quot;aha&quot; of a group clicking into place,
        you will enjoy it — and it pairs well with Letter Box, because one tests what words mean
        together and the other tests how words are built. Full comparison: <a href="/letter-boxed-vs-connections">Letter Boxed vs Connections</a>.
      </p>
      <h2>Strands</h2>
      <p>
        Strands is a word search with a theme: find theme words hidden in a letter grid, plus one
        spangram that spans the board. It tests theme discovery and visual scanning. Letter Box has
        no theme and no grid to search — its puzzle is the chain itself, and every letter is visible
        on the board from the start. Full comparison: <a href="/letter-boxed-vs-strands">Letter Boxed vs Strands</a>.
      </p>
      <h2>Edgewords and LetterBorder</h2>
      <p>
        Edgewords and LetterBorder are the closest alternatives in mechanics to Letter Boxed: chaining
        words across edges and shapes, often with free unlimited play. They are worth trying if you
        want more chaining practice after finishing the daily board here — and they are a reminder
        that the chaining idea is bigger than any single publisher&apos;s version. Our version remains
        independent and original, and is not affiliated with any of these games.
      </p>
      <h2>Wordscapes</h2>
      <p>
        Wordscapes mixes a crossword grid with connecting letters from a small set to fill it. It
        rewards letter placement and word-finding, like Letter Box, but the grid does the chaining
        for you: you fill crossings, you do not build a chain from scratch. If you like the relaxed,
        fill-in feel, it is a good second game after a Letter Box solve.
      </p>
      <h2>How to choose</h2>
      <ul>
        <li>Want to build a chain from visible letters? Play Letter Box.</li>
        <li>Want to find as many words as possible from seven letters? Try Spelling Bee.</li>
        <li>Want to guess a hidden word with feedback? Try Wordle.</li>
        <li>Want to sort words into hidden groups? Try Connections.</li>
        <li>Want to hunt theme words in a grid? Try Strands.</li>
        <li>Want more chaining, free and unlimited? Try Edgewords or LetterBorder, then come back for <a href="/unlimited">unlimited Letter Box practice</a>.</li>
      </ul>
      <p>
        This site does not publish daily answers for other publishers&apos; games. If you are looking for
        today&apos;s answer to another game, that game&apos;s own publisher is the right place — here you will
        find our own boards, our own hints, and our own <a href="/solver">solver</a>, all built around Letter Box.
      </p>
    </ArticleClient>
  );
}
