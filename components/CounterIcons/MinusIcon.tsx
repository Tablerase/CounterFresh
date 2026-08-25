import { IconProps } from "@/components/CounterIcons/IconProps.tsx";

export default function MinusIcon({
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
      class={`minus-box ${className}`}
    >
      <g
        class="minus-core"
        stroke="var(--minus-color, #c5b5ff)"
        stroke-width="2"
      >
        <line
          stroke-linecap="round"
          x1={10}
          y1={16}
          x2={22}
          y2={16}
        />
        <line
          class="arrow-top"
          stroke-linecap="round"
          x2={22}
          y2={12}
          x1={26}
          y1={16}
        />
        <line
          class="arrow-bottom"
          stroke-linecap="round"
          x1={26}
          y1={16}
          x2={22}
          y2={20}
        />
      </g>
    </svg>
  );
}
