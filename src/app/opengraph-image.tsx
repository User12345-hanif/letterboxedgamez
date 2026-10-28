import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Letterboxed Gamez — twelve letters, four sides, one clear path.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LETTERS: Array<[string, number, number]> = [
  ["C", 110, 20], ["U", 230, 20], ["J", 350, 20],
  ["A", 420, 110], ["R", 420, 230], ["O", 420, 320],
  ["Y", 350, 410], ["E", 230, 410], ["P", 110, 410],
  ["S", 40, 320], ["N", 40, 230], ["T", 40, 110],
];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          background: "#faf5e9",
          padding: "48px 64px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ position: "relative", width: 500, height: 500, flexShrink: 0, display: "flex" }}>
          <div
            style={{
              position: "absolute",
              left: 24,
              top: 24,
              width: 452,
              height: 452,
              border: "3px solid #ddd3b8",
              borderRadius: 32,
              background: "#fffdf6",
            }}
          />
          {LETTERS.map(([letter, x, y]) => (
            <div
              key={letter}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 76,
                height: 76,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fffdf6",
                border: "3px solid #1e4d2b",
                borderRadius: 18,
                fontSize: 42,
                fontWeight: 700,
                color: "#1c261d",
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, letterSpacing: 4, color: "#1e4d2b", fontFamily: "sans-serif", fontWeight: 700 }}>
            DAILY WORD PUZZLE
          </div>
          <div style={{ marginTop: 16, fontSize: 72, lineHeight: 1.05, fontWeight: 700, color: "#1c261d" }}>
            Letterboxed
          </div>
          <div style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 700, color: "#1e4d2b" }}>
            Gamez
          </div>
          <div style={{ marginTop: 20, fontSize: 28, lineHeight: 1.4, color: "#5c6b5e", fontFamily: "sans-serif" }}>
            Twelve letters. Four sides.
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: "#5c6b5e", fontFamily: "sans-serif" }}>
            One clear path. Use every letter.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
