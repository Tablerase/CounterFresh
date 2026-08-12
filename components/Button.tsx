import type { ComponentChildren } from "preact";

export interface ButtonProps {
  id?: string;
  onClick?: () => void;
  children?: ComponentChildren;
  disabled?: boolean;
  class?: string;
}

export function Button({ class: className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      class={`inline-flex items-center justify-center 
      w-14 h-14 sm:w-16 sm:h-16 rounded-full 
      bg-[oklch(from_var(--neutral-purple-lch)_calc(l-0.4)_c_h)] 
      hover:bg-[oklch(from_var(--neutral-purple-lch)_calc(l-0.4)_calc(c+0.05)_h)] 
      border border-purple-600/40 hover:border-purple-400 
      transition-all duration-300 shadow-lg active:scale-95 cursor-pointer ${className}`}
    />
  );
}
