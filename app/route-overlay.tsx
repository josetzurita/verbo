"use client";

import { ROUTE_TRANSITION_COVER_MS, type RouteTransitionState } from "../components/route-transition-types";

const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

function panelTransform(phase: RouteTransitionState["phase"]) {
  if (phase === "covering" || phase === "waiting") {
    return "translate3d(0, 0, 0)";
  }
  if (phase === "revealing") {
    return "translate3d(0, -100%, 0)";
  }
  return "translate3d(0, 100%, 0)";
}

export function RouteOverlay({ phase }: RouteTransitionState) {
  const active = phase !== "idle";
  const covered = phase === "covering" || phase === "waiting";
  const transition = active ? `transform ${ROUTE_TRANSITION_COVER_MS}ms ${EASE}` : "none";

  return (
    <div
      aria-hidden="true"
      data-testid="route-overlay"
      data-phase={phase}
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: "var(--z-overlay)", visibility: active ? "visible" : "hidden" }}
    >
      <div
        className="absolute inset-0 bg-background will-change-transform"
        style={{
          transform: panelTransform(phase),
          transition,
          pointerEvents: covered ? "auto" : "none",
        }}
      />
    </div>
  );
}
