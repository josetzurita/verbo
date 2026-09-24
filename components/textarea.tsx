import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { fieldControlClass } from "./field";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  specimenState?: "focus";
};

export function Textarea({ className, specimenState, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(fieldControlClass, "min-h-24 resize-y", className)}
      data-specimen={specimenState}
      {...props}
    />
  );
}
