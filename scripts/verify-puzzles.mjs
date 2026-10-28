/**
 * Puzzle verification — run with `npm run verify:puzzles`.
 * Reads the puzzle and dictionary sources (as text, no TS build needed)
 * and checks every stored solution against the game rules. Fails loudly
 * if any puzzle is unsolvable, uses a repeated letter, or has a
 * solution word missing from the dictionary.
 *
 * This is the check that backs the claim "every puzzle is solvable".
 * It does not invent words: it only checks the words already listed.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function extractArrayLiteral(source, name) {
  const start = source.indexOf(name);
  if (start === -1) throw new Error(`Could not find ${name}`);
  const eq = source.indexOf("=", start);
  const bracket = source.indexOf("[", eq);
  let depth = 0;
  let inString = null;
  for (let i = bracket; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (ch === inString && source[i - 1] !== "\\") inString = null;
      continue;
    }
    if (ch === '"' || ch === "'") inString = ch;
    else if (ch === "[") depth += 1;
    else if (ch === "]") {
      depth -= 1;
      if (depth === 0) return source.slice(bracket, i + 1);
    }
  }
  throw new Error(`Unbalanced array for ${name}`);
}

const puzzlesSrc = readFileSync(join(root, "src/lib/puzzles.ts"), "utf8");
const dictSrc = readFileSync(join(root, "src/lib/dictionary.ts"), "utf8");

// Dictionary: every quoted word in the two exported arrays.
const dict = new Set();
for (const arrName of ["DICTIONARY_WORDS", "DICTIONARY_WORDS_LONG"]) {
  const lit = extractArrayLiteral(dictSrc, arrName);
  for (const m of lit.matchAll(/"([a-z]+)"/g)) dict.add(m[1]);
}

// Puzzles: parse id / sides / solution blocks with a tolerant regex.
const puzzleBlocks = [...puzzlesSrc.matchAll(/id:\s*"([^"]+)"[\s\S]*?sides:\s*\[([\s\S]*?)\],\s*solution:\s*\[([^\]]+)\]/g)];
if (puzzleBlocks.length === 0) throw new Error("No puzzles parsed");

let failures = 0;
for (const [, id, sidesRaw, solutionRaw] of puzzleBlocks) {
  const sides = [...sidesRaw.matchAll(/\[([^\]]+)\]/g)].map((m) =>
    [...m[1].matchAll(/"([A-Z])"/g)].map((x) => x[1]),
  );
  const solution = [...solutionRaw.matchAll(/"([A-Z]+)"/g)].map((m) => m[1]);
  const errors = [];
  if (sides.length !== 4) errors.push(`expected 4 sides, got ${sides.length}`);
  if (sides.some((s) => s.length !== 3)) errors.push("every side must have exactly 3 letters");
  const all = sides.flat();
  if (all.length !== 12) errors.push(`expected 12 letters, got ${all.length}`);
  if (new Set(all).size !== 12) errors.push(`letters must be distinct, got: ${all.join("")}`);
  const sideOf = new Map();
  sides.forEach((side, i) => side.forEach((l) => sideOf.set(l, i)));

  let prev = null;
  const used = new Set();
  for (const word of solution) {
    if (word.length < 3) errors.push(`${word}: too short`);
    if (!dict.has(word.toLowerCase())) errors.push(`${word}: not in dictionary`);
    for (const l of word) {
      if (!sideOf.has(l)) errors.push(`${word}: letter ${l} not on board`);
      used.add(l);
    }
    for (let i = 1; i < word.length; i += 1) {
      if (sideOf.get(word[i]) === sideOf.get(word[i - 1])) {
        errors.push(`${word}: consecutive letters ${word[i - 1]}${word[i]} share a side`);
      }
    }
    if (prev && word[0] !== prev[prev.length - 1]) {
      errors.push(`${word}: must start with ${prev[prev.length - 1]} (last letter of ${prev})`);
    }
    prev = word;
  }
  if (used.size !== 12) errors.push(`solution covers ${used.size}/12 letters: ${[...used].join("")}`);
  if (errors.length > 0) {
    failures += 1;
    console.error(`\n✗ ${id}`);
    for (const e of errors) console.error(`  - ${e}`);
  } else {
    console.log(`✓ ${id}: ${solution.join(" → ")} covers all 12 letters`);
  }
}
console.log(`\nDictionary words checked: ${dict.size}`);
if (failures > 0) {
  console.error(`${failures} puzzle(s) failed verification.`);
  process.exit(1);
}
console.log("All puzzles verified solvable with the curated dictionary.");
