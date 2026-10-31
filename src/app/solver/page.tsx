import type { Metadata } from "next";
import SolverTool from "@/components/SolverTool";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Letter Box Solver",
  description:
    "Free Letter Box solver: enter 3 letters on each side and get the shortest chain that uses all 12 letters, checked against this site's own word list.",
  alternates: { canonical: canonical("/solver") },
  openGraph: {
    title: "Letter Box Solver",
    description: "Solve any 12-letter Letter Box board, shortest chain first, using this site's word list.",
    url: canonical("/solver"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Letter Box Solver",
    description: "Solve any 12-letter Letter Box board, shortest chain first, using this site's word list.",
  },
};

export default function SolverPage() {
  return (
    <ArticleClient
      kicker="Solver"
      title="Letter Box Solver"
      intro="Enter any 12-letter board — 3 letters on each side — and the solver finds the shortest chain that uses every letter. It uses only this site's curated word list, so every result is a chain the game itself would accept."
    >
      <h2>How the solver works</h2>
      <p>
        It lists every word in our curated list that fits the board and the rules — at least 3
        letters, no two consecutive letters from the same side, no repeated letter inside one word —
        groups them by first letter, then searches by chain length: 1 word, then 2, then 3, then 4.
        The first length with a complete chain is the shortest available in this list. It never
        invents a word, and it never claims a board is unsolvable in general if it finds no chain
        here: it only reports what this list contains.
      </p>
      <SolverTool />
      <h2>A note on word lists</h2>
      <p>
        Word lists differ between games. A solver result proves a chain exists in <em>our</em> list —
        it does not prove the same words are accepted everywhere else. Use it to study a route, then
        try to find your own chain on the board. A longer solve you found yourself still counts as
        a win.
      </p>
    </ArticleClient>
  );
}
