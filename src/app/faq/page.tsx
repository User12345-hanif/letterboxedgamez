import type { Metadata } from "next";
import Link from "next/link";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Is Letter Box Game free? Do I need an account? Why was my word rejected? Straight answers about the daily word puzzle.",
  alternates: { canonical: canonical("/faq") },
  openGraph: {
    title: "Frequently Asked Questions",
    description: "Is it free? Do I need an account? Why was my word rejected? Straight answers, no jargon.",
    url: canonical("/faq"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions",
    description: "Is it free? Do I need an account? Why was my word rejected? Straight answers, no jargon.",
  },
};

const FAQS: Array<[string, string]> = [
  [
    "Is Letter Box Game free?",
    "Yes. The daily puzzle and practice puzzles are free to play, with no account, no download and no subscription. Your progress is stored only in your own browser.",
  ],
  [
    "Do I need an account?",
    "No. There are no accounts at all. Statistics and in-progress puzzles are saved in your browser's local storage on the device you are using, which is why they do not follow you to another device or browser.",
  ],
  [
    "When does the daily puzzle change?",
    "The daily puzzle changes at midnight Pakistan time (00:00 Asia/Karachi, 19:00 UTC), so everyone sees the same board on the same Pakistan calendar day, and a new board arrives each day. Practice puzzles use the same rotation with a different starting point, so you can keep playing after the daily is done.",
  ],
  [
    "Why was my word rejected when it is a real word?",
    "Most often, for one of three reasons: it broke the side rule, it did not start with the required chaining letter, or it is not yet in the game's curated word list. The list contains common words and is expanded over time; a rejection for that reason is a limit of the list, not a judgement on the word. The game tells you which reason applied, so you can adjust.",
  ],
  [
    "Can I use the same letter twice in one word?",
    "No — in this game, each letter may be used at most once within a single word. This keeps the path on the board easy to follow. The same letter may, of course, appear in different words in your chain.",
  ],
  [
    "How do I know a puzzle is solvable?",
    "Every puzzle in the rotation is checked before it is published: a verified solution is stored with it, and a script confirms that every solution word is in the dictionary, obeys the side and chaining rules, and together covers all twelve letters. If a puzzle ever failed that check, the game would show an error instead of the board.",
  ],
  [
    "Does the game work on a phone?",
    "Yes — it is designed mobile-first, with large tiles, no horizontal scrolling, and touch targets of at least 44 pixels. It also works with a keyboard: type letters, press Enter to submit, Backspace to undo, and Esc to clear.",
  ],
  [
    "Is the game accessible?",
    "That is a design goal, not an afterthought: tiles are labelled by letter and side, focus is visible, motion respects your reduced-motion setting, and every essential fact is available as text. If you find a barrier, please tell us via the contact address on the About page.",
  ],
  [
    "Can I share my result?",
    "Yes. After solving, the Share result button copies a short summary — how many words you used and the words themselves — ready to paste anywhere. Sharing is entirely optional and never automatic.",
  ],
  [
    "I lost my progress or statistics. What happened?",
    "Progress lives in your browser's local storage. Clearing site data, using private browsing, switching browsers or devices, or a browser setting that clears storage on exit will remove it. The game itself never deletes your progress while you play.",
  ],
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleClient
        kicker="FAQ"
        title="Frequently asked questions"
        intro="Straight answers to the questions players ask most. If yours is not here, the About page has a way to reach us."
      >
        <div className="space-y-7">
          {FAQS.map(([question, answer]) => (
            <section key={question}>
              <h2 className="!mt-0 text-[19px]">{question}</h2>
              <p className="mt-1.5">{answer}</p>
            </section>
          ))}
        </div>
        <p className="mt-10">
          Still curious? <Link href="/how-to-play">Read the full rules</Link>, or{" "}
          <Link href="/strategies">learn a few strategies</Link> before your next board.
        </p>
      </ArticleClient>
    </>
  );
}
