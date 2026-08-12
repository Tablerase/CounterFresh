import type { ComponentChildren } from "preact";

export interface SurfaceProps {
  children?: ComponentChildren;
  class?: string;
}

export default function Surface(
  { children, class: className = "" }: SurfaceProps,
) {
  return (
    <div
      class={`max-w-md w-full p-10 sm:px-14 text-center rounded-2xl border border-purple-600/35 
              bg-[oklch(from_var(--neutral-purple-lch)_calc(l-0.5)_c_h)] 
              backdrop-blur-xl shadow-[0_8px_64px_oklch(from_var(--purple-700)_l_c_h_/0.4)] ${className}`}
    >
      {children}
    </div>
  );
}
