import { puzzleLetters, type Puzzle } from "@/lib/puzzles";

export interface SideMeta {
  key: string;
  label: string;
  glyph: string;
  patternClass: string;
  description: string;
  /** Soft tint for the side's legend chip (color is never the only signal). */
  tintClass: string;
}

export const SIDE_META: SideMeta[] = [
  {
    key: "top",
    label: "Top",
    glyph: "●",
    patternClass: "side-pattern-top",
    description: "Solid",
    tintClass: "bg-slate-50",
  },
  {
    key: "right",
    label: "Right",
    glyph: "◆",
    patternClass: "side-pattern-right",
    description: "Dashed",
    tintClass: "bg-slate-50",
  },
  {
    key: "bottom",
    label: "Bottom",
    glyph: "▲",
    patternClass: "side-pattern-bottom",
    description: "Dotted",
    tintClass: "bg-slate-50",
  },
  {
    key: "left",
    label: "Left",
    glyph: "■",
    patternClass: "side-pattern-left",
    description: "Double",
    tintClass: "bg-slate-50",
  },
];

const SIDE_NAMES = ["Top", "Right", "Bottom", "Left"] as const;
/** Side for each flat (clockwise) board position. */
const SIDE_FOR_POSITION: number[] = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3];
/** Tile centres in a 0–100 coordinate system, clockwise from top-left. */
export const TILE_POSITIONS = [
  { x: 22, y: 10 },
  { x: 50, y: 10 },
  { x: 78, y: 10 },
  { x: 90, y: 22 },
  { x: 90, y: 50 },
  { x: 90, y: 78 },
  { x: 78, y: 90 },
  { x: 50, y: 90 },
  { x: 22, y: 90 },
  { x: 10, y: 78 },
  { x: 10, y: 50 },
  { x: 10, y: 22 },
] as const;

interface GameBoardProps {
  puzzle: Puzzle;
  /** Flat board indices in the order the player picked them. */
  selectedIndices: number[];
  /** Whether a tile may be picked next. */
  canPick: (flatIndex: number) => boolean;
  onPick: (flatIndex: number) => void;
  hintIndex: number | null;
  disabled?: boolean;
  solved?: boolean;
}

