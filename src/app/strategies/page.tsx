import type { Metadata } from "next";
import Link from "next/link";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Strategies",
  description:
    "Strategies for solving Letter Box Game in fewer words: awkward letters first, plan backwards, save flexible letters for the link.",
  alternates: { canonical: canonical("/strategies") },
  openGraph: {
    title: "Strategies",
    description: "How to plan a two-word solve without guessing: awkward letters first, flexible links, and reading the board by sides.",
    url: canonical("/strategies"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Strategies",
    description: "How to plan a two-word solve without guessing: awkward letters first, flexible links, and reading the board by sides.",
  },
};

export default function StrategiesPage() {
  return (
    <ArticleClient
      kicker="Strategies"
      title="Strategies that actually help"
      intro="No tricks, no spoilers for today's board — just the habits that turn a five-word ramble into a tidy two-word solve."
    >
      <h2>1. Start with the awkward letters</h2>
      <p>
        Every board has one or two letters that feel hard to place: a <strong>J</strong>, a{" "}
        <strong>Q</strong>-less <strong>Z</strong>, a vowel sitting alone on a side. Those letters
        are the puzzle. Plan your first word around them, because a word that leaves the awkward
        letters for last usually cannot reach them at all — the chain will have moved on.
      </p>
      <p>
        Before you tap anything, scan the four sides and ask: <em>which letter would I hate to be
        left with?</em> Build toward it early.
      </p>

      <h2>2. Think in sides, not just letters</h2>
      <p>
        The side rule is the real constraint. A promising word can collapse because two of its
        letters sit on the same side. Read the board as four groups of three, and rehearse a word
        side by side: <em>Top, Right, Top, Bottom, Left…</em> If two in a row repeat a side, the
        word needs a different spelling or a different word entirely.
      </p>
      <p>
        It helps to notice which sides are vowel-heavy and which are consonant-heavy. Words
        naturally alternate between them — lean into that rhythm instead of fighting it.
      </p>

      <h2>3. Plan backwards from the link</h2>
      <p>
        In a two-word solve, the link letter — the last letter of word one and the first letter
        of word two — does double duty. Choose it deliberately. A flexible link letter such as{" "}
        <strong>S</strong>, <strong>T</strong>, <strong>E</strong> or <strong>R</strong> can start
        many second words; a rare letter as a link narrows your options sharply.
      </p>
      <p>
        A useful exercise: pick a candidate second word first, note its first letter, then look
        for a first word that ends there and covers the remaining letters.
      </p>

      <h2>4. Use long words, but not at any cost</h2>
      <p>
        Longer words cover more letters, which is why two-word solves exist. But a long word that
        repeats letters you have already covered wastes its length. Count <em>new</em> letters, not
        total letters. The game shows you how many new letters each submitted word added — use
        that number to judge whether a word earned its place.
      </p>

      <h2>5. Keep a spare letter in reserve</h2>
      <p>
        When you have two or three letters left, you need a word that starts with the required
        link letter and reaches them without breaking the side rule. Before submitting a word,
        glance at the remaining letters and check that at least one plausible next word exists.
        If not, a different spelling of the current word — or a different word altogether — will
        usually fix it.
      </p>

      <h2>6. Use hints as planning tools, not answers</h2>
      <p>
        A hint&apos;s first tap tells you a starting letter and a length. That is often enough to
        find the word yourself, which is more satisfying and teaches you the board. Save the
        second tap — the full reveal — for when you are genuinely stuck, and treat the revealed
        word as a lesson in how that board fits together. See also the{" "}
        <Link href="/hints">hints guide</Link>.
      </p>

      <h2>7. Practise the pattern, not the puzzle</h2>
      <p>
        Practice puzzles use the same rules with different letters, so the skill transfers. Play
        one practice board a day with a specific focus — <em>today, awkward letters first</em> — and
        the daily puzzle will start to feel familiar even when its letters are new.
      </p>

      <h2>A note on “perfect” solves</h2>
      <p>
        A two-word solve is excellent. A three- or four-word solve that follows the rules is a
        complete solve, and it counts exactly the same in your statistics. Chasing the shortest
        possible chain is fun; it is not the point. The point is the quiet moment when the last
        letter lights up.
      </p>
    </ArticleClient>
  );
}
