import Counter from "@/islands/Counter.tsx";
import Surface from "@/components/Surface.tsx";
import { useId } from "preact/hooks";
import { ParticipantItem } from "@/islands/ParticipantList.tsx";

export interface ParticipantProps {
  participant: ParticipantItem;
}

export default function Participant({ participant }: ParticipantProps) {
  return (
    <Surface>
      <input
        id={useId()}
        type="text"
        value={participant.name}
        placeholder="Name"
        autocapitalize="sentences"
        class={`capitalize text-center align-middle items-center font-mono text-2xl font-bold text-purple-200 tracking-wider mb-2`}
      />
      <Counter count={participant.count} />
      {
        /* TODO: Position relative to other participant
            <p class="font-mono text-xs text-purple-400 tracking-widest uppercase mt-4">
              connecting to gateway...
            </p>
        */
      }
    </Surface>
  );
}
