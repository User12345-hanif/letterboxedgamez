"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { GameScreen } from "@/components/GameScreen";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HowToPlayModal, StatsModal } from "@/components/Modals";
import { loadStats, type Stats } from "@/lib/stats";
import { SITE } from "@/lib/site";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE.name,
  url: SITE.url,
  applicationCategory: "GameApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: SITE.description,
};

const HOME_FAQS: Array<[string, string]> = [
  [
    "Is Letterboxed Gamez free?",
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
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQS.map(([question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

export default function HomePage() {
  const [showHowTo, setShowHowTo] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<Stats>(() => loadStats());

  const handleStatsChange = useCallback((next: Stats) => {
    setStats(next);
  }, []);

  const openStats = useCallback(() => {
    setStats(loadStats());
    setShowStats(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <Header
        onHowToPlay={() => setShowHowTo(true)}
        onStatistics={openStats}
        solvedCount={stats.gamesSolved}
      />

      <main id="main-content" className="flex-1">
        <GameScreen onStatsChange={handleStatsChange} />

        {/* Editorial homepage content — readable by search engines, useful to players. */}
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
          <section aria-labelledby="how-it-works" className="mt-14 border-t border-line pt-10">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-forest">How it works</p>
            <h2 id="how-it-works" className="mt-2 max-w-2xl font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              A small puzzle with a satisfying finish
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-moss">
              Letterboxed Gamez gives you twelve letters arranged around a square — three on each
              side. Your job is to link words together until every letter has been used. There is
              no time limit and no account to create. Play for three minutes on a
              coffee break, or take your time over the whole board.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "1. Pick letters in order",
                  body: "Tap a tile, or type on your keyboard. Your word appears above the board, with the path drawn between the letters you chose.",
                },
                {
                  title: "2. Change sides every time",
                  body: "Two letters in a row must come from different sides. Each side is labelled by name, shape and pattern, so you never have to guess by colour alone.",
                },
                {
                  title: "3. Chain to the finish",
                  body: "Each new word starts with the last letter of the one before it. When all twelve letters are used, the puzzle is solved — in as few words as you can manage.",
                },
              ].map((card) => (
                <article key={card.title} className="rounded-3xl border border-line bg-cream p-5 shadow-sm">
                  <h3 className="font-display text-lg font-bold text-ink">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-moss">{card.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="why-clear" className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-forest p-6 text-white sm:p-8">
              <h2 id="why-clear" className="font-display text-[26px] font-bold leading-tight">
                Built to be read at a glance
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-sage">
                Most letter-box games hide the rules in tiny type and identical tiles. Here the
                board is the centrepiece: large letters, generous spacing, a visible path for
                your current word, and a progress bar that always tells you exactly which
                letters remain. If you can read the board, you can play the game.
              </p>
              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed">
                <li>✓ &nbsp;Large touch targets, made for phones first</li>
                <li>✓ &nbsp;Keyboard support, focus states and reduced-motion support</li>
                <li>✓ &nbsp;Clear feedback when a word cannot be played — and why</li>
                <li>✓ &nbsp;Your progress stays in your browser, and only there</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-line bg-cream p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-[26px] font-bold leading-tight text-ink">
                A new puzzle every day
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-moss">
                The daily puzzle is the same for everyone, so you can compare notes with a friend
                without spoiling anything — just say how many words it took you. Finished it?
                Play as many practice puzzles as you like, with the same rules and a fresh board,
                whenever you want one. Every puzzle in the rotation has been checked in advance: a verified solution
                exists, and every word in that solution is in the curated word list.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/strategies" className="min-h-11 inline-flex items-center rounded-full border border-forest px-4 text-sm font-bold text-forest-dark hover:bg-sage-light">
                  Read strategies →
                </Link>
                <Link href="/hints" className="min-h-11 inline-flex items-center rounded-full border border-line bg-white px-4 text-sm font-semibold text-pine hover:border-forest/40">
                  Get a hint, without spoilers
                </Link>
                <Link href="/faq" className="min-h-11 inline-flex items-center rounded-full border border-line bg-white px-4 text-sm font-semibold text-pine hover:border-forest/40">
                  Common questions
                </Link>
              </div>
            </div>
          </section>

          <section aria-labelledby="example" className="mt-12">
            <h2 id="example" className="font-display text-[26px] font-bold tracking-tight text-ink sm:text-[30px]">
              What a solve looks like
            </h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">
              A strong solve uses just two words. The first word gathers most of the letters; the
              second starts with the first word&apos;s final letter and mops up the rest. You do
              not need to find the same two words as anyone else — any chain that uses all twelve
              letters solves the puzzle.
            </p>
            <figure className="mt-5 overflow-hidden rounded-3xl border border-line bg-cream shadow-sm">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-5 py-4 sm:px-6">
                <span className="rounded-full bg-forest px-3 py-1 font-display text-sm font-bold tracking-wide text-white">CAPTURE</span>
                <span aria-hidden="true" className="text-xl font-bold text-forest">→</span>
                <span className="rounded-full bg-forest px-3 py-1 font-display text-sm font-bold tracking-wide text-white">ENJOYS</span>
                <span className="ml-1 text-sm font-semibold text-moss">2 words · 12 letters used</span>
              </div>
              <figcaption className="border-t border-line px-5 py-3 text-sm leading-relaxed text-moss sm:px-6">
                An example chain, shown to explain the chaining rule. Today&apos;s board has its
                own letters — the idea is the same.
              </figcaption>
            </figure>
          </section>

          <section aria-labelledby="home-faq" className="mt-12">
            <h2 id="home-faq" className="font-display text-[26px] font-bold tracking-tight text-ink sm:text-[30px]">
              Questions, answered briefly
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {HOME_FAQS.map(([question, answer]) => (
                <article key={question} className="rounded-3xl border border-line bg-cream p-5 shadow-sm">
                  <h3 className="font-display text-[18px] font-bold leading-snug text-ink">{question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-moss">{answer}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-[15px] text-moss">
              More questions? Read the full{" "}
              <Link href="/faq" className="font-semibold text-forest underline underline-offset-4">
                frequently asked questions
              </Link>
              , the{" "}
              <Link href="/how-to-play" className="font-semibold text-forest underline underline-offset-4">
                full rules
              </Link>
              , or{" "}
              <Link href="/strategies" className="font-semibold text-forest underline underline-offset-4">
                strategies for fewer words
              </Link>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
      <HowToPlayModal open={showHowTo} onClose={() => setShowHowTo(false)} />
      <StatsModal open={showStats} onClose={() => setShowStats(false)} stats={stats} />
    </div>
  );
}
