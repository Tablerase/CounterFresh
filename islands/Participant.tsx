import Counter from "@/islands/Counter.tsx";
import Surface from "@/components/Surface.tsx";
import DeleteIcon from "@/components/DeleteIcon/DeleteIcon.tsx";
import { useId } from "preact/hooks";
import { ParticipantItem } from "@/islands/ParticipantList.tsx";

export interface ParticipantProps {
  participant: ParticipantItem;
  showRemove?: boolean;
  onRemove?: () => void;
}

export default function Participant(
  { participant, showRemove = false, onRemove }: ParticipantProps,
) {
  return (
    <Surface class="relative">
      {showRemove && (
        <button
          type="button"
          onClick={onRemove}
          class="absolute right-3 top-3 text-purple-400/60 hover:text-red-400 hover:scale-150 font-bold text-sm p-1 rounded transition-transform cursor-pointer"
          title="Remove Participant"
        >
          <DeleteIcon />
        </button>
      )}
      <input
        id={useId()}
        type="text"
        value={participant.name}
        onInput={(e) => {
          participant.name.value = e.currentTarget.value;
        }}
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
