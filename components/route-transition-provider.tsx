"use client";

import { ScrollTrigger } from "./gsap";
import { useSmoothScroll } from "./use-smooth-scroll";
import { useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MAIN_CONTENT_ID, ROUTE_TRANSITION_COVER_MS, ROUTE_TRANSITION_TIMEOUT_MS } from "./route-transition-types";
import type {
  RouteTransitionPhase,
  RouteTransitionRenderOverlay,
} from "./route-transition-types";
import { RouteTransitionContext, type RouteTransitionApi } from "./use-route-transition";

function focusMain() {
  const main = document.getElementById(MAIN_CONTENT_ID);
  if (main instanceof HTMLElement) {
    main.focus({ preventScroll: true });
  }
}

function refreshScrollScene() {
  ScrollTrigger.refresh();
}

export function RouteTransitionProvider({
  children,
  enabled = true,
  timeoutMs = ROUTE_TRANSITION_TIMEOUT_MS,
  renderOverlay,
}: {
  children: ReactNode;
  enabled?: boolean;
  timeoutMs?: number;
  renderOverlay?: RouteTransitionRenderOverlay;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = Boolean(useReducedMotion());
  const smooth = useSmoothScroll();
  const [phase, setPhase] = useState<RouteTransitionPhase>("idle");
  const [href, setHref] = useState<string | null>(null);
  const pendingRef = useRef<string | null>(null);
  const timeoutRef = useRef<number>(0);
  const coverRef = useRef<number>(0);

  const clearTimers = useCallback(() => {
    window.clearTimeout(timeoutRef.current);
    window.clearTimeout(coverRef.current);
  }, []);

  const settle = useCallback(() => {
    clearTimers();
    pendingRef.current = null;
    setHref(null);
    setPhase("idle");
    smooth.start();
    smooth.resize();
    refreshScrollScene();
    focusMain();
  }, [clearTimers, smooth]);

  const fail = useCallback(() => {
    clearTimers();
    pendingRef.current = null;
    setHref(null);
    setPhase("idle");
    smooth.start();
  }, [clearTimers, smooth]);

  const navigate = useCallback(
    (nextHref: string) => {
      if (!enabled || reduce) {
        smooth.stop();
        router.push(nextHref);
        return;
      }
      clearTimers();
      pendingRef.current = nextHref;
      setHref(nextHref);
      setPhase("covering");
      smooth.stop();
      timeoutRef.current = window.setTimeout(() => {
        fail();
      }, timeoutMs);
      coverRef.current = window.setTimeout(() => {
        setPhase("waiting");
        try {
          router.push(nextHref);
        } catch {
          fail();
        }
      }, ROUTE_TRANSITION_COVER_MS);
    },
    [clearTimers, enabled, fail, reduce, router, smooth, timeoutMs],
  );

  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }
    previousPathname.current = pathname;
    if (phase === "waiting") {
      setPhase("revealing");
      coverRef.current = window.setTimeout(() => {
        settle();
      }, ROUTE_TRANSITION_COVER_MS);
      return;
    }
    if (phase === "idle") {
      smooth.start();
      refreshScrollScene();
      focusMain();
    }
  }, [pathname, phase, settle, smooth]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const state = useMemo<RouteTransitionApi>(
    () => ({
      phase,
      href,
      enabled: enabled && !reduce,
      reducedMotion: reduce,
      navigate,
      fail,
    }),
    [enabled, fail, href, navigate, phase, reduce],
  );

  return (
    <RouteTransitionContext.Provider value={state}>
      {children}
      {enabled && !reduce && renderOverlay
        ? renderOverlay({
            phase,
            href,
            enabled: true,
            reducedMotion: false,
          })
        : null}
    </RouteTransitionContext.Provider>
  );
}
