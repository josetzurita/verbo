"use client";

import { createContext, useContext } from "react";
import { houseMotionProfile } from "./profiles/create-motion-profile";
import type { MotionProfile } from "./profiles/types";

export const MotionProfileContext =
  createContext<MotionProfile>(houseMotionProfile);

export function useMotionProfile(): MotionProfile {
  return useContext(MotionProfileContext);
}
