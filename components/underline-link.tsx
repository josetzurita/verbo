"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  cursorTrailAttribute,
  cursorTrailUnderAttribute,
  type TrailAimX,
  type TrailAimY,
} from "./cursor-trail";
import { gsap, registerGsap, ScrollTrigger, useGSAP } from "./gsap";

type UnderlineLinkProps = {
  href: string;
  children: string;
  id?: string;
  className?: string;
  ruleClassName?: string;
  entrance?: "mount" | "view";
  delay?: number;
  /** Paint the hover images under the surrounding copy. */
  trailUnder?: boolean;
  trailX?: TrailAimX;
  trailY?: TrailAimY;
  trailSpread?: number;
  trailInset?: number;
  trailCount?: number;
};

export function UnderlineLink({
  href,
  children,
  id,
  className,
  ruleClassName,
  entrance = "view",
  delay = 0,
  trailUnder = false,
  trailX = "right",
  trailY = "top",
  trailSpread = 1,
  trailInset = 0,
  trailCount,
}: UnderlineLinkProps) {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const ruleRef = useRef<SVGLineElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const rule = ruleRef.current;
      const label = labelRef.current;
      const root = rootRef.current;
      if (!rule || !label || !root) {
        return;
      }

      registerGsap();
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const length = rule.getTotalLength();
        let playing = false;
        gsap.set(rule, { strokeDasharray: length, strokeDashoffset: length });
        gsap.set(label, { yPercent: 120, autoAlpha: 0 });

        const play = () => {
          const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
          timeline.to(label, { yPercent: 0, autoAlpha: 1, duration: 0.75 }, delay);
          timeline.to(rule, { strokeDashoffset: 0, duration: 0.85 }, delay + 0.08);
        };

        const trigger =
          entrance === "view"
            ? ScrollTrigger.create({
                trigger: root,
                start: "top 92%",
                once: true,
                onEnter: play,
              })
            : undefined;

        if (entrance === "mount") {
          play();
        }

        const onEnter = () => {
          if (playing) {
            return;
          }
          playing = true;
          const hover = gsap.timeline({
            defaults: { ease: "power3.out", overwrite: "auto" },
            onComplete: () => {
              playing = false;
            },
          });
          hover.to(rule, { strokeDashoffset: -length, duration: 0.3 });
          hover.set(rule, { strokeDashoffset: length });
          hover.to(rule, { strokeDashoffset: 0, duration: 0.3 });
        };

        root.addEventListener("pointerenter", onEnter);
        return () => {
          root.removeEventListener("pointerenter", onEnter);
          trigger?.kill();
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [delay, entrance] },
  );

  return (
    <a
      ref={rootRef}
      id={id}
      href={href}
      {...(trailUnder ? cursorTrailUnderAttribute : cursorTrailAttribute)}
      data-cursor-trail-x={trailX}
      data-cursor-trail-y={trailY}
      data-cursor-trail-spread={trailSpread}
      data-cursor-trail-inset={trailInset}
      data-cursor-trail-count={trailCount}
      className={cn(
        "relative inline-block py-5 text-[24px] font-light leading-none tracking-[-0.04em] whitespace-nowrap text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground active:translate-y-px",
        className,
      )}
    >
      <span className="inline-block overflow-visible align-bottom">
        <span ref={labelRef} className="inline-block">
          {children}
          <img
            src="/brand/discovery-arrow.svg"
            alt=""
            width={22.3005}
            height={14.7281}
            className="ml-4 inline-block align-middle"
          />
        </span>
      </span>
      <svg
        viewBox="0 0 100 1"
        preserveAspectRatio="none"
        aria-hidden="true"
        className={cn("absolute inset-x-0 bottom-0 h-px w-full overflow-visible", ruleClassName)}
      >
        <line
          ref={ruleRef}
          x1="0"
          y1="0.5"
          x2="100"
          y2="0.5"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    </a>
  );
}
