export const TWEEN_INTENTS = [
  "enter",
  "settle",
  "move",
  "exit",
  "linear",
] as const;

export const SPRING_INTENTS = ["pop"] as const;

export const DURATION_TOKENS = ["instant", "fast", "base", "slow"] as const;

export const STAGGER_TOKENS = ["tight", "normal", "expressive"] as const;

export type TweenIntent = (typeof TWEEN_INTENTS)[number];

export type SpringIntent = (typeof SPRING_INTENTS)[number];

export type DurationToken = (typeof DURATION_TOKENS)[number];

export type StaggerToken = (typeof STAGGER_TOKENS)[number];

export type CubicBezier = readonly [number, number, number, number];

export type SpringConfig = {
  type: "spring";
  stiffness: number;
  damping: number;
  mass: number;
  velocity?: number;
};

export type MotionProfileData = {
  easing: Record<TweenIntent, CubicBezier>;
  spring: Record<SpringIntent, SpringConfig>;
  duration: Record<DurationToken, number>;
  stagger: Record<StaggerToken, number>;
};

export type MotionProfileOverride = {
  easing?: Partial<Record<TweenIntent, CubicBezier>>;
  spring?: Partial<Record<SpringIntent, Partial<SpringConfig>>>;
  duration?: Partial<Record<DurationToken, number>>;
  stagger?: Partial<Record<StaggerToken, number>>;
};

export type MotionProfile = MotionProfileData & {
  ease: (intent: TweenIntent) => CubicBezier;
  springOf: (intent?: SpringIntent) => SpringConfig;
  durationOf: (token: DurationToken) => number;
  staggerOf: (token: StaggerToken) => number;
};

export class MotionProfileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MotionProfileError";
  }
}
