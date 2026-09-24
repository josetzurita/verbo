import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      className={cn(
        "size-4 rounded-[var(--radius-sm)] border-border accent-accent outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      type="checkbox"
      {...props}
    />
  );
}
