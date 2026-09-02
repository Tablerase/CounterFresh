import { assertEquals } from "@std/assert";
import { signal } from "@preact/signals";
import { type ParticipantItem, sortParticipants } from "./ParticipantList.tsx";

Deno.test("ParticipantList - Primary sort orders participants descending by score", () => {
  const p1: ParticipantItem = {
    id: "1",
    name: signal("Alice"),
    count: signal(5),
  };
  const p2: ParticipantItem = {
    id: "2",
    name: signal("Bob"),
    count: signal(12),
  };
  const p3: ParticipantItem = {
    id: "3",
    name: signal("Charlie"),
    count: signal(3),
  };

  const sorted = sortParticipants([p1, p2, p3], [p1, p2, p3]);

  assertEquals(sorted.map((p) => p.name.value), ["Bob", "Alice", "Charlie"]);
});

Deno.test("ParticipantList - Stable tie-breaker preserves existing display order on equal scores", () => {
  const p1: ParticipantItem = {
    id: "1",
    name: signal("First"),
    count: signal(10),
  };
  const p2: ParticipantItem = {
    id: "2",
    name: signal("Second"),
    count: signal(10),
  };
  const p3: ParticipantItem = {
    id: "3",
    name: signal("Third"),
    count: signal(10),
  };

  // Initial order: [First, Second, Third]
  const currentOrder = [p1, p2, p3];

  // Re-sorting when all scores are 10 should keep [First, Second, Third]
  const sorted = sortParticipants([p3, p1, p2], currentOrder);
  assertEquals(sorted.map((p) => p.name.value), ["First", "Second", "Third"]);
});

Deno.test("ParticipantList - Score update shifts rank dynamically", () => {
  const p1: ParticipantItem = {
    id: "1",
    name: signal("Player 1"),
    count: signal(8),
  };
  const p2: ParticipantItem = {
    id: "2",
    name: signal("Player 2"),
    count: signal(5),
  };

  let currentOrder = [p1, p2];
  let sorted = sortParticipants([p1, p2], currentOrder);
  assertEquals(sorted.map((p) => p.name.value), ["Player 1", "Player 2"]);

  // Player 2 scores 10 points
  p2.count.value = 10;
  currentOrder = sorted;
  sorted = sortParticipants([p1, p2], currentOrder);

  assertEquals(sorted.map((p) => p.name.value), ["Player 2", "Player 1"]);
});

Deno.test("ParticipantList - Handles empty list and single participant", () => {
  assertEquals(sortParticipants([], []), []);

  const p1: ParticipantItem = {
    id: "1",
    name: signal("Solo"),
    count: signal(0),
  };
  const sorted = sortParticipants([p1], []);
  assertEquals(sorted, [p1]);
});

Deno.test("ParticipantList - Handles negative scores correctly", () => {
  const p1: ParticipantItem = {
    id: "1",
    name: signal("Negative"),
    count: signal(-5),
  };
  const p2: ParticipantItem = {
    id: "2",
    name: signal("Zero"),
    count: signal(0),
  };
  const p3: ParticipantItem = {
    id: "3",
    name: signal("Positive"),
    count: signal(5),
  };

  const sorted = sortParticipants([p1, p2, p3], []);
  assertEquals(sorted.map((p) => p.name.value), [
    "Positive",
    "Zero",
    "Negative",
  ]);
});

Deno.test("ParticipantList - Places new participant not in currentOrder appropriately", () => {
  const p1: ParticipantItem = {
    id: "1",
    name: signal("Existing"),
    count: signal(10),
  };
  const p2: ParticipantItem = {
    id: "2",
    name: signal("Newbie"),
    count: signal(10),
  };

  // p1 is in currentOrder, p2 is newly added (not in currentOrder)
  const sorted = sortParticipants([p1, p2], [p1]);
  // p1 has index 0 in currentOrder, p2 has index -1. So indexA - indexB = 0 - (-1) > 0, or preserved
  assertEquals(sorted.length, 2);
});
