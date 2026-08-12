import "./CounterIcon.css";

export interface IconProps {
  width?: number | string;
  height?: number | string;
  class?: string;
}

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
      id="minus-box"
      class={`${className}`}
    >
      {/* <rect width="32" height="32" fill="url(#grid-pattern)" /> */}
      <g id="minus-core">
        <line
          stroke-linecap="round"
          x1={10}
          y1={16}
          x2={22}
          y2={16}
        />
        <line
          id="arrow-top"
          stroke-linecap="round"
          x2={22}
          y2={12}
          x1={26}
          y1={16}
        />
        <line
          id="arrow-bottom"
          stroke-linecap="round"
          x1={26}
          y1={16}
          x2={22}
          y2={20}
        />
        {/* <path */}
        {/*   id="minus-arrow-head" */}
        {/*   d=" M 22 12 L 26 16 */}
        {/*   L 22 20 */}
        {/*   " */}
        {/*   fill="none" */}
        {/*   stroke-linecap="round" */}
        {/*   stroke-linejoin="round" */}
        {/* /> */}
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
      {/*             M 0 1 L 1 1" /> */}
      {/*   </pattern> */}
      {/* </defs> */}
    </svg>
  );
}
