import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "The History of Letter Box Puzzles",
  description: "How letter-box puzzles work, how this independent version came to be, and how it differs from the New York Times game.",
  alternates: { canonical: canonical("/history") },
  openGraph: {
    title: "The History of Letter Box Puzzles",
    description: "How letter-box puzzles work, how this independent version came to be, and how it differs from the New York Times game.",
    url: canonical("/history"),
  },
};

export default function GuidePage() {
  return (
    <ArticleClient kicker="Guide" title="The History of Letter Box Puzzles" intro="Letter-box puzzles are a family of word puzzles built around a simple idea: letters arranged around a square, words built by moving from side to side, and a chain that uses every letter. The New York Times version, Letter Boxed, made the format widely known as a daily game.">

      <h2>The format</h2>
      <p>The format's appeal is that it is visible: you can see every letter, you can see which letters you have used, and you can see the chain growing. The constraints — change sides every letter, chain words, use everything — turn a word list into a puzzle, because most chains fail one of those constraints.</p>
      <h2>This site's version</h2>
      <p>Letter Box Game on this site is an independent, original version. Its puzzles are its own: seven boards in rotation, each with a checked solution, a hint, and a par of two words. It is free, it needs no account, it stores progress only in your browser, and it is not affiliated with, endorsed by, or connected to the New York Times or any other publisher. If you are looking for today's New York Times Letter Boxed answer, you will not find it here — and that is deliberate: this site's answers are for its own boards only.</p>
      <h2>Why an independent version exists</h2>
      <p>A free, no-account version lets anyone play without a subscription, practise on unlimited boards, and study solutions with a solver that uses a stated word list. The goal is not to replace the original, but to offer a clear, honest version of the same kind of puzzle, with its own boards and its own rules stated in full.</p>
    </ArticleClient>
  );
}
