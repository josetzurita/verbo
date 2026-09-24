function cn(...inputs: Array<string | undefined | false | null>) {
  return inputs.filter(Boolean).join(" ");
}

import type { HTMLAttributes } from "react";

export function AspectMedia({
  width,
  height,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  width: number;
  height: number;
}) {
  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: `${String(width)} / ${String(height)}` }}
      {...props}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
