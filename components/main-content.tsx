function cn(...inputs: Array<string | undefined | false | null>) {
  return inputs.filter(Boolean).join(" ");
}

import type { HTMLAttributes } from "react";
import { MAIN_CONTENT_ID } from "./route-transition-types";

export function MainContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <main
      id={MAIN_CONTENT_ID}
      tabIndex={-1}
      className={cn("outline-none", className)}
      {...props}
    >
      {children}
    </main>
  );
}
