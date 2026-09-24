"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { GSAP_EASE_NAMES } from "./gsap-ease-names";
import { gsap, registerGsap } from "./gsap";
import { FINE_POINTER_QUERY, shouldEnablePointerAccent } from "./motion-policy";
import {
  POINTER_ACCENT_DEFAULTS,
  pointerAccentHoverTransform,
  pointerAccentLayoutSize,
  pointerAccentZIndexVar,
  pointerDeformation,
  pointerHoverCoverScale,
  pointerRotationDeg,
  pointerSpeedPxPerMs,
  resolvePointerAccentOptions,
  type PointerAccentOptions,
} from "./pointer-accent-options";
import { useMotionProfile } from "./use-motion-profile";

export type { PointerAccentOptions } from "./pointer-accent-options";

function closestHoverTarget(
  node: EventTarget | null,
  hoverSelectors: string,
  textSelectors: string,
): { el: Element; mode: "text" | "interactive" } | null {
  if (!(node instanceof Element)) {
    return null;
  }
  try {
    if (node.closest("[data-pointer-accent]")) {
      return null;
    }
    const text = textSelectors.trim() ? node.closest(textSelectors) : null;
    if (text) {
      return { el: text, mode: "text" };
    }
    const interactive = hoverSelectors.trim() ? node.closest(hoverSelectors) : null;
    if (interactive) {
      return { el: interactive, mode: "interactive" };
    }
  } catch {
    return null;
  }
  return null;
}

