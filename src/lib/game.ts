import { isInDictionary } from "./dictionary";
import { allPuzzleLetters, sideOf, type Puzzle } from "./puzzles";

/**
 * Game rules — pure functions, no UI. Every rule the board enforces
 * lives here so it can be unit-checked without rendering anything.
 *
 * Rules:
 *  1. A word has at least 3 letters.
 *  2. No two consecutive letters may come from the same side.
 *  3. Each word after the first must start with the previous word's
 *     last letter.
 *  4. A word must be in the curated dictionary.
 *  5. A word may not be repeated in the same game.
 *  6. The puzzle is solved when every letter has been used at least once.
 *  7. A letter may be used at most once within a single word, so the
 *     path on the board is always easy to follow.
 */

export type RejectReason =
  | "too-short"
  | "same-side"
  | "wrong-start"
  | "not-in-dictionary"
  | "already-used"
  | "repeated-letter"
  | "unknown-letter";

export interface Validation {
  ok: boolean;
  reason?: RejectReason;
  message?: string;
}

export const MIN_WORD_LENGTH = 3;

export function lettersOf(word: string): string[] {
  return word.toUpperCase().replace(/[^A-Z]/g, "").split("");
}

export function validateWord(
  puzzle: Puzzle,
  word: string,
  submitted: readonly string[],
): Validation {
  const letters = lettersOf(word);
  if (letters.length < MIN_WORD_LENGTH) {
    return {
      ok: false,
      reason: "too-short",
      message: `Words need at least ${MIN_WORD_LENGTH} letters. Keep going.`,
    };
  }
  const allowed = allPuzzleLetters(puzzle);
  if (letters.some((l) => !allowed.has(l))) {
    return {
      ok: false,
      reason: "unknown-letter",
      message: "That word uses a letter that is not on this board.",
    };
  }
  if (new Set(letters).size !== letters.length) {
    return {
      ok: false,
      reason: "repeated-letter",
      message:
        "Use each letter at most once in a word. Pick a different letter next.",
    };
  }
  const sides = sideOf(puzzle);
  for (let i = 1; i < letters.length; i += 1) {
    if (sides.get(letters[i]) === sides.get(letters[i - 1])) {
      return {
        ok: false,
        reason: "same-side",
        message:
          "Two letters in a row cannot come from the same side. Pick a letter from a different side next.",
      };
    }
  }
  if (submitted.length > 0) {
    const last = submitted[submitted.length - 1];
    const required = last[last.length - 1];
    if (letters[0] !== required) {
      return {
        ok: false,
        reason: "wrong-start",
        message: `Your next word must start with “${required}” — the last letter of “${last}”.`,
      };
    }
  }
  const upper = letters.join("");
  if (submitted.some((w) => w.toUpperCase() === upper)) {
    return {
      ok: false,
      reason: "already-used",
      message: "You have already used that word in this puzzle.",
    };
  }
  if (!isInDictionary(upper.toLowerCase())) {
    return {
      ok: false,
      reason: "not-in-dictionary",
      message:
        "That word is not in our curated word list yet. Try a more common word — the list is growing, and this is not a judgement on the word itself.",
    };
  }
  return { ok: true };
}

/** Can this letter be picked next, given the current partial word? */
export function canPickLetter(
  puzzle: Puzzle,
  letter: string,
  current: readonly string[],
  submitted: readonly string[],
): boolean {
  if (current.includes(letter)) return false;
  if (current.length === 0 && submitted.length > 0) {
    const required = submitted[submitted.length - 1].slice(-1);
    if (letter !== required) return false;
  }
  if (current.length === 0) return true;
  const sides = sideOf(puzzle);
  return sides.get(letter) !== sides.get(current[current.length - 1]);
}

export function usedLetters(submitted: readonly string[]): Set<string> {
  return new Set(submitted.flatMap((w) => lettersOf(w)));
}

export function remainingLetters(
  puzzle: Puzzle,
  submitted: readonly string[],
): string[] {
  const used = usedLetters(submitted);
  return puzzle.sides.flat().filter((l) => !used.has(l));
}

export function isSolved(puzzle: Puzzle, submitted: readonly string[]): boolean {
  if (submitted.length === 0) return false;
  const used = usedLetters(submitted);
  return puzzle.sides.flat().every((l) => used.has(l));
}

export function progressPercent(
  puzzle: Puzzle,
  submitted: readonly string[],
): number {
  const total = puzzle.sides.flat().length;
  return Math.round((usedLetters(submitted).size / total) * 100);
}

/** Check a stored solution the same way a player's words are checked. */
export function verifySolution(puzzle: Puzzle): Validation & { coversAll: boolean } {
  const submitted: string[] = [];
  for (const word of puzzle.solution) {
    const v = validateWord(puzzle, word, submitted);
    if (!v.ok) return { ...v, coversAll: false };
    submitted.push(word);
  }
  return { ok: true, coversAll: isSolved(puzzle, submitted) };
}

/**
 * Find a helpful hint word from the dictionary: it must start with the
 * required letter, obey the side rule, and use at least one letter the
 * player has not used yet. Prefers words covering the most unused letters.
 */
export function findHintWord(
  puzzle: Puzzle,
  submitted: readonly string[],
  current: readonly string[],
  dictionary: Iterable<string>,
): string | null {
  const requiredStart =
    current.length > 0
      ? null
      : submitted.length > 0
        ? submitted[submitted.length - 1].slice(-1)
        : null;
  const unused = new Set(remainingLetters(puzzle, submitted));
  const sides = sideOf(puzzle);
  let best: string | null = null;
  let bestScore = -1;

  for (const raw of dictionary) {
    const word = raw.toUpperCase();
    if (word.length < MIN_WORD_LENGTH) continue;
    if (submitted.some((w) => w.toUpperCase() === word)) continue;
    if (requiredStart && word[0] !== requiredStart) continue;
    if (current.length > 0 && !word.startsWith(current.join(""))) continue;
    const letters = word.split("");
    if (new Set(letters).size !== letters.length) continue;
    if (letters.some((l) => !sides.has(l))) continue;
    let ok = true;
    for (let i = 1; i < letters.length; i += 1) {
      if (sides.get(letters[i]) === sides.get(letters[i - 1])) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    const newLetters = new Set(letters.filter((l) => unused.has(l))).size;
    if (newLetters === 0) continue;
    // Prefer covering many new letters, then a shorter, friendlier word.
    const score = newLetters * 10 - word.length;
    if (score > bestScore) {
      bestScore = score;
      best = word;
    }
  }
  return best;
}
