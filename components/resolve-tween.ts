import type { CubicBezier, DurationToken, MotionProfileData, TweenIntent } from "./profiles/types";

export type ResolveTweenOptions = {
  intent?: TweenIntent;
  ease?: CubicBezier;
  duration?: number;
  durationToken?: DurationToken;
};

export function toMotionEase(
  ease: CubicBezier,
): [number, number, number, number] {
  return [ease[0], ease[1], ease[2], ease[3]];
}

export function resolveTween(
  profile: MotionProfileData,
  options: ResolveTweenOptions = {},
): { duration: number; ease: CubicBezier } {
  const intent = options.intent ?? "enter";
  return {
    duration:
      options.duration ??
      profile.duration[options.durationToken ?? "base"],
    ease: options.ease ?? profile.easing[intent],
  };
}
