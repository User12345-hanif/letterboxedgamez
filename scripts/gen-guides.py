#!/usr/bin/env python3
"""Generate the 12 guide pages for the merged live repo.

All examples use live puzzles (Puzzle 1-7) or the live dictionary, never
invented boards. No NYT daily boards or answers are reproduced, and no
affiliation is claimed. Run once; output is checked in.
"""
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GUIDES_DIR = ROOT / "src" / "app"

GUIDES = {
    "two-word-solutions": {
        "title": "Two-Word Letter Box Solutions",
        "kicker": "Strategy",
        "desc": "How two-word solves work in Letter Box Game, with all seven live puzzles as worked examples.",
        "intro": "Every puzzle in the live rotation is solved in two words. That is not a coincidence: the boards were built so a strong first word gathers most of the letters and a second word, starting with the first word's final letter, mops up the rest.",
        "body": """
      <h2>The pattern</h2>
      <p>Take Puzzle 1: CAPTURE, then ENJOYS. CAPTURE uses C, A, P, T, U, R, E. ENJOYS starts with E, the last letter of CAPTURE, and adds N, J, O, Y, S. Together they cover all twelve letters, and neither word breaks the side rule or repeats a letter.</p>
      <h2>All seven live two-word solves</h2>
      <ul>
        <li>Puzzle 1: CAPTURE → ENJOYS</li>
        <li>Puzzle 2: GARDENS → SWITCH</li>
        <li>Puzzle 3: JOURNEY → YACHTS</li>
        <li>Puzzle 4: FATHOMS → SLICED</li>
        <li>Puzzle 5: DOLPHIN → NATURE — and DOLPHIN → NEUTRAL also works</li>
        <li>Puzzle 6: CRYSTAL → LOUNGE</li>
        <li>Puzzle 7: OVERLAP → PUNCHY</li>
      </ul>
      <h2>How to hunt for one</h2>
      <p>Look for a first word of six or seven letters that uses letters from at least three sides and ends in a letter that starts many common words — E, S, N, Y and L are friendly. Then ask: what words start with that letter and contain the letters you still need? If the second word needs a letter from the same side as the first word's last letter, it cannot start there — pick a different first word. The <a href="/solver">solver</a> shows the shortest chain for any board, so you can study the shape of a two-word solve and then try to find your own.</p>
      <p>Any chain that uses all twelve letters counts, even if it takes three or four words. Two words is the benchmark, not a requirement.</p>
""",
    },
    "rare-letters": {
        "title": "Rare Letters in Letter Box",
        "kicker": "Strategy",
        "desc": "How to handle J, V and Y on Letter Box boards, and why Q, X and Z need a different approach.",
        "intro": "Rare letters feel scary because they appear in few words. On the live boards they are manageable: the only genuinely rare letters present are J and V, plus Y, which is far more flexible than it looks.",
        "body": """
      <h2>Where rare letters live</h2>
      <p>Puzzle 1 has J and Y. Puzzle 3 has J and Y. Puzzle 7 has V and Y. No live board currently contains Q, X or Z. That is a fact about these seven boards, not a rule of the game — a custom board in the solver can contain any letters, and the solver will only suggest words that are actually in the word list.</p>
      <h2>J: pair it early</h2>
      <p>J usually needs a following vowel. In ENJOYS, J sits between N and O, on the Top side, with neighbours from the Left and Right sides. If J is still unused late in a solve, look for a word that ends in a letter that can start a J word — ENJOYS starts with E, so a first word ending in E unlocks it.</p>
      <h2>V: look for -VE and -V words</h2>
      <p>OVERLAP → PUNCHY is Puzzle 7, and V sits in OVERLAP between O and E. Words with V often end in -VE or start with V, so a chain that ends in a letter V can start, or a word containing V can bridge two common sections.</p>
      <h2>Y: a bridge, not a dead end</h2>
      <p>Y starts YACHTS and PUNCHY ends in Y. Treat Y as both a starter and a finisher: a first word ending in Y opens Y words, and a word ending in Y is a clean finish. When Y is your last unused letter, search for words ending in Y first.</p>
      <p>If a board does contain Q, X or Z, do not guess: check the <a href="/solver">solver</a> for which words in this word list actually contain that letter on that board. A word you cannot verify is not a plan.</p>
""",
    },
    "suffixes-and-prefixes": {
        "title": "Suffixes and Prefixes That Win Letter Box Games",
        "kicker": "Strategy",
        "desc": "Use common word endings and beginnings — -S, -ED, -URE, -AL, -GE, -Y — to cover more letters with fewer words.",
        "intro": "The fastest way to cover twelve letters is to let word parts do the work. Suffixes and prefixes are letter bundles: one ending can add three or four letters you still need, in a single word.",
        "body": """
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
""",
    },
    "bridge-words": {
        "title": "Bridge Words in Letter Box",
        "kicker": "Strategy",
        "desc": "Bridge words link two parts of a board: they start with one word's last letter and carry the letters you still need.",
        "intro": "A bridge word is the second word in a two-word solve — or any word that connects what you have used to what you have not. Its job is twofold: start with the required letter, and contain as many unused letters as possible.",
        "body": """
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
""",
    },
    "8-letter-openers": {
        "title": "8-Letter Openers for Letter Box",
        "kicker": "Strategy",
        "desc": "Why the live boards use 7-letter openers, and how to hunt for a genuine 8-letter opener on a custom board.",
        "intro": "A long opener is attractive: one word that covers most of the board. On the current live boards, though, honesty comes first — no 8-letter word in this site's word list fits any of the seven boards, so the checked openers here are all 7 letters.",
        "body": """
      <h2>The live truth</h2>
      <p>Every live checked solve starts with a 7-letter word: CAPTURE, GARDENS, JOURNEY, FATHOMS, DOLPHIN, CRYSTAL, OVERLAP. That is the benchmark to aim for on these boards. Claiming an 8-letter opener for them would be inventing a word that the game would reject.</p>
      <h2>When 8-letter openers do exist</h2>
      <p>The word list does contain longer words — for example DISCOUNT and GRATEFUL are in the list. Whether one fits a board depends on the board's letters and sides, not on the word alone. Type a custom board into the <a href="/solver">solver</a> and look at its playable-word list: if an 8-letter word appears there, it obeys the side rule and the no-repeat rule for that board, and it is a real opener candidate. If none appears, no amount of wishing makes one fit.</p>
      <h2>How to judge an opener</h2>
      <p>Length is not the whole story. A good opener uses letters from at least three sides, ends in a letter that starts many words, and leaves a bridge word that can cover the rest. A 7-letter opener that leaves a clean 5-letter bridge beats an 8-letter opener that strands a rare letter. Aim for the chain, not the first word alone.</p>
""",
    },
    "common-mistakes": {
        "title": "Common Letter Box Mistakes",
        "kicker": "Strategy",
        "desc": "The seven mistakes the game itself reports — and how to fix each one before you submit.",
        "intro": "The game tells you exactly why a word was rejected. Learning those seven messages is the fastest way to stop repeating the same mistake.",
        "body": """
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
""",
    },
    "scoring-and-par": {
        "title": "Letter Box Scoring and Par Explained",
        "kicker": "Guide",
        "desc": "Par, stars and solve rate in Letter Box Game: what each number means, and what counts as a good solve.",
        "intro": "Par is the benchmark number of words for a puzzle. On this site, par is simply the length of the checked solution — and every live puzzle has par 2.",
        "body": """
      <h2>Par on the live boards</h2>
      <p>All seven live puzzles have par 2, because each checked solution uses two words. A solve in 2 words meets par. A solve in 3 words is one over par. A solve in 4 or more words still solves the puzzle — it just uses more words than the benchmark.</p>
      <h2>Stars</h2>
      <p>The game awards 3 stars for a solve at or under par, 2 stars for one over par, and 1 star for any other completed solve. Stars are a summary, not a score to chase at the cost of enjoying the board: a 3-word solve you found yourself is better practice than a 2-word solve you copied.</p>
      <h2>Other numbers</h2>
      <p>The timer counts up from your first letter and stops when you solve, so it measures your solve time for that board. Statistics — games played, games solved, current streak, fastest solve and solve rate — are stored only in your own browser, with no account. They do not follow you to another device, and they are not shared with anyone.</p>
      <p>There is no time limit and no penalty for extra words. The only failure state is giving up, and even then the hints and the <a href="/solver">solver</a> are there to help you finish.</p>
""",
    },
    "letter-boxed-vs-wordle": {
        "title": "Letter Boxed vs Wordle",
        "kicker": "Comparison",
        "desc": "Letter Box and Wordle are both word games, but they test different skills: chaining and coverage versus guessing a hidden word.",
        "intro": "Both games use letters and common English words, and both are free daily puzzles. That is where the similarity ends. This page compares the two honestly, without claiming any affiliation with either original publisher.",
        "body": """
      <h2>The core difference</h2>
      <p>Wordle gives you a hidden five-letter word and six guesses, with colour feedback on each guess. Letter Box Game gives you all twelve letters up front and asks you to use every one of them in a chain of words. One is a guessing game with feedback; the other is a construction game with a visible board.</p>
      <h2>What each game rewards</h2>
      <ul>
        <li>Wordle rewards a good first guess and careful elimination. You learn from each guess.</li>
        <li>Letter Box rewards planning: a first word that gathers letters, ends in a useful letter, and leaves a bridge that can finish the board.</li>
        <li>Wordle has one answer per day. Letter Box boards here have at least one checked solution, and often more — Puzzle 5 finishes with NATURE or NEUTRAL.</li>
      </ul>
      <h2>Which to play</h2>
      <p>If you like narrowing down a hidden answer, Wordle is the tighter puzzle. If you like building something from visible pieces, Letter Box is the more creative one. Many players enjoy both, for different reasons, and there is no reason to choose only one. Our version of Letter Box is original and independent — it is not Wordle, and it is not affiliated with the New York Times.</p>
""",
    },
    "letter-boxed-vs-spelling-bee": {
        "title": "Letter Boxed vs Spelling Bee",
        "kicker": "Comparison",
        "desc": "Letter Box and Spelling Bee both build words from a small set of letters, but one chains words to cover a board and the other hunts for many words.",
        "intro": "Both games give you a handful of letters and ask for English words. Spelling Bee asks for as many words as you can find from seven letters, with one required centre letter. Letter Box asks for a chain that uses twelve letters, three on each of four sides, at least once.",
        "body": """
      <h2>Coverage versus quantity</h2>
      <p>In Spelling Bee, a word is good if it uses the letters, especially the centre letter, and longer words and pangrams score more. In Letter Box, a word is good if it advances the chain: it starts with the required letter, obeys the side rule, and adds letters you still need. A brilliant Spelling Bee word that breaks the side rule is useless here, and a short Letter Box word that adds three new letters is excellent.</p>
      <h2>Rules that change the strategy</h2>
      <ul>
        <li>Spelling Bee letters can repeat. Letter Box letters cannot repeat inside a single word.</li>
        <li>Spelling Bee words can be any length from four up. Letter Box words need at least three letters.</li>
        <li>Spelling Bee has a scoring ladder and ranks. Letter Box has par and stars, based on word count, not word length.</li>
      </ul>
      <p>If you enjoy finding many words from a small set, Spelling Bee is the deeper word-hunt. If you enjoy finding one clean chain that uses everything exactly once, Letter Box is the cleaner construction puzzle. This site's Letter Box puzzles are original and independent, and are not affiliated with the New York Times.</p>
""",
    },
    "history": {
        "title": "The History of Letter Box Puzzles",
        "kicker": "Guide",
        "desc": "How letter-box puzzles work, how this independent version came to be, and how it differs from the New York Times game.",
        "intro": "Letter-box puzzles are a family of word puzzles built around a simple idea: letters arranged around a square, words built by moving from side to side, and a chain that uses every letter. The New York Times version, Letter Boxed, made the format widely known as a daily game.",
        "body": """
      <h2>The format</h2>
      <p>The format's appeal is that it is visible: you can see every letter, you can see which letters you have used, and you can see the chain growing. The constraints — change sides every letter, chain words, use everything — turn a word list into a puzzle, because most chains fail one of those constraints.</p>
      <h2>This site's version</h2>
      <p>Letter Box Game on this site is an independent, original version. Its puzzles are its own: seven boards in rotation, each with a checked solution, a hint, and a par of two words. It is free, it needs no account, it stores progress only in your browser, and it is not affiliated with, endorsed by, or connected to the New York Times or any other publisher. If you are looking for today's New York Times Letter Boxed answer, you will not find it here — and that is deliberate: this site's answers are for its own boards only.</p>
      <h2>Why an independent version exists</h2>
      <p>A free, no-account version lets anyone play without a subscription, practise on unlimited boards, and study solutions with a solver that uses a stated word list. The goal is not to replace the original, but to offer a clear, honest version of the same kind of puzzle, with its own boards and its own rules stated in full.</p>
""",
    },
    "word-list": {
        "title": "The Letter Box Word List",
        "kicker": "Guide",
        "desc": "What words Letter Box Game accepts, how the curated list works, and why a real word can still be rejected.",
        "intro": "Letter Box Game checks words against a curated list of common English words, not against a complete dictionary. That choice is deliberate, and it explains the most confusing rejection in the game.",
        "body": """
      <h2>What is in the list</h2>
      <p>The list contains 2,808 unique common words, including every word in every checked solution. It is expanded only by adding verified common words — never invented at runtime. Short common words, longer common words, and the words in the live solutions are all in it.</p>
      <h2>What is not in the list</h2>
      <p>Obscure words, proper names, abbreviations and very rare spellings may be missing, even if they are real English. A rejection for that reason is a limit of the list, not a judgement on the word. The game says so plainly when it rejects a word for this reason, so you can try a more common word instead.</p>
      <h2>How to use the list honestly</h2>
      <p>The <a href="/solver">solver</a> uses exactly this list, so its results are always words the game would accept. If you want to know whether a word will be accepted before you play it, check it in the solver for that board. If a word you expected is missing, that is useful feedback — but the list is curated for common words, so an obscure word staying out is the intended behaviour, not a bug.</p>
""",
    },
    "letter-boxed-for-beginners": {
        "title": "Letter Boxed for Beginners",
        "kicker": "Guide",
        "desc": "A gentle first game of Letter Box: the rules in plain language, worked through on Puzzle 1, CAPTURE → ENJOYS.",
        "intro": "If you have never played a letter-box puzzle, start here. You need no vocabulary tricks — just twelve letters, four sides, and one goal: use every letter.",
        "body": """
      <h2>The goal in one sentence</h2>
      <p>Build a chain of words that uses all twelve letters on the board at least once. That is it. There is no time limit, no penalty for extra words, and no account to create.</p>
      <h2>A worked first game: Puzzle 1</h2>
      <p>The board is Top C, U, J; Right A, R, O; Bottom P, E, Y; Left T, N, S. Start with CAPTURE: C (Top), A (Right), P (Bottom), T (Left), U (Top), R (Right), E (Bottom). Notice the sides change every single letter, and no letter repeats inside the word. CAPTURE ends in E, so the next word must start with E. ENJOYS does: E (Bottom), N (Left), J (Top), O (Right), Y (Bottom), S (Left). Together, CAPTURE and ENJOYS use all twelve letters. Puzzle solved, in two words — par.</p>
      <h2>Your first three habits</h2>
      <ol>
        <li>Check the side rule as you pick: never pick two letters in a row from the same side.</li>
        <li>Check the chain rule before the second word: it must start with the last letter of the first.</li>
        <li>Watch the unused letters, not the word count. A solve is finished when no letters remain unused, however many words it took.</li>
      </ol>
      <p>Ready to try? <a href="/">Play today's puzzle</a>, or practise without pressure on <a href="/unlimited">unlimited boards</a>. If you get stuck, the <a href="/hints">hints page</a> explains how hints work without spoiling anything.</p>
""",
    },
}

TEMPLATE = """import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "__TITLE__",
  description: "__DESC__",
  alternates: { canonical: canonical("/__SLUG__") },
  openGraph: {
    title: "__TITLE__",
    description: "__DESC__",
    url: canonical("/__SLUG__"),
  },
};

export default function GuidePage() {
  return (
    <ArticleClient kicker="__KICKER__" title="__TITLE__" intro="__INTRO__">
__BODY__    </ArticleClient>
  );
}
"""

for slug, g in GUIDES.items():
    out = (TEMPLATE
        .replace("__TITLE__", g["title"])
        .replace("__DESC__", g["desc"])
        .replace("__SLUG__", slug)
        .replace("__KICKER__", g["kicker"])
        .replace("__INTRO__", g["intro"])
        .replace("__BODY__", g["body"]))
    path = GUIDES_DIR / slug / "page.tsx"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(out)
    print("wrote", path)
print("done", len(GUIDES))
