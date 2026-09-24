"use client";

import type { ReactNode } from "react";
import { createMotionProfile } from "./profiles/create-motion-profile";
import { HOUSE_MOTION_PROFILE } from "./profiles/house";
import type {
  MotionProfile,
  MotionProfileData,
  MotionProfileOverride,
} from "./profiles/types";
import { registerMotionEases } from "./register-motion-eases";
import { MotionProfileContext } from "./use-motion-profile";

export type MotionProfileProviderProps = {
  children: ReactNode;
  profile?: MotionProfile | MotionProfileData | MotionProfileOverride;
};

function isProfileData(
  profile: MotionProfile | MotionProfileData | MotionProfileOverride,
): profile is MotionProfileData {
  return Boolean(
    profile.easing &&
      "enter" in profile.easing &&
      profile.spring &&
      "pop" in profile.spring &&
      profile.duration &&
      "base" in profile.duration &&
      profile.stagger &&
      "normal" in profile.stagger,
  );
}

function resolveProvidedProfile(
  profile?: MotionProfile | MotionProfileData | MotionProfileOverride,
): MotionProfile {
  if (!profile) {
    return createMotionProfile();
  }
  if (isProfileData(profile)) {
    return createMotionProfile(
      {},
      {
        easing: profile.easing,
        spring: profile.spring,
        duration: profile.duration,
        stagger: profile.stagger,
      },
    );
  }
  return createMotionProfile(profile);
}

export function MotionProfileProvider({
  children,
  profile,
}: MotionProfileProviderProps) {
  const resolved = resolveProvidedProfile(profile);
  registerMotionEases(resolved);

  return (
    <MotionProfileContext.Provider value={resolved}>
      {children}
    </MotionProfileContext.Provider>
  );
}

export { HOUSE_MOTION_PROFILE };
