import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Bridge Words in Letter Box",
  description: "Bridge words link two parts of a board: they start with one word's last letter and carry the letters you still need.",
  alternates: { canonical: canonical("/bridge-words") },
  openGraph: {
    title: "Bridge Words in Letter Box",
    description: "Bridge words link two parts of a board: they start with one word's last letter and carry the letters you still need.",
    url: canonical("/bridge-words"),
  },
};

export default function GuidePage() {
  return (
    <ArticleClient kicker="Strategy" title="Bridge Words in Letter Box" intro="A bridge word is the second word in a two-word solve — or any word that connects what you have used to what you have not. Its job is twofold: start with the required letter, and contain as many unused letters as possible.">

      <h2>Live bridges, letter by letter</h2>
      <ul>
        <li>CAPTURE → ENJOYS: the bridge starts with E and adds N, J, O, Y, S.</li>
        <li>GARDENS → SWITCH: the bridge starts with S and adds W, I, T, C, H.</li>
        <li>JOURNEY → YACHTS: the bridge starts with Y and adds A, C, H, T, S.</li>
        <li>FATHOMS → SLICED: the bridge starts with S and adds L, I, C, E, D.</li>
        <li>DOLPHIN → NATURE or NEUTRAL: both bridges start with N. NATURE adds A, T, U, R, E; NEUTRAL adds E, U, T, R, A, L — a reminder that two different bridges can finish the same board.</li>
        <li>CRYSTAL → LOUNGE: the bridge starts with L and adds O, U, N, G, E.</li>
        <li>OVERLAP → PUNCHY: the bridge starts with P and adds U, N, C, H, Y.</li>
      </ul>
      <h2>What makes a good bridge</h2>
      <p>Count the new letters it adds, not its length alone. A seven-letter bridge that adds only one new letter is worse than a five-letter bridge that adds four. Also check its sides: a bridge word cannot put two consecutive letters on the same side, and it cannot repeat a letter inside itself. If your candidate bridge fails either check, change the first word instead of forcing the bridge.</p>
    </ArticleClient>
  );
}
