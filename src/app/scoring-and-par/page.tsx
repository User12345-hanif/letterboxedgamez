import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Letter Box Scoring and Par Explained",
  description: "Par, stars and solve rate in Letter Box Game: what each number means, and what counts as a good solve.",
  alternates: { canonical: canonical("/scoring-and-par") },
  openGraph: {
    title: "Letter Box Scoring and Par Explained",
    description: "Par, stars and solve rate in Letter Box Game: what each number means, and what counts as a good solve.",
    url: canonical("/scoring-and-par"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Letter Box Scoring and Par Explained",
    description: "Par, stars and solve rate in Letter Box Game: what each number means, and what counts as a good solve.",
  },
};

export default function GuidePage() {
  return (
    <ArticleClient kicker="Guide" title="Letter Box Scoring and Par Explained" intro="Par is the benchmark number of words for a puzzle. On this site, par is simply the length of the checked solution — and every live puzzle has par 2.">

      <h2>Par on the live boards</h2>
      <p>All seven live puzzles have par 2, because each checked solution uses two words. A solve in 2 words meets par. A solve in 3 words is one over par. A solve in 4 or more words still solves the puzzle — it just uses more words than the benchmark.</p>
      <h2>Stars</h2>
      <p>The game awards 3 stars for a solve at or under par, 2 stars for one over par, and 1 star for any other completed solve. Stars are a summary, not a score to chase at the cost of enjoying the board: a 3-word solve you found yourself is better practice than a 2-word solve you copied.</p>
      <h2>Other numbers</h2>
      <p>The timer counts up from your first letter and stops when you solve, so it measures your solve time for that board. Statistics — games played, games solved, current streak, fastest solve and solve rate — are stored only in your own browser, with no account. They do not follow you to another device, and they are not shared with anyone.</p>
      <p>There is no time limit and no penalty for extra words. The only failure state is giving up, and even then the hints and the <a href="/solver">solver</a> are there to help you finish.</p>
    </ArticleClient>
  );
}
