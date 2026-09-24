"use client";

import { List, X } from "@phosphor-icons/react";
import type { ButtonHTMLAttributes } from "react";

export function NavigationToggle({
  open,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { open?: boolean }) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls="mobile-navigation"
      className="inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] border border-border md:hidden"
      {...props}
    >
      <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
      {open ? <X weight="bold" className="size-4" /> : <List weight="bold" className="size-4" />}
    </button>
  );
}
