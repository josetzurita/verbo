"use client";

import { useRef } from "react";
import { verboHoverWord, verboMarkPupil, verboMarkRing } from "@/lib/brand-paths";
import { CustomEase, gsap, registerGsap, useGSAP } from "./gsap";

const VIEW_WIDTH = 36.7778;
const VIEW_HEIGHT = 34.9572;
const MAX_TRAVEL_X = 9.4;
const MAX_TRAVEL_Y = 10.6;

const TIMELINE_SECONDS = 3;
const FRAME_WIDTH = 1728;
const FRAME_HEIGHT = 1117;
const MARK_LEFT = FRAME_WIDTH * 0.4733;
const MARK_TOP = FRAME_HEIGHT * 0.4616;
const FIGMA_MARK_WIDTH = FRAME_WIDTH * (1 - 0.4733 - 0.4745);
const MARK_SCALE = 37 / FIGMA_MARK_WIDTH;

const GROUP_X = 178.082 * MARK_SCALE;
const CLIP_FIGMA_WIDTH = 366.816;
const CLIP_FIGMA_HEIGHT = 119;
const CLIP_WIDTH = CLIP_FIGMA_WIDTH * MARK_SCALE;
const CLIP_HEIGHT = CLIP_FIGMA_HEIGHT * MARK_SCALE;
const CLIP_REST_WIDTH = MARK_SCALE;
const CLIP_LEFT = (622 - MARK_LEFT) * MARK_SCALE;
const CLIP_TOP = (482 - MARK_TOP) * MARK_SCALE;
const LOGO_X = 1.718505859375;
const LOGO_Y = 0.392059326171875;
const LOGO_WIDTH = 364.0912170410156;
const LOGO_HEIGHT = 118.97992706298828;

const DOT_X = [0, 0, -0.001, 0, 0.411, 15.509, 40.083, 48.46, 52.307, 54.017, 54.408] as const;
const DOT_X_TIMES = [0, 0.2, 0.2333, 0.2667, 0.3, 0.3333, 0.3667, 0.4, 0.4333, 0.4667, 0.498] as const;
const DOT_Y = [0, 0, -2.805, -5.115, -1.713, 17.448, 65.239, 53.571, 43.313, 37.792, 35.139, 34.505] as const;
const DOT_Y_TIMES = [0, 0.1805, 0.2, 0.2333, 0.2667, 0.3, 0.3333, 0.3667, 0.4, 0.4333, 0.4667, 0.498] as const;

function at(progress: number) {
  return progress * TIMELINE_SECONDS;
}

function travelKeyframes(
  property: "x" | "y",
  samples: readonly number[],
  times: readonly number[],
) {
  return times.slice(1).map((time, index) => {
    const previous = times[index];
    const sample = samples[index + 1];
    if (previous === undefined || sample === undefined) {
      throw new Error("Mark motion sample is missing.");
    }
    return {
      [property]: sample * MARK_SCALE,
      duration: at(time) - at(previous),
      ease: "none" as const,
    };
  });
}

function markEase(id: string, x1: number, y1: number, x2: number, y2: number) {
  return CustomEase.create(id, `${x1},${y1},${x2},${y2}`, { precision: 4 });
}

