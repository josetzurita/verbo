"use client";

import { motion, useReducedMotion } from "motion/react";
import { createElement, useSyncExternalStore, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { CubicBezier, TweenIntent } from "./profiles/types";
import { resolveTween, toMotionEase } from "./resolve-tween";
import { useMotionProfile } from "./use-motion-profile";

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function readReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
  once = true,
  y = 16,
  intent = "enter",
  ease,
  duration,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  once?: boolean;
  y?: number;
  intent?: TweenIntent;
  ease?: CubicBezier;
  duration?: number;
}) {
  const hookReduce = useReducedMotion();
  const mediaReduce = useSyncExternalStore(subscribeReducedMotion, readReducedMotion, () => false);
  const reduce = Boolean(hookReduce) || mediaReduce;
  const profile = useMotionProfile();
  const tween = resolveTween(profile, { intent, ease, duration });
  const Tag = as as ElementType;

  if (reduce) {
    return createElement(Tag, { className, "data-reveal": "static" }, children);
  }

  const Component = motion.create(Tag);

  return (
    <Component
      className={cn(className)}
      data-reveal="motion"
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.3 }}
      transition={{
        duration: tween.duration,
        delay,
        ease: toMotionEase(tween.ease),
      }}
    >
      {children}
    </Component>
  );
}
