"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  cursorTrailAttribute,
  type TrailAimX,
  type TrailAimY,
  type TrailSet,
} from "./cursor-trail";
import { gsap, registerGsap, ScrollTrigger, useGSAP } from "./gsap";
import { onIntroReveal } from "./intro-gate";

type UnderlineLinkProps = {
  href: string;
  children: string;
  id?: string;
  className?: string;
  ruleClassName?: string;
  entrance?: "mount" | "view";
  delay?: number;
  trailX?: TrailAimX;
  trailY?: TrailAimY;
  trailSpread?: number;
  trailInset?: number;
  trailCount?: number;
  trailSet?: TrailSet;
  cursor?: "trail" | "mark";
};

export function UnderlineLink({
  href,
  children,
  id,
  className,
  ruleClassName,
  entrance = "view",
  delay = 0,
  trailX = "right",
  trailY = "top",
  trailSpread = 1,
  trailInset = 0,
  trailCount,
  trailSet,
  cursor = "trail",
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

        const stopWaiting = entrance === "mount" ? onIntroReveal(play) : undefined;

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
          stopWaiting?.();
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
      {...(cursor === "trail" ? cursorTrailAttribute : { "data-coordinate-mark": "" })}
      data-cursor-trail-x={cursor === "trail" ? trailX : undefined}
      data-cursor-trail-y={cursor === "trail" ? trailY : undefined}
      data-cursor-trail-spread={cursor === "trail" ? trailSpread : undefined}
      data-cursor-trail-inset={cursor === "trail" ? trailInset : undefined}
      data-cursor-trail-count={cursor === "trail" ? trailCount : undefined}
      data-cursor-trail-set={cursor === "trail" ? trailSet : undefined}
      className={cn(
        "relative inline-block py-5 text-[24px] font-light leading-none tracking-[-0.04em] whitespace-nowrap text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground",
        className,
      )}
    >
      <span className="relative z-[9] inline-block overflow-visible align-bottom">
        <span ref={labelRef} className="inline-block active:translate-y-px">
          {children}
          <svg
            viewBox="0 0 22.3005 14.7281"
            width={22.3005}
            height={14.7281}
            aria-hidden="true"
            className="ml-4 inline-block align-middle"
          >
            <path
              fill="currentColor"
              d="M14.2295 0.292745C14.62 -0.0975588 15.2531 -0.0976046 15.6436 0.292745L22.0078 6.657C22.3981 7.04748 22.3981 7.68059 22.0078 8.07106L15.6436 14.4353C15.2531 14.8257 14.62 14.8256 14.2295 14.4353C13.839 14.0448 13.8391 13.4118 14.2295 13.0213L18.8857 8.36403H0V6.36403H18.8857L14.2295 1.70681C13.8391 1.31627 13.839 0.683231 14.2295 0.292745Z"
            />
          </svg>
        </span>
      </span>
      <svg
        viewBox="0 0 100 1"
        preserveAspectRatio="none"
        aria-hidden="true"
        className={cn("absolute inset-x-0 bottom-0 z-[9] h-px w-full overflow-visible", ruleClassName)}
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
