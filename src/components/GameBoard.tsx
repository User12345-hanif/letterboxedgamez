import { puzzleLetters, type Puzzle } from "@/lib/puzzles";

export interface SideMeta {
  key: string;
  label: string;
  glyph: string;
  patternClass: string;
  edgeClass: string;
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
    edgeClass: "border-t-[6px] border-t-forest",
    description: "Solid edge",
    tintClass: "bg-sky-wash",
  },
  {
    key: "right",
    label: "Right",
    glyph: "◆",
    patternClass: "side-pattern-right",
    edgeClass: "border-r-[6px] border-r-forest",
    description: "Diagonal stripes",
    tintClass: "bg-mint",
  },
  {
    key: "bottom",
    label: "Bottom",
    glyph: "▲",
    patternClass: "side-pattern-bottom",
    edgeClass: "border-b-[6px] border-b-forest",
    description: "Dotted edge",
    tintClass: "bg-butter",
  },
  {
    key: "left",
    label: "Left",
    glyph: "■",
    patternClass: "side-pattern-left",
    edgeClass: "border-l-[6px] border-l-forest",
    description: "Crosshatch edge",
    tintClass: "bg-lavender-wash",
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
            className={`flex min-h-11 items-center gap-2 rounded-xl border border-gold/40 px-2.5 py-1.5 shadow-sm ${side.patternClass} ${side.tintClass}`}
          >
            <span aria-hidden="true" className="text-base leading-none text-gold-deep">
              {side.glyph}
            </span>
            <span className="text-left leading-tight">
              <span className="block text-[13px] font-bold text-ink">{side.label}</span>
              <span className="block text-[11px] text-pine">{side.description}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Gold frame around a deep-forest board: the board is the centrepiece. */}
      <div className="mx-auto w-full max-w-[540px] rounded-[32px] bg-gradient-to-br from-gold-bright via-gold to-gold-deep p-[3px] shadow-board ring-4 ring-gold/30">
        <div
          role="group"
          aria-label="Puzzle board. Twelve letters on four sides. Use Tab to move between letters, Enter or Space to pick one."
          className="relative aspect-square w-full overflow-hidden rounded-[29px] bg-forest-deep shadow-[inset_0_2px_18px_rgb(0_0_0/0.45)]"
          style={{
            backgroundImage:
              "radial-gradient(rgb(248 236 201 / 0.14) 1.1px, transparent 1.3px), radial-gradient(420px 300px at 50% 0%, rgb(47 125 78 / 0.45), transparent 65%)",
            backgroundSize: "18px 18px, auto",
          }}
        >
        {/* Edge treatments — one distinct treatment per side. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-8 top-0 h-[5px] rounded-b bg-gold-bright" />
          <div className="absolute inset-y-8 right-0 w-[5px] rounded-l [background:repeating-linear-gradient(0deg,#e3b93e_0_6px,transparent_6px_11px)]" />
          <div className="absolute inset-x-8 bottom-0 h-[5px] rounded-t [background:radial-gradient(#f8ecc9_1.6px,transparent_1.7px)] [background-size:10px_5px] [background-position:center]" />
          <div className="absolute inset-y-8 left-0 w-[5px] rounded-r [background:repeating-linear-gradient(0deg,#f8ecc9_0_3px,transparent_3px_8px),repeating-linear-gradient(90deg,#f8ecc9_0_3px,transparent_3px_8px)]" />
          <div className="absolute inset-[13%] rounded-[20px] border border-dashed border-gold/30" />
          {/* Corner ornaments. */}
          <span className="absolute left-3 top-3 inline-block h-2 w-2 rotate-45 bg-gold-bright/80" />
          <span className="absolute right-3 top-3 inline-block h-2 w-2 rotate-45 bg-gold-bright/80" />
          <span className="absolute bottom-3 left-3 inline-block h-2 w-2 rotate-45 bg-gold-bright/80" />
          <span className="absolute bottom-3 right-3 inline-block h-2 w-2 rotate-45 bg-gold-bright/80" />
        </div>

        {/* Connecting path for the current word. */}
        {selectedIndices.length > 1 && (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full [filter:drop-shadow(0_0_5px_rgb(227_185_62/0.7))]"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polyline
              points={linePoints}
              fill="none"
              stroke="#e3b93e"
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
                "board-tile absolute z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[22px] border-[3px] font-display font-bold shadow-tile transition-all duration-150 sm:h-[68px] sm:w-[68px] md:h-[72px] md:w-[72px]",
                "text-[26px] leading-none sm:text-[30px] md:text-[32px]",
                isSelected
                  ? "border-gold-deep bg-gradient-to-b from-sunny-light to-sunny text-ink scale-[1.08]"
                  : pickable
                    ? "cursor-pointer border-[#e8d9a8] bg-gradient-to-b from-white to-[#fdf3d7] text-ink hover:-translate-y-0.5 hover:border-forest-light hover:shadow-lift hover:ring-[3px] hover:ring-gold/70 active:scale-[0.96]"
                    : "cursor-not-allowed border-[#8a9a86] bg-[#3d5c46] text-[#eef2e4] saturate-75",
                isHinted && !isSelected
                  ? "ring-4 ring-gold-bright animate-ring-pulse border-gold"
                  : "",
                solved ? "opacity-90" : "",
              ].join(" ")}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <span aria-hidden="true" className={`leading-none ${isSelected ? "animate-tile-pop" : ""}`}>{letter}</span>
              <span
                aria-hidden="true"
                className={`mt-[3px] flex items-center gap-1 text-[8px] font-sans font-bold uppercase tracking-wider sm:text-[9px] ${isSelected ? "text-forest-dark" : pickable ? "text-moss" : "text-[#c8d4c2]"}`}
              >
                <span>{side.glyph}</span>
                <span>{side.label}</span>
              </span>
              {isSelected && (
                <span
                  aria-hidden="true"
                  className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-forest font-sans text-[12px] font-bold text-white shadow animate-pop"
                >
                  {order + 1}
                </span>
              )}
              {isSelected && order === selectedIndices.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -left-1 -top-2 text-[15px] leading-none text-sunny animate-sparkle-pop [filter:drop-shadow(0_1px_2px_rgb(0_0_0/0.45))]"
                >
                  ✦
                </span>
              )}
            </button>
          );
        })}

        {/* Centre label — on its own dark pill so the gold path never strikes through it. */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <p className="max-w-[190px] rounded-full bg-forest-deep/80 px-3.5 py-1.5 text-center text-[11px] font-bold uppercase leading-snug tracking-[0.14em] text-gold-light sm:max-w-[210px] sm:text-xs">
            {solved ? "Puzzle solved" : "Pick letters in order"}
          </p>
        </div>
        </div>
      </div>

      <p className="mt-3 text-center text-[13px] leading-relaxed text-moss">
        Sides are labelled by name, shape and pattern — <span className="font-semibold text-pine">Top ●</span>,{" "}
        <span className="font-semibold text-pine">Right ◆</span>,{" "}
        <span className="font-semibold text-pine">Bottom ▲</span>,{" "}
        <span className="font-semibold text-pine">Left ■</span>. Two letters in a row must come from
        different sides.
      </p>
    </div>
  );
}
