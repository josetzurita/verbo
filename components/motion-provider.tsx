"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { houseMotionProfile } from "./profiles/create-motion-profile";
import { registerGsap } from "./gsap";
import { registerMotionEases } from "./register-motion-eases";

export function MotionProvider({ children }: { children: ReactNode }) {
  registerGsap();
  registerMotionEases(houseMotionProfile);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
