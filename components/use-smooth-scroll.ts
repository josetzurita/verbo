"use client";

import type Lenis from "lenis";
import { createContext, useContext } from "react";
import { FINE_POINTER_QUERY } from "./motion-policy";
import { getReducedMotionSnapshot } from "./reduced-motion";
import {
  resolveSmoothScrollMode,
  type SmoothScrollMode,
} from "./smooth-scroll-options";

export type SmoothScrollToTarget = number | string | HTMLElement;

export type SmoothScrollToOptions = {
  immediate?: boolean;
  offset?: number;
  lock?: boolean;
};

export type SmoothScrollApi = {
  lenis: Lenis | null;
  mode: SmoothScrollMode;
  scrollTo: (target: SmoothScrollToTarget, options?: SmoothScrollToOptions) => void;
  start: () => void;
  stop: () => void;
  resize: () => void;
};

export const SmoothScrollContext = createContext<SmoothScrollApi | null>(null);

function nativeScrollTo(
  target: SmoothScrollToTarget,
  options?: SmoothScrollToOptions,
) {
  if (typeof window === "undefined") {
    return;
  }
  const behavior = options?.immediate ? "auto" : "smooth";
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior });
    return;
  }
  if (typeof target === "string") {
    if (target === "top" || target === "start") {
      window.scrollTo({ top: 0, behavior });
      return;
    }
    const node = document.querySelector(target);
    node?.scrollIntoView({ behavior, block: "start" });
    return;
  }
  target.scrollIntoView({ behavior, block: "start" });
}

export const nativeSmoothScrollApi: SmoothScrollApi = {
  lenis: null,
  mode: "reduced-motion",
  scrollTo: nativeScrollTo,
  start: () => undefined,
  stop: () => undefined,
  resize: () => undefined,
};

/**
 * Control API for the app-level SmoothScrollProvider.
 * Outside the provider this returns native window scrolling (lenis is null).
 */
export function useSmoothScroll(): SmoothScrollApi {
  const value = useContext(SmoothScrollContext);
  if (value) {
    return value;
  }
  const reduce = getReducedMotionSnapshot();
  const finePointer =
    typeof window !== "undefined" &&
    window.matchMedia(FINE_POINTER_QUERY).matches;
  return {
    ...nativeSmoothScrollApi,
    mode: resolveSmoothScrollMode({ reduce, finePointer }),
  };
}
