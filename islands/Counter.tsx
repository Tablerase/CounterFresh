import type { Signal } from "@preact/signals";
import { Button } from "@/components/Button.tsx";
import MinusIcon from "@/components/CounterIcons/MinusIcon.tsx";
import PlusIcon from "@/components/CounterIcons/PlusIcon.tsx";

interface CounterProps {
  count: Signal<number>;
}

export default function Counter(props: CounterProps) {
  const iconSize = 50;

  return (
    <div class="grid grid-cols-[auto_120px_auto] sm:grid-cols-[auto_160px_auto] items-center justify-center gap-4 sm:gap-6 py-6 select-none mx-auto">
      {/* Decrement Button - Fixed left grid column */}
      <div class="flex justify-end">
        <Button
          id="decrement"
          class="inline-flex items-center justify-center 
      w-14 h-14 sm:w-16 sm:h-16 rounded-full 
      bg-[oklch(from_var(--neutral-purple-lch)_calc(l-0.4)_c_h)] 
      hover:bg-[oklch(from_var(--neutral-purple-lch)_calc(l-0.4)_calc(c+0.05)_h)] 
      border border-purple-600/40 hover:border-purple-400 
      text-white transition-all duration-300 shadow-lg active:scale-95 cursor-pointer"
          onClick={() => {
            props.count.value -= 1;
          }}
        >
          <MinusIcon width={iconSize} height={iconSize} />
        </Button>
      </div>

      {/* Center Number - Exact 120px / 160px fixed width grid column */}
      <div class="w-30 sm:w-40 text-center flex items-center justify-center overflow">
        <p class="text-6xl sm:text-7xl font-bold font-title tabular-nums tracking-tight leading-none text-purple-100 drop-shadow-sm drop-shadow-purple-400">
          {props.count}
        </p>
      </div>

      {/* Increment Button - Fixed right grid column */}
      <div class="flex justify-start">
        <Button
          id="increment"
          class="inline-flex items-center justify-center 
      w-14 h-14 sm:w-16 sm:h-16 rounded-full 
      bg-[oklch(from_var(--neutral-purple-lch)_calc(l-0.4)_c_h)] 
      hover:bg-[oklch(from_var(--neutral-purple-lch)_calc(l-0.4)_calc(c+0.05)_h)] 
      border border-purple-600/40 hover:border-purple-400 
      text-white transition-all duration-300 shadow-lg active:scale-95 cursor-pointer"
          onClick={() => {
            props.count.value += 1;
          }}
        >
          <PlusIcon width={iconSize} height={iconSize} />
        </Button>
      </div>
    </div>
  );
}
