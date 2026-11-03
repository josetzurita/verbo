import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SpecimenTable({
  columns,
  stickyFirst = true,
  minWidthClass = "min-w-[64rem]",
  children,
}: {
  columns: string[];
  stickyFirst?: boolean;
  minWidthClass?: string;
  children: ReactNode;
}) {
  return (
    <div className="max-w-full overflow-x-auto">
      <table className={cn("w-full border-collapse text-left text-sm", minWidthClass)}>
        <thead>
          <tr className="border-b border-border">
            {columns.map((column, index) => (
              <th
                className={cn(
                  "bg-background py-3 pr-6 font-medium text-foreground/70",
                  stickyFirst && index === 0 && "sticky left-0 z-[var(--z-raised)] min-w-32",
                )}
                key={column}
                scope="col"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function SpecimenCell({
  children,
  sticky = false,
  className,
}: {
  children: ReactNode;
  sticky?: boolean;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "border-b border-border py-4 pr-6 align-top",
        sticky && "sticky left-0 z-[var(--z-raised)] bg-background",
        className,
      )}
    >
      {children}
    </td>
  );
}
