import { IconProps } from "@/components/CounterIcons/IconProps.tsx";

export default function PlusIcon({
  width = 32,
  height = 32,
  class: className = "",
}: IconProps = {}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      class={`plus-box ${className}`}
    >
      <g class="plus-core" stroke="var(--plus-color, #a5c1ff)" stroke-width="2">
        <line
          stroke-linecap="round"
          x1={10}
          y1={16}
          x2={22}
          y2={16}
        />
        <path
          class="plus-arrow-head"
          d="M 16 10 L 16 16 L 16 22"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  );
}
