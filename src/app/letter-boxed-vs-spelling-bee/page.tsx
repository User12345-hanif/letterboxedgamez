import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Letter Boxed vs Spelling Bee",
  description: "Letter Box and Spelling Bee both build words from a small set of letters, but one chains words to cover a board and the other hunts for many words.",
  alternates: { canonical: canonical("/letter-boxed-vs-spelling-bee") },
  openGraph: {
    title: "Letter Boxed vs Spelling Bee",
    description: "Letter Box and Spelling Bee both build words from a small set of letters, but one chains words to cover a board and the other hunts for many words.",
    url: canonical("/letter-boxed-vs-spelling-bee"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Letter Boxed vs Spelling Bee",
    description: "Letter Box and Spelling Bee both build words from a small set of letters, but one chains words to cover a board and the other hunts for many words.",
  },
};

export default function GuidePage() {
  return (
    <ArticleClient kicker="Comparison" title="Letter Boxed vs Spelling Bee" intro="Both games give you a handful of letters and ask for English words. Spelling Bee asks for as many words as you can find from seven letters, with one required centre letter. Letter Box asks for a chain that uses twelve letters, three on each of four sides, at least once.">

      <h2>Coverage versus quantity</h2>
      <p>In Spelling Bee, a word is good if it uses the letters, especially the centre letter, and longer words and pangrams score more. In Letter Box, a word is good if it advances the chain: it starts with the required letter, obeys the side rule, and adds letters you still need. A brilliant Spelling Bee word that breaks the side rule is useless here, and a short Letter Box word that adds three new letters is excellent.</p>
      <h2>Rules that change the strategy</h2>
      <ul>
        <li>Spelling Bee letters can repeat. Letter Box letters cannot repeat inside a single word.</li>
        <li>Spelling Bee words can be any length from four up. Letter Box words need at least three letters.</li>
        <li>Spelling Bee has a scoring ladder and ranks. Letter Box has par and stars, based on word count, not word length.</li>
      </ul>
      <p>If you enjoy finding many words from a small set, Spelling Bee is the deeper word-hunt. If you enjoy finding one clean chain that uses everything exactly once, Letter Box is the cleaner construction puzzle. This site's Letter Box puzzles are original and independent, and are not affiliated with the New York Times.</p>
      <h2>Pangram-hunting versus chain-planning</h2>
      <p>Spelling Bee&apos;s great moment is the pangram: one word using all seven letters, worth a bonus. Letter Box&apos;s great moment is the bridge: a second word that starts with the first word&apos;s last letter and covers everything left. Both reward seeing the whole letter set at once, but the planning runs opposite ways — Spelling Bee asks what else can be found from these letters, while Letter Box asks what single chain can use them all, in order, without breaking the side rule. A pangram-hunter collects; a chain-planner connects.</p>
      <p>Try it yourself: <a href="/">today&apos;s puzzle is free</a>, the <a href="/solver">solver</a> shows the shortest chain for any board, and <a href="/games-like-letter-boxed">games like Letter Boxed</a> compares the other games in the family.</p>
    </ArticleClient>
  );
}
