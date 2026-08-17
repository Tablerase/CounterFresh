import { IconProps } from "@/components/CounterIcons/IconProps.tsx";
import { useId } from "preact/hooks";
import "./DeleteIcon.css";

export default function DeleteIcon({
  width = 32,
  height = 32,
  class: className = "",
}: IconProps = {}) {
  const maskId = useId();

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
          <rect class="mask-bg" x={4} y={4} width={24} height={24} rx={6} />
          {/* Mask Cross: White (visible cross) -> Black (cutout hole) */}
          <path
            class="mask-cross"
            d="M 11 11 L 21 21 M 21 11 L 11 21"
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
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
