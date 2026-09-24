function cn(...inputs: Array<string | undefined | false | null>) {
  return inputs.filter(Boolean).join(" ");
}

import type { HTMLAttributes } from "react";

export function MediaFrame({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <figure className={cn("relative overflow-hidden", className)} {...props}>
      {children}
    </figure>
  );
}
