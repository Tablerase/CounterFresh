import "./ParticipantIcon.css";
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
      {/* <rect width="32" height="32" fill="url(#grid-pattern)" /> */}
      <g id="participant-core">
        <path
          id="participant-head"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="participant-body"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      {/* <defs> */}
      {/*   <pattern */}
      {/*     id="grid-pattern" */}
      {/*     width="1" */}
      {/*     height="1" */}
      {/*     stroke-width="0.1" */}
      {/*     patternUnits="userSpaceOnUse" */}
      {/*     stroke="grey" */}
      {/*   > */}
      {/*     <rect width="1" height="1" x="0" y="0" fill="white" /> */}
      {/*     <path d=" M 1 0 L 1 1 */}
      {/*               M 0 1 L 1 1" /> */}
      {/*   </pattern> */}
      {/* </defs> */}
    </svg>
  );
}
