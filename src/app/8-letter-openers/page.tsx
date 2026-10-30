import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "8-Letter Openers for Letter Box",
  description: "Why the live boards use 7-letter openers, and how to hunt for a genuine 8-letter opener on a custom board.",
  alternates: { canonical: canonical("/8-letter-openers") },
  openGraph: {
    title: "8-Letter Openers for Letter Box",
    description: "Why the live boards use 7-letter openers, and how to hunt for a genuine 8-letter opener on a custom board.",
    url: canonical("/8-letter-openers"),
  },
};

export default function GuidePage() {
  return (
    <ArticleClient kicker="Strategy" title="8-Letter Openers for Letter Box" intro="A long opener is attractive: one word that covers most of the board. On the current live boards, though, honesty comes first — no 8-letter word in this site's word list fits any of the seven boards, so the checked openers here are all 7 letters.">

      <h2>The live truth</h2>
      <p>Every live checked solve starts with a 7-letter word: CAPTURE, GARDENS, JOURNEY, FATHOMS, DOLPHIN, CRYSTAL, OVERLAP. That is the benchmark to aim for on these boards. Claiming an 8-letter opener for them would be inventing a word that the game would reject.</p>
      <h2>When 8-letter openers do exist</h2>
      <p>The word list does contain longer words — for example DISCOUNT and GRATEFUL are in the list. Whether one fits a board depends on the board's letters and sides, not on the word alone. Type a custom board into the <a href="/solver">solver</a> and look at its playable-word list: if an 8-letter word appears there, it obeys the side rule and the no-repeat rule for that board, and it is a real opener candidate. If none appears, no amount of wishing makes one fit.</p>
      <h2>How to judge an opener</h2>
      <p>Length is not the whole story. A good opener uses letters from at least three sides, ends in a letter that starts many words, and leaves a bridge word that can cover the rest. A 7-letter opener that leaves a clean 5-letter bridge beats an 8-letter opener that strands a rare letter. Aim for the chain, not the first word alone.</p>
    </ArticleClient>
  );
}