export function NavMark() {
  const rootRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<SVGGElement>(null);
  const pupilMotionRef = useRef<SVGGElement>(null);
  const pupilRef = useRef<SVGGElement>(null);
  const clipRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = rootRef.current;
    const pupil = pupilRef.current;
    const pupilMotion = pupilMotionRef.current;
    const ring = ringRef.current;
    const group = groupRef.current;
    const clip = clipRef.current;
    const svg = svgRef.current;
    if (!root || !pupil || !pupilMotion || !ring || !group || !clip || !svg) {
      return;
    }

    registerGsap();
    gsap.set(pupil, { transformOrigin: "50% 50%" });
    gsap.set([ring, pupilMotion], { transformOrigin: "50% 50%" });
    gsap.set(clip, { width: CLIP_REST_WIDTH });

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(pupil, {
        scale: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.16,
      });
    });

    mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine) and (hover: hover)", () => {
      let xTo = gsap.quickTo(pupil, "x", { duration: 0.55, ease: "power3.out" });
      let yTo = gsap.quickTo(pupil, "y", { duration: 0.55, ease: "power3.out" });
      let idleTimer = 0;
      let hoverActive = false;

      const bindEye = () => {
        xTo = gsap.quickTo(pupil, "x", { duration: 0.55, ease: "power3.out" });
        yTo = gsap.quickTo(pupil, "y", { duration: 0.55, ease: "power3.out" });
      };

      const hover = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          hoverActive = false;
          bindEye();
        },
      });

      hover.to(group, {
        x: GROUP_X,
        duration: at(0.498) - at(0.1458),
        ease: markEase("verboMarkSlide", 0.752, -3.267, 0.422, 1),
      }, at(0.1458));

      hover.to(ring, {
        rotate: -180,
        duration: at(0.2881) - at(0.1464),
        ease: markEase("verboMarkSpin", 0.007, 0, 0.125, 1),
      }, at(0.1464));

      hover.to(ring, {
        scaleX: 1.15,
        duration: at(0.5521) - at(0.3366),
        ease: markEase("verboMarkRingStretch", 0.55, 0, 0.07, 1),
      }, at(0.3366));

      hover.to(pupilMotion, {
        scaleX: 1.16,
        duration: at(0.5521) - at(0.3366),
        ease: markEase("verboMarkPupilStretch", 0.548, 0, 0.07, 1),
      }, at(0.3366));

      hover.to(pupilMotion, {
        keyframes: travelKeyframes("x", DOT_X, DOT_X_TIMES),
        ease: "none",
      }, 0);

      hover.to(pupilMotion, {
        keyframes: travelKeyframes("y", DOT_Y, DOT_Y_TIMES),
        ease: "none",
      }, 0);

      hover.to(clip, {
        width: CLIP_WIDTH,
        duration: at(0.4899) - at(0.2829),
        ease: markEase("verboMarkLine", 0.642, 0, 0.52, 1),
      }, at(0.2829));

      const onMove = (event: PointerEvent) => {
        if (hoverActive || event.pointerType === "touch") {
          return;
        }
        window.clearTimeout(idleTimer);
        const rect = svg.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        const reach = Math.min(1, dist / 240);
        xTo((dx / dist) * MAX_TRAVEL_X * (rect.width / VIEW_WIDTH) * reach);
        yTo((dy / dist) * MAX_TRAVEL_Y * (rect.height / VIEW_HEIGHT) * reach);
        idleTimer = window.setTimeout(() => {
          if (hoverActive) {
            return;
          }
          xTo(0);
          yTo(0);
        }, 2000);
      };

      const onEnter = () => {
        hoverActive = true;
        window.clearTimeout(idleTimer);
        gsap.killTweensOf(pupil, "x,y");
        gsap.to(pupil, { x: 0, y: 0, duration: 0.25, ease: "power3.out", overwrite: "auto" });
        hover.play();
      };

      const onLeave = () => {
        hover.reverse();
      };

      root.addEventListener("pointerenter", onEnter);
      root.addEventListener("pointerleave", onLeave);
      window.addEventListener("pointermove", onMove, { passive: true });

      return () => {
        window.clearTimeout(idleTimer);
        root.removeEventListener("pointerenter", onEnter);
        root.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("pointermove", onMove);
      };
    });

    return () => {
      mm.revert();
    };
  }, { scope: rootRef });

  return (
    <span ref={rootRef} className="relative inline-block overflow-visible text-foreground">
      <span ref={groupRef} className="inline-block">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          width={37}
          height={35}
          aria-hidden="true"
          className="h-[35px] w-[37px] overflow-visible"
        >
          <g ref={ringRef}>
            <path d={verboMarkRing} fill="currentColor" fillRule="evenodd" />
          </g>
          <g ref={pupilMotionRef}>
            <g ref={pupilRef}>
              <path d={verboMarkPupil} fill="currentColor" />
            </g>
          </g>
        </svg>
      </span>
      <span
        ref={clipRef}
        aria-hidden="true"
        className="absolute overflow-hidden"
        style={{ left: CLIP_LEFT, top: CLIP_TOP, width: CLIP_REST_WIDTH, height: CLIP_HEIGHT }}
      >
        <svg
          viewBox={`0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}`}
          width={LOGO_WIDTH * MARK_SCALE}
          height={LOGO_HEIGHT * MARK_SCALE}
          aria-hidden="true"
          style={{ marginLeft: LOGO_X * MARK_SCALE, marginTop: LOGO_Y * MARK_SCALE }}
        >
          <path d={verboHoverWord} fill="currentColor" />
        </svg>
      </span>
    </span>
  );
}
