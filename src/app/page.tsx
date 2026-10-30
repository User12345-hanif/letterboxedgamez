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
  [
    "Can Letter Box Game always be solved in two words?",
    "Not every board in general. On this site, all seven boards in rotation do have a checked two-word solution, so par is two here. Other boards may need three or four words, and the solver searches up to four words for any board you enter.",
  ],
  [
    "How long does it take to improve at Letter Box Game?",
    "It varies from player to player, and there is no fixed timeline. Playing a little each day, using hints when you are stuck, and studying the solver's shortest chain are the most reliable ways to get better. Your own statistics, stored in your browser, show your progress over time.",
  ],
  [
    "What counts as a valid word?",
    "A word counts if it has at least three letters, obeys the side rule and the chaining rule, does not repeat a letter inside itself, has not already been used in this puzzle, and is in this site's curated list of common words. A word missing from that list is a limit of the list, not a judgement on the word.",
  ],
  [
    "How is this different from the NYT?",
    "This site's boards, hints, solver and word list are its own, and the game is free with no account. The New York Times version is a subscription game with its own daily boards. The rules are similar in spirit, but the puzzles here are original to this site.",
  ],
  [
    "Are there different difficulty levels?",
    "No difficulty levels. There are seven boards in rotation, and each one returns every week. Boards feel different because their letters differ — for example, boards with J or V need different words than boards without them — but no board carries an official difficulty rating.",
  ],
  [
    "Can I reuse letters in a word?",
    "Not inside a single word: each letter may be used at most once in one word. Across words, yes — a letter you used in the first word can appear again in a later word, as long as the chain rule is followed.",
  ],
  [
    "Can puzzles be replayed?",
    "Yes. Practice boards can be played again at any time, and the daily puzzle returns every week because the rotation has seven boards. Your progress for a board is saved in your browser, separately for daily and practice play.",
  ],
  [
    "What is the minimum number of words needed to win?",
    "It depends on the board. Par — the benchmark — is two words for every board in rotation here, because each has a checked two-word solution. The minimum for a board you enter in the solver is whatever the shortest chain in this site's word list is, up to four words.",
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
              <li><a href="#which-game" className="font-semibold text-forest underline underline-offset-4">Which game should you play?</a></li>
              <li><a href="#facts-home" className="font-semibold text-forest underline underline-offset-4">Facts</a></li>
              <li><a href="#beginners-home" className="font-semibold text-forest underline underline-offset-4">Tips for Beginners</a></li>
              <li><a href="#who-home" className="font-semibold text-forest underline underline-offset-4">Who can play?</a></li>
              <li><a href="#home-faq" className="font-semibold text-forest underline underline-offset-4">Frequently Asked Questions</a></li>
              <li><a href="#final-advice" className="font-semibold text-forest underline underline-offset-4">Final Advice</a></li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
              <Link href="/solver" className="min-h-11 inline-flex items-center rounded-full bg-forest px-5 text-sm font-bold text-white">Use the solver →</Link>
              <Link href="/unlimited" className="min-h-11 inline-flex items-center rounded-full border-2 border-forest/25 bg-white px-5 text-sm font-bold text-ink">Unlimited practice</Link>
              <Link href="/archive" className="min-h-11 inline-flex items-center rounded-full border-2 border-forest/25 bg-white px-5 text-sm font-bold text-ink">Puzzle archive</Link>
            </div>
          </nav>


          <section aria-labelledby="play-now" className="mt-10 rounded-[32px] border-[3px] border-sky-deep/20 bg-sky-wash/60 p-6 sm:p-8">
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
          </section>

          <section aria-labelledby="what-is" className="mt-16 border-t-2 border-line pt-10">
            <h2 id="what-is" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              What is Letter Box Game?
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-moss">
              Letter Box Game is a word puzzle with twelve letters around a square, three on each side. You link words together until every letter has been used. That is the whole game — simple to learn, tricky to master.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <article className="rounded-3xl border-2 border-line bg-cream p-5">
                <h3 className="font-display text-lg font-bold text-ink">Fresh Daily Challenge</h3>
                <p className="mt-2 text-sm leading-relaxed text-moss">A new board arrives every day at midnight Pakistan time. Everyone sees the same board on the same day, so you can compare how many words it took you — without spoiling the answer.</p>
              </article>
              <article className="rounded-3xl border-2 border-line bg-cream p-5">
                <h3 className="font-display text-lg font-bold text-ink">Sharpen Your Vocabulary</h3>
                <p className="mt-2 text-sm leading-relaxed text-moss">Every board asks you to find words from a small set of letters. You will meet words you know well and words you had forgotten, and you will remember them because you built them yourself.</p>
              </article>
              <article className="rounded-3xl border-2 border-line bg-cream p-5">
                <h3 className="font-display text-lg font-bold text-ink">Play in Under 5 Minutes</h3>
                <p className="mt-2 text-sm leading-relaxed text-moss">Most boards take just a few minutes. There is no time limit, so you can also take your time — but if you only have a short break, a board fits it nicely.</p>
              </article>
              <article className="rounded-3xl border-2 border-line bg-cream p-5">
                <h3 className="font-display text-lg font-bold text-ink">No Login Required</h3>
                <p className="mt-2 text-sm leading-relaxed text-moss">There are no accounts at all. Your progress and statistics stay in your own browser, and only there. Just open the page and play.</p>
              </article>
            </div>
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
          </section>

          <section aria-labelledby="how-to-play-home" className="mt-16 border-t-2 border-line pt-10">
            <h2 id="how-to-play-home" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              How to Play Letter Box Game
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-moss">
              Pick letters in order, change sides every letter, and chain your words. The first word can start anywhere. Every word after it must start with the last letter of the previous word. When all twelve letters are used, you win.
            </p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Strong vs Weak First Words</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">
              A strong first word gathers many letters and ends in a useful letter. On Puzzle 1, CAPTURE is strong: seven letters, and it ends in E, which starts ENJOYS. A weak first word is still valid, but it leaves too much work behind — ACE, for example, uses only three letters and leaves nine still to find. <Link href="/strategies" className="font-semibold text-forest underline underline-offset-4">Read more strategies →</Link>
            </p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">4 Mistakes You Will Make as a Beginner</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-moss">
              <li><strong>Same side twice in a row.</strong> Two letters in a row must come from different sides. Change sides every letter.</li>
              <li><strong>Wrong starting letter.</strong> After the first word, every word must start with the previous word&apos;s last letter. The game shows the required letter.</li>
              <li><strong>Repeating a letter inside one word.</strong> A letter may be used at most once in a single word. If you need it twice, use it in two different words.</li>
              <li><strong>Submitting too soon.</strong> Words need at least three letters, and they must be in the curated word list. If a word is rejected, the game tells you why — read the message and adjust.</li>
            </ol>
            <p className="mt-4 text-[15px] text-moss">Full rules, with examples: <Link href="/how-to-play" className="font-semibold text-forest underline underline-offset-4">How to Play →</Link></p>
          </section>

          <section aria-labelledby="different" className="mt-16 grid gap-6 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl bg-forest p-6 text-white shadow-soft sm:p-8">
              <Sprinkles tone="light" />
              <div className="relative">
                <h2 id="different" className="font-display text-[26px] font-bold leading-tight">
                  What makes Letter Box Game different?
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-sage">
                  Most word games hide the answer or hide the letters. Here, every letter is visible, the board is the centrepiece, and the puzzle is the chain you build. Large letters, generous spacing, a visible path for your current word, and a progress bar that always tells you which letters remain. If you can read the board, you can play the game.
                </p>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed">
                  <li>✓ &nbsp;Large touch targets, made for phones first</li>
                  <li>✓ &nbsp;Keyboard support, focus states and reduced-motion support</li>
                  <li>✓ &nbsp;Clear feedback when a word cannot be played — and why</li>
                  <li>✓ &nbsp;Your progress stays in your browser, and only there</li>
                </ul>
              </div>
            </div>
            <div className="rounded-3xl border-2 border-line bg-gradient-to-b from-cream to-butter/70 p-6 shadow-soft sm:p-8">
              <h2 className="font-display text-[26px] font-bold leading-tight text-ink">
                Why players enjoy Letter Box Game
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-moss">
                It is quick, it is calm, and it fits into a day. A fresh board each morning, a few minutes of word-hunting, and a clean finish when the last letter is used. There is no pressure to be fast and no score to chase — just a small, satisfying puzzle, free, every day.
              </p>
              <h2 className="mt-6 font-display text-[26px] font-bold leading-tight text-ink">
                How Letter Box Game Differs from Other NYT Games
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-moss">
                Wordle asks you to guess a hidden word. Spelling Bee asks for as many words as you can find from seven letters. Connections asks you to sort words into hidden groups. Strands asks you to hunt theme words in a grid. Letter Box asks you to build a chain that uses everything. Same love of words, different puzzle. <Link href="/games-like-letter-boxed" className="font-semibold text-forest underline underline-offset-4">Compare all the games →</Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="fits-now" className="mt-16 border-t-2 border-line pt-10">
            <h2 id="fits-now" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Why Letter Box Game Fits Right Now
            </h2>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">The paywall gap</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">The New York Times version sits behind a subscription. This independent version is free, with no account — so anyone can play a letter-box puzzle without paying first.</p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">A fresh board every day</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">Seven boards rotate, one per day, so a board you enjoyed returns every week and a new one is always coming. Daily puzzles give players a shared board to talk about, without spoiling anything.</p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">A short, calm break</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">No timer, no lives, no ads shouting for attention. Just twelve letters and a quiet few minutes — a puzzle that fits a coffee break as well as a long evening.</p>
          </section>

          <section aria-labelledby="two-modes" className="mt-16 border-t-2 border-line pt-10">
            <h2 id="two-modes" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Two Modes, One Puzzle
            </h2>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Daily Puzzle</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">One board per day, the same for everyone, changing at midnight Pakistan time. Play it above, and compare how many words it took you — not the answer itself.</p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Unlimited Puzzle</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">Finished the daily? Keep playing. Practice boards use the same rotation with a different starting point, and you can pick any of the seven boards. <Link href="/unlimited" className="font-semibold text-forest underline underline-offset-4">Play unlimited puzzles →</Link></p>
          </section>

          <section aria-labelledby="offers" className="mt-16 border-t-2 border-line pt-10">
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
          </section>

          <section aria-labelledby="rules-home" className="mt-16 border-t-2 border-line pt-10">
            <h2 id="rules-home" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Letter Box Game Rules (Complete Guide)
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-moss">
              Words need at least three letters. No two consecutive letters may come from the same side. No letter may repeat inside one word. Each new word must start with the last letter of the previous word. The puzzle is solved when every letter has been used at least once.
            </p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">What Words Are Accepted vs Rejected</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">
              Accepted: a word of three or more letters, in the curated word list, that follows the side rule, the chain rule and the no-repeat rule, and has not already been used in this puzzle. Rejected: too short, same side twice, wrong starting letter, repeated letter inside the word, already used, a letter not on the board, or not yet in the word list. The game always tells you which reason applied. <Link href="/how-to-play" className="font-semibold text-forest underline underline-offset-4">Full rules →</Link>
            </p>
            <h2 className="mt-10 font-display text-[26px] font-bold leading-tight tracking-tight text-ink sm:text-[30px]">
              Winning Conditions &amp; Optimal Solutions
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-moss">
              You win the moment the last unused letter appears in one of your words. The optimal solution — the benchmark, called par — is two words for every board here, because each board has a checked two-word solution. But any chain that uses all twelve letters wins, in two words or more, and a three- or four-word solve you found yourself is still a win.
            </p>
          </section>

          <section aria-labelledby="daily-challenge" className="mt-16 border-t-2 border-line pt-10">
            <h2 id="daily-challenge" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Daily Letter Box Challenge (How It Works)
            </h2>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">What Makes the Daily Puzzle Special</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">It is shared: everyone sees the same board on the same Pakistan calendar day, so friends can compare word counts without spoiling answers. It also changes on a clock you can trust — midnight Pakistan time, every day.</p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">How Difficult Is the Daily Puzzle?</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">Boards feel different, not harder by label. A board with J or V needs different words than a board without them, and a board with many vowels offers different openings than one with few. There are no official difficulty ratings — the challenge is finding a chain that covers everything, in as few words as you can. <Link href="/daily" className="font-semibold text-forest underline underline-offset-4">Daily puzzles by date →</Link></p>
          </section>

          <section aria-labelledby="strategies-home" className="mt-16 border-t-2 border-line pt-10">
            <h2 id="strategies-home" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Letter Box Strategies
            </h2>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Choosing an Ending Letter</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">End your first word in a letter that starts many common words — E, S, N, Y and L are friendly. A first word ending in a rare letter can strand you, because few words start there.</p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Managing vowels for better word chains</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">Vowels connect consonants. If your first word uses up all the easy vowels, the bridge word may have nowhere to go. Leave at least one vowel for the bridge, and check that the bridge word can actually start with the required letter.</p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Identifying the bridge letter</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">The bridge letter is the last letter of your first word — it is also the first letter of your second word. Pick your first word with its ending in mind, not just its length. <Link href="/bridge-words" className="font-semibold text-forest underline underline-offset-4">More on bridge words →</Link></p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Efficient use of long words</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">Long words cover more letters at once, but only if they obey the side rule and leave a workable bridge. A seven-letter word that leaves a clean five-letter bridge beats an eight-letter word that strands a rare letter — and on this site&apos;s boards, the checked openers are seven letters. <Link href="/8-letter-openers" className="font-semibold text-forest underline underline-offset-4">Long openers, honestly →</Link></p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Avoiding dead ends</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">A dead end is a board state where the letters left cannot form a legal word starting with the required letter. Before you submit a word, glance at what is left: can a word starting with its last letter cover those letters? If not, try a different word first.</p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">The 2-Word Solution Approach</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">Look for a first word of six or seven letters that uses letters from at least three sides, then a second word that starts with its last letter and mops up the rest. All seven live boards work this way. <Link href="/two-word-solutions" className="font-semibold text-forest underline underline-offset-4">All seven two-word solves →</Link></p>
          </section>

          <section aria-labelledby="solver-home" className="mt-16 rounded-[32px] border-[3px] border-gold/50 bg-butter/60 p-6 sm:p-8">
            <h2 id="solver-home" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Letter Box Solver Tool (Free Assistant)
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-moss">
              Enter any twelve-letter board, three letters per side, and the solver finds the shortest chain that uses every letter — using only this site&apos;s word list, so every result is a chain the game itself would accept.
            </p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">How the Solver Works</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">It lists every legal word for the board, groups them by first letter, then searches by chain length: one word, then two, then three, then four. The first length with a complete chain is the shortest available in this list. If no chain is found, that only means this list contains none — it is not a claim that the board is unsolvable in general.</p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">When to Use the Solver and When Not To</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">Use it when you are stuck, when you want to study a route, or when you want to check whether a board can be solved in two words. Do not use it as a first step every time — you will learn far more by trying first, then checking where your chain went wrong.</p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Using the Solver as a Learning Tool</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">After a solve, compare your chain with the solver&apos;s shortest chain. Did it use a longer opener? A different bridge letter? A word you had not thought of? That comparison is the lesson. <Link href="/solver" className="font-semibold text-forest underline underline-offset-4">Try the solver →</Link></p>
          </section>

          <section aria-labelledby="practice-home" className="mt-16 border-t-2 border-line pt-10">
            <h2 id="practice-home" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              How to Practice with Unlimited Letter Box Puzzles
            </h2>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">How Unlimited Mode Differs from the Daily Puzzle</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">The daily puzzle is one board, shared by everyone, changing at midnight. Unlimited practice uses the same seven boards with a different starting point, and you can pick any board, any time, as often as you like. Your daily puzzle is never touched by practice play.</p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Focused practice exercises for specific skills</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-moss">
              <li><strong>Rare letters:</strong> play Puzzle 1 or Puzzle 7 and hunt for words containing J or V first.</li>
              <li><strong>Bridge letters:</strong> play any board and, before submitting, name the bridge letter your first word will end in.</li>
              <li><strong>Two-word focus:</strong> try to finish a board in exactly two words, then check your chain against the solver&apos;s shortest chain.</li>
            </ul>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Learn from the solver while you practise</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">After a practice board, enter it in the solver and study the shortest chain. The solver is a teacher here, not a shortcut: the goal is to find the next board&apos;s chain yourself. <Link href="/unlimited" className="font-semibold text-forest underline underline-offset-4">Start practising →</Link></p>
          </section>

          <section aria-labelledby="which-game" className="mt-16 border-t-2 border-line pt-10">
            <h2 id="which-game" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Which NYT Word Game Should You Play?
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-moss">
              If you like guessing a hidden word, try Wordle. If you like finding many words from seven letters, try Spelling Bee. If you like sorting words into hidden groups, try Connections. If you like hunting theme words in a grid, try Strands. If you like building a chain from visible letters, play Letter Box Game here — free, with no account. <Link href="/games-like-letter-boxed" className="font-semibold text-forest underline underline-offset-4">Full comparison of games like Letter Box →</Link>
            </p>
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
          </section>

          <section aria-labelledby="beginners-home" className="mt-16 border-t-2 border-line pt-10">
            <h2 id="beginners-home" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Letter Box Tips for Beginners
            </h2>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Your First Week: What to Expect</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">In your first week, expect three- and four-word solves, a few rejected words, and a lot of &quot;oh, that word works!&quot; moments. That is normal. Use hints when you are stuck — they are there to teach, not to punish.</p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Building Vocabulary for Letter Box Specifically</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">Learn words by their endings and beginnings: -S, -ED, -URE, -AL, -GE and -Y all appear in live solves. When you meet a new word in a solve, try to use it on the next board. <Link href="/suffixes-and-prefixes" className="font-semibold text-forest underline underline-offset-4">Suffixes and prefixes that win →</Link></p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">How Long Does It Take to Get Good?</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">There is no fixed time, and anyone promising one is guessing. Most players find two-word solves start to appear after a week or two of daily play — but &quot;good&quot; here means enjoying the puzzle and finishing boards, not hitting a number. <Link href="/letter-boxed-for-beginners" className="font-semibold text-forest underline underline-offset-4">Beginner&apos;s guide →</Link></p>
          </section>

          <section aria-labelledby="exercises-home" className="mt-16 border-t-2 border-line pt-10">
            <h2 id="exercises-home" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              What Letter Box Game Exercises
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-moss">
              This section describes the skills the game itself uses. It is not a health claim and it does not cite research — it is simply what you practise when you play.
            </p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Vocabulary</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">You search your memory for words that fit the letters, the sides and the chain. Words you find yourself are easier to remember next time.</p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Pattern recognition</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">You learn to spot which letters can follow which, which sides are open, and which endings are available. That pattern-spotting is the core skill of the game.</p>
            <h3 className="mt-6 font-display text-xl font-bold text-ink">Planning</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-moss">A good solve is planned backwards: pick a bridge, then a first word that ends in its starting letter. Planning a chain, not just finding a word, is what turns a three-word solve into a two-word solve.</p>
          </section>

          <section aria-labelledby="who-home" className="mt-16 border-t-2 border-line pt-10">
            <h2 id="who-home" className="font-display text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Who Can Play Letter Box Game?
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-moss">Anyone who likes words. No account, no age gate, no special knowledge — just twelve letters and a few minutes.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <article className="rounded-3xl border-2 border-line bg-cream p-5">
                <h3 className="font-display text-lg font-bold text-ink">Students</h3>
                <p className="mt-2 text-sm leading-relaxed text-moss">A quick daily puzzle that practises spelling and word-building, with hints when a word will not come.</p>
              </article>
              <article className="rounded-3xl border-2 border-line bg-cream p-5">
                <h3 className="font-display text-lg font-bold text-ink">Professionals</h3>
                <p className="mt-2 text-sm leading-relaxed text-moss">A calm break between tasks — one board, a few minutes, no inbox, no feed.</p>
              </article>
              <article className="rounded-3xl border-2 border-line bg-cream p-5">
                <h3 className="font-display text-lg font-bold text-ink">Word Enthusiasts</h3>
                <p className="mt-2 text-sm leading-relaxed text-moss">Par-two boards, alternative chains and a solver to study — plenty to chew on, even for strong players.</p>
              </article>
              <article className="rounded-3xl border-2 border-line bg-cream p-5">
                <h3 className="font-display text-lg font-bold text-ink">Lifelong Learners</h3>
                <p className="mt-2 text-sm leading-relaxed text-moss">New words every day, in a game that rewards trying, not just knowing. Every board teaches a word or two.</p>
              </article>
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

          <section aria-labelledby="find-way" className="mt-16 grid gap-6 sm:grid-cols-3">
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
                <li><Link href="/two-word-solutions" className="font-semibold text-forest underline underline-offset-4">Two-word solutions</Link></li>
                <li><Link href="/games-like-letter-boxed" className="font-semibold text-forest underline underline-offset-4">Games like Letter Box</Link></li>
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
          </section>

          <section aria-labelledby="final-advice" className="mt-16 rounded-[32px] border-[3px] border-gold/50 bg-forest p-6 text-white shadow-soft sm:p-8">
            <h2 id="final-advice" className="font-display text-[28px] font-bold leading-tight tracking-tight sm:text-[34px]">
              Final Advice
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-sage">
              Try first, use a hint when you are truly stuck, and study the shortest chain after you finish. That is how a three-word solver becomes a two-word solver — one board at a time, one day at a time.
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
