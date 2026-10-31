"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { GameScreen } from "@/components/GameScreen";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HowToPlayModal, StatsModal } from "@/components/Modals";
import { Sprinkles } from "@/components/Decorations";
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
        <div className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
          <p className="mt-10 text-center text-lg font-semibold leading-relaxed text-moss">
            A friendly puzzle for word lovers of all ages. Big letters, clear rules, no rush — just you and twelve letters.
          </p>
          <nav aria-label="On this page" className="mt-8 rounded-3xl border-2 border-line bg-cream p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-forest">On this page — jump to a section</p>
            <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
              <li><a href="#play-now" className="font-semibold text-forest underline underline-offset-4">Play Letter Box Game Now</a></li>
              <li><a href="#what-is" className="font-semibold text-forest underline underline-offset-4">What is Letter Box Game?</a></li>
              <li><a href="#how-to-play-home" className="font-semibold text-forest underline underline-offset-4">How to Play</a></li>
              <li><a href="#different" className="font-semibold text-forest underline underline-offset-4">What makes it different?</a></li>
              <li><a href="#fits-now" className="font-semibold text-forest underline underline-offset-4">Why it fits right now</a></li>
              <li><a href="#two-modes" className="font-semibold text-forest underline underline-offset-4">Two Modes, One Puzzle</a></li>
              <li><a href="#offers" className="font-semibold text-forest underline underline-offset-4">Everything it offers</a></li>
              <li><a href="#rules-home" className="font-semibold text-forest underline underline-offset-4">Rules &amp; Winning Conditions</a></li>
              <li><a href="#daily-challenge" className="font-semibold text-forest underline underline-offset-4">Daily Challenge</a></li>
              <li><a href="#strategies-home" className="font-semibold text-forest underline underline-offset-4">Strategies</a></li>
              <li><a href="#solver-home" className="font-semibold text-forest underline underline-offset-4">Solver Tool</a></li>
              <li><a href="#practice-home" className="font-semibold text-forest underline underline-offset-4">Unlimited Practice</a></li>
              <li><a href="#facts-home" className="font-semibold text-forest underline underline-offset-4">Facts</a></li>
              <li><a href="#beginners-home" className="font-semibold text-forest underline underline-offset-4">Tips for Beginners</a></li>
              <li><a href="#home-faq" className="font-semibold text-forest underline underline-offset-4">Frequently Asked Questions</a></li>
              <li><a href="#final-advice" className="font-semibold text-forest underline underline-offset-4">Final Advice</a></li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
              <Link href="/solver" className="min-h-11 inline-flex items-center rounded-full bg-forest px-5 text-sm font-bold text-white">Use the solver →</Link>
              <Link href="/unlimited" className="min-h-11 inline-flex items-center rounded-full border-2 border-forest/25 bg-white px-5 text-sm font-bold text-ink">Unlimited practice</Link>
              <Link href="/archive" className="min-h-11 inline-flex items-center rounded-full border-2 border-forest/25 bg-white px-5 text-sm font-bold text-ink">Puzzle archive</Link>
            </div>
          </nav>


          <section aria-labelledby="play-now" className="mt-10">
            <div className="rounded-[32px] border-[3px] border-sky-deep/20 bg-sky-wash/60 p-6 sm:p-8">
            <h2 id="play-now" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Play Letter Box Game Now
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-moss">
              The game is right above, ready to play. Tap letters, build words, and use all twelve letters. No download, no account, no waiting.
            </p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Game Controls</h3>
            <ul className="mt-3 grid gap-2 text-[15px] leading-relaxed text-moss sm:grid-cols-2">
              <li>✦ <strong>Tap or type</strong> — pick letters on the board or use your keyboard.</li>
              <li>✦ <strong>Submit ✓</strong> — send your word when it is ready.</li>
              <li>✦ <strong>Undo</strong> — take back the last letter you picked.</li>
              <li>✦ <strong>Clear</strong> — start the current word again.</li>
              <li>✦ <strong>Hint (3 left)</strong> — first tap gives a letter and a word length; tap again for the full word.</li>
              <li>✦ <strong>New Game</strong> — switch to a practice board. Your daily puzzle stays untouched.</li>
            </ul>
            </div>
            <div className="mt-10">
            <h2 id="what-is" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              What is Letter Box Game?
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-moss">
              Letter Box Game is a word puzzle with twelve letters around a square, three on each side. You link words together until every letter has been used. That is the whole game — simple to learn, tricky to master. It is quick, it is calm, and it fits into a day. Anyone who likes words can play — no account, no age gate, no special knowledge, just twelve letters and a few minutes.
            </p>
            <h3 className="mt-8 font-display text-xl font-bold text-ink">An example chain, at a glance</h3>
            <figure className="mt-3 overflow-hidden rounded-3xl border-[3px] border-gold/50 bg-cream shadow-soft">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-5 py-4 sm:px-6">
                <span className="rounded-full bg-forest px-3 py-1 font-display text-sm font-bold tracking-wide text-white">CAPTURE</span>
                <span aria-hidden="true" className="text-xl font-bold text-forest">→</span>
                <span className="rounded-full bg-forest px-3 py-1 font-display text-sm font-bold tracking-wide text-white">ENJOYS</span>
                <span className="ml-1 text-sm font-semibold text-moss">2 words · 12 letters used</span>
              </div>
              <figcaption className="border-t border-line px-5 py-3 text-sm leading-relaxed text-moss sm:px-6">
                An example chain, shown to explain the chaining rule. Today&apos;s board has its own letters — the idea is the same.
              </figcaption>
            </figure>
            </div>
            <div className="mt-10">
            <h2 id="how-to-play-home" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              How to Play Letter Box Game
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-moss">
              Pick letters in order, change sides every letter, and chain your words. The first word can start anywhere. Every word after it must start with the last letter of the previous word. When all twelve letters are used, you win.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-moss">
              <li><strong>Change sides every letter</strong> — never pick two letters in a row from the same side.</li>
              <li><strong>Chain from the last letter</strong> — every word after the first starts with the previous word&apos;s last letter.</li>
              <li><strong>Use every letter</strong> — the puzzle is solved when no letters remain unused, in however many words it took.</li>
            </ul>
            <p className="mt-4 text-[15px] text-moss">Full rules, with examples: <Link href="/how-to-play" className="font-semibold text-forest underline underline-offset-4">How to Play →</Link> · <Link href="/strategies" className="font-semibold text-forest underline underline-offset-4">Strategies for fewer words →</Link></p>
            </div>
          </section>

          <section aria-labelledby="different" className="mt-16 border-t-2 border-line pt-10">
            <div className="grid gap-6 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl bg-forest p-6 text-white shadow-soft sm:p-8">
              <Sprinkles tone="light" />
              <div className="relative">
                <h2 id="different" className="font-display text-[26px] font-bold leading-tight">
                  What makes Letter Box Game different?
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-sage">
                  Most word games hide the answer or hide the letters. Here, every letter is visible, the board is the centrepiece, and the puzzle is the chain you build. Large letters, generous spacing, and a progress bar that always tells you which letters remain.
                </p>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed">
                  <li>✓ &nbsp;Large touch targets, made for phones first</li>
                  <li>✓ &nbsp;Clear feedback when a word cannot be played — and why</li>
                </ul>
              </div>
            </div>
            <div className="rounded-3xl border-2 border-line bg-gradient-to-b from-cream to-butter/70 p-6 shadow-soft sm:p-8">
              <h2 className="font-display text-[26px] font-bold leading-tight text-ink">
                How Letter Box Game Differs from Other NYT Games
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-moss">
                Wordle asks you to guess a hidden word. Spelling Bee asks for as many words as you can find from seven letters. Connections asks you to sort words into hidden groups. Strands asks you to hunt theme words in a grid. Letter Box asks you to build a chain that uses everything. Same love of words, different puzzle. <Link href="/games-like-letter-boxed" className="font-semibold text-forest underline underline-offset-4">Compare all the games →</Link>
              </p>
            </div>
            </div>
            <div className="mt-10">
            <h2 id="fits-now" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Why Letter Box Game Fits Right Now
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-moss">The New York Times version sits behind a subscription. This independent version is free, with no account — so anyone can play a letter-box puzzle without paying first.</p>
            </div>
          </section>

          <section aria-labelledby="two-modes" className="mt-16 border-t-2 border-line pt-10">

            <h2 id="two-modes" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Two Modes, One Puzzle
            </h2>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Daily Puzzle</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">One board per day, the same for everyone, changing at midnight Pakistan time. Play it above, and compare how many words it took you — not the answer itself.</p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Unlimited Puzzle</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">Finished the daily? Keep playing. Practice boards use the same rotation with a different starting point, and you can pick any of the seven boards. <Link href="/unlimited" className="font-semibold text-forest underline underline-offset-4">Play unlimited puzzles →</Link></p>
            <div className="mt-10">
            <h2 id="offers" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Everything Letter Box Game Offers
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <article className="rounded-3xl border-2 border-line bg-cream p-5">
                <h3 className="font-display text-lg font-bold text-ink">Statistics Tracking</h3>
                <p className="mt-2 text-sm leading-relaxed text-moss">Games played, games solved, current streak, fastest solve and solve rate — stored only in your browser, with no account.</p>
              </article>
              <article className="rounded-3xl border-2 border-line bg-cream p-5">
                <h3 className="font-display text-lg font-bold text-ink">Hint System</h3>
                <p className="mt-2 text-sm leading-relaxed text-moss">Three hints per game. The first tap gives a letter and a word length; the second tap reveals the full word. Hints never spoil the whole puzzle at once.</p>
              </article>
              <article className="rounded-3xl border-2 border-line bg-cream p-5">
                <h3 className="font-display text-lg font-bold text-ink">Puzzle Archive</h3>
                <p className="mt-2 text-sm leading-relaxed text-moss">All seven boards in rotation, with boards, par and tiered hints — and daily pages by date, so you can revisit any day&apos;s board. <Link href="/archive" className="font-semibold text-forest underline underline-offset-4">Browse the archive →</Link></p>
              </article>
              <article className="rounded-3xl border-2 border-line bg-cream p-5">
                <h3 className="font-display text-lg font-bold text-ink">No Login or Subscription</h3>
                <p className="mt-2 text-sm leading-relaxed text-moss">Free to play, no account, no download, no subscription. Open the page and play.</p>
              </article>
              <article className="rounded-3xl border-2 border-line bg-cream p-5 sm:col-span-2">
                <h3 className="font-display text-lg font-bold text-ink">Plays on Any Device</h3>
                <p className="mt-2 text-sm leading-relaxed text-moss">Made for phones first, with large touch targets and keyboard support on computers. Your progress stays on the device and browser you played on.</p>
              </article>
            </div>
            </div>
          </section>

          <section aria-labelledby="rules-home" className="mt-16 border-t-2 border-line pt-10">

            <h2 id="rules-home" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Letter Box Game Rules (Complete Guide)
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <article className="rounded-3xl border-2 border-line bg-cream p-5">
                <h3 className="font-display text-lg font-bold text-ink">The rules in brief</h3>
                <p className="mt-2 text-sm leading-relaxed text-moss">Words need at least three letters, no two consecutive letters from the same side, no repeated letter inside one word, and each new word starts with the last letter of the previous one. <Link href="/how-to-play" className="font-semibold text-forest underline underline-offset-4">Full rules →</Link></p>
              </article>
              <article className="rounded-3xl border-2 border-line bg-cream p-5">
                <h3 className="font-display text-lg font-bold text-ink">Winning &amp; par</h3>
                <p className="mt-2 text-sm leading-relaxed text-moss">You win the moment the last unused letter appears in one of your words. Par — the benchmark — is two words for every board here, because each has a checked two-word solution. <Link href="/scoring-and-par" className="font-semibold text-forest underline underline-offset-4">Scoring and par →</Link></p>
              </article>
            </div>
            <div className="mt-10">
            <h2 id="daily-challenge" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Daily Letter Box Challenge (How It Works)
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-moss">It is shared: everyone sees the same board on the same Pakistan calendar day, so friends can compare word counts without spoiling answers. It also changes on a clock you can trust — midnight Pakistan time, every day.</p>
            <p className="mt-4">
              <Link href="/daily" className="min-h-11 inline-flex items-center rounded-full bg-forest px-5 text-sm font-bold text-white">Daily puzzles by date →</Link>
              {" "}
              <Link href="/archive" className="min-h-11 inline-flex items-center rounded-full border-2 border-forest/25 bg-white px-5 text-sm font-bold text-ink">Puzzle archive</Link>
            </p>
            </div>
          </section>

          <section aria-labelledby="strategies-home" className="mt-16 border-t-2 border-line pt-10">

            <h2 id="strategies-home" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Letter Box Strategies
            </h2>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Choosing an Ending Letter</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">End your first word in a letter that starts many common words — E, S, N, Y and L are friendly. A first word ending in a rare letter can strand you, because few words start there.</p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Identifying the bridge letter</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">The bridge letter is the last letter of your first word — it is also the first letter of your second word. Pick your first word with its ending in mind, not just its length. <Link href="/bridge-words" className="font-semibold text-forest underline underline-offset-4">More on bridge words →</Link></p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">The 2-Word Solution Approach</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">Look for a first word of six or seven letters that uses letters from at least three sides, then a second word that starts with its last letter and mops up the rest. All seven live boards work this way. <Link href="/two-word-solutions" className="font-semibold text-forest underline underline-offset-4">All seven two-word solves →</Link></p>
            <p className="mt-4 text-[15px] text-moss">Full strategies, with the whole method: <Link href="/strategies" className="font-semibold text-forest underline underline-offset-4">Strategies →</Link> · <Link href="/8-letter-openers" className="font-semibold text-forest underline underline-offset-4">Long openers, honestly →</Link></p>
            <div className="mt-10 rounded-[32px] border-[3px] border-gold/50 bg-butter/60 p-6 sm:p-8">
            <h2 id="solver-home" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Letter Box Solver Tool (Free Assistant)
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-moss">
              Enter any twelve-letter board, three letters per side, and the solver finds the shortest chain that uses every letter — using only this site&apos;s word list, so every result is a chain the game itself would accept.
            </p>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">It lists every legal word for the board, groups them by first letter, then searches by chain length: one word, then two, then three, then four. The first length with a complete chain is the shortest available in this list. <Link href="/solver" className="font-semibold text-forest underline underline-offset-4">Try the solver →</Link></p>
            </div>
            <div className="mt-10">
            <h2 id="practice-home" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              How to Practice with Unlimited Letter Box Puzzles
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-moss">Finished the daily? Keep playing. Unlimited practice uses the same seven boards with a different starting point, and you can pick any board, any time, as often as you like. Your daily puzzle is never touched by practice play.</p>
            <p className="mt-4">
              <Link href="/unlimited" className="min-h-11 inline-flex items-center rounded-full bg-forest px-5 text-sm font-bold text-white">Start practising →</Link>
            </p>
            </div>
          </section>

          <section aria-labelledby="facts-home" className="mt-16 border-t-2 border-line pt-10">

            <h2 id="facts-home" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Letter Box Game Facts
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-moss">
              These are facts about this site&apos;s own game, measured from its boards and word list — not guesses, and not figures borrowed from another publisher.
            </p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Boards, par and playable words</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">
              Seven boards in rotation. Par is two words for every board, because each has a checked two-word solution. Legal words on each board, in this site&apos;s word list: Puzzle 1: 99, Puzzle 2: 172, Puzzle 3: 108, Puzzle 4: 125, Puzzle 5: 194, Puzzle 6: 133, Puzzle 7: 77.
            </p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Most Common Letters in This Site&apos;s Boards</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">
              Across the seven boards, E and A appear on all seven boards. R, N, T, O and C appear on six each. Twenty-one different letters appear across the boards in total; B, K, Q, X and Z do not appear on any current board. The word list itself contains 2,808 unique common words.
            </p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">What Is a Realistic Improvement Target?</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">
              There is no published average solve time or improvement curve for this site, and this page does not invent one. A realistic personal target is simpler: finish more boards in two words than you did last week, and need fewer hints. Your browser statistics — games solved, streak and fastest solve — show whether that is happening, for you.
            </p>
            <div className="mt-10">
            <h2 id="beginners-home" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Letter Box Tips for Beginners
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-moss">In your first week, expect three- and four-word solves, a few rejected words, and a lot of &quot;oh, that word works!&quot; moments. That is normal. Use hints when you are stuck — they are there to teach, not to punish.</p>
            <p className="mt-4 text-[15px] text-moss"><Link href="/letter-boxed-for-beginners" className="font-semibold text-forest underline underline-offset-4">Beginner&apos;s guide →</Link> · <Link href="/suffixes-and-prefixes" className="font-semibold text-forest underline underline-offset-4">Suffixes and prefixes that win →</Link></p>
            </div>
          </section>

          <section aria-labelledby="home-faq" className="mt-16 border-t-2 border-line pt-10">
            <h2 id="home-faq" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Frequently Asked Questions
            </h2>
            <div className="mt-6 space-y-3">
              {HOME_FAQS.map(([question, answer]) => (
                <details key={question} className="rounded-3xl border-2 border-line bg-cream px-5 py-4">
                  <summary className="cursor-pointer font-display text-[18px] font-bold leading-snug text-ink">{question}</summary>
                  <p className="mt-2 text-sm leading-relaxed text-moss">{answer}</p>
                </details>
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

          <section aria-labelledby="find-way" className="mt-16 border-t-2 border-line pt-10">
            <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-3xl border-2 border-line bg-cream p-6">
              <h2 id="find-way" className="font-display text-xl font-bold text-ink">GAME</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                <li><Link href="/" className="font-semibold text-forest underline underline-offset-4">Play today&apos;s puzzle</Link></li>
                <li><Link href="/unlimited" className="font-semibold text-forest underline underline-offset-4">Unlimited practice</Link></li>
                <li><Link href="/solver" className="font-semibold text-forest underline underline-offset-4">Solver tool</Link></li>
                <li><Link href="/archive" className="font-semibold text-forest underline underline-offset-4">Puzzle archive</Link></li>
                <li><Link href="/daily" className="font-semibold text-forest underline underline-offset-4">Daily puzzles by date</Link></li>
              </ul>
            </div>
            <div className="rounded-3xl border-2 border-line bg-cream p-6">
              <h2 className="font-display text-xl font-bold text-ink">LEARN</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                <li><Link href="/how-to-play" className="font-semibold text-forest underline underline-offset-4">How to play</Link></li>
                <li><Link href="/strategies" className="font-semibold text-forest underline underline-offset-4">Strategies</Link></li>
                <li><Link href="/hints" className="font-semibold text-forest underline underline-offset-4">Hints</Link></li>
                <li><Link href="/faq" className="font-semibold text-forest underline underline-offset-4">FAQ</Link></li>
                <li><Link href="/games-like-letter-boxed" className="font-semibold text-forest underline underline-offset-4">Games like Letter Box</Link></li>
                <li><Link href="/rare-letters" className="font-semibold text-forest underline underline-offset-4">Rare Letters</Link></li>
                <li><Link href="/common-mistakes" className="font-semibold text-forest underline underline-offset-4">Common Mistakes</Link></li>
                <li><Link href="/history" className="font-semibold text-forest underline underline-offset-4">History</Link></li>
                <li><Link href="/word-list" className="font-semibold text-forest underline underline-offset-4">Word List</Link></li>
              </ul>
            </div>
            <div className="rounded-3xl border-2 border-line bg-cream p-6">
              <h2 className="font-display text-xl font-bold text-ink">INFO</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                <li><Link href="/about" className="font-semibold text-forest underline underline-offset-4">About Letter Box Game</Link></li>
                <li><Link href="/faq" className="font-semibold text-forest underline underline-offset-4">Frequently asked questions</Link></li>
                <li><Link href="/privacy-policy" className="font-semibold text-forest underline underline-offset-4">Privacy Policy</Link></li>
                <li><Link href="/terms" className="font-semibold text-forest underline underline-offset-4">Terms</Link></li>
                <li><a href={`mailto:${SITE.email}`} className="font-semibold text-forest underline underline-offset-4">{SITE.email}</a></li>
              </ul>
            </div>
            </div>
            <div className="mt-10 rounded-[32px] border-[3px] border-gold/50 bg-forest p-6 text-white shadow-soft sm:p-8">
            <h2 id="final-advice" className="font-display text-[28px] font-bold leading-tight tracking-tight sm:text-[34px]">
              Final Advice
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-sage">
              Try first, use a hint when you are truly stuck, and study the shortest chain after you finish.
            </p>
            <p className="mt-5">
              <Link href="/" className="inline-block rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink">
                Play today&apos;s puzzle →
              </Link>
              {" "}
              <Link href="/unlimited" className="inline-block rounded-full border-2 border-cream/40 px-6 py-3 text-sm font-bold text-cream">
                Practise unlimited →
              </Link>
            </p>
            </div>
          </section>
          <p className="mt-12 text-center text-sm">
            <a href="#main-content" className="font-bold text-forest underline underline-offset-4">Back to top ↑</a>
          </p>
        </div>
      </main>

      <Footer />
      <HowToPlayModal open={showHowTo} onClose={() => setShowHowTo(false)} />
      <StatsModal open={showStats} onClose={() => setShowStats(false)} stats={stats} />
    </div>
  );
}
