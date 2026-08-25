import { useEffect, useId, useRef, useState } from "preact/hooks";
import DeleteIcon from "@/components/DeleteIcon/DeleteIcon.tsx";

export interface HoldDeleteButtonProps {
  onDelete?: () => void;
  holdDuration?: number; // Duration in ms to complete deletion (default 800ms)
  class?: string;
  size?: number;
  title?: string;
}

export default function HoldDeleteButton({
  onDelete,
  holdDuration = 800,
  class: className = "",
  size = 28,
  title = "Hold to remove",
}: HoldDeleteButtonProps) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);

  const reqIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const progressRef = useRef(0);
  progressRef.current = progress;

  const rawGradientId = useId();
  const gradientId = `hold-gradient-${
    rawGradientId.replace(/[^a-zA-Z0-9_-]/g, "")
  }`;

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (reqIdRef.current !== null) {
        cancelAnimationFrame(reqIdRef.current);
      }
    };
  }, []);

  const startHolding = () => {
    if (isTriggered) return;
    setIsHolding(true);
    startTimeRef.current = performance.now() -
      (progressRef.current * holdDuration);

    if (reqIdRef.current !== null) {
      cancelAnimationFrame(reqIdRef.current);
    }

    const step = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const nextProgress = Math.min(1, elapsed / holdDuration);
      setProgress(nextProgress);

      if (nextProgress >= 1) {
        setIsTriggered(true);
        setIsHolding(false);
        if (onDelete) {
          onDelete();
        }
      } else {
        reqIdRef.current = requestAnimationFrame(step);
      }
    };

    reqIdRef.current = requestAnimationFrame(step);
  };

  const stopHolding = () => {
    if (isTriggered) return;
    setIsHolding(false);

    if (reqIdRef.current !== null) {
      cancelAnimationFrame(reqIdRef.current);
    }

    const currentProg = progressRef.current;
    if (currentProg <= 0) return;

    // Smoothly rewind / drain progress back to 0
    const drainStartTime = performance.now();
    const drainDuration = currentProg * 220;

    const drainStep = (now: number) => {
      const elapsed = now - drainStartTime;
      const fraction = Math.min(1, elapsed / (drainDuration || 1));
      const remainingProgress = currentProg * (1 - fraction);
      setProgress(remainingProgress);

      if (fraction < 1 && remainingProgress > 0) {
        reqIdRef.current = requestAnimationFrame(drainStep);
      } else {
        setProgress(0);
      }
    };

    reqIdRef.current = requestAnimationFrame(drainStep);
  };

  // Radial meter calculations
  const radius = 13.5;
  const circumference = 2 * Math.PI * radius; // ~84.82
  const strokeDashoffset = circumference * (1 - progress);

  // Micro vibration / shake effect when charging past 60%
  const isShaking = isHolding && progress > 0.6 && progress < 1;

  return (
    <button
      type="button"
      onPointerDown={(e) => {
        if (e.button !== 0) return; // Only trigger on primary click
        startHolding();
      }}
      onPointerUp={stopHolding}
      onPointerLeave={stopHolding}
      onPointerCancel={stopHolding}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          if (!isHolding) startHolding();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          stopHolding();
        }
      }}
      onContextMenu={(e) => e.preventDefault()}
      title={title}
      aria-label={title}
      class={`group relative inline-flex items-center justify-center rounded-full
        select-none cursor-pointer focus:outline-none transition-transform duration-150
        ${isHolding ? "scale-115" : "hover:scale-110 active:scale-95"}
        ${isShaking ? "animate-charge-shake" : ""}
        ${isTriggered ? "scale-125 opacity-0 transition-all duration-300" : ""}
        ${className}`}
      style={{ width: size + 10, height: size + 10 }}
    >
      {/* Radial Progress Ring */}
      <svg
        class="absolute inset-0 w-full h-full pointer-events-none -rotate-90 overflow-visible"
        viewBox="0 0 36 36"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff7b7b" />
            <stop offset="100%" stop-color="#ef4444" />
          </linearGradient>
        </defs>

        {/* Faint Background Track */}
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          class={`text-red-500/20 transition-opacity duration-200 ${
            isHolding || progress > 0
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-40"
          }`}
        />

        {/* Active Radial Progress Arc */}
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          stroke-width="2.6"
          stroke-linecap="round"
          stroke-dasharray={circumference}
          stroke-dashoffset={strokeDashoffset}
          style={{
            filter: progress > 0
              ? "drop-shadow(0 0 5px rgba(239, 68, 68, 0.8))"
              : "none",
          }}
        />
      </svg>

      {/* Delete Icon at center */}
      <div class="relative z-10 flex items-center justify-center pointer-events-none">
        <DeleteIcon width={size} height={size} />
      </div>
    </button>
  );
}
