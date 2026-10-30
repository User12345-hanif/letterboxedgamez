import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Suffixes and Prefixes That Win Letter Box Games",
  description: "Use common word endings and beginnings — -S, -ED, -URE, -AL, -GE, -Y — to cover more letters with fewer words.",
  alternates: { canonical: canonical("/suffixes-and-prefixes") },
  openGraph: {
    title: "Suffixes and Prefixes That Win Letter Box Games",
    description: "Use common word endings and beginnings — -S, -ED, -URE, -AL, -GE, -Y — to cover more letters with fewer words.",
    url: canonical("/suffixes-and-prefixes"),
  },
};

export default function GuidePage() {
  return (
    <ArticleClient kicker="Strategy" title="Suffixes and Prefixes That Win Letter Box Games" intro="The fastest way to cover twelve letters is to let word parts do the work. Suffixes and prefixes are letter bundles: one ending can add three or four letters you still need, in a single word.">

      <h2>Endings that appear in live solves</h2>
      <ul>
        <li>-S: GARDENS, JOURNEY's partner YACHTS, FATHOMS, SLICED's partner words all use a final S to close a chain cleanly.</li>
        <li>-ED: SLICED in Puzzle 4. An -ED ending is useful because D is otherwise hard to place, and -ED words often start with a common letter.</li>
        <li>-URE: CAPTURE and NATURE. -URE packs U, R and E into one ending — three letters that are otherwise easy to strand.</li>
        <li>-AL: CRYSTAL in Puzzle 6. -AL endings pair well with a following L word, as in CRYSTAL → LOUNGE.</li>
        <li>-GE: LOUNGE. -GE words end in E, which starts a huge number of second words.</li>
        <li>-Y: PUNCHY in Puzzle 7. A -Y ending is a finish line: it rarely helps the next word, so save it for the last word if you can.</li>
      </ul>
      <h2>How to use them in a solve</h2>
      <p>When you look at a board, list the endings the letters could make, then work backwards: which first word ends in a letter that starts a word with the ending you need? If you need -ED, you need a D and an E on different sides from their neighbours, and a word that starts with the previous word's last letter. Practise by trying to build a two-word chain for a board in <a href="/unlimited">unlimited practice</a>, then check your route against the <a href="/solver">solver</a>.</p>
    </ArticleClient>
  );
}
