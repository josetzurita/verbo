export const MOTION_DEFAULTS = {
  staggerInterval: 0.08,
  staggerDelay: 0,
  staggerAmount: 0.3,
  staggerOnce: true,
  staggerY: 16,
  parallaxSpeed: 0.2,
  parallaxSpeedMin: 0,
  parallaxSpeedMax: 0.45,
  parallaxRangePx: 72,
  magneticStrength: 0.35,
  magneticStrengthMin: 0,
  magneticStrengthMax: 1,
  magneticMaxOffset: 16,
  magneticMaxOffsetMin: 0,
  magneticMaxOffsetMax: 32,
  imageScale: 1,
  imageScaleMin: 1,
  imageScaleMax: 1.08,
  imageRevealY: 24,
  ease: [0.16, 1, 0.3, 1] as const,
  duration: 0.55,
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clampParallaxSpeed(speed: number): number {
  return clamp(
    speed,
    MOTION_DEFAULTS.parallaxSpeedMin,
    MOTION_DEFAULTS.parallaxSpeedMax,
  );
}

export function clampMagneticStrength(strength: number): number {
  return clamp(
    strength,
    MOTION_DEFAULTS.magneticStrengthMin,
    MOTION_DEFAULTS.magneticStrengthMax,
  );
}

export function clampMagneticOffset(offset: number): number {
  return clamp(
    offset,
    MOTION_DEFAULTS.magneticMaxOffsetMin,
    MOTION_DEFAULTS.magneticMaxOffsetMax,
  );
}

export function clampImageScale(scale: number): number {
  return clamp(
    scale,
    MOTION_DEFAULTS.imageScaleMin,
    MOTION_DEFAULTS.imageScaleMax,
  );
}

export function clampStaggerInterval(interval: number): number {
  return clamp(interval, 0, 1);
}

export function parallaxTravelPx(speed: number): number {
  return clampParallaxSpeed(speed) * MOTION_DEFAULTS.parallaxRangePx;
}
