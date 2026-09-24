import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { fieldControlClass } from "./field";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  specimenState?: "focus";
};

export function Input({ className, specimenState, ...props }: InputProps) {
  return (
    <input
      className={cn(fieldControlClass, className)}
      data-specimen={specimenState}
      {...props}
    />
  );
}
