import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rare Letters in Letter Box",
  description: "How to handle J, V and Y on Letter Box boards, and why Q, X and Z need a different approach.",
  alternates: { canonical: canonical("/rare-letters") },
  openGraph: {
    title: "Rare Letters in Letter Box",
    description: "How to handle J, V and Y on Letter Box boards, and why Q, X and Z need a different approach.",
    url: canonical("/rare-letters"),
  },
};

export default function GuidePage() {
  return (
    <ArticleClient kicker="Strategy" title="Rare Letters in Letter Box" intro="Rare letters feel scary because they appear in few words. On the live boards they are manageable: the only genuinely rare letters present are J and V, plus Y, which is far more flexible than it looks.">

      <h2>Where rare letters live</h2>
      <p>Puzzle 1 has J and Y. Puzzle 3 has J and Y. Puzzle 7 has V and Y. No live board currently contains Q, X or Z. That is a fact about these seven boards, not a rule of the game — a custom board in the solver can contain any letters, and the solver will only suggest words that are actually in the word list.</p>
      <h2>J: pair it early</h2>
      <p>J usually needs a following vowel. In ENJOYS, J sits between N and O, on the Top side, with neighbours from the Left and Right sides. If J is still unused late in a solve, look for a word that ends in a letter that can start a J word — ENJOYS starts with E, so a first word ending in E unlocks it.</p>
      <h2>V: look for -VE and -V words</h2>
      <p>OVERLAP → PUNCHY is Puzzle 7, and V sits in OVERLAP between O and E. Words with V often end in -VE or start with V, so a chain that ends in a letter V can start, or a word containing V can bridge two common sections.</p>
      <h2>Y: a bridge, not a dead end</h2>
      <p>Y starts YACHTS and PUNCHY ends in Y. Treat Y as both a starter and a finisher: a first word ending in Y opens Y words, and a word ending in Y is a clean finish. When Y is your last unused letter, search for words ending in Y first.</p>
      <p>If a board does contain Q, X or Z, do not guess: check the <a href="/solver">solver</a> for which words in this word list actually contain that letter on that board. A word you cannot verify is not a plan.</p>
    </ArticleClient>
  );
}
