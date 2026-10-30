import { DICTIONARY } from "./dictionary";
import { sideOf, type Puzzle } from "./puzzles";

/**
 * Solver — finds the shortest chains that cover all 12 letters of a board,
 * using ONLY the live site's curated dictionary, so a solver result is
 * always a chain the game itself would accept.
 *
 * Rules enforced (the same rules as src/lib/game.ts):
 *   1. Words need at least 3 letters.
 *   2. No two consecutive letters may come from the same side.
 *   3. A letter may be used at most once within a single word.
 *   4. Each word after the first must start with the previous word's
 *      last letter.
 *   5. No word may repeat inside one chain.
 *   6. Every word must be in the live dictionary.
 *
 * Search is breadth-first by chain length (1, then 2, then 3, then 4
 * words), so the first length with a complete chain is the shortest
 * available in this dictionary. If no chain is found, that only means
 * this dictionary contains none — it is not a claim that the board is
 * unsolvable in general.
 */

export type BoardSides = [string[], string[], string[], string[]];

export function puzzleToSides(puzzle: Puzzle): BoardSides {
  return puzzle.sides;
}

export function sideName(index: number): string {
  return ["Top", "Right", "Bottom", "Left"][index] ?? "?";
}

function sideMap(sides: BoardSides): Map<string, number> {
  const map = new Map<string, number>();
  sides.forEach((side, index) => {
    side.forEach((letter) => map.set(letter, index));
  });
  return map;
}

export function playableWords(sides: BoardSides): string[] {
  const letters = new Set(sides.flat());
  const map = sideMap(sides);
  const out: string[] = [];
  for (const raw of DICTIONARY) {
    const word = raw.toUpperCase();
    if (word.length < 3) continue;
    if (new Set(word.split("")).size !== word.length) continue;
    if ([...word].some((c) => !letters.has(c))) continue;
    let ok = true;
    for (let i = 1; i < word.length; i += 1) {
      if (map.get(word[i - 1]) === map.get(word[i])) {
        ok = false;
        break;
      }
    }
    if (ok) out.push(word);
  }
  return out.sort();
}

/** Side names for a word, e.g. GARDENS → "Top → Right → …". */
export function sidePath(sides: BoardSides, word: string): string[] {
  const map = sideMap(sides);
  return [...word].map((c) => sideName(map.get(c) ?? 0));
}

export function solveBoard(sides: BoardSides, limit = 6, maxWords = 4): string[][] {
  const letters = new Set(sides.flat());
  if (letters.size !== 12) return [];
  const words = playableWords(sides);
  const byFirst = new Map<string, string[]>();
  for (const w of words) {
    const arr = byFirst.get(w[0]) ?? [];
    arr.push(w);
    byFirst.set(w[0], arr);
  }
  for (const arr of byFirst.values()) arr.sort((a, b) => b.length - a.length);

  type Node = { used: Set<string>; last: string; path: string[] };
  let frontier: Node[] = words.map((w) => ({
    used: new Set(w.split("")),
    last: w[w.length - 1],
    path: [w],
  }));
  const seen = new Set<string>();
  for (const n of frontier) seen.add([...n.used].sort().join("") + "|" + n.last);

  for (let depth = 1; depth <= maxWords; depth += 1) {
    const complete = frontier.filter((n) => n.used.size === 12);
    if (complete.length > 0) {
      return complete.slice(0, limit).map((n) => n.path);
    }
    if (depth === maxWords) break;
    const next: Node[] = [];
    for (const n of frontier) {
      for (const w of byFirst.get(n.last) ?? []) {
        if (n.path.includes(w)) continue;
        const used = new Set([...n.used, ...w.split("")]);
        const key = [...used].sort().join("") + "|" + w[w.length - 1];
        if (seen.has(key)) continue;
        seen.add(key);
        next.push({ used, last: w[w.length - 1], path: [...n.path, w] });
        if (next.length > 20000) break;
      }
      if (next.length > 20000) break;
    }
    frontier = next;
    if (frontier.length === 0) break;
  }
  return [];
}

/** Solve a live Puzzle (its own sides, in live side order). */
export function solvePuzzle(puzzle: Puzzle, limit = 6): string[][] {
  return solveBoard(puzzleToSides(puzzle), limit);
}

export { sideOf };
