import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const fieldControlClass =
  "w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out-expo)] placeholder:text-foreground/45 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive data-[specimen=focus]:ring-2 data-[specimen=focus]:ring-ring";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;

  return (
    <div className={cn("grid gap-2", className)}>
      <label
        className="text-sm font-medium text-foreground"
        htmlFor={htmlFor}
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p className="text-xs text-foreground/65" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="text-xs text-destructive" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function FieldLabel({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-sm font-medium text-foreground", className)} {...props} />
  );
}
