import { useEffect, useRef } from "preact/hooks";

// ── 1. Configuration & Design Constants ───────────────────────────────────────
const CONFIG = {
  font: {
    size: 14,
    rowPadding: 4,
    get rowHeight() {
      return this.size + this.rowPadding;
    },
    family: '"JetBrains Mono", monospace',
  },
  grid: {
    columnGap: 22,
    dotGap: 28,
    dotRadius: 1.1,
  },
  column: {
    minLength: 10,
    lengthVariance: 18,
    minSpeed: 0.7,
    speedVariance: 1.6,
    flickerChance: 0.07,
  },
  effects: {
    trailFadeOpacity: 0.28,
    spotlightRadius: 64,
    headGlowPrimary: 18,
    headGlowSecondary: 8,
    brightTrailRatio: 0.35,
    maxMidAlpha: 0.85,
    maxDimAlpha: 0.40,
  },
  themeDefaults: {
    purpleLch: "oklch(70.86% 0.112 294.1)",
    blueLch: "oklch(70.86% 0.112 265.5)",
    orangeLch: "oklch(70.8% 0.112 51.8)",
    purple800: "oklch(35% 0.12 294.1)",
    blue800: "oklch(35% 0.12 265.5)",
    orange800: "oklch(35% 0.12 51.8)",
    darkBg: "#1f0046",
    purple100: "#e5dfff",
    blue100: "#d7e4ff",
    orange100: "#ffdcc7",
  },
} as const;

// Math symbols & numeric glyphs
const GLYPH_CHARS = "0123456789+-><=";

// Normalized relative coordinates for blueprint geometric frames
const BLUEPRINT_RECTS = [
  { x: 0.08, y: 0.12, w: 0.22, h: 0.18 },
  { x: 0.38, y: 0.08, w: 0.28, h: 0.32 },
  { x: 0.72, y: 0.18, w: 0.20, h: 0.24 },
  { x: 0.14, y: 0.55, w: 0.18, h: 0.28 },
  { x: 0.52, y: 0.60, w: 0.32, h: 0.22 },
  { x: 0.82, y: 0.62, w: 0.14, h: 0.30 },
] as const;

// ── 2. Utility Helpers ────────────────────────────────────────────────────────
function getRandomChar(): string {
  return GLYPH_CHARS[Math.floor(Math.random() * GLYPH_CHARS.length)];
}

function getThemeVar(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return val || fallback;
}

function withAlpha(colorStr: string, alpha: number): string {
  const clean = colorStr.trim();
  if (clean.startsWith("oklch(")) {
    return clean.replace(/\)$/, ` / ${alpha})`);
  }
  return clean;
}

// ── 3. Theme Tint Color Palette Setup ─────────────────────────────────────────
function getThemeTints() {
  const { themeDefaults } = CONFIG;
  const purpleLch = getThemeVar("--purple-lch", themeDefaults.purpleLch);
  const blueLch = getThemeVar("--blue-lch", themeDefaults.blueLch);
  const orangeLch = getThemeVar("--orange-lch", themeDefaults.orangeLch);

  const purple100 = getThemeVar("--purple-100", themeDefaults.purple100);
  const blue100 = getThemeVar("--blue-100", themeDefaults.blue100);
  const orange100 = getThemeVar("--orange-100", themeDefaults.orange100);

  return [
    {
      head: "#ffffff",
      glow: purple100,
      mid: (alpha: number) => withAlpha(purpleLch, alpha),
      dim: (alpha: number) => withAlpha(themeDefaults.purple800, alpha),
    },
    {
      head: "#ffffff",
      glow: blue100,
      mid: (alpha: number) => withAlpha(blueLch, alpha),
      dim: (alpha: number) => withAlpha(themeDefaults.blue800, alpha),
    },
    {
      head: "#ffffff",
      glow: orange100,
      mid: (alpha: number) => withAlpha(orangeLch, alpha),
      dim: (alpha: number) => withAlpha(themeDefaults.orange800, alpha),
    },
  ];
}

type TintScheme = ReturnType<typeof getThemeTints>[number];

interface ColumnState {
  x: number;
  y: number;
  speed: number;
  glyphs: string[];
  tint: TintScheme;
}

function createColumn(x: number, tints: TintScheme[]): ColumnState {
  const { minLength, lengthVariance, minSpeed, speedVariance } = CONFIG.column;
  const length = minLength + Math.floor(Math.random() * lengthVariance);

  return {
    x,
    y: -(length * CONFIG.font.rowHeight) * Math.random(),
    speed: minSpeed + Math.random() * speedVariance,
    glyphs: Array.from({ length }, getRandomChar),
    tint: tints[Math.floor(Math.random() * tints.length)],
  };
}

