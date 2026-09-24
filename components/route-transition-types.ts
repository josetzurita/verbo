import type { ReactNode } from "react";

export type RouteTransitionPhase = "idle" | "covering" | "waiting" | "revealing";

export type RouteTransitionState = {
  phase: RouteTransitionPhase;
  href: string | null;
  enabled: boolean;
  reducedMotion: boolean;
};

export type RouteTransitionRenderOverlay = (state: RouteTransitionState) => ReactNode;

export const ROUTE_TRANSITION_TIMEOUT_MS = 8000;
export const ROUTE_TRANSITION_COVER_MS = 280;
export const MAIN_CONTENT_ID = "main-content";
