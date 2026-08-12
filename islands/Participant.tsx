import { useSignal } from "@preact/signals";
import Counter from "@/islands/Counter.tsx";
import Surface from "@/components/Surface.tsx";
import { useId } from "preact/hooks";

export default function Participant() {
  const count = useSignal<number>(0);
  const name = useSignal<string>("");

  return (
    <Surface>
      <input
        id={useId()}
        type="text"
        value={name}
        placeholder="Name"
        autocapitalize="sentences"
        class={`capitalize text-center align-middle items-center font-mono text-2xl font-bold text-purple-200 tracking-wider mb-2`}
      />
      <Counter count={count} />
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
