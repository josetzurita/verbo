"use client";

function cn(...inputs: Array<string | undefined | false | null>) {
  return inputs.filter(Boolean).join(" ");
}

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { classifyNavigation, shouldInterceptNavigation } from "./classify-navigation";
import type { SiteNavItem } from "./navigation-types";
import { useRouteTransition } from "./use-route-transition";

export type TransitionLinkProps = ComponentProps<typeof Link> & {
  href: string;
};

export function TransitionLink({
  href,
  onClick,
  target,
  download,
  className,
  children,
  ...props
}: TransitionLinkProps) {
  const pathname = usePathname();
  const transition = useRouteTransition();
  const hrefValue = href;

  return (
    <Link
      href={href}
      target={target}
      download={download}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) {
          return;
        }
        const kind = classifyNavigation({
          href: hrefValue,
          currentPathname: pathname,
          target: typeof target === "string" ? target : undefined,
          download: Boolean(download),
          metaKey: event.metaKey,
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey,
          button: event.button,
        });
        if (!shouldInterceptNavigation(kind)) {
          return;
        }
        if (transition.reducedMotion) {
          event.preventDefault();
          transition.navigate(hrefValue);
          return;
        }
        if (!transition.enabled) {
          return;
        }
        event.preventDefault();
        transition.navigate(hrefValue);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}

export function DesktopNavigation({
  items,
  className,
}: {
  items: SiteNavItem[];
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className={cn("hidden min-w-0 md:block", className)}>
      <ul className="flex flex-nowrap items-center gap-6 overflow-x-auto">
        {items.map((item) => {
          const current = pathname === item.href;
          return (
            <li key={item.href} className="shrink-0">
              <TransitionLink
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap text-sm",
                  current ? "text-foreground" : "text-foreground/70",
                )}
              >
                {item.label}
              </TransitionLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
