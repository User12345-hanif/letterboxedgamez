import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Letter Box Word List",
  description: "What words Letter Box Game accepts, how the curated list works, and why a real word can still be rejected.",
  alternates: { canonical: canonical("/word-list") },
  openGraph: {
    title: "The Letter Box Word List",
    description: "What words Letter Box Game accepts, how the curated list works, and why a real word can still be rejected.",
    url: canonical("/word-list"),
  },
};

export default function GuidePage() {
  return (
    <ArticleClient kicker="Guide" title="The Letter Box Word List" intro="Letter Box Game checks words against a curated list of common English words, not against a complete dictionary. That choice is deliberate, and it explains the most confusing rejection in the game.">

      <h2>What is in the list</h2>
      <p>The list contains 2,808 unique common words, including every word in every checked solution. It is expanded only by adding verified common words — never invented at runtime. Short common words, longer common words, and the words in the live solutions are all in it.</p>
      <h2>What is not in the list</h2>
      <p>Obscure words, proper names, abbreviations and very rare spellings may be missing, even if they are real English. A rejection for that reason is a limit of the list, not a judgement on the word. The game says so plainly when it rejects a word for this reason, so you can try a more common word instead.</p>
      <h2>How to use the list honestly</h2>
      <p>The <a href="/solver">solver</a> uses exactly this list, so its results are always words the game would accept. If you want to know whether a word will be accepted before you play it, check it in the solver for that board. If a word you expected is missing, that is useful feedback — but the list is curated for common words, so an obscure word staying out is the intended behaviour, not a bug.</p>
    </ArticleClient>
  );
}
