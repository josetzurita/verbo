import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function Radio({ className, ...props }: RadioProps) {
  return (
    <input
      className={cn(
        "size-4 border-border accent-accent outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      type="radio"
      {...props}
    />
  );
}
