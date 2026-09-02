import { assertEquals } from "@std/assert";
import {
  calculateDrainProgress,
  calculateHoldProgress,
  DRAIN_MAX_DURATION,
  getShakeClass,
  HOLD_DURATION,
} from "./Participant.tsx";

Deno.test("Participant - Constants are defined with expected values", () => {
  assertEquals(HOLD_DURATION, 850);
  assertEquals(DRAIN_MAX_DURATION, 240);
});

Deno.test("Participant - Charging calculates correct progress ratio", () => {
  assertEquals(calculateHoldProgress(0), 0);
  assertEquals(calculateHoldProgress(425), 0.5);
  assertEquals(calculateHoldProgress(850), 1.0);
  assertEquals(calculateHoldProgress(1200), 1.0); // Clamped at 1.0
  assertEquals(calculateHoldProgress(-50), 0); // Negative elapsed clamped to 0
});

Deno.test("Participant - Custom hold duration parameter works", () => {
  assertEquals(calculateHoldProgress(500, 1000), 0.5);
  assertEquals(calculateHoldProgress(1000, 1000), 1.0);
});

Deno.test("Participant - Shake intensity activates at thresholds", () => {
  assertEquals(getShakeClass(0), "");
  assertEquals(getShakeClass(0.2), "");
  assertEquals(getShakeClass(0.35), "");
  assertEquals(getShakeClass(0.36), "animate-card-shake-mild");
  assertEquals(getShakeClass(0.50), "animate-card-shake-mild");
  assertEquals(getShakeClass(0.65), "animate-card-shake-mild");
  assertEquals(getShakeClass(0.66), "animate-card-shake-intense");
  assertEquals(getShakeClass(0.90), "animate-card-shake-intense");
  assertEquals(getShakeClass(1.0), "animate-card-shake-intense");
});

Deno.test("Participant - Drain loop scales duration proportionally to charge", () => {
  const halfCharged = 0.5;
  // Half charged drain duration is 0.5 * 240 = 120ms
  assertEquals(calculateDrainProgress(halfCharged, 0), 0.5);
  assertEquals(calculateDrainProgress(halfCharged, 60), 0.25);
  assertEquals(calculateDrainProgress(halfCharged, 120), 0);
  assertEquals(calculateDrainProgress(halfCharged, 200), 0); // Clamped at 0
});

Deno.test("Participant - Drain handles zero or negative progress gracefully", () => {
  assertEquals(calculateDrainProgress(0, 100), 0);
  assertEquals(calculateDrainProgress(-0.5, 100), 0);
});