export function GameBoard({
  puzzle,
  selectedIndices,
  canPick,
  onPick,
  hintIndex,
  disabled = false,
  solved = false,
}: GameBoardProps) {
  const letters = puzzleLetters(puzzle);
  const selectedSet = new Set(selectedIndices);
  const linePoints = selectedIndices
    .map((i) => `${TILE_POSITIONS[i].x},${TILE_POSITIONS[i].y}`)
    .join(" ");

  return (
    <div className="w-full">
      {/* Side legend — text + shape + pattern, never colour alone. */}
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="How to tell the sides apart">
        {SIDE_META.map((side) => (
          <div
            key={side.key}
            className={`flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 ${side.patternClass} ${side.tintClass}`}
          >
            <span aria-hidden="true" className="text-base leading-none text-emerald-700">
              {side.glyph}
            </span>
            <span className="text-left leading-tight">
              <span className="block text-[13px] font-bold text-slate-900">{side.description}</span>
              <span className="block text-[11px] text-slate-700">edge</span>
            </span>
          </div>
        ))}
      </div>

      {/* Flat slate board: the board is the centrepiece. */}
      <div className="mx-auto w-full max-w-[540px] rounded-2xl border border-slate-800 bg-slate-900 p-2">
        <div
          role="group"
          aria-label="Puzzle board. Twelve letters on four sides. Use Tab to move between letters, Enter or Space to pick one."
          className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-900"
        >
        {/* Edge treatments — one distinct treatment per side: solid emerald
            top, dashed gold right, dotted muted-gold bottom, double slate left. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-8 top-0 h-[5px] rounded-b bg-emerald-600" />
          <div className="absolute inset-y-8 right-0 w-[5px] rounded-l [background:repeating-linear-gradient(0deg,#d97706_0_6px,transparent_6px_11px)]" />
          <div className="absolute inset-x-8 bottom-0 h-[5px] rounded-t [background:radial-gradient(#c9a227_1.6px,transparent_1.7px)] [background-size:10px_5px] [background-position:center]" />
          <div className="absolute inset-y-8 left-0 w-[5px] rounded-r [background:repeating-linear-gradient(0deg,#cbd5e1_0_3px,transparent_3px_8px),repeating-linear-gradient(90deg,#cbd5e1_0_3px,transparent_3px_8px)]" />
          <div className="absolute inset-[13%] rounded-xl border border-dashed border-slate-600" />
        </div>

        {/* Connecting path for the current word. */}
        {selectedIndices.length > 1 && (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polyline
              points={linePoints}
              fill="none"
              stroke="#34d399"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.95"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}

        {letters.map((letter, flatIndex) => {
          const sideIndex = SIDE_FOR_POSITION[flatIndex];
          const side = SIDE_META[sideIndex];
          const order = selectedIndices.indexOf(flatIndex);
          const isSelected = order !== -1;
          const isHinted = hintIndex === flatIndex;
          const pickable = !disabled && canPick(flatIndex);
          const pos = TILE_POSITIONS[flatIndex];
          return (
            <button
              key={`${letter}-${flatIndex}`}
              type="button"
              onClick={() => onPick(flatIndex)}
              disabled={disabled || !pickable}
              aria-label={`Letter ${letter}, ${SIDE_NAMES[sideIndex]} side, position ${flatIndex % 3 + 1} of 3${isSelected ? `, picked ${order + 1} in the current word` : ""}${pickable ? "" : ", not available next"}`}
              aria-pressed={isSelected}
              className={[
                "board-tile absolute z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-lg border-2 font-display font-bold transition-all duration-150 sm:h-[68px] sm:w-[68px] md:h-[72px] md:w-[72px]",
                "text-[26px] leading-none sm:text-[30px] md:text-[32px]",
                isSelected
                  ? "border-emerald-500 bg-emerald-600 text-white scale-[1.08]"
                  : pickable
                    ? "cursor-pointer border-slate-300 bg-white text-slate-900 hover:-translate-y-0.5 hover:border-emerald-500 hover:ring-2 hover:ring-emerald-500/40 active:scale-[0.96]"
                    : "cursor-not-allowed border-slate-700 bg-slate-700 text-slate-400",
                isHinted && !isSelected
                  ? "ring-4 ring-emerald-400 animate-ring-pulse border-emerald-500"
                  : "",
                solved ? "opacity-90" : "",
              ].join(" ")}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <span aria-hidden="true" className={`leading-none ${isSelected ? "animate-tile-pop" : ""}`}>{letter}</span>
              <span
                aria-hidden="true"
                className={`mt-[3px] flex items-center gap-1 text-[8px] font-sans font-bold uppercase tracking-wider sm:text-[9px] ${isSelected ? "text-emerald-100" : pickable ? "text-slate-500" : "text-slate-500"}`}
              >
                <span>{side.glyph}</span>
                <span>{side.label}</span>
              </span>
              {isSelected && (
                <span
                  aria-hidden="true"
                  className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-white font-sans text-[12px] font-bold text-emerald-700 animate-pop"
                >
                  {order + 1}
                </span>
              )}
            </button>
          );
        })}

        {/* Centre label — on its own dark pill so the path never strikes through it. */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <p className="max-w-[190px] rounded-full border border-slate-700 bg-slate-800/90 px-3.5 py-1.5 text-center text-[11px] font-bold uppercase leading-snug tracking-[0.14em] text-slate-300 sm:max-w-[210px] sm:text-xs">
            {solved ? "Puzzle solved" : "Pick letters in order"}
          </p>
        </div>
        </div>
      </div>

      <p className="mt-3 text-center text-[13px] leading-relaxed text-slate-500">
        Each side has its own pattern, shape and glyph — <span className="font-semibold text-slate-700">Solid ●</span>,{" "}
        <span className="font-semibold text-slate-700">Dashed ◆</span>,{" "}
        <span className="font-semibold text-slate-700">Dotted ▲</span>,{" "}
        <span className="font-semibold text-slate-700">Double ■</span>. Two letters in a row must come from
        different sides.
      </p>
    </div>
  );
}
