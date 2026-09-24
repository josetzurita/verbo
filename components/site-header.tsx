"use client";

function cn(...inputs: Array<string | undefined | false | null>) {
  return inputs.filter(Boolean).join(" ");
}

import { useState, type ReactNode } from "react";
import { DesktopNavigation } from "./transition-link";
import { MobileNavigation } from "./mobile-navigation";
import { NavigationToggle } from "./navigation-toggle";
import type { SiteNavItem } from "./navigation-types";

export function SiteHeader({
  brand,
  items,
  className,
}: {
  brand: ReactNode;
  items: SiteNavItem[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 flex h-14 items-center justify-between gap-6 border-b border-border bg-background px-4",
        className,
      )}
      style={{ zIndex: "var(--z-sticky)" }}
    >
      <div className="min-w-0 shrink">{brand}</div>
      <DesktopNavigation items={items} />
      <NavigationToggle open={open} onClick={() => setOpen((value) => !value)} />
      <MobileNavigation items={items} open={open} onOpenChange={setOpen} />
    </header>
  );
}
