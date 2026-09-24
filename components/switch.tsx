"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Switch({
  checked = false,
  onCheckedChange,
  className,
  disabled,
  ...props
}: SwitchProps) {
  return (
    <button
      aria-checked={checked}
      className={cn(
        "relative h-6 w-10 rounded-full border border-border outline-none transition-[background-color] duration-[var(--duration-fast)] ease-[var(--ease-out-expo)] focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-accent" : "bg-surface-muted",
        className,
      )}
      disabled={disabled}
      role="switch"
      type="button"
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-0.5 left-0.5 block size-4 rounded-full bg-foreground transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]",
          checked ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  );
}
