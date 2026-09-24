import { FINE_POINTER_QUERY } from "./motion-policy";

export type SmoothScrollMode = "smooth" | "native-touch" | "reduced-motion";

export type SmoothScrollOptions = {
  lerp: number;
  anchors: boolean;
  stopInertiaOnNavigate: boolean;
  syncTouch: boolean;
  smoothWheel: boolean;
  autoRaf: boolean;
  respectReducedMotion: boolean;
};

export const SMOOTH_SCROLL_DEFAULTS: SmoothScrollOptions = {
  lerp: 0.1,
  anchors: true,
  stopInertiaOnNavigate: true,
  syncTouch: false,
  smoothWheel: true,
  autoRaf: false,
  respectReducedMotion: true,
};

export const LENIS_PREVENT_SELECTOR =
  "[data-lenis-prevent], [data-radix-dialog-content], [role='dialog']";

export function resolveSmoothScrollMode(options: {
  reduce: boolean | null | undefined;
  finePointer: boolean;
}): SmoothScrollMode {
  if (options.reduce) {
    return "reduced-motion";
  }
  if (!options.finePointer) {
    return "native-touch";
  }
  return "smooth";
}

export function shouldEnableLenis(mode: SmoothScrollMode): boolean {
  return mode === "smooth";
}

export function shouldPreventLenis(node: HTMLElement): boolean {
  return Boolean(node.closest(LENIS_PREVENT_SELECTOR));
}

export { FINE_POINTER_QUERY };
