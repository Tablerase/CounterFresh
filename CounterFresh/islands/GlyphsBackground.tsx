import { useEffect, useRef } from "preact/hooks";

// Counter/math chars only — decimals + operators
const CHARS = "0123456789+-><=";

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

const FONT_SIZE = 14;
const COL_GAP = 22;

// Brand-purple column tints
const TINTS = [
  { head: "#e5dfff", mid: "#a593e0", dim: "#3b2768" },
  { head: "#d7e4ff", mid: "#7f9fe7", dim: "#092094" },
  { head: "#f5f3ff", mid: "#8870cc", dim: "#420089" },
];

interface Col {
  x: number;
  y: number;
  speed: number;
  glyphs: string[];
  tint: (typeof TINTS)[number];
}

function makeCol(x: number, h: number): Col {
  const len = 10 + Math.floor(Math.random() * 18);
  return {
    x,
    y: -(len * (FONT_SIZE + 4)) * Math.random(),
    speed: 0.7 + Math.random() * 1.6,
    glyphs: Array.from({ length: len }, randomChar),
    tint: TINTS[Math.floor(Math.random() * TINTS.length)],
  };
}

// Draw the static reveal-pattern onto an offscreen canvas
function buildPatternCanvas(w: number, h: number): HTMLCanvasElement {
  const oc = document.createElement("canvas");
  oc.width = w;
  oc.height = h;
  const c = oc.getContext("2d")!;

  // Slightly lighter dark ground that will show through glows
  c.fillStyle = "#1a0d3c";
  c.fillRect(0, 0, w, h);

  // Dot grid — Figma-canvas style
  const DOT_GAP = 28;
  c.fillStyle = "rgba(165,147,224,0.22)";
  for (let x = DOT_GAP; x < w; x += DOT_GAP) {
    for (let y = DOT_GAP; y < h; y += DOT_GAP) {
      c.beginPath();
      c.arc(x, y, 1.1, 0, Math.PI * 2);
      c.fill();
    }
  }

  // Thin geometric frames — gives the Figma-Make "blueprint" feel
  const rects = [
    { x: 0.08, y: 0.12, w: 0.22, h: 0.18 },
    { x: 0.38, y: 0.08, w: 0.28, h: 0.32 },
    { x: 0.72, y: 0.18, w: 0.2, h: 0.24 },
    { x: 0.14, y: 0.55, w: 0.18, h: 0.28 },
    { x: 0.52, y: 0.6, w: 0.32, h: 0.22 },
    { x: 0.82, y: 0.62, w: 0.14, h: 0.3 },
  ];
  c.strokeStyle = "rgba(136,112,204,0.18)";
  c.lineWidth = 1;
  for (const r of rects) {
    c.strokeRect(r.x * w, r.y * h, r.w * w, r.h * h);
    // inner label line
    c.beginPath();
    c.moveTo(r.x * w + 4, r.y * h + 12);
    c.lineTo((r.x + r.w) * w - 4, r.y * h + 12);
    c.stroke();
  }

  // Diagonal cross guides
  c.strokeStyle = "rgba(91,127,213,0.09)";
  c.lineWidth = 0.5;
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(w, h);
  c.moveTo(w, 0);
  c.lineTo(0, h);
  c.stroke();

  return oc;
}

export default function GlyphsBackground() {
  const patternRef = useRef<HTMLCanvasElement>(null);
  const mainRef = useRef<HTMLCanvasElement>(null);
  const patternOC = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const mainCanvas = mainRef.current!;
    const ctx = mainCanvas.getContext("2d")!;

    let animId: number;
    let cols: Col[] = [];

    const resize = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      mainCanvas.width = W;
      mainCanvas.height = H;

      if (patternRef.current) {
        patternRef.current.width = W;
        patternRef.current.height = H;
      }

      patternOC.current = buildPatternCanvas(W, H);

      const numCols = Math.ceil(W / COL_GAP);
      cols = Array.from(
        { length: numCols },
        (_, i) => makeCol(i * COL_GAP + COL_GAP / 2, H),
      );
    };

    const tick = () => {
      const W = mainCanvas.width;
      const H = mainCanvas.height;

      // ── 1. Dark overlay (builds up trail via partial erase) ──────────────
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(8, 5, 20, 0.28)";
      ctx.fillRect(0, 0, W, H);

      // ── 2. Punch holes in the dark layer using destination-out ────────────
      //    This reveals the pattern canvas (behind) through the glows.
      ctx.globalCompositeOperation = "destination-out";
      for (const col of cols) {
        const headY = col.y;

        // Large soft halo around the head glyph
        const r = 56;
        const grad = ctx.createRadialGradient(col.x, headY, 0, col.x, headY, r);
        grad.addColorStop(0, "rgba(0,0,0,0.72)");
        grad.addColorStop(0.55, "rgba(0,0,0,0.28)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(col.x, headY, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── 3. Draw the glyphs ────────────────────────────────────────────────
      ctx.globalCompositeOperation = "source-over";
      ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;
      ctx.textAlign = "center";

      for (const col of cols) {
        const { glyphs, tint } = col;
        const rowH = FONT_SIZE + 4;

        for (let i = 0; i < glyphs.length; i++) {
          const cy = col.y + i * rowH;
          if (cy < -rowH || cy > H + rowH) continue;

          const frac = i / glyphs.length;

          if (i === 0) {
            // Bright head with glow
            ctx.shadowColor = tint.head;
            ctx.shadowBlur = 12;
            ctx.fillStyle = tint.head;
          } else if (frac < 0.35) {
            ctx.shadowBlur = 0;
            const alpha = Math.round((1 - frac / 0.35) * 200).toString(16)
              .padStart(2, "0");
            ctx.fillStyle = tint.mid + alpha;
          } else {
            ctx.shadowBlur = 0;
            const alpha = Math.round((1 - (frac - 0.35) / 0.65) * 90).toString(
              16,
            ).padStart(2, "0");
            ctx.fillStyle = tint.dim + alpha;
          }

          ctx.fillText(glyphs[i], col.x, cy);
          ctx.shadowBlur = 0;
        }

        // Advance
        col.y += col.speed;

        // Flicker
        if (Math.random() < 0.07) {
          col.glyphs[Math.floor(Math.random() * glyphs.length)] = randomChar();
        }

        // Reset
        if (col.y > H + glyphs.length * (FONT_SIZE + 4)) {
          const nc = makeCol(col.x, H);
          col.y = nc.y;
          col.speed = nc.speed;
          col.glyphs = nc.glyphs;
          col.tint = nc.tint;
        }
      }

      animId = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Sync pattern offscreen canvas to the visible pattern canvas
  useEffect(() => {
    const pc = patternRef.current!;
    const pCtx = pc.getContext("2d")!;

    const drawPattern = () => {
      if (patternOC.current) {
        pCtx.clearRect(0, 0, pc.width, pc.height);
        pCtx.drawImage(patternOC.current, 0, 0);
      }
      requestAnimationFrame(drawPattern);
    };

    const id = requestAnimationFrame(drawPattern);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        pointerEvents: "none",
        inset: "0",
        zIndex: "-100",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#080514",
      }}
    >
      {/* Layer 1 — revealed pattern (dot grid + geometry) */}
      <canvas
        ref={patternRef}
        style={{ position: "absolute", inset: 0, display: "block" }}
      />

      {/* Layer 2 — animated dark overlay with glow holes + glyphs */}
      <canvas
        ref={mainRef}
        style={{ position: "absolute", inset: 0, display: "block" }}
      />
    </div>
  );
}
