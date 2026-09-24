"use client";

import { CircleNotch } from "@phosphor-icons/react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import {
  type ButtonSize,
  type ButtonSpecimenState,
  type ButtonVariant,
} from "./button-variants";

export type { ButtonSize, ButtonSpecimenState, ButtonVariant } from "./button-variants";
export {
  BUTTON_SIZES,
  BUTTON_SPECIMEN_STATES,
  BUTTON_VARIANTS,
} from "./button-variants";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-accent text-accent-foreground hover:brightness-95 data-[specimen=hover]:brightness-95 data-[specimen=pressed]:brightness-90",
  secondary:
    "border-border bg-surface text-foreground hover:bg-surface-muted data-[specimen=hover]:bg-surface-muted data-[specimen=pressed]:bg-surface-muted",
  ghost:
    "border-transparent bg-transparent text-foreground hover:bg-surface-muted data-[specimen=hover]:bg-surface-muted data-[specimen=pressed]:bg-surface-muted",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  specimenState?: ButtonSpecimenState;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  specimenState,
  disabled,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading || specimenState === "disabled";
  const isLoading = loading || specimenState === "loading";
  const forced =
    specimenState && specimenState !== "default" && specimenState !== "disabled" && specimenState !== "loading"
      ? specimenState
      : undefined;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] border font-medium tracking-tight outline-none transition-[transform,background-color,color,border-color,filter] duration-[var(--duration-fast)] ease-[var(--ease-out-expo)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 data-[specimen=pressed]:scale-[0.98] data-[specimen=focus]:ring-2 data-[specimen=focus]:ring-ring data-[specimen=focus]:ring-offset-2 data-[specimen=focus]:ring-offset-background",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      data-slot="button"
      data-specimen={forced}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      type={type}
      {...props}
    >
      {isLoading ? (
        <CircleNotch aria-hidden className="size-4 animate-spin" weight="bold" />
      ) : null}
      {children}
    </button>
  );
}