// ── 4. Blueprint Pattern Generator (Offscreen Canvas) ────────────────────────
function buildPatternCanvas(w: number, h: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const { themeDefaults, grid } = CONFIG;
  const darkBg = getThemeVar("--neutral-900", themeDefaults.darkBg);
  const purpleLch = getThemeVar("--purple-lch", themeDefaults.purpleLch);
  const blueLch = getThemeVar("--blue-lch", themeDefaults.blueLch);

  // Background Ground
  ctx.fillStyle = darkBg.startsWith("oklch") ? darkBg : "oklch(15% 0.05 294.1)";
  ctx.fillRect(0, 0, w, h);

  // Dot Grid
  ctx.fillStyle = withAlpha(purpleLch, 0.22);
  for (let x = grid.dotGap; x < w; x += grid.dotGap) {
    for (let y = grid.dotGap; y < h; y += grid.dotGap) {
      ctx.beginPath();
      ctx.arc(x, y, grid.dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Geometric Frames
  ctx.strokeStyle = withAlpha(purpleLch, 0.18);
  ctx.lineWidth = 1;
  for (const rect of BLUEPRINT_RECTS) {
    const rx = rect.x * w;
    const ry = rect.y * h;
    const rw = rect.w * w;
    const rh = rect.h * h;

    ctx.strokeRect(rx, ry, rw, rh);
    ctx.beginPath();
    ctx.moveTo(rx + 4, ry + 12);
    ctx.lineTo(rx + rw - 4, ry + 12);
    ctx.stroke();
  }

  // Diagonal Cross Guides
  ctx.strokeStyle = withAlpha(blueLch, 0.09);
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w, h);
  ctx.moveTo(w, 0);
  ctx.lineTo(0, h);
  ctx.stroke();

  return canvas;
}

// ── 5. Main Component ─────────────────────────────────────────────────────────
export default function GlyphsBackground() {
  const patternRef = useRef<HTMLCanvasElement>(null);
  const mainRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const mainCanvas = mainRef.current!;
    const patternCanvas = patternRef.current!;
    const mainCtx = mainCanvas.getContext("2d")!;
    const patternCtx = patternCanvas.getContext("2d")!;

    let animId: number;
    let columns: ColumnState[] = [];
    const tints = getThemeTints();

    const handleResize = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;

      mainCanvas.width = W;
      mainCanvas.height = H;
      patternCanvas.width = W;
      patternCanvas.height = H;

      // Build static offscreen pattern and draw ONCE on resize (avoids wasteful per-frame redraws)
      const offscreenPattern = buildPatternCanvas(W, H);
      patternCtx.clearRect(0, 0, W, H);
      patternCtx.drawImage(offscreenPattern, 0, 0);

      // Re-initialize columns
      const numCols = Math.ceil(W / CONFIG.grid.columnGap);
      columns = Array.from(
        { length: numCols },
        (_, i) => createColumn(i * CONFIG.grid.columnGap + CONFIG.grid.columnGap / 2, tints),
      );
    };

    const renderFrame = () => {
      const W = mainCanvas.width;
      const H = mainCanvas.height;
      const { font, effects, column: colConfig } = CONFIG;

      // Step 1: Motion Trail Partial Erase
      mainCtx.globalCompositeOperation = "source-over";
      mainCtx.fillStyle = `oklch(12% 0.04 294.1 / ${effects.trailFadeOpacity})`;
      mainCtx.fillRect(0, 0, W, H);

      // Step 2: Spotlight Hole Punching (Erases dark layer around lead glyph)
      mainCtx.globalCompositeOperation = "destination-out";
      for (const col of columns) {
        const radius = effects.spotlightRadius;
        const grad = mainCtx.createRadialGradient(col.x, col.y, 0, col.x, col.y, radius);
        grad.addColorStop(0, "rgba(0,0,0,0.85)");
        grad.addColorStop(0.5, "rgba(0,0,0,0.35)");
        grad.addColorStop(1, "rgba(0,0,0,0)");

        mainCtx.fillStyle = grad;
        mainCtx.beginPath();
        mainCtx.arc(col.x, col.y, radius, 0, Math.PI * 2);
        mainCtx.fill();
      }

      // Step 3: Render Glyphs
      mainCtx.globalCompositeOperation = "source-over";
      mainCtx.font = `bold ${font.size}px ${font.family}`;
      mainCtx.textAlign = "center";

      for (const col of columns) {
        const { glyphs, tint } = col;

        for (let i = 0; i < glyphs.length; i++) {
          const cy = col.y + i * font.rowHeight;
          if (cy < -font.rowHeight || cy > H + font.rowHeight) continue;

          const frac = i / glyphs.length;

          if (i === 0) {
            // Head Glyph Neon Glow
            mainCtx.shadowColor = tint.glow;
            mainCtx.shadowBlur = effects.headGlowPrimary;
            mainCtx.fillStyle = tint.head;
            mainCtx.fillText(glyphs[i], col.x, cy);

            mainCtx.shadowBlur = effects.headGlowSecondary;
            mainCtx.fillText(glyphs[i], col.x, cy);
            mainCtx.shadowBlur = 0;
          } else if (frac < effects.brightTrailRatio) {
            mainCtx.shadowBlur = 0;
            const alpha = (1 - frac / effects.brightTrailRatio) * effects.maxMidAlpha;
            mainCtx.fillStyle = tint.mid(alpha);
            mainCtx.fillText(glyphs[i], col.x, cy);
          } else {
            mainCtx.shadowBlur = 0;
            const alpha = (1 - (frac - effects.brightTrailRatio) / (1 - effects.brightTrailRatio)) * effects.maxDimAlpha;
            mainCtx.fillStyle = tint.dim(alpha);
            mainCtx.fillText(glyphs[i], col.x, cy);
          }
        }

        // Advance column
        col.y += col.speed;

        // Random character flicker
        if (Math.random() < colConfig.flickerChance) {
          col.glyphs[Math.floor(Math.random() * glyphs.length)] = getRandomChar();
        }

        // Reset column when past bottom boundary
        if (col.y > H + glyphs.length * font.rowHeight) {
          const newCol = createColumn(col.x, tints);
          col.y = newCol.y;
          col.speed = newCol.speed;
          col.glyphs = newCol.glyphs;
          col.tint = newCol.tint;
        }
      }

      animId = requestAnimationFrame(renderFrame);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    animId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div class="fixed top-0 left-0 w-screen h-screen overflow-hidden -z-10 pointer-events-none bg-neutral-900">
      {/* Layer 1 — Revealed blueprint pattern */}
      <canvas ref={patternRef} class="absolute inset-0 block" />

      {/* Layer 2 — Animated trails & glyphs */}
      <canvas ref={mainRef} class="absolute inset-0 block" />
    </div>
  );
}
