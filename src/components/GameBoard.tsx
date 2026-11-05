import { puzzleLetters, type Puzzle } from "@/lib/puzzles";

export interface SideMeta {
  key: string;
  label: string;
  glyph: string;
  patternClass: string;
  description: string;
  /** Glass chip tint for the side's legend chip (color is never the only signal). */
  tintClass: string;
  /** Accent colour for the side's glyph, matching its board edge. */
  glyphClass: string;
}

/** Each side has its own colour AND its own pattern + glyph, so the
 *  sides are never distinguished by colour alone. */
export const SIDE_META: SideMeta[] = [
  {
    key: "top",
    label: "Top",
    glyph: "●",
    patternClass: "side-pattern-top",
    description: "Solid",
    tintClass: "border-emerald-500/40 bg-emerald-500/10",
    glyphClass: "text-emerald-400",
  },
  {
    key: "right",
    label: "Right",
    glyph: "◆",
    patternClass: "side-pattern-right",
    description: "Dashed",
    tintClass: "border-amber-500/40 bg-amber-500/10",
    glyphClass: "text-amber-400",
  },
  {
    key: "bottom",
    label: "Bottom",
    glyph: "▲",
    patternClass: "side-pattern-bottom",
    description: "Dotted",
    tintClass: "border-yellow-500/40 bg-yellow-500/10",
    glyphClass: "text-yellow-300",
  },
  {
    key: "left",
    label: "Left",
    glyph: "■",
    patternClass: "side-pattern-left",
    description: "Double",
    tintClass: "border-sky-500/40 bg-sky-500/10",
    glyphClass: "text-sky-400",
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
      {/* Side legend — text + shape + pattern + colour, never colour alone. */}
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="How to tell the sides apart">
        {SIDE_META.map((side) => (
          <div
            key={side.key}
            className={`flex min-h-11 items-center gap-2 rounded-xl border px-2.5 py-1.5 shadow-[0_4px_14px_-6px_rgba(0,0,0,0.7)] ${side.patternClass} ${side.tintClass}`}
          >
            <span aria-hidden="true" className={`text-base leading-none ${side.glyphClass}`}>
              {side.glyph}
            </span>
            <span className="text-left leading-tight">
              <span className="block text-[13px] font-bold text-white">{side.description}</span>
              <span className="block text-[11px] text-slate-400">edge</span>
            </span>
          </div>
        ))}
      </div>

      {/* Arcade board: deep slate with a glowing emerald frame — the centrepiece. */}
      <div className="relative mx-auto w-full max-w-[580px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-8 rounded-full bg-emerald-500/15 blur-[70px] animate-glow-pulse"
        />
        <div className="relative rounded-[28px] border border-emerald-500/40 bg-slate-950 p-2 shadow-board">
          <div
            role="group"
            aria-label="Puzzle board. Twelve letters on four sides. Use Tab to move between letters, Enter or Space to pick one."
            className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-slate-950"
          >
            {/* Soft emerald glow pooled in the centre of the board. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.16),transparent_65%)]"
            />
            {/* Edge treatments — one bold, colourful treatment per side:
                solid emerald top, dashed amber right, dotted gold bottom,
                double sky left. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute inset-x-8 top-0 h-[6px] rounded-b bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.9)]" />
              <div className="absolute inset-y-8 right-0 w-[6px] rounded-l [background:repeating-linear-gradient(0deg,#f59e0b_0_8px,transparent_8px_14px)] [filter:drop-shadow(0_0_6px_rgba(245,158,11,0.7))]" />
              <div className="absolute inset-x-8 bottom-0 h-[6px] rounded-t [background:radial-gradient(#eab308_2.6px,transparent_2.7px)] [background-size:12px_6px] [background-position:center] [filter:drop-shadow(0_0_6px_rgba(234,179,8,0.7))]" />
              <div className="absolute inset-y-8 left-0 w-[6px] rounded-r [background:repeating-linear-gradient(0deg,#38bdf8_0_3px,transparent_3px_9px),repeating-linear-gradient(90deg,#38bdf8_0_3px,transparent_3px_9px)] [filter:drop-shadow(0_0_6px_rgba(56,189,248,0.7))]" />
              <div className="absolute inset-[13%] rounded-xl border border-dashed border-slate-500/50" />
            </div>

            {/* Connecting path for the current word — thick, glowing, drawn in. */}
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
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.95"
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  className="connector-line"
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
                    "board-tile absolute z-10 flex h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl border-2 font-display font-bold transition-all duration-150 sm:h-20 sm:w-20 md:h-[84px] md:w-[84px]",
                    "text-[26px] leading-none sm:text-[30px] md:text-[34px]",
                    isSelected
                      ? "scale-[1.1] border-emerald-400 bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-[0_6px_0_#065f46,0_0_32px_rgba(52,211,153,0.85),inset_0_2px_0_rgba(255,255,255,0.35)]"
                      : pickable
                        ? "cursor-pointer border-slate-950/60 bg-gradient-to-b from-white via-slate-100 to-slate-300 text-slate-900 shadow-tile hover:scale-[1.07] hover:border-emerald-400 hover:shadow-[0_6px_0_rgba(2,6,23,0.85),0_0_28px_rgba(52,211,153,0.55)] active:scale-[0.95]"
                        : "cursor-not-allowed border-slate-700 bg-slate-800 text-slate-500 shadow-[0_4px_0_rgba(2,6,23,0.9)]",
                    isHinted && !isSelected
                      ? "ring-4 ring-amber-400 animate-ring-pulse-amber border-amber-400"
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
                      className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-white font-sans text-[12px] font-bold text-emerald-700 shadow-[0_2px_8px_rgba(0,0,0,0.5)] animate-pop"
                    >
                      {order + 1}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Centre label — on its own dark pill so the path never strikes through it. */}
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <p className="max-w-[190px] rounded-full border border-emerald-500/40 bg-slate-900/90 px-3.5 py-1.5 text-center text-[11px] font-bold uppercase leading-snug tracking-[0.14em] text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)] sm:max-w-[210px] sm:text-xs">
                {solved ? "Puzzle solved" : "Pick letters in order"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-[13px] leading-relaxed text-slate-400">
        Each side has its own pattern, shape and glyph —{" "}
        <span className="font-semibold text-emerald-400">Solid ●</span>,{" "}
        <span className="font-semibold text-amber-400">Dashed ◆</span>,{" "}
        <span className="font-semibold text-yellow-300">Dotted ▲</span>,{" "}
        <span className="font-semibold text-sky-400">Double ■</span>. Two letters in a row must come from
        different sides.
      </p>
    </div>
  );
}
