import { assertEquals } from "@std/assert";
import { signal } from "@preact/signals";
import type { ParticipantItem } from "./ParticipantList.tsx";

function sortParticipants(
  items: ParticipantItem[],
  currentOrder: ParticipantItem[],
): ParticipantItem[] {
  const list = [...items];
  list.sort((a, b) => {
    // 1. Primary sort: Score descending (higher score comes first)
    const scoreDiff = b.count.value - a.count.value;
    if (scoreDiff !== 0) {
      return scoreDiff;
    }

    // 2. Secondary tie-breaker: Preserve current display position
    const indexA = currentOrder.indexOf(a);
    const indexB = currentOrder.indexOf(b);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    return 0;
  });
  return list;
}

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
