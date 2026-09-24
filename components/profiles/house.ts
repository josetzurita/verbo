import type { MotionProfileData } from "./types";

export const HOUSE_MOTION_PROFILE: MotionProfileData = {
  easing: {
    enter: [0.16, 1, 0.3, 1],
    settle: [0.22, 1, 0.36, 1],
    move: [0.65, 0, 0.35, 1],
    exit: [0.4, 0, 1, 1],
    linear: [0, 0, 1, 1],
  },
  spring: {
    pop: {
      type: "spring",
      stiffness: 420,
      damping: 26,
      mass: 0.7,
    },
  },
  duration: {
    instant: 0.16,
    fast: 0.28,
    base: 0.55,
    slow: 0.9,
  },
  stagger: {
    tight: 0.035,
    normal: 0.065,
    expressive: 0.1,
  },
};
