import { HOUSE_MOTION_PROFILE } from "./house";
import {
  DURATION_TOKENS,
  MotionProfileError,
  SPRING_INTENTS,
  STAGGER_TOKENS,
  TWEEN_INTENTS,
  type CubicBezier,
  type MotionProfile,
  type MotionProfileData,
  type MotionProfileOverride,
  type SpringConfig,
  type TweenIntent,
} from "./types";

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function assertCubicBezier(
  value: unknown,
  path: string,
): asserts value is CubicBezier {
  if (!Array.isArray(value) || value.length !== 4) {
    throw new MotionProfileError(
      `${path} must be a cubic Bézier of four numbers [x1, y1, x2, y2].`,
    );
  }

  const [x1, y1, x2, y2] = value;
  if (
    !isFiniteNumber(x1) ||
    !isFiniteNumber(y1) ||
    !isFiniteNumber(x2) ||
    !isFiniteNumber(y2)
  ) {
    throw new MotionProfileError(`${path} Bézier values must be finite numbers.`);
  }

  if (x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) {
    throw new MotionProfileError(
      `${path} X control points must stay between 0 and 1. Received x1=${String(x1)}, x2=${String(x2)}.`,
    );
  }
}

function assertPositive(value: unknown, path: string) {
  if (!isFiniteNumber(value) || value <= 0) {
    throw new MotionProfileError(`${path} must be a finite number greater than 0.`);
  }
}

function assertSpring(value: SpringConfig, path: string) {
  if (value.type !== "spring") {
    throw new MotionProfileError(`${path}.type must be "spring".`);
  }
  assertPositive(value.stiffness, `${path}.stiffness`);
  assertPositive(value.damping, `${path}.damping`);
  assertPositive(value.mass, `${path}.mass`);
  if (value.velocity !== undefined && !isFiniteNumber(value.velocity)) {
    throw new MotionProfileError(`${path}.velocity must be a finite number when set.`);
  }
}

export function validateMotionProfileData(
  data: MotionProfileData,
): MotionProfileData {
  for (const intent of TWEEN_INTENTS) {
    assertCubicBezier(data.easing[intent], `easing.${intent}`);
  }

  for (const intent of SPRING_INTENTS) {
    assertSpring(data.spring[intent], `spring.${intent}`);
  }

  for (const token of DURATION_TOKENS) {
    assertPositive(data.duration[token], `duration.${token}`);
  }

  for (const token of STAGGER_TOKENS) {
    assertPositive(data.stagger[token], `stagger.${token}`);
  }

  return data;
}

function copyBezier(value: CubicBezier): CubicBezier {
  return [value[0], value[1], value[2], value[3]];
}

function mergeProfile(
  base: MotionProfileData,
  overrides: MotionProfileOverride,
): MotionProfileData {
  return {
    easing: {
      enter: copyBezier(overrides.easing?.enter ?? base.easing.enter),
      settle: copyBezier(overrides.easing?.settle ?? base.easing.settle),
      move: copyBezier(overrides.easing?.move ?? base.easing.move),
      exit: copyBezier(overrides.easing?.exit ?? base.easing.exit),
      linear: copyBezier(overrides.easing?.linear ?? base.easing.linear),
    },
    spring: {
      pop: {
        type: "spring",
        stiffness: overrides.spring?.pop?.stiffness ?? base.spring.pop.stiffness,
        damping: overrides.spring?.pop?.damping ?? base.spring.pop.damping,
        mass: overrides.spring?.pop?.mass ?? base.spring.pop.mass,
        velocity: overrides.spring?.pop?.velocity ?? base.spring.pop.velocity,
      },
    },
    duration: {
      instant: overrides.duration?.instant ?? base.duration.instant,
      fast: overrides.duration?.fast ?? base.duration.fast,
      base: overrides.duration?.base ?? base.duration.base,
      slow: overrides.duration?.slow ?? base.duration.slow,
    },
    stagger: {
      tight: overrides.stagger?.tight ?? base.stagger.tight,
      normal: overrides.stagger?.normal ?? base.stagger.normal,
      expressive: overrides.stagger?.expressive ?? base.stagger.expressive,
    },
  };
}

function withRuntime(data: MotionProfileData): MotionProfile {
  const profile: MotionProfile = {
    ...data,
    ease(intent: TweenIntent) {
      return profile.easing[intent];
    },
    springOf(intent = "pop") {
      return profile.spring[intent];
    },
    durationOf(token) {
      return profile.duration[token];
    },
    staggerOf(token) {
      return profile.stagger[token];
    },
  };
  return profile;
}

export function createMotionProfile(
  overrides: MotionProfileOverride = {},
  base: MotionProfileData = HOUSE_MOTION_PROFILE,
): MotionProfile {
  return withRuntime(validateMotionProfileData(mergeProfile(base, overrides)));
}

export const houseMotionProfile = createMotionProfile();

export function serializeMotionProfile(
  profile: MotionProfileData,
): MotionProfileData {
  const validated = validateMotionProfileData(mergeProfile(HOUSE_MOTION_PROFILE, profile));
  return {
    easing: {
      enter: copyBezier(validated.easing.enter),
      settle: copyBezier(validated.easing.settle),
      move: copyBezier(validated.easing.move),
      exit: copyBezier(validated.easing.exit),
      linear: copyBezier(validated.easing.linear),
    },
    spring: {
      pop: { ...validated.spring.pop },
    },
    duration: { ...validated.duration },
    stagger: { ...validated.stagger },
  };
}
