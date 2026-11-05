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

/* Homepage FAQs — the same questions and answers are shown in the
 * visible FAQ section below, so the structured data matches the page.
 * Every answer is true for this site's own game: no invented times,
 * scores or research claims, and no claim of NYT affiliation. */
const HOME_FAQS: Array<[string, string]> = [
  [
    "What is Letter Box Game?",
    "Letter Box Game is a free daily word puzzle. You get twelve letters, three on each of four sides, and you build a chain of words that uses every letter at least once. It is an original, independent game — not the New York Times Letter Boxed, and not affiliated with it.",
  ],
  [
    "How do you play Letter Box Game?",
    "Pick letters to build a word, changing sides every letter. Submit the word, then build the next word starting with the last letter of the one before it. Keep going until all twelve letters have been used. There is no time limit and no account needed.",
  ],
  [
    "What is the same-side rule?",
    "Two letters in a row cannot come from the same side of the board. You may return to a side later in the same word — just never twice in a row. Each side is labelled by name, shape and pattern, so you never have to guess by colour alone.",
  ],
  [
    "Is Letter Box Game still free, or do you need a subscription?",
    "It is free. The daily puzzle and practice puzzles are free to play, with no account, no download and no subscription. Your progress is stored only in your own browser.",
  ],
  [
    "Is this the official New York Times Letter Boxed?",
    "No. This is an independent, original version with its own seven boards, hints and solver. It is not affiliated with, endorsed by, or connected to the New York Times. If you want today's New York Times puzzle, that publisher is the right place.",
  ],
  [
    "What is the best strategy to solve Letter Box Game efficiently?",
    "Aim for a long first word that gathers many letters and ends in a letter that starts many words, then find a bridge word that covers what is left. Two words is the benchmark on this site's boards, but any chain that uses all twelve letters counts as a win.",
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

        {/* Editorial homepage content — friendly, simple language, short
          * sentences, storybook panels. Same topics as competitors cover,
          * in the same order, but all copy is original to this site and
          * every fact is true for this site's own game. */}
        <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6">
          <p className="mt-10 text-lg leading-relaxed text-slate-500">
            A friendly puzzle for word lovers of all ages. Big letters, clear rules, no rush — just you and twelve letters.
          </p>
          <section aria-label="Letter Box Game at a glance" className="mt-10 border-y border-slate-200 py-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <div>
                <p className="font-display text-3xl font-bold leading-none text-slate-900">12</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-500">Letters per puzzle</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold leading-none text-slate-900">7</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-500">Boards in rotation</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold leading-none text-slate-900">Par 2</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-500">On every board</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold leading-none text-slate-900">Free</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-500">No login needed</p>
              </div>
            </div>
          </section>
          <nav aria-label="On this page" className="mt-8 border-y border-slate-200 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">On this page — jump to a section</p>
            <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
              <li><a href="#play-now" className="font-semibold text-emerald-600 underline underline-offset-4">Play Letter Box Game Now</a></li>
              <li><a href="#what-is" className="font-semibold text-emerald-600 underline underline-offset-4">What is Letter Box Game?</a></li>
              <li><a href="#how-to-play-home" className="font-semibold text-emerald-600 underline underline-offset-4">How to Play</a></li>
              <li><a href="#different" className="font-semibold text-emerald-600 underline underline-offset-4">What makes it different?</a></li>
              <li><a href="#fits-now" className="font-semibold text-emerald-600 underline underline-offset-4">Why it fits right now</a></li>
              <li><a href="#two-modes" className="font-semibold text-emerald-600 underline underline-offset-4">Two Modes, One Puzzle</a></li>
              <li><a href="#offers" className="font-semibold text-emerald-600 underline underline-offset-4">Everything it offers</a></li>
              <li><a href="#rules-home" className="font-semibold text-emerald-600 underline underline-offset-4">Rules &amp; Winning Conditions</a></li>
              <li><a href="#daily-challenge" className="font-semibold text-emerald-600 underline underline-offset-4">Daily Challenge</a></li>
              <li><a href="#strategies-home" className="font-semibold text-emerald-600 underline underline-offset-4">Strategies</a></li>
              <li><a href="#solver-home" className="font-semibold text-emerald-600 underline underline-offset-4">Solver Tool</a></li>
              <li><a href="#practice-home" className="font-semibold text-emerald-600 underline underline-offset-4">Unlimited Practice</a></li>
              <li><a href="#facts-home" className="font-semibold text-emerald-600 underline underline-offset-4">Facts</a></li>
              <li><a href="#beginners-home" className="font-semibold text-emerald-600 underline underline-offset-4">Tips for Beginners</a></li>
              <li><a href="#home-faq" className="font-semibold text-emerald-600 underline underline-offset-4">Frequently Asked Questions</a></li>
              <li><a href="#final-advice" className="font-semibold text-emerald-600 underline underline-offset-4">Final Advice</a></li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
              <Link href="/solver" className="min-h-11 inline-flex items-center rounded-full bg-emerald-600 px-5 text-sm font-bold text-white">Use the solver →</Link>
              <Link href="/unlimited" className="min-h-11 inline-flex items-center rounded-full border-2 border-emerald-600/25 bg-white px-5 text-sm font-bold text-slate-900">Unlimited practice</Link>
              <Link href="/archive" className="min-h-11 inline-flex items-center rounded-full border-2 border-emerald-600/25 bg-white px-5 text-sm font-bold text-slate-900">Puzzle archive</Link>
            </div>
          </nav>


          <section aria-labelledby="play-now" className="mt-10">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 id="play-now" className="font-display text-[30px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[38px]">
              Play Letter Box Game Now
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-slate-500">
              The game is right above, ready to play. Tap letters, build words, and use all twelve letters. No download, no account, no waiting.
            </p>
            <h3 className="mt-6 font-display text-xl font-bold text-slate-900">Game Controls</h3>
            <ul className="mt-3 grid gap-2 text-[15px] leading-relaxed text-slate-500 sm:grid-cols-2">
              <li>✦ <strong>Tap or type</strong> — pick letters on the board or use your keyboard.</li>
              <li>✦ <strong>Submit ✓</strong> — send your word when it is ready.</li>
              <li>✦ <strong>Undo</strong> — take back the last letter you picked.</li>
              <li>✦ <strong>Clear</strong> — start the current word again.</li>
              <li>✦ <strong>Hint (3 left)</strong> — first tap gives a letter and a word length; tap again for the full word.</li>
              <li>✦ <strong>New Game</strong> — switch to a practice board. Your daily puzzle stays untouched.</li>
              <li>✦ <strong>Full screen</strong> — expand the game to fill your screen; press Esc to leave full screen.</li>
            </ul>
            </div>
            <div className="mt-10">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">Start here</p>
            <h2 id="what-is" className="font-display text-[30px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[38px]">
              What is Letter Box Game?
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-slate-500">
              Letter Box Game is a word puzzle with twelve letters around a square, three on each side. You link words together until every letter has been used. That is the whole game — simple to learn, tricky to master. It is quick, it is calm, and it fits into a day. Anyone who likes words can play — no account, no age gate, no special knowledge, just twelve letters and a few minutes.
            </p>
            <h3 className="mt-8 font-display text-xl font-bold text-slate-900">Infographic: how a two-word solve works</h3>
            <figure className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="grid gap-4 border-b border-slate-200 px-5 py-4 sm:grid-cols-3 sm:px-6">
                <div>
                  <p className="font-display font-bold text-emerald-600">1 · Start long</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">CAPTURE uses 7 letters and ends in E.</p>
                </div>
                <div>
                  <p className="font-display font-bold text-emerald-600">2 · Chain from E</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">The next word must start with E, the last letter of the first word.</p>
                </div>
                <div>
                  <p className="font-display font-bold text-emerald-600">3 · Finish</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">ENJOYS covers the rest — 12 of 12 letters, in 2 words.</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-5 py-4 sm:px-6">
                <span className="rounded-full bg-emerald-600 px-3 py-1 font-display text-sm font-bold tracking-wide text-white">CAPTURE</span>
                <span aria-hidden="true" className="text-xl font-bold text-emerald-600">→</span>
                <span className="rounded-full bg-emerald-600 px-3 py-1 font-display text-sm font-bold tracking-wide text-white">ENJOYS</span>
                <span className="ml-1 text-sm font-semibold text-slate-500">2 words · 12 letters used</span>
              </div>
              <figcaption className="border-t border-slate-200 px-5 py-3 text-sm leading-relaxed text-slate-500 sm:px-6">
                An example chain, shown to explain the chaining rule. Today&apos;s board has its own letters — the idea is the same.
              </figcaption>
            </figure>
            </div>
            <div className="mt-10">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">How to play</p>
            <h2 id="how-to-play-home" className="font-display text-[30px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[38px]">
              How to Play
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-slate-500">
              Pick letters in order, change sides every letter, and chain your words. The first word can start anywhere. Every word after it must start with the last letter of the previous word. When all twelve letters are used, you win.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-slate-500">
              <li><strong>Change sides every letter</strong> — never pick two letters in a row from the same side.</li>
              <li><strong>Chain from the last letter</strong> — every word after the first starts with the previous word&apos;s last letter.</li>
              <li><strong>Use every letter</strong> — the puzzle is solved when no letters remain unused, in however many words it took.</li>
            </ul>
            <h3 className="mt-8 font-display text-xl font-bold text-slate-900">4 mistakes beginners make</h3>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm leading-relaxed">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th scope="col" className="px-4 py-3 font-display font-bold text-slate-900">Mistake</th>
                    <th scope="col" className="px-4 py-3 font-display font-bold text-slate-900">Why it hurts</th>
                    <th scope="col" className="px-4 py-3 font-display font-bold text-slate-900">The fix</th>
                  </tr>
                </thead>
                <tbody className="text-slate-500">
                  <tr className="border-b border-slate-200"><td className="px-4 py-3 font-semibold text-slate-900">Same side twice in a row</td><td className="px-4 py-3">The word is rejected.</td><td className="px-4 py-3">Change sides every letter.</td></tr>
                  <tr className="border-b border-slate-200"><td className="px-4 py-3 font-semibold text-slate-900">Wrong starting letter</td><td className="px-4 py-3">The chain breaks.</td><td className="px-4 py-3">Start each new word with the previous word&apos;s last letter.</td></tr>
                  <tr className="border-b border-slate-200"><td className="px-4 py-3 font-semibold text-slate-900">Same letter twice in one word</td><td className="px-4 py-3">The word is rejected — a letter may be used at most once in a single word.</td><td className="px-4 py-3">Use that letter again in a later word instead.</td></tr>
                  <tr><td className="px-4 py-3 font-semibold text-slate-900">Word too short, or not in the list</td><td className="px-4 py-3">The game rejects it and tells you why.</td><td className="px-4 py-3">Aim for 3 or more letters, read the message, and adjust.</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[15px] text-slate-500">Full rules, with examples: <Link href="/how-to-play" className="font-semibold text-emerald-600 underline underline-offset-4">How to Play →</Link> · <Link href="/strategies" className="font-semibold text-emerald-600 underline underline-offset-4">Strategies for fewer words →</Link></p>
            </div>
          </section>

          <section aria-labelledby="different" className="mt-16">
            <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div>
                <h2 id="different" className="font-display text-[26px] font-bold leading-tight">
                  What makes it different?
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-500">
                  Most word games hide the answer or hide the letters. Here, every letter is visible, the board is the centrepiece, and the puzzle is the chain you build. Large letters, generous spacing, and a progress bar that always tells you which letters remain.
                </p>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed">
                  <li>✓ &nbsp;Large touch targets, made for phones first</li>
                  <li>✓ &nbsp;Clear feedback when a word cannot be played — and why</li>
                </ul>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="font-display text-[26px] font-bold leading-tight text-slate-900">
                How Letter Box Game Differs from Other NYT Games
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-500">
                Wordle asks you to guess a hidden word. Spelling Bee asks for as many words as you can find from seven letters. Connections asks you to sort words into hidden groups. Strands asks you to hunt theme words in a grid. Letter Box asks you to build a chain that uses everything. Same love of words, different puzzle. <Link href="/games-like-letter-boxed" className="font-semibold text-emerald-600 underline underline-offset-4">Compare all the games →</Link>
              </p>
            </div>
            </div>
            <div className="mt-10">
            <h3 className="font-display text-xl font-bold text-slate-900">Letter Box Game vs other word games, at a glance</h3>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm leading-relaxed">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th scope="col" className="px-4 py-3 font-display font-bold text-slate-900">Game</th>
                    <th scope="col" className="px-4 py-3 font-display font-bold text-slate-900">What you do</th>
                    <th scope="col" className="px-4 py-3 font-display font-bold text-slate-900">New puzzle daily?</th>
                    <th scope="col" className="px-4 py-3 font-display font-bold text-slate-900">Replayable?</th>
                  </tr>
                </thead>
                <tbody className="text-slate-500">
                  <tr className="border-b border-slate-200"><td className="px-4 py-3 font-semibold text-slate-900">Letter Box Game</td><td className="px-4 py-3">Build a chain that uses all 12 letters</td><td className="px-4 py-3">Yes — one shared board</td><td className="px-4 py-3">Yes — practice boards anytime</td></tr>
                  <tr className="border-b border-slate-200"><td className="px-4 py-3 font-semibold text-slate-900">Wordle</td><td className="px-4 py-3">Guess one hidden word</td><td className="px-4 py-3">Yes — one word</td><td className="px-4 py-3">No — one puzzle a day</td></tr>
                  <tr className="border-b border-slate-200"><td className="px-4 py-3 font-semibold text-slate-900">Spelling Bee</td><td className="px-4 py-3">Find as many words as you can from seven letters</td><td className="px-4 py-3">Yes — one set of letters</td><td className="px-4 py-3">Yes — same board, keep finding words</td></tr>
                  <tr><td className="px-4 py-3 font-semibold text-slate-900">Connections</td><td className="px-4 py-3">Sort 16 words into four groups of four</td><td className="px-4 py-3">Yes — one puzzle</td><td className="px-4 py-3">No — one puzzle a day</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[15px] text-slate-500"><Link href="/games-like-letter-boxed" className="font-semibold text-emerald-600 underline underline-offset-4">Full comparison of games like Letter Box →</Link></p>
            </div>
            <div className="mt-10">
            <h2 id="fits-now" className="font-display text-[30px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[38px]">
              Why it fits right now
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-500">The New York Times version sits behind a subscription. This independent version is free, with no account — so anyone can play a letter-box puzzle without paying first.</p>
            </div>
          </section>

          <section aria-labelledby="two-modes" className="mt-16">

            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">Modes</p>
            <h2 id="two-modes" className="font-display text-[30px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[38px]">
              Two Modes, One Puzzle
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">Relaxed</p>
                <h3 className="mt-1 font-display text-lg font-bold text-slate-900">Daily Puzzle</h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-500">
                  <li>One fresh board every day</li>
                  <li>Same board for everyone</li>
                  <li>Changes at midnight Pakistan time</li>
                  <li>No time limit — play at your own pace</li>
                </ul>
                <p className="mt-3"><Link href="/" className="font-semibold text-emerald-600 underline underline-offset-4">Play today&apos;s puzzle →</Link></p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">Keep going</p>
                <h3 className="mt-1 font-display text-lg font-bold text-slate-900">Unlimited Practice</h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-500">
                  <li>Same seven boards, different starting point</li>
                  <li>Pick any board, any time</li>
                  <li>Replay as often as you like</li>
                  <li>Your daily puzzle is never touched by practice</li>
                </ul>
                <p className="mt-3"><Link href="/unlimited" className="font-semibold text-emerald-600 underline underline-offset-4">Play unlimited puzzles →</Link></p>
              </article>
            </div>
            <div className="mt-10">
            <h2 id="offers" className="font-display text-[30px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[38px]">
              Everything it offers
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-display text-lg font-bold text-slate-900">Statistics Tracking</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">Games played, games solved, current streak, fastest solve and solve rate — stored only in your browser, with no account.</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-display text-lg font-bold text-slate-900">Hint System</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">Three hints per game. The first tap gives a letter and a word length; the second tap reveals the full word. Hints never spoil the whole puzzle at once.</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-display text-lg font-bold text-slate-900">Puzzle Archive</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">All seven boards in rotation, with boards, par and tiered hints — and daily pages by date, so you can revisit any day&apos;s board. <Link href="/archive" className="font-semibold text-emerald-600 underline underline-offset-4">Browse the archive →</Link></p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-display text-lg font-bold text-slate-900">No Login or Subscription</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">Free to play, no account, no download, no subscription. Open the page and play.</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:col-span-2">
                <h3 className="font-display text-lg font-bold text-slate-900">Plays on Any Device</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">Made for phones first, with large touch targets and keyboard support on computers. Your progress stays on the device and browser you played on.</p>
              </article>
            </div>
            </div>
          </section>

          <section aria-labelledby="rules-home" className="mt-16">

            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">Rules</p>
            <h2 id="rules-home" className="font-display text-[30px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[38px]">
              Letter Box Game Rules (Complete Guide)
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-display text-lg font-bold text-slate-900">The rules in brief</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">Words need at least three letters, no two consecutive letters from the same side, no repeated letter inside one word, and each new word starts with the last letter of the previous one. <Link href="/how-to-play" className="font-semibold text-emerald-600 underline underline-offset-4">Full rules →</Link></p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-display text-lg font-bold text-slate-900">Winning &amp; par</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">You win the moment the last unused letter appears in one of your words. Par — the benchmark — is two words for every board here, because each has a checked two-word solution. <Link href="/scoring-and-par" className="font-semibold text-emerald-600 underline underline-offset-4">Scoring and par →</Link></p>
              </article>
            </div>
            <div className="mt-10">
            <h2 id="daily-challenge" className="font-display text-[30px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[38px]">
              Daily Letter Box Challenge (How It Works)
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-500">It is shared: everyone sees the same board on the same Pakistan calendar day, so friends can compare word counts without spoiling answers. It also changes on a clock you can trust — midnight Pakistan time, every day.</p>
            <p className="mt-4">
              <Link href="/daily" className="min-h-11 inline-flex items-center rounded-full bg-emerald-600 px-5 text-sm font-bold text-white">Daily puzzles by date →</Link>
              {" "}
              <Link href="/archive" className="min-h-11 inline-flex items-center rounded-full border-2 border-emerald-600/25 bg-white px-5 text-sm font-bold text-slate-900">Puzzle archive</Link>
            </p>
            </div>
          </section>

          <section aria-labelledby="strategies-home" className="mt-16">

            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">Strategy</p>
            <h2 id="strategies-home" className="font-display text-[30px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[38px]">
              Letter Box Strategies
            </h2>
            <h3 className="mt-6 font-display text-xl font-bold text-slate-900">Choosing an Ending Letter</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-500">End your first word in a letter that starts many common words — E, S, N, Y and L are friendly. A first word ending in a rare letter can strand you, because few words start there.</p>
            <h3 className="mt-6 font-display text-xl font-bold text-slate-900">Identifying the bridge letter</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-500">The bridge letter is the last letter of your first word — it is also the first letter of your second word. Pick your first word with its ending in mind, not just its length. <Link href="/bridge-words" className="font-semibold text-emerald-600 underline underline-offset-4">More on bridge words →</Link></p>
            <h3 className="mt-6 font-display text-xl font-bold text-slate-900">The 2-Word Solution Approach</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-500">Look for a first word of six or seven letters that uses letters from at least three sides, then a second word that starts with its last letter and mops up the rest. All seven live boards work this way. <Link href="/two-word-solutions" className="font-semibold text-emerald-600 underline underline-offset-4">All seven two-word solves →</Link></p>
            <p className="mt-4 text-[15px] text-slate-500">Full strategies, with the whole method: <Link href="/strategies" className="font-semibold text-emerald-600 underline underline-offset-4">Strategies →</Link> · <Link href="/8-letter-openers" className="font-semibold text-emerald-600 underline underline-offset-4">Long openers, honestly →</Link></p>
            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 id="solver-home" className="font-display text-[30px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[38px]">
              Letter Box Solver Tool (Free Assistant)
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-slate-500">
              Enter any twelve-letter board, three letters per side, and the solver finds the shortest chain that uses every letter — using only this site&apos;s word list, so every result is a chain the game itself would accept.
            </p>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-500">It lists every legal word for the board, groups them by first letter, then searches by chain length: one word, then two, then three, then four. The first length with a complete chain is the shortest available in this list. <Link href="/solver" className="font-semibold text-emerald-600 underline underline-offset-4">Try the solver →</Link></p>
            </div>
            <div className="mt-10">
            <h2 id="practice-home" className="font-display text-[30px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[38px]">
              How to Practice with Unlimited Letter Box Puzzles
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-500">Finished the daily? Keep playing. Unlimited practice uses the same seven boards with a different starting point, and you can pick any board, any time, as often as you like. Your daily puzzle is never touched by practice play.</p>
            <p className="mt-4">
              <Link href="/unlimited" className="min-h-11 inline-flex items-center rounded-full bg-emerald-600 px-5 text-sm font-bold text-white">Start practising →</Link>
            </p>
            </div>
          </section>

          <section aria-labelledby="facts-home" className="mt-16">

            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">The facts</p>
            <h2 id="facts-home" className="font-display text-[30px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[38px]">
              Letter Box Game Facts
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-slate-500">
              These are facts about this site&apos;s own game, measured from its boards and word list — not guesses, and not figures borrowed from another publisher.
            </p>
            <h3 className="mt-6 font-display text-xl font-bold text-slate-900">Boards, par and playable words</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-500">
              Seven boards in rotation. Par is two words for every board, because each has a checked two-word solution. Legal words on each board, in this site&apos;s word list: Puzzle 1: 99, Puzzle 2: 172, Puzzle 3: 108, Puzzle 4: 125, Puzzle 5: 194, Puzzle 6: 133, Puzzle 7: 77.
            </p>
            <h3 className="mt-6 font-display text-xl font-bold text-slate-900">Most Common Letters in This Site&apos;s Boards</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-500">
              Across the seven boards, E and A appear on all seven boards. R, N, T, O and C appear on six each. Twenty-one different letters appear across the boards in total; B, K, Q, X and Z do not appear on any current board. The word list itself contains 2,808 unique common words.
            </p>
            <h3 className="mt-6 font-display text-xl font-bold text-slate-900">What Is a Realistic Improvement Target?</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-500">
              There is no published average solve time or improvement curve for this site, and this page does not invent one. A realistic personal target is simpler: finish more boards in two words than you did last week, and need fewer hints. Your browser statistics — games solved, streak and fastest solve — show whether that is happening, for you.
            </p>
            <div className="mt-10">
            <h2 id="beginners-home" className="font-display text-[30px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[38px]">
              Letter Box Tips for Beginners
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-500">In your first week, expect three- and four-word solves, a few rejected words, and a lot of &quot;oh, that word works!&quot; moments. That is normal. Use hints when you are stuck — they are there to teach, not to punish.</p>
            <p className="mt-4 text-[15px] text-slate-500"><Link href="/letter-boxed-for-beginners" className="font-semibold text-emerald-600 underline underline-offset-4">Beginner&apos;s guide →</Link> · <Link href="/suffixes-and-prefixes" className="font-semibold text-emerald-600 underline underline-offset-4">Suffixes and prefixes that win →</Link></p>
            </div>
          </section>

          <section aria-labelledby="home-faq" className="mt-16">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">Questions</p>
            <h2 id="home-faq" className="font-display text-[30px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[38px]">
              Frequently Asked Questions
            </h2>
            <div className="mt-6 space-y-3">
              {HOME_FAQS.map(([question, answer]) => (
                <details key={question} className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                  <summary className="cursor-pointer font-display text-[18px] font-bold leading-snug text-slate-900">{question}</summary>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{answer}</p>
                </details>
              ))}
            </div>
            <p className="mt-4 text-[15px] text-slate-500">
              More questions? Read the full{" "}
              <Link href="/faq" className="font-semibold text-emerald-600 underline underline-offset-4">
                frequently asked questions
              </Link>
              , the{" "}
              <Link href="/how-to-play" className="font-semibold text-emerald-600 underline underline-offset-4">
                full rules
              </Link>
              , or{" "}
              <Link href="/strategies" className="font-semibold text-emerald-600 underline underline-offset-4">
                strategies for fewer words
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="find-way" className="mt-16">
            <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 id="find-way" className="font-display text-xl font-bold text-slate-900">GAME</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                <li><Link href="/" className="font-semibold text-emerald-600 underline underline-offset-4">Play today&apos;s puzzle</Link></li>
                <li><Link href="/unlimited" className="font-semibold text-emerald-600 underline underline-offset-4">Unlimited practice</Link></li>
                <li><Link href="/solver" className="font-semibold text-emerald-600 underline underline-offset-4">Solver tool</Link></li>
                <li><Link href="/archive" className="font-semibold text-emerald-600 underline underline-offset-4">Puzzle archive</Link></li>
                <li><Link href="/daily" className="font-semibold text-emerald-600 underline underline-offset-4">Daily puzzles by date</Link></li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="font-display text-xl font-bold text-slate-900">LEARN</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                <li><Link href="/how-to-play" className="font-semibold text-emerald-600 underline underline-offset-4">How to play</Link></li>
                <li><Link href="/strategies" className="font-semibold text-emerald-600 underline underline-offset-4">Strategies</Link></li>
                <li><Link href="/hints" className="font-semibold text-emerald-600 underline underline-offset-4">Hints</Link></li>
                <li><Link href="/faq" className="font-semibold text-emerald-600 underline underline-offset-4">FAQ</Link></li>
                <li><Link href="/games-like-letter-boxed" className="font-semibold text-emerald-600 underline underline-offset-4">Games like Letter Box</Link></li>
                <li><Link href="/rare-letters" className="font-semibold text-emerald-600 underline underline-offset-4">Rare Letters</Link></li>
                <li><Link href="/common-mistakes" className="font-semibold text-emerald-600 underline underline-offset-4">Common Mistakes</Link></li>
                <li><Link href="/history" className="font-semibold text-emerald-600 underline underline-offset-4">History</Link></li>
                <li><Link href="/word-list" className="font-semibold text-emerald-600 underline underline-offset-4">Word List</Link></li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="font-display text-xl font-bold text-slate-900">INFO</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                <li><Link href="/about" className="font-semibold text-emerald-600 underline underline-offset-4">About Letter Box Game</Link></li>
                <li><Link href="/faq" className="font-semibold text-emerald-600 underline underline-offset-4">Frequently asked questions</Link></li>
                <li><Link href="/privacy-policy" className="font-semibold text-emerald-600 underline underline-offset-4">Privacy Policy</Link></li>
                <li><Link href="/terms" className="font-semibold text-emerald-600 underline underline-offset-4">Terms</Link></li>
                <li><a href={`mailto:${SITE.email}`} className="font-semibold text-emerald-600 underline underline-offset-4">{SITE.email}</a></li>
              </ul>
            </div>
            </div>
            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 id="final-advice" className="font-display text-[28px] font-bold leading-tight tracking-tight sm:text-[34px]">
              Final Advice
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-slate-500">
              Try first, use a hint when you are truly stuck, and study the shortest chain after you finish.
            </p>
            <p className="mt-5">
              <Link href="/" className="inline-block rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white">
                Play today&apos;s puzzle →
              </Link>
              {" "}
              <Link href="/unlimited" className="inline-block rounded-full border-2 border-emerald-600/25 px-6 py-3 text-sm font-bold text-slate-900">
                Practise unlimited →
              </Link>
            </p>
            </div>
          </section>
          <p className="mt-12 text-center text-sm">
            <a href="#main-content" className="font-bold text-emerald-600 underline underline-offset-4">Back to top ↑</a>
          </p>
        </div>
      </main>

      <Footer />
      <HowToPlayModal open={showHowTo} onClose={() => setShowHowTo(false)} />
      <StatsModal open={showStats} onClose={() => setShowStats(false)} stats={stats} />
    </div>
  );
}
