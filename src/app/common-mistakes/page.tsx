import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Common Letter Box Mistakes",
  description: "The seven mistakes the game itself reports — and how to fix each one before you submit.",
  alternates: { canonical: canonical("/common-mistakes") },
  openGraph: {
    title: "Common Letter Box Mistakes",
    description: "The seven mistakes the game itself reports — and how to fix each one before you submit.",
    url: canonical("/common-mistakes"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Common Letter Box Mistakes",
    description: "The seven mistakes the game itself reports — and how to fix each one before you submit.",
  },
};

export default function GuidePage() {
  return (
    <ArticleClient kicker="Strategy" title="Common Letter Box Mistakes" intro="The game tells you exactly why a word was rejected. Learning those seven messages is the fastest way to stop repeating the same mistake.">

      <h2>The seven messages, and the fix</h2>
      <ul>
        <li><strong>Too short.</strong> Words need at least 3 letters. Keep building before you submit.</li>
        <li><strong>Same side.</strong> Two letters in a row cannot come from the same side. Change the middle letter to one from another side.</li>
        <li><strong>Wrong start.</strong> Every word after the first must start with the last letter of the previous word. The game shows the required letter — start there, or undo the last word.</li>
        <li><strong>Not in the word list.</strong> The word is not in this site's curated list yet. That is a limit of the list, not a judgement on the word. Try a more common word.</li>
        <li><strong>Already used.</strong> You have used that word in this puzzle already. Pick a different word, even if it covers the same letters.</li>
        <li><strong>Repeated letter.</strong> A letter may be used at most once within a single word. If you need a letter twice, it must appear in two different words.</li>
        <li><strong>Unknown letter.</strong> The word uses a letter that is not on this board. Check the board again — it is easy to misread a tile.</li>
      </ul>
      <p>Most mistakes are not vocabulary mistakes at all: they are side-rule or chain-rule slips. Slow down on the second word — that is where wrong-start and same-side errors cluster.</p>
      <p>The full rules behind these messages are on the <a href="/how-to-play">How to Play</a> page.</p>
    </ArticleClient>
  );
}
