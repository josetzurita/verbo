"use client";

import { createContext, useContext } from "react";
import type { RouteTransitionState } from "./route-transition-types";

export type RouteTransitionApi = RouteTransitionState & {
  navigate: (href: string) => void;
  fail: () => void;
};

export const RouteTransitionContext = createContext<RouteTransitionApi | null>(null);

export function useRouteTransition(): RouteTransitionApi {
  const value = useContext(RouteTransitionContext);
  if (!value) {
    return {
      phase: "idle",
      href: null,
      enabled: false,
      reducedMotion: false,
      navigate: (href: string) => {
        window.location.assign(href);
      },
      fail: () => undefined,
    };
  }
  return value;
}
