import Counter from "@/islands/Counter.tsx";
import Surface from "@/components/Surface.tsx";
import DeleteIcon from "@/components/DeleteIcon/DeleteIcon.tsx";
import { useEffect, useId, useRef, useState } from "preact/hooks";
import { ParticipantItem } from "@/islands/ParticipantList.tsx";

export interface ParticipantProps {
  participant: ParticipantItem;
  showRemove?: boolean;
  onRemove?: () => void;
}

export const HOLD_DURATION = 850; // ms to charge and validate deletion
export const DRAIN_MAX_DURATION = 240; // ms max duration to drain back to 0

export function calculateHoldProgress(
  elapsedMs: number,
  holdDuration: number = HOLD_DURATION,
): number {
  return Math.min(1, Math.max(0, elapsedMs / holdDuration));
}

export function calculateDrainProgress(
  initialProgress: number,
  drainElapsedMs: number,
  maxDrainDuration: number = DRAIN_MAX_DURATION,
): number {
  const drainDuration = initialProgress * maxDrainDuration;
  if (drainDuration <= 0) return 0;
  const fraction = Math.min(1, drainElapsedMs / drainDuration);
  return Math.max(0, initialProgress * (1 - fraction));
}

export function getShakeClass(progress: number): string {
  if (progress > 0.65) return "animate-card-shake-intense";
  if (progress > 0.35) return "animate-card-shake-mild";
  return "";
}

export default function Participant(
  { participant, showRemove = false, onRemove }: ParticipantProps,
) {
  const inputId = useId();
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const reqIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const progressRef = useRef(0);
  progressRef.current = progress;

  useEffect(() => {
    return () => {
      if (reqIdRef.current !== null) {
        cancelAnimationFrame(reqIdRef.current);
      }
    };
  }, []);

  const startHolding = () => {
    if (isDeleting) return;
    setIsHolding(true);
    startTimeRef.current = performance.now() -
      (progressRef.current * HOLD_DURATION);

    if (reqIdRef.current !== null) {
      cancelAnimationFrame(reqIdRef.current);
    }

    const step = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const nextProgress = calculateHoldProgress(elapsed, HOLD_DURATION);
      setProgress(nextProgress);

      if (nextProgress >= 1) {
        setIsHolding(false);
        setIsDeleting(true);
        // Play brief collapse animation before actual item removal
        setTimeout(() => {
          if (onRemove) {
            onRemove();
          }
        }, 180);
      } else {
        reqIdRef.current = requestAnimationFrame(step);
      }
    };

    reqIdRef.current = requestAnimationFrame(step);
  };

  const stopHolding = () => {
    if (isDeleting) return;
    setIsHolding(false);

    if (reqIdRef.current !== null) {
      cancelAnimationFrame(reqIdRef.current);
    }

    const currentProg = progressRef.current;
    if (currentProg <= 0) return;

    // Smoothly drain / rewind progress back to 0
    const drainStartTime = performance.now();

    const drainStep = (now: number) => {
      const elapsed = now - drainStartTime;
      const remainingProgress = calculateDrainProgress(
        currentProg,
        elapsed,
        DRAIN_MAX_DURATION,
      );
      setProgress(remainingProgress);

      if (remainingProgress > 0) {
        reqIdRef.current = requestAnimationFrame(drainStep);
      } else {
        setProgress(0);
      }
    };

    reqIdRef.current = requestAnimationFrame(drainStep);
  };

  // Card shake intensity classes based on charge level
  const shakeClass = getShakeClass(progress);

  // Dynamic card border and glow based on charge progress
  const dynamicSurfaceStyle = progress > 0
    ? {
      borderColor: `rgba(239, 68, 68, ${0.35 + progress * 0.65})`,
      boxShadow: `0 0 ${progress * 55}px rgba(239, 68, 68, ${progress * 0.65})`,
    }
    : undefined;

  return (
    <div
      class={`transition-all duration-200 ${
        isDeleting ? "scale-75 opacity-0 blur-sm pointer-events-none" : ""
      }`}
    >
      <Surface
        style={dynamicSurfaceStyle}
        class={`relative overflow-hidden transition-shadow duration-150 select-none ${shakeClass}`}
      >
        {/* 1. Danger Rising Fill Overlay */}
        <div
          class="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-600/35 via-red-500/15 to-transparent transition-[height] duration-75 ease-linear"
          style={{ height: `${progress * 100}%` }}
        />

        {/* 2. Glowing Laser Leading Edge */}
        <div
          class="pointer-events-none absolute left-0 right-0 h-[2px] bg-red-400 shadow-[0_0_15px_#ef4444] transition-[bottom,opacity] duration-75 ease-linear"
          style={{
            bottom: `calc(${progress * 100}% - 1px)`,
            opacity: progress > 0.02 ? 1 : 0,
          }}
        />

        {/* 3. Bottom Card Progress Bar */}
        <div
          class="pointer-events-none absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-500 via-orange-400 to-red-400 shadow-[0_0_8px_#ef4444] transition-[width] duration-75 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />

        {/* 4. Top-Right Delete Trigger Button */}
        {showRemove && (
          <button
            type="button"
            onPointerDown={(e) => {
              if (e.button !== 0) return;
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
            class={`absolute right-3 top-3 z-30 p-1 text-purple-400/60 hover:text-red-400 
              rounded transition-transform cursor-pointer focus:outline-none 
              ${isHolding ? "scale-125" : "hover:scale-125 active:scale-95"}`}
            title="Hold to remove participant"
            aria-label="Hold to remove participant"
          >
            <DeleteIcon width={28} height={28} />
          </button>
        )}

        {/* 5. Card Inputs & Content */}
        <div
          class={`relative z-10 transition-opacity duration-150 ${
            progress > 0 ? "opacity-95" : ""
          }`}
        >
          <input
            id={inputId}
            type="text"
            value={participant.name}
            onInput={(e) => {
              participant.name.value = e.currentTarget.value;
            }}
            placeholder="Name"
            autocapitalize="sentences"
            class="capitalize text-center align-middle items-center font-mono text-2xl font-bold text-purple-200 tracking-wider mb-2"
          />
          <Counter count={participant.count} />
        </div>
      </Surface>
    </div>
  );
}
