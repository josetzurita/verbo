"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { usePathname } from "next/navigation";
import { TransitionLink } from "./transition-link";
import type { SiteNavItem } from "./navigation-types";

export function MobileNavigation({
  items,
  open,
  onOpenChange,
}: {
  items: SiteNavItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-foreground/40 md:hidden"
          style={{ zIndex: "var(--z-overlay)" }}
        />
        <Dialog.Content
          id="mobile-navigation"
          data-lenis-prevent=""
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col gap-4 overflow-y-auto border-l border-border bg-surface p-6 md:hidden"
          style={{ zIndex: "var(--z-dialog)" }}
        >
          <Dialog.Title className="text-sm font-medium">Navigation</Dialog.Title>
          <ul className="grid gap-2">
            {items.map((item) => {
              const current = pathname === item.href;
              return (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => onOpenChange(false)}
                    className="block py-2 text-base"
                  >
                    {item.label}
                  </TransitionLink>
                </li>
              );
            })}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
