import { assertEquals } from "@std/assert";

const HOLD_DURATION = 850; // ms
const DRAIN_MAX_DURATION = 240; // ms

function calculateHoldProgress(elapsedMs: number): number {
  return Math.min(1, Math.max(0, elapsedMs / HOLD_DURATION));
}

function calculateDrainProgress(
  initialProgress: number,
  drainElapsedMs: number,
): number {
  const drainDuration = initialProgress * DRAIN_MAX_DURATION;
  if (drainDuration <= 0) return 0;
  const fraction = Math.min(1, drainElapsedMs / drainDuration);
  return Math.max(0, initialProgress * (1 - fraction));
}

function getShakeClass(progress: number, isHolding: boolean): string {
  if (!isHolding || progress < 0.35) return "";
  if (progress >= 0.65) return "shake-intense";
  return "shake-mild";
}

Deno.test("Participant - Charging calculates correct progress ratio", () => {
  assertEquals(calculateHoldProgress(0), 0);
  assertEquals(calculateHoldProgress(425), 0.5);
  assertEquals(calculateHoldProgress(850), 1.0);
  assertEquals(calculateHoldProgress(1200), 1.0); // Clamped at 1.0
});

Deno.test("Participant - Shake intensity activates at thresholds", () => {
  assertEquals(getShakeClass(0.2, true), "");
  assertEquals(getShakeClass(0.34, true), "");
  assertEquals(getShakeClass(0.35, true), "shake-mild");
  assertEquals(getShakeClass(0.50, true), "shake-mild");
  assertEquals(getShakeClass(0.65, true), "shake-intense");
  assertEquals(getShakeClass(0.90, true), "shake-intense");
  assertEquals(getShakeClass(0.90, false), ""); // No shake when not holding
});

Deno.test("Participant - Drain loop scales duration proportionally to charge", () => {
  const halfCharged = 0.5;
  // Half charged drain duration is 120ms
  assertEquals(calculateDrainProgress(halfCharged, 0), 0.5);
  assertEquals(calculateDrainProgress(halfCharged, 60), 0.25);
  assertEquals(calculateDrainProgress(halfCharged, 120), 0);
  assertEquals(calculateDrainProgress(halfCharged, 200), 0); // Clamped at 0
});
