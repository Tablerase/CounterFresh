import { Signal, signal, useComputed, useSignal } from "@preact/signals";
import { useLayoutEffect, useRef } from "preact/hooks";
import { Button } from "@/components/Button.tsx";
import Participant from "@/islands/Participant.tsx";
import ParticipantIcon from "@/components/ParticipantIcon/ParticipantIcon.tsx";

export interface ParticipantItem {
  id: string;
  name: Signal<string>;
  count: Signal<number>;
}

export function sortParticipants(
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

    // 2. Secondary tie-breaker: Preserve CURRENT display position!
    const indexA = currentOrder.indexOf(a);
    const indexB = currentOrder.indexOf(b);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    return 0;
  });

  return list;
}

export default function ParticipantList() {
  const participantItems = useSignal<ParticipantItem[]>([
    { id: crypto.randomUUID(), name: signal(""), count: signal(0) },
    { id: crypto.randomUUID(), name: signal(""), count: signal(0) },
  ]);

  // Track current display order for stable tie-breaking
  const currentSortedRef = useRef<ParticipantItem[]>([]);

  // Sorts cards by score descending. On equal scores, keeps current display order (no swap on ties!)
  const sortedParticipants = useComputed(() => {
    const items = sortParticipants(
      participantItems.value,
      currentSortedRef.current,
    );
    currentSortedRef.current = items;
    return items;
  });

  function addParticipant() {
    const newParticipant = {
      id: crypto.randomUUID(),
      name: signal(""),
      count: signal(0),
    };
    participantItems.value = [...participantItems.value, newParticipant];
  }

  function removeParticipant(id: string) {
    participantItems.value = participantItems.value.filter((item) =>
      item.id !== id
    );
  }

  const positionsRef = useRef<Map<string, DOMRect>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // 🚀 FLIP Layout Animation (First, Last, Invert, Play) for smooth card sliding
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll<HTMLElement>(
      "[data-participant-id]",
    );
    const newPositions = new Map<string, DOMRect>();

    cards.forEach((card) => {
      const id = card.getAttribute("data-participant-id");
      if (!id) return;

      const newRect = card.getBoundingClientRect();
      const oldRect = positionsRef.current.get(id);

      if (oldRect) {
        const deltaX = oldRect.left - newRect.left;
        const deltaY = oldRect.top - newRect.top;

        if (deltaX !== 0 || deltaY !== 0) {
          // 1. Invert: Instantly snap card back to its previous position
          card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          card.style.transition = "transform 0s";

          // 2. Play: Smoothly animate card sliding into its new position
          requestAnimationFrame(() => {
            card.style.transition =
              "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
            card.style.transform = "";
          });
        }
      }

      newPositions.set(id, newRect);
    });

    positionsRef.current = newPositions;
  }, [sortedParticipants.value]);

  return (
    <div
      id="participantList"
      class="relative z-10 max-w-5xl mx-auto flex flex-col gap-5 items-center justify-center min-h-[70vh]"
    >
      <div
        ref={containerRef}
        id="participantRow"
        class="flex flex-row flex-wrap gap-4 justify-center"
      >
        {sortedParticipants.value.map((element) => (
          <div
            key={element.id}
            data-participant-id={element.id}
            class="will-change-transform"
          >
            {/* TODO: Add background gradient based on position */}
            <Participant
              participant={element}
              showRemove={sortedParticipants.value.length > 1}
              onRemove={() => removeParticipant(element.id)}
            />
          </div>
        ))}
      </div>
      <Button
        id="addParticipant"
        title="Add Participant"
        onClick={addParticipant}
        class="font-bold text-6xl text-neutral-50"
      >
        <ParticipantIcon />
      </Button>
    </div>
  );
}
