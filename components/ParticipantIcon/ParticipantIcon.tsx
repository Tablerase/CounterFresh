import { IconProps } from "@/components/CounterIcons/IconProps.tsx";

export default function ParticipantIcon({
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
      class={`participant-box ${className}`}
    >
      <g
        class="participant-core"
        stroke="var(--add-participant-color, white)"
        stroke-width="5"
      >
        <path
          class="participant-head"
          d="M 16 6 C 16 6 16 26 16 26 C 16 26 16 6 16 6"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          class="participant-body"
          d="M 6 16 C 12 16 22 16 26 16"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  );
}
