"use client";

import { Source_Serif_4 } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { cursorTrailAim, cursorTrailCount, cursorTrailSpacing, cursorTrailStacksUnder, isCursorTrailTarget, mountCursorTrail } from "./cursor-trail";
import { gsap, registerGsap } from "./gsap";
import { FINE_POINTER_QUERY } from "./motion-policy";
import { reducedMotionQuery } from "./reduced-motion";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: "300",
  display: "swap",
});

const CURSOR_CLASS = "coordinate-cursor";
const FOLLOW_DURATION = 0.1;
const FOLLOW_EASE = "power2.out";
const MARK_SELECTOR = "[data-coordinate-mark]";
const MARK_SQUARE_SCALE = 2.5;
const MARK_SQUARE_DURATION = 0.35;
const MARK_LINE_DURATION = 0.5;
const digits = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function isMarkTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(MARK_SELECTOR));
}

function CoordinateCursorActive() {
  const horizontalRef = useRef<HTMLDivElement>(null);
  const horizontalBarRef = useRef<HTMLDivElement>(null);
  const verticalRef = useRef<HTMLDivElement>(null);
  const verticalBarRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const squareFaceRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const xRef = useRef<HTMLSpanElement>(null);
  const yRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const horizontal = horizontalRef.current;
    const horizontalBar = horizontalBarRef.current;
    const vertical = verticalRef.current;
    const verticalBar = verticalBarRef.current;
    const square = squareRef.current;
    const squareFace = squareFaceRef.current;
    const label = labelRef.current;
    const trailHost = trailRef.current;
    if (!horizontal || !horizontalBar || !vertical || !verticalBar || !square || !squareFace || !label || !trailHost) {
      return;
    }

    registerGsap();
    const media = window.matchMedia(FINE_POINTER_QUERY);
    const motion = window.matchMedia(reducedMotionQuery);
    const parts = [horizontal, vertical, square, label];
    let shown = false;
    let primed = false;
    let trailActive = false;
    let overMark = false;
    let lineCollapsed = false;
    let lineProgress = 1;
    let squareScale = 1;
    let lineTween: gsap.core.Tween | null = null;
    let squareTween: gsap.core.Tween | null = null;

    horizontalBar.style.scale = "1 1";
    verticalBar.style.scale = "1 1";
    squareFace.style.scale = "1";
    squareFace.style.transformOrigin = "50% 50%";
    gsap.set(horizontal, { yPercent: -50 });
    gsap.set(vertical, { xPercent: -50 });
    gsap.set(square, { xPercent: -50, yPercent: -50 });
    gsap.set(label, { xPercent: -100, yPercent: -100 });

    const follow = { duration: FOLLOW_DURATION, ease: FOLLOW_EASE };
    const horizontalY = gsap.quickTo(horizontal, "y", follow);
    const verticalX = gsap.quickTo(vertical, "x", follow);
    const squareX = gsap.quickTo(square, "x", follow);
    const squareY = gsap.quickTo(square, "y", follow);
    const labelX = gsap.quickTo(label, "x", follow);
    const labelY = gsap.quickTo(label, "y", follow);

    const paintVisibility = () => {
      const lineVisibility = shown && !lineCollapsed ? "visible" : "hidden";
      horizontal.style.visibility = lineVisibility;
      vertical.style.visibility = lineVisibility;
      square.style.visibility = shown ? "visible" : "hidden";
      label.style.visibility = shown && !trailActive && !overMark ? "visible" : "hidden";
      document.documentElement.classList.toggle(CURSOR_CLASS, shown);
    };

    const syncLineOrigin = (x: number, y: number) => {
      horizontalBar.style.transformOrigin = `${x}px 50%`;
      verticalBar.style.transformOrigin = `50% ${y}px`;
    };

    const applyLineProgress = (value: number) => {
      lineProgress = value;
      horizontalBar.style.scale = `${value} 1`;
      verticalBar.style.scale = `1 ${value}`;
    };

    const setLineScale = (collapsed: boolean) => {
      lineTween?.kill();
      const target = collapsed ? 0 : 1;
      if (motion.matches) {
        applyLineProgress(target);
        lineCollapsed = collapsed;
        paintVisibility();
        return;
      }
      if (!collapsed) {
        lineCollapsed = false;
        paintVisibility();
      }
      const state = { value: lineProgress };
      lineTween = gsap.to(state, {
        value: target,
        duration: MARK_LINE_DURATION,
        ease: "power3.inOut",
        onUpdate: () => {
          applyLineProgress(state.value);
        },
        onComplete: () => {
          if (!collapsed) {
            return;
          }
          lineCollapsed = true;
          paintVisibility();
        },
      });
    };

    const setShown = (next: boolean) => {
      if (next === shown) {
        return;
      }
      shown = next;
      paintVisibility();
    };

    const setOverMark = (next: boolean) => {
      if (next === overMark) {
        return;
      }
      overMark = next;
      square.style.mixBlendMode = next ? "difference" : "";
      const scale = next ? MARK_SQUARE_SCALE : 1;
      squareTween?.kill();
      if (motion.matches) {
        squareScale = scale;
        squareFace.style.scale = String(scale);
      } else {
        const state = { value: squareScale };
        squareTween = gsap.to(state, {
          value: scale,
          duration: MARK_SQUARE_DURATION,
          ease: "power3.out",
          onUpdate: () => {
            squareScale = state.value;
            squareFace.style.scale = String(state.value);
          },
        });
      }
      setLineScale(next);
      paintVisibility();
    };

    const resetCursor = () => {
      shown = false;
      overMark = false;
      lineCollapsed = false;
      square.style.mixBlendMode = "";
      squareTween?.kill();
      lineTween?.kill();
      squareScale = 1;
      squareFace.style.scale = "1";
      applyLineProgress(1);
      paintVisibility();
    };

    const trail = mountCursorTrail(trailHost, {
      follow,
      onActiveChange: (next) => {
        trailActive = next;
        paintVisibility();
      },
    });

    const place = (x: number, y: number) => {
      if (xRef.current) {
        xRef.current.textContent = `x: ${digits.format(Math.round(x))}`;
      }
      if (yRef.current) {
        yRef.current.textContent = `y: ${digits.format(Math.round(y))}`;
      }
      const labelLeft = x - 6;
      const labelTop = y - 7;
      syncLineOrigin(x, y);
      const snap = !primed || motion.matches;
      if (snap) {
        gsap.set(horizontal, { y });
        gsap.set(vertical, { x });
        gsap.set(square, { x, y });
        gsap.set(label, { x: labelLeft, y: labelTop });
        primed = true;
        trail.sync(x, y, x, y, true);
        return;
      }
      horizontalY(y);
      verticalX(x);
      squareX(x);
      squareY(y);
      labelX(labelLeft);
      labelY(labelTop);
      const squareXNow = gsap.getProperty(square, "x");
      const squareYNow = gsap.getProperty(square, "y");
      trail.sync(
        x,
        y,
        typeof squareXNow === "number" ? squareXNow : x,
        typeof squareYNow === "number" ? squareYNow : y,
        false,
      );
    };

    const onOver = (event: PointerEvent) => {
      if (!media.matches || event.pointerType === "touch" || motion.matches) {
        return;
      }
      if (!isCursorTrailTarget(event.target)) {
        return;
      }
      place(event.clientX, event.clientY);
      setShown(true);
      trail.enter(
        event.clientX,
        event.clientY,
        cursorTrailStacksUnder(event.target),
        cursorTrailAim(event.target),
        cursorTrailSpacing(event.target),
        cursorTrailCount(event.target),
      );
    };

    const onOut = (event: PointerEvent) => {
      if (!isCursorTrailTarget(event.target)) {
        return;
      }
      if (isCursorTrailTarget(event.relatedTarget)) {
        return;
      }
      trail.leave();
    };

    const onMove = (event: PointerEvent) => {
      if (!media.matches || event.pointerType === "touch") {
        trail.leave();
        resetCursor();
        return;
      }
      syncLineOrigin(event.clientX, event.clientY);
      setOverMark(isMarkTarget(event.target));
      place(event.clientX, event.clientY);
      setShown(true);
    };

    const hide = () => {
      trail.leave();
      resetCursor();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("pointerleave", hide);
    media.addEventListener("change", hide);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("pointerleave", hide);
      media.removeEventListener("change", hide);
      document.documentElement.classList.remove(CURSOR_CLASS);
      trail.destroy();
      gsap.killTweensOf(parts);
    };
  }, []);

  const layer = "pointer-events-none invisible fixed";

  return (
    <>
      <div
        ref={horizontalRef}
        aria-hidden="true"
        className={`${layer} inset-x-0 top-0 z-[80] h-px`}
      >
        <div ref={horizontalBarRef} className="h-full w-full bg-[#60433a]" />
      </div>
      <div
        ref={verticalRef}
        aria-hidden="true"
        className={`${layer} inset-y-0 left-0 z-[80] w-px`}
      >
        <div ref={verticalBarRef} className="h-full w-full bg-[#60433a]" />
      </div>
      <div ref={trailRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60]" />
      <div
        ref={squareRef}
        aria-hidden="true"
        className={`${layer} top-0 left-0 z-[80] size-[7px]`}
      >
        <div ref={squareFaceRef} className="size-full bg-[#faab2a]" />
      </div>
      <div
        ref={labelRef}
        aria-hidden="true"
        className={`${sourceSerif.className} ${layer} top-0 left-0 z-[80] flex flex-col text-[10px] font-light leading-none tracking-[0.2px] text-[#faab2a]`}
      >
        <span ref={xRef} className="block whitespace-nowrap leading-none">
          x: 0
        </span>
        <span ref={yRef} className="block whitespace-nowrap leading-none">
          y: 0
        </span>
      </div>
    </>
  );
}

export function CoordinateCursor() {
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(FINE_POINTER_QUERY);
    const update = () => {
      setFinePointer(media.matches);
    };
    update();
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  if (!finePointer) {
    return null;
  }

  return <CoordinateCursorActive />;
}
