import { clamp } from "./clamp";
import type { TweenIntent } from "./profiles/types";
import { TWEEN_INTENTS } from "./profiles/types";
import { GSAP_EASE_NAMES } from "./gsap-ease-names";

export const POINTER_ACCENT_SHAPES = ["circle", "square", "ring"] as const;
export const POINTER_ACCENT_Z_INDEX = [
  "base",
  "raised",
  "sticky",
  "overlay",
  "dialog",
  "toast",
  "debug",
] as const;
export const POINTER_ACCENT_BLEND_MODES = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
  "plus-lighter",
] as const;

export type PointerAccentShape = (typeof POINTER_ACCENT_SHAPES)[number];
export type PointerAccentZIndex = (typeof POINTER_ACCENT_Z_INDEX)[number];
export type PointerAccentBlendMode = (typeof POINTER_ACCENT_BLEND_MODES)[number];

export type PointerAccentOptions = {
  enabled?: boolean;
  size?: number;
  color?: string;
  opacity?: number;
  shape?: PointerAccentShape;
  lag?: number;
  ease?: TweenIntent | string;
  stretch?: number;
  maxStretch?: number;
  offsetX?: number;
  offsetY?: number;
  blendMode?: PointerAccentBlendMode | string;
  zIndex?: PointerAccentZIndex;
  className?: string;
  hoverGrow?: boolean;
  hoverSelectors?: string;
  textSelectors?: string;
  hoverScaleMax?: number;
};

export type ResolvedPointerAccentOptions = {
  enabled: boolean;
  size: number;
  color: string;
  opacity: number;
  shape: PointerAccentShape;
  lag: number;
  ease: string;
  stretch: number;
  maxStretch: number;
  offsetX: number;
  offsetY: number;
  blendMode: string;
  zIndex: PointerAccentZIndex;
  className?: string;
  hoverGrow: boolean;
  hoverSelectors: string;
  textSelectors: string;
  hoverScaleMax: number;
};

export const POINTER_ACCENT_DEFAULTS = {
  enabled: false,
  size: 14,
  sizeMin: 4,
  sizeMax: 96,
  color: "oklch(0.97 0.004 250)",
  opacity: 1,
  opacityMin: 0.08,
  opacityMax: 1,
  shape: "circle" as PointerAccentShape,
  lag: 0.4,
  lagMin: 0.04,
  lagMax: 0.85,
  ease: "power3.out",
  stretch: 0.2,
  stretchMin: 0,
  stretchMax: 1.5,
  maxStretch: 0.6,
  maxStretchMin: 0,
  maxStretchMax: 1.2,
  offsetX: 0,
  offsetY: 0,
  offsetMax: 48,
  blendMode: "difference" as PointerAccentBlendMode,
  zIndex: "debug" as PointerAccentZIndex,
  speedMax: 2.4,
  restSpeed: 0.08,
  hoverGrow: true,
  hoverSelectors: "a, button, [data-pointer-accent-hover], [data-slot=button]",
  textSelectors: "[data-pointer-accent-text]",
  hoverScaleMax: 1.5,
  hoverScaleMaxMin: 1,
  hoverScaleMaxMax: 24,
  hoverPadding: 1.18,
};

export function resolvePointerEase(ease: TweenIntent | string | undefined): string {
  const value = ease ?? POINTER_ACCENT_DEFAULTS.ease;
  if ((TWEEN_INTENTS as readonly string[]).includes(value)) {
    return GSAP_EASE_NAMES[value as TweenIntent];
  }
  return value;
}

