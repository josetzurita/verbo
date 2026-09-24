import { serializeMotionProfile } from "./profiles/create-motion-profile";
import {
  DURATION_TOKENS,
  STAGGER_TOKENS,
  TWEEN_INTENTS,
  type CubicBezier,
  type MotionProfileData,
  type TweenIntent,
} from "./profiles/types";
import { GSAP_EASE_NAMES } from "./gsap-ease-names";

export function cubicBezierToCss(bezier: CubicBezier): string {
  return `cubic-bezier(${bezier[0]}, ${bezier[1]}, ${bezier[2]}, ${bezier[3]})`;
}

export function cubicBezierToGsap(bezier: CubicBezier): string {
  return `${bezier[0]},${bezier[1]},${bezier[2]},${bezier[3]}`;
}

export function motionProfileToCss(profile: MotionProfileData): string {
  const data = serializeMotionProfile(profile);
  const easeLines = TWEEN_INTENTS.map(
    (intent) => `  --ease-${intent}: ${cubicBezierToCss(data.easing[intent])};`,
  );
  const durationLines = DURATION_TOKENS.map(
    (token) => `  --duration-${token}: ${String(data.duration[token])}s;`,
  );
  const staggerLines = STAGGER_TOKENS.map(
    (token) => `  --stagger-${token}: ${String(data.stagger[token])}s;`,
  );

  return [":root {", ...easeLines, ...durationLines, ...staggerLines, "}"].join(
    "\n",
  );
}

export function motionProfileToMotionTs(profile: MotionProfileData): string {
  const data = serializeMotionProfile(profile);
  return `import { createMotionProfile } from "@cds/motion";

export const projectMotionProfile = createMotionProfile(${JSON.stringify(data, null, 2)});
`;
}

export function motionProfileToGsapRegistration(
  profile: MotionProfileData,
): Record<(typeof GSAP_EASE_NAMES)[TweenIntent], string> {
  const data = serializeMotionProfile(profile);
  return {
    [GSAP_EASE_NAMES.enter]: cubicBezierToGsap(data.easing.enter),
    [GSAP_EASE_NAMES.settle]: cubicBezierToGsap(data.easing.settle),
    [GSAP_EASE_NAMES.move]: cubicBezierToGsap(data.easing.move),
    [GSAP_EASE_NAMES.exit]: cubicBezierToGsap(data.easing.exit),
    [GSAP_EASE_NAMES.linear]: cubicBezierToGsap(data.easing.linear),
  };
}

export function motionProfileToJson(profile: MotionProfileData): string {
  return `${JSON.stringify(serializeMotionProfile(profile), null, 2)}\n`;
}
