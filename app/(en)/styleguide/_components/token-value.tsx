"use client";

import { useLayoutEffect, useRef, useState } from "react";

export function TokenValue({
  name,
  asColor = false,
}: {
  name: string;
  asColor?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState("measuring");

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    const styles = getComputedStyle(node);
    if (asColor) {
      setValue(styles.backgroundColor || "unset");
      return;
    }
    const raw = styles.getPropertyValue(name).trim();
    setValue(raw || "unset");
  }, [asColor, name]);

  return (
    <span className="type-mono text-foreground/80">
      <span
        aria-hidden
        className="pointer-events-none absolute h-px w-px overflow-hidden"
        ref={ref}
        style={asColor ? { backgroundColor: `var(${name})` } : undefined}
      />
      {value}
    </span>
  );
}
