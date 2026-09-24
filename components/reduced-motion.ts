"use client";

import { useReducedMotion } from "motion/react";

export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia(reducedMotionQuery).matches;
}

export function usePrefersReducedMotion(): boolean {
  return Boolean(useReducedMotion());
}

export const reducedMotionCss = {
  query: reducedMotionQuery,
  disableTransitions: `
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`,
};
