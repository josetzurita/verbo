"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/button";
import { toMotionEase } from "@/components/resolve-tween";
import { useMotionProfile } from "@/components/use-motion-profile";
import { MOTION_INTENTS } from "../_data/styleguide-data";
import { StyleguideSection } from "./styleguide-section";

function formatBezier(values: readonly [number, number, number, number]): string {
  return `cubic-bezier(${values.map((value) => value.toString()).join(", ")})`;
}

export function MotionSection() {
  const profile = useMotionProfile();
  const reduce = useReducedMotion();
  const [replay, setReplay] = useState(0);

  return (
    <StyleguideSection
      description="Per-project motion language from the active profile. Replay each intent. Reduced motion keeps the block static."
      id="motion"
      title="Motion language"
    >
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[72rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-[var(--z-raised)] bg-background py-3 pr-6 font-medium text-foreground/70">
                Intent
              </th>
              <th className="py-3 pr-6 font-medium text-foreground/70">Duration</th>
              <th className="py-3 pr-6 font-medium text-foreground/70">Easing</th>
              <th className="py-3 pr-6 font-medium text-foreground/70">Values</th>
              <th className="py-3 pr-6 font-medium text-foreground/70">Live</th>
              <th className="py-3 pr-6 font-medium text-foreground/70">Use</th>
            </tr>
          </thead>
          <tbody>
            {MOTION_INTENTS.map((row) => {
              const tween =
                row.kind === "tween" && row.durationToken && row.intent !== "pop"
                  ? {
                      duration: profile.durationOf(row.durationToken),
                      ease: profile.ease(row.intent),
                    }
                  : null;
              const spring = row.kind === "spring" ? profile.springOf("pop") : null;
              return (
                <tr key={row.intent}>
                  <td className="sticky left-0 z-[var(--z-raised)] border-b border-border bg-background py-5 pr-6 font-medium">
                    {row.intent}
                  </td>
                  <td className="border-b border-border py-5 pr-6 type-mono">
                    {tween ? `${tween.duration}s / ${row.durationToken}` : "spring"}
                  </td>
                  <td className="border-b border-border py-5 pr-6 type-mono">
                    {row.kind === "spring" ? "pop spring" : row.intent}
                  </td>
                  <td className="border-b border-border py-5 pr-6 type-mono text-xs">
                    {spring
                      ? `stiffness ${spring.stiffness}, damping ${spring.damping}, mass ${spring.mass}`
                      : tween
                        ? formatBezier(tween.ease)
                        : ""}
                  </td>
                  <td className="border-b border-border py-5 pr-6">
                    <div className="flex h-16 w-40 items-center overflow-hidden border border-border bg-surface-muted px-3">
                      <motion.span
                        animate={
                          reduce
                            ? { opacity: 1, x: 0, scale: 1 }
                            : row.intent === "exit"
                              ? { opacity: 0, x: 24 }
                              : row.intent === "pop"
                                ? { opacity: 1, scale: 1 }
                                : { opacity: 1, x: 0 }
                        }
                        className="size-8 rounded-[var(--radius-sm)] bg-accent"
                        initial={
                          reduce
                            ? false
                            : row.intent === "exit"
                              ? { opacity: 1, x: 0 }
                              : row.intent === "pop"
                                ? { opacity: 1, scale: 0.72 }
                                : { opacity: 0, x: 20 }
                        }
                        key={`${row.intent}-${replay}`}
                        transition={
                          spring
                            ? spring
                            : tween
                              ? {
                                  duration: tween.duration,
                                  ease: toMotionEase(tween.ease),
                                }
                              : undefined
                        }
                      />
                    </div>
                  </td>
                  <td className="border-b border-border py-5 pr-6 text-foreground/75">
                    {row.use}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        <Button onClick={() => setReplay((value) => value + 1)} size="sm" variant="secondary">
          Replay intents
        </Button>
      </div>
    </StyleguideSection>
  );
}
