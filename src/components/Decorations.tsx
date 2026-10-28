/**
 * Decorative, aria-hidden storybook shapes. These never carry meaning:
 * every shape is hidden from assistive technology, and none sits behind
 * important text. Motion is covered by the global reduced-motion rule.
 */

const LIGHT_SHAPES = [
  { char: "✦", pos: "right-[6%] top-[12%]", size: "text-xl", color: "text-sunny", anim: "animate-twinkle", delay: "0s" },
  { char: "✦", pos: "right-[16%] top-[58%]", size: "text-sm", color: "text-sky", anim: "animate-twinkle", delay: "0.9s" },
  { char: "●", pos: "left-[4%] bottom-[14%]", size: "text-[10px]", color: "text-coral", anim: "animate-bob", delay: "0.4s" },
  { char: "◆", pos: "right-[3%] bottom-[10%]", size: "text-xs", color: "text-lavender", anim: "animate-bob", delay: "1.2s" },
  { char: "✦", pos: "left-[10%] top-[8%]", size: "text-sm", color: "text-mint", anim: "animate-twinkle", delay: "1.8s" },
] as const;

const INK_SHAPES = [
  { char: "✦", pos: "right-[5%] top-[10%]", size: "text-lg", color: "text-gold-deep", anim: "animate-twinkle", delay: "0.3s" },
  { char: "◆", pos: "left-[4%] bottom-[12%]", size: "text-[10px]", color: "text-sky-deep", anim: "animate-bob", delay: "0.8s" },
  { char: "●", pos: "right-[10%] bottom-[8%]", size: "text-[10px]", color: "text-coral", anim: "animate-bob", delay: "1.5s" },
] as const;

export function Sprinkles({
  tone = "light",
  className = "",
}: {
  /** "light" for dark panels (masthead), "ink" for light panels. */
  tone?: "light" | "ink";
  className?: string;
}) {
  const shapes = tone === "light" ? LIGHT_SHAPES : INK_SHAPES;
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {shapes.map((shape, i) => (
        <span
          key={i}
          className={`absolute ${shape.pos} ${shape.size} ${shape.color} ${shape.anim}`}
          style={{ animationDelay: shape.delay }}
        >
          {shape.char}
        </span>
      ))}
    </div>
  );
}

/** A small smiling sun for the masthead. Pure decoration. */
export function SunDecoration({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className={`animate-bob ${className}`}
      focusable="false"
    >
      <g stroke="#f7c948" strokeWidth="5" strokeLinecap="round">
        <line x1="60" y1="8" x2="60" y2="22" />
        <line x1="60" y1="98" x2="60" y2="112" />
        <line x1="8" y1="60" x2="22" y2="60" />
        <line x1="98" y1="60" x2="112" y2="60" />
        <line x1="23" y1="23" x2="33" y2="33" />
        <line x1="87" y1="87" x2="97" y2="97" />
        <line x1="97" y1="23" x2="87" y2="33" />
        <line x1="33" y1="87" x2="23" y2="97" />
      </g>
      <circle cx="60" cy="60" r="26" fill="#f7c948" />
      <circle cx="51" cy="56" r="3.5" fill="#0f3d22" />
      <circle cx="69" cy="56" r="3.5" fill="#0f3d22" />
      <path d="M50,68 Q60,76 70,68" fill="none" stroke="#0f3d22" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
