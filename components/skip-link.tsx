function cn(...inputs: Array<string | undefined | false | null>) {
  return inputs.filter(Boolean).join(" ");
}

import type { AnchorHTMLAttributes } from "react";
import { MAIN_CONTENT_ID } from "./route-transition-types";

export function SkipLink({
  className,
  children = "Skip to content",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-surface focus:px-3 focus:py-2 focus:text-sm",
        className,
      )}
      style={{ zIndex: "var(--z-dialog)" }}
      {...props}
    >
      {children}
    </a>
  );
}
