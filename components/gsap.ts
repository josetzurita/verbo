"use client";

import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

let registered = false;
const plugins = [ScrollTrigger, useGSAP, CustomEase];

export function registerGsap() {
  if (registered || typeof window === "undefined") {
    return;
  }
  gsap.registerPlugin(...plugins);
  registered = true;
}

export function reducedMotionMatchMedia() {
  return gsap.matchMedia();
}

export { CustomEase, gsap, ScrollTrigger, useGSAP };
