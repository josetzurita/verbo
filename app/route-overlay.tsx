"use client";

import type { RouteTransitionState } from "../components/route-transition-types";

export function RouteOverlay({ phase }: RouteTransitionState) {
  const visible = phase === "covering" || phase === "waiting" || phase === "revealing";
  return (
    <div
      aria-hidden={!visible}
      data-testid="route-overlay"
      data-phase={phase}
      className="fixed inset-0 bg-background transition-opacity duration-[var(--duration-base)]"
      style={{
        zIndex: "var(--z-overlay)",
        opacity: visible ? 1 : 0,
        pointerEvents: phase === "covering" || phase === "waiting" ? "auto" : "none",
      }}
    />
  );
}
