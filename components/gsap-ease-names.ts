import type { TweenIntent } from "./profiles/types";

export const GSAP_EASE_NAMES = {
  enter: "cds-enter",
  settle: "cds-settle",
  move: "cds-move",
  exit: "cds-exit",
  linear: "cds-linear",
} as const satisfies Record<TweenIntent, string>;

export const GSAP_SCROLL_SCRUB_EASE = "none";

export const NATIVE_GSAP_EASE_NAMES = new Set([
  "none",
  "linear",
  "power1",
  "power2",
  "power3",
  "power4",
  "quad",
  "cubic",
  "quart",
  "quint",
  "strong",
  "elastic",
  "bounce",
  "back",
  "sine",
  "expo",
  "circ",
  "slow",
  "steps",
  "in",
  "out",
  "inOut",
]);
