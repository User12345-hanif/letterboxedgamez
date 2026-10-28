/**
 * Puzzle data — kept separate from the interface, exactly as requested.
 *
 * Each puzzle has 12 distinct letters, 3 per side. Sides are listed in
 * reading order: top left→right, right top→bottom, bottom left→right,
 * left top→bottom. A verified solution is stored with every puzzle.
 * A solution is only accepted here after `scripts/verify-puzzles.mjs`
 * has checked, against the curated dictionary and the game rules, that:
 *   1. every solution word is in the dictionary,
 *   2. no two consecutive letters share a side,
 *   3. each word after the first starts with the previous word's last letter,
 *   4. together the words use all 12 letters at least once.
 * Do not add a puzzle without running that check.
 */
export type SideIndex = 0 | 1 | 2 | 3;

export interface Puzzle {
  id: string;
  /** Human label shown in the UI, e.g. "Puzzle 1". */
  label: string;
  sides: [string[], string[], string[], string[]];
  /** One verified solution, in play order. Never shown until the player wins or asks for it. */
  solution: string[];
  /** Short, original hint for the Hints page / hint button fallback. */
  hint: string;
}

export const PUZZLES: readonly Puzzle[] = [
  {
    id: "capture-enjoys",
    label: "Puzzle 1",
    sides: [
      ["C", "U", "J"],
      ["A", "R", "O"],
      ["P", "E", "Y"],
      ["T", "N", "S"],
    ],
    solution: ["CAPTURE", "ENJOYS"],
    hint: "Start with a word for seizing something, then a word for liking it.",
  },
  {
    id: "gardens-switch",
    label: "Puzzle 2",
    sides: [
      ["G", "E", "I"],
      ["A", "N", "T"],
      ["R", "S", "C"],
      ["D", "W", "H"],
    ],
    solution: ["GARDENS", "SWITCH"],
    hint: "Begin in a place where flowers grow, then change something over.",
  },
  {
    id: "journey-yachts",
    label: "Puzzle 3",
    sides: [
      ["J", "N", "C"],
      ["O", "E", "H"],
      ["U", "Y", "T"],
      ["R", "A", "S"],
    ],
    solution: ["JOURNEY", "YACHTS"],
    hint: "A long trip first, then the boats that might take you on one.",
  },
  {
    id: "fathoms-sliced",
    label: "Puzzle 4",
    sides: [
      ["F", "O", "I"],
      ["A", "M", "C"],
      ["T", "S", "E"],
      ["H", "L", "D"],
    ],
    solution: ["FATHOMS", "SLICED"],
    hint: "Think of measuring deep water, then cutting bread.",
  },
  {
    id: "dolphin-nature",
    label: "Puzzle 5",
    sides: [
      ["D", "H", "T"],
      ["O", "I", "U"],
      ["L", "N", "R"],
      ["P", "A", "E"],
    ],
    solution: ["DOLPHIN", "NATURE"],
    hint: "A clever sea mammal first, then the world around it.",
  },
  {
    id: "crystal-lounge",
    label: "Puzzle 6",
    sides: [
      ["C", "T", "U"],
      ["R", "A", "N"],
      ["Y", "L", "G"],
      ["S", "O", "E"],
    ],
    solution: ["CRYSTAL", "LOUNGE"],
    hint: "A clear, sparkling mineral, then a place to relax in.",
  },
  {
    id: "overlap-punchy",
    label: "Puzzle 7",
    sides: [
      ["O", "L", "N"],
      ["V", "A", "C"],
      ["E", "P", "H"],
      ["R", "U", "Y"],
    ],
    solution: ["OVERLAP", "PUNCHY"],
    hint: "Parts that cover each other, then something with a lively bite.",
  },
];

/** All twelve letters of a puzzle, in clockwise board order. */
export function puzzleLetters(puzzle: Puzzle): string[] {
  const [top, right, bottom, left] = puzzle.sides;
  return [
    ...top,
    ...right,
    bottom[2],
    bottom[1],
    bottom[0],
    left[2],
    left[1],
    left[0],
  ];
}

/** Map from letter → side index, for fast rule checks. */
export function sideOf(puzzle: Puzzle): Map<string, SideIndex> {
  const map = new Map<string, SideIndex>();
  puzzle.sides.forEach((side, index) => {
    side.forEach((letter) => map.set(letter, index as SideIndex));
  });
  return map;
}

export function allPuzzleLetters(puzzle: Puzzle): Set<string> {
  return new Set(puzzle.sides.flat());
}