export function PointerAccent(options: PointerAccentOptions = {}) {
  const reduce = useReducedMotion();
  const profile = useMotionProfile();
  const profileRef = useRef(profile);
  profileRef.current = profile;
  const resolved = resolvePointerAccentOptions(options);
  const [finePointer, setFinePointer] = useState(false);
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<SVGSVGElement | null>(null);
  const layoutSize = pointerAccentLayoutSize(
    resolved.size,
    resolved.hoverGrow,
    resolved.hoverScaleMax,
  );
  const restScale = pointerAccentHoverTransform(
    1,
    resolved.hoverGrow,
    resolved.hoverScaleMax,
  );

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

  const allowed = shouldEnablePointerAccent({
    enabled: resolved.enabled,
    reduce,
    finePointer,
  });

  useEffect(() => {
    if (!allowed) {
      return;
    }
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) {
      return;
    }

    registerGsap();
    const settleEase = GSAP_EASE_NAMES.settle;
    const settleDuration = profileRef.current.duration.base;
    const followEase = resolved.ease;
    const xTo = gsap.quickTo(outer, "x", { duration: resolved.lag, ease: followEase });
    const yTo = gsap.quickTo(outer, "y", { duration: resolved.lag, ease: followEase });
    const hoverScaleXTo = gsap.quickTo(outer, "scaleX", {
      duration: settleDuration,
      ease: settleEase,
    });
    const hoverScaleYTo = gsap.quickTo(outer, "scaleY", {
      duration: settleDuration,
      ease: settleEase,
    });
    const opacityTo = gsap.quickTo(outer, "opacity", {
      duration: settleDuration,
      ease: settleEase,
    });
    const rotateTo = gsap.quickTo(inner, "rotation", {
      duration: resolved.lag,
      ease: followEase,
    });
    const scaleXTo = gsap.quickTo(inner, "scaleX", {
      duration: settleDuration,
      ease: settleEase,
    });
    const scaleYTo = gsap.quickTo(inner, "scaleY", {
      duration: settleDuration,
      ease: settleEase,
    });

    gsap.set(outer, {
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      scaleX: restScale,
      scaleY: restScale,
      opacity: 0,
    });
    gsap.set(inner, {
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    });

    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;
    let hoverEl: Element | null = null;
    let settleCall: ReturnType<typeof gsap.delayedCall> | null = null;

    function restShape() {
      if (hoverEl) {
        return;
      }
      scaleXTo(1);
      scaleYTo(1);
    }

    function applyHoverCover(el: Element) {
      const rect = el.getBoundingClientRect();
      const cover = pointerAccentHoverTransform(
        pointerHoverCoverScale(
          resolved.size,
          rect.width,
          rect.height,
          resolved.hoverScaleMax,
        ),
        resolved.hoverGrow,
        resolved.hoverScaleMax,
      );
      hoverScaleXTo(cover);
      hoverScaleYTo(cover);
      scaleXTo(1);
      scaleYTo(1);
    }

    function clearHover() {
      hoverEl = null;
      hoverScaleXTo(restScale);
      hoverScaleYTo(restScale);
    }

    function hide() {
      settleCall?.kill();
      opacityTo(0);
      clearHover();
      scaleXTo(1);
      scaleYTo(1);
    }

    function onMove(event: PointerEvent) {
      if (
        !shouldEnablePointerAccent({
          enabled: resolved.enabled,
          reduce,
          finePointer: true,
          pointerType: event.pointerType,
        })
      ) {
        hide();
        return;
      }

      const now = event.timeStamp || performance.now();
      const x = event.clientX + resolved.offsetX;
      const y = event.clientY + resolved.offsetY;
      const elapsed = lastTime === 0 ? 0 : now - lastTime;
      const dx = lastTime === 0 ? 0 : x - lastX;
      const dy = lastTime === 0 ? 0 : y - lastY;
      const speed = pointerSpeedPxPerMs(Math.hypot(dx, dy), elapsed);
      const deformation = pointerDeformation(
        speed,
        resolved.stretch,
        resolved.maxStretch,
      );

      xTo(x);
      yTo(y);

      if (!hoverEl && speed >= POINTER_ACCENT_DEFAULTS.restSpeed) {
        rotateTo(pointerRotationDeg(dx, dy));
        scaleXTo(deformation.scaleX);
        scaleYTo(deformation.scaleY);
      } else if (!hoverEl) {
        restShape();
      }

      lastX = x;
      lastY = y;
      lastTime = now;

      opacityTo(resolved.opacity);

      settleCall?.kill();
      settleCall = gsap.delayedCall(0.12, restShape);
    }

    function onPointerOver(event: PointerEvent) {
      if (!resolved.hoverGrow) {
        return;
      }
      const next = closestHoverTarget(
        event.target,
        resolved.hoverSelectors,
        resolved.textSelectors,
      );
      if (!next) {
        return;
      }
      hoverEl = next.el;
      applyHoverCover(next.el);
    }

    function onPointerOut(event: PointerEvent) {
      if (!hoverEl) {
        return;
      }
      const related = event.relatedTarget;
      if (related instanceof Node && hoverEl.contains(related)) {
        return;
      }
      const still = closestHoverTarget(
        related,
        resolved.hoverSelectors,
        resolved.textSelectors,
      );
      if (still && still.el === hoverEl) {
        return;
      }
      clearHover();
    }

    function onLeave(event: PointerEvent | MouseEvent) {
      const next = event.relatedTarget;
      if (next instanceof Node && document.documentElement.contains(next)) {
        return;
      }
      hide();
    }

    function onBlur() {
      hide();
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onBlur);
      settleCall?.kill();
      gsap.killTweensOf(outer);
      gsap.killTweensOf(inner);
    };
  }, [
    allowed,
    reduce,
    resolved.blendMode,
    resolved.color,
    resolved.ease,
    resolved.enabled,
    resolved.hoverGrow,
    resolved.hoverScaleMax,
    resolved.hoverSelectors,
    resolved.lag,
    resolved.maxStretch,
    resolved.offsetX,
    resolved.offsetY,
    resolved.opacity,
    resolved.shape,
    resolved.size,
    resolved.stretch,
    resolved.textSelectors,
    restScale,
  ]);

  if (!allowed) {
    return null;
  }

  return (
    <div
      ref={outerRef}
      aria-hidden="true"
      data-pointer-accent=""
      data-testid="pointer-accent"
      data-shape={resolved.shape}
      className={resolved.className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: layoutSize,
        height: layoutSize,
        zIndex: pointerAccentZIndexVar(resolved.zIndex),
        pointerEvents: "none",
        mixBlendMode: resolved.blendMode as CSSProperties["mixBlendMode"],
        transform: `translate(-50%, -50%) scale(${restScale})`,
        transformOrigin: "center center",
        opacity: 0,
        willChange: "transform, opacity",
      }}
    >
      <svg
        ref={innerRef}
        data-pointer-accent-inner=""
        viewBox="0 0 100 100"
        overflow="visible"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          willChange: "transform",
        }}
      >
        {resolved.shape === "square" ? (
          <rect x="0" y="0" width="100" height="100" rx="8" fill={resolved.color} />
        ) : resolved.shape === "ring" ? (
          <circle
            cx="50"
            cy="50"
            r="49"
            fill="none"
            stroke={resolved.color}
            strokeWidth="2"
          />
        ) : (
          <circle cx="50" cy="50" r="50" fill={resolved.color} />
        )}
      </svg>
    </div>
  );
}
