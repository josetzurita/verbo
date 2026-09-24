import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { fieldControlClass } from "./field";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  specimenState?: "focus";
};

export function Select({ className, specimenState, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(fieldControlClass, className)}
      data-specimen={specimenState}
      {...props}
    >
      {children}
    </select>
  );
}
