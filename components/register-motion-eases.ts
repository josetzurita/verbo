"use client";

import { CustomEase } from "gsap/CustomEase";
import { gsap } from "gsap";
import { cubicBezierToGsap } from "./export-motion-profile";
import {
  GSAP_EASE_NAMES,
  NATIVE_GSAP_EASE_NAMES,
} from "./gsap-ease-names";
import { TWEEN_INTENTS, type MotionProfileData } from "./profiles/types";

let registeredSignature: string | null = null;
let pluginRegistered = false;

const customEasePlugin = CustomEase;

function profileEaseSignature(profile: MotionProfileData): string {
  return JSON.stringify(profile.easing);
}

export function registerMotionEases(profile: MotionProfileData) {
  if (typeof window === "undefined") {
    return;
  }

  if (!pluginRegistered) {
    gsap.registerPlugin(customEasePlugin);
    pluginRegistered = true;
  }

  const signature = profileEaseSignature(profile);
  if (registeredSignature === signature) {
    return;
  }

  for (const intent of TWEEN_INTENTS) {
    const name = GSAP_EASE_NAMES[intent];
    if (NATIVE_GSAP_EASE_NAMES.has(name)) {
      throw new Error(
        `Refusing to register ${name}. Semantic GSAP eases must not overwrite native names.`,
      );
    }
    customEasePlugin.create(name, cubicBezierToGsap(profile.easing[intent]));
  }

  registeredSignature = signature;
}

export function getMotionEaseRegistrationSignature() {
  return registeredSignature;
}

export function resetMotionEaseRegistration() {
  registeredSignature = null;
  pluginRegistered = false;
}

export { CustomEase, GSAP_EASE_NAMES, NATIVE_GSAP_EASE_NAMES };
