import { useEffect, useRef } from "preact/hooks";

// Counter/math chars only — decimals + operators
const CHARS = "0123456789+-><=";

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

const FONT_SIZE = 14;
const COL_GAP = 22;

// Brand OKLCH color tints matching root styles.css
// Purple: oklch(70.86% 0.112 294.1), Blue: oklch(70.86% 0.112 265.5), Orange: oklch(70.8% 0.112 51.8)
const TINTS = [
  {
    head: "#ffffff",
    glow: "rgba(229, 223, 255, 0.95)",
    mid: (alpha: number) => `oklch(70.86% 0.112 294.1 / ${alpha})`,
    dim: (alpha: number) => `oklch(35% 0.12 294.1 / ${alpha})`,
  },
  {
    head: "#ffffff",
    glow: "rgba(215, 228, 255, 0.95)",
    mid: (alpha: number) => `oklch(70.86% 0.112 265.5 / ${alpha})`,
    dim: (alpha: number) => `oklch(35% 0.12 265.5 / ${alpha})`,
  },
  {
    head: "#ffffff",
    glow: "rgba(255, 220, 195, 0.95)",
    mid: (alpha: number) => `oklch(70.8% 0.112 51.8 / ${alpha})`,
    dim: (alpha: number) => `oklch(35% 0.12 51.8 / ${alpha})`,
  },
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

  // Dark ground matching --b-purple-900 / OKLCH theme
  c.fillStyle = "oklch(15% 0.05 294.1)";
  c.fillRect(0, 0, w, h);

  // Dot grid in brand OKLCH purple
  const DOT_GAP = 28;
  c.fillStyle = "oklch(70.86% 0.112 294.1 / 0.22)";
  for (let x = DOT_GAP; x < w; x += DOT_GAP) {
    for (let y = DOT_GAP; y < h; y += DOT_GAP) {
      c.beginPath();
      c.arc(x, y, 1.1, 0, Math.PI * 2);
      c.fill();
    }
  }

  // Thin geometric frames — blueprint feel
  const rects = [
    { x: 0.08, y: 0.12, w: 0.22, h: 0.18 },
    { x: 0.38, y: 0.08, w: 0.28, h: 0.32 },
    { x: 0.72, y: 0.18, w: 0.2, h: 0.24 },
    { x: 0.14, y: 0.55, w: 0.18, h: 0.28 },
    { x: 0.52, y: 0.6, w: 0.32, h: 0.22 },
    { x: 0.82, y: 0.62, w: 0.14, h: 0.3 },
  ];
  c.strokeStyle = "oklch(60% 0.1 294.1 / 0.18)";
  c.lineWidth = 1;
  for (const r of rects) {
    c.strokeRect(r.x * w, r.y * h, r.w * w, r.h * h);
    // inner label line
    c.beginPath();
    c.moveTo(r.x * w + 4, r.y * h + 12);
    c.lineTo((r.x + r.w) * w - 4, r.y * h + 12);
    c.stroke();
  }

  // Diagonal cross guides in brand blue OKLCH
  c.strokeStyle = "oklch(70.86% 0.112 265.5 / 0.09)";
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
      ctx.fillStyle = "oklch(12% 0.04 294.1 / 0.28)";
      ctx.fillRect(0, 0, W, H);

      // ── 2. Punch holes in the dark layer using destination-out ────────────
      ctx.globalCompositeOperation = "destination-out";
      for (const col of cols) {
        const headY = col.y;

        // Soft halo revealing the pattern canvas behind the head glyph
        const r = 64;
        const grad = ctx.createRadialGradient(col.x, headY, 0, col.x, headY, r);
        grad.addColorStop(0, "rgba(0,0,0,0.85)");
        grad.addColorStop(0.5, "rgba(0,0,0,0.35)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(col.x, headY, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── 3. Draw the glyphs ────────────────────────────────────────────────
      ctx.globalCompositeOperation = "source-over";
      ctx.font = `bold ${FONT_SIZE}px "JetBrains Mono", monospace`;
      ctx.textAlign = "center";

      for (const col of cols) {
        const { glyphs, tint } = col;
        const rowH = FONT_SIZE + 4;

        for (let i = 0; i < glyphs.length; i++) {
          const cy = col.y + i * rowH;
          if (cy < -rowH || cy > H + rowH) continue;

          const frac = i / glyphs.length;

          if (i === 0) {
            // Intense head glow: render drop shadow + pure white core
            ctx.shadowColor = tint.glow;
            ctx.shadowBlur = 18;
            ctx.fillStyle = "#ffffff";
            ctx.fillText(glyphs[i], col.x, cy);

            // Double pass for extra vibrancy
            ctx.shadowBlur = 8;
            ctx.fillText(glyphs[i], col.x, cy);
            ctx.shadowBlur = 0;
          } else if (frac < 0.35) {
            ctx.shadowBlur = 0;
            const alpha = (1 - frac / 0.35) * 0.85;
            ctx.fillStyle = tint.mid(alpha);
            ctx.fillText(glyphs[i], col.x, cy);
          } else {
            ctx.shadowBlur = 0;
            const alpha = (1 - (frac - 0.35) / 0.65) * 0.4;
            ctx.fillStyle = tint.dim(alpha);
            ctx.fillText(glyphs[i], col.x, cy);
          }
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
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "oklch(12% 0.04 294.1)",
        zIndex: -1,
        pointerEvents: "none",
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