export function resolvePointerAccentOptions(
  options: PointerAccentOptions = {},
): ResolvedPointerAccentOptions {
  return {
    enabled: options.enabled ?? POINTER_ACCENT_DEFAULTS.enabled,
    size: clamp(
      options.size ?? POINTER_ACCENT_DEFAULTS.size,
      POINTER_ACCENT_DEFAULTS.sizeMin,
      POINTER_ACCENT_DEFAULTS.sizeMax,
    ),
    color: options.color ?? POINTER_ACCENT_DEFAULTS.color,
    opacity: clamp(
      options.opacity ?? POINTER_ACCENT_DEFAULTS.opacity,
      POINTER_ACCENT_DEFAULTS.opacityMin,
      POINTER_ACCENT_DEFAULTS.opacityMax,
    ),
    shape: options.shape ?? POINTER_ACCENT_DEFAULTS.shape,
    lag: clamp(
      options.lag ?? POINTER_ACCENT_DEFAULTS.lag,
      POINTER_ACCENT_DEFAULTS.lagMin,
      POINTER_ACCENT_DEFAULTS.lagMax,
    ),
    ease: resolvePointerEase(options.ease),
    stretch: clamp(
      options.stretch ?? POINTER_ACCENT_DEFAULTS.stretch,
      POINTER_ACCENT_DEFAULTS.stretchMin,
      POINTER_ACCENT_DEFAULTS.stretchMax,
    ),
    maxStretch: clamp(
      options.maxStretch ?? POINTER_ACCENT_DEFAULTS.maxStretch,
      POINTER_ACCENT_DEFAULTS.maxStretchMin,
      POINTER_ACCENT_DEFAULTS.maxStretchMax,
    ),
    offsetX: clamp(
      options.offsetX ?? POINTER_ACCENT_DEFAULTS.offsetX,
      -POINTER_ACCENT_DEFAULTS.offsetMax,
      POINTER_ACCENT_DEFAULTS.offsetMax,
    ),
    offsetY: clamp(
      options.offsetY ?? POINTER_ACCENT_DEFAULTS.offsetY,
      -POINTER_ACCENT_DEFAULTS.offsetMax,
      POINTER_ACCENT_DEFAULTS.offsetMax,
    ),
    blendMode: options.blendMode ?? POINTER_ACCENT_DEFAULTS.blendMode,
    zIndex: options.zIndex ?? POINTER_ACCENT_DEFAULTS.zIndex,
    className: options.className,
    hoverGrow: options.hoverGrow ?? POINTER_ACCENT_DEFAULTS.hoverGrow,
    hoverSelectors: options.hoverSelectors ?? POINTER_ACCENT_DEFAULTS.hoverSelectors,
    textSelectors: options.textSelectors ?? POINTER_ACCENT_DEFAULTS.textSelectors,
    hoverScaleMax: clamp(
      options.hoverScaleMax ?? POINTER_ACCENT_DEFAULTS.hoverScaleMax,
      POINTER_ACCENT_DEFAULTS.hoverScaleMaxMin,
      POINTER_ACCENT_DEFAULTS.hoverScaleMaxMax,
    ),
  };
}

export function pointerSpeedPxPerMs(distance: number, elapsedMs: number): number {
  if (elapsedMs <= 0) {
    return 0;
  }
  return distance / elapsedMs;
}

export function clampPointerSpeed(speed: number): number {
  return clamp(speed, 0, POINTER_ACCENT_DEFAULTS.speedMax);
}

export function pointerDeformation(
  speed: number,
  stretch: number,
  maxStretch: number,
): { scaleX: number; scaleY: number } {
  const extra = clamp(
    clampPointerSpeed(speed) * stretch,
    0,
    maxStretch,
  );
  const scaleX = 1 + extra;
  const scaleY = 1 / scaleX;
  return { scaleX, scaleY };
}

export function pointerHoverCoverScale(
  restSize: number,
  width: number,
  height: number,
  hoverScaleMax: number,
  padding = POINTER_ACCENT_DEFAULTS.hoverPadding,
): number {
  if (restSize <= 0) {
    return 1;
  }
  const needed = (Math.max(width, height) * padding) / restSize;
  return clamp(needed, 1, hoverScaleMax);
}

export function pointerAccentLayoutSize(
  restSize: number,
  hoverGrow: boolean,
  hoverScaleMax: number,
): number {
  if (!hoverGrow || hoverScaleMax <= 1) {
    return restSize;
  }
  return restSize * hoverScaleMax;
}

export function pointerAccentHoverTransform(
  coverScale: number,
  hoverGrow: boolean,
  hoverScaleMax: number,
): number {
  if (!hoverGrow || hoverScaleMax <= 0) {
    return 1;
  }
  return coverScale / hoverScaleMax;
}

export function pointerRotationDeg(dx: number, dy: number): number {
  if (dx === 0 && dy === 0) {
    return 0;
  }
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

export function pointerAccentZIndexVar(layer: PointerAccentZIndex): string {
  return `var(--z-${layer})`;
}
