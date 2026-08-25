import { IconProps } from "@/components/CounterIcons/IconProps.tsx";
import { useId } from "preact/hooks";

export default function DeleteIcon({
  width = 32,
  height = 32,
  class: className = "",
}: IconProps = {}) {
  const rawId = useId();
  const maskId = `delete-mask-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      class={`delete-box overflow-visible ${className}`}
    >
      <defs>
        <mask id={maskId}>
          {/* Mask Box: Black (hidden) -> White (visible) */}
          <rect
            class="mask-bg"
            x={4}
            y={4}
            width={24}
            height={24}
            rx={6}
            fill="black"
          />
          {/* Mask Cross: White (visible cross) -> Black (cutout hole) */}
          <path
            class="mask-cross"
            d="M 11 11 L 21 21 M 21 11 L 11 21"
            fill="none"
            stroke="white"
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </mask>
      </defs>

      {/* Single Rectangle element whose fill and mask morph seamlessly */}
      <rect
        class="morph-box"
        x={4}
        y={4}
        width={24}
        height={24}
        rx={6}
        fill="var(--close-color, #c5b5ff)"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
