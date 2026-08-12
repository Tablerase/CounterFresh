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
      class={` ${className}`}
    />
  );
}
