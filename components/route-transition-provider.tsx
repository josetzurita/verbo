"use client";

import { ScrollTrigger } from "./gsap";
import { useSmoothScroll, type SmoothScrollApi } from "./use-smooth-scroll";
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
import { classifyNavigation, shouldInterceptNavigation } from "./classify-navigation";
import { cancelHomeHero, homeHeroRequested, isHomeHeroHref } from "./home-scroll";
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

function snapHomeHero(scrollTo: SmoothScrollApi["scrollTo"]) {
  if (!homeHeroRequested()) {
    return;
  }
  scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
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
    snapHomeHero(smooth.scrollTo);
    refreshScrollScene();
    snapHomeHero(smooth.scrollTo);
    focusMain();
  }, [clearTimers, smooth]);

  const fail = useCallback(() => {
    clearTimers();
    pendingRef.current = null;
    setHref(null);
    setPhase("idle");
    if (pathname !== "/") {
      cancelHomeHero();
    }
    smooth.start();
  }, [clearTimers, pathname, smooth]);

  const navigate = useCallback(
    (nextHref: string) => {
      const hero = isHomeHeroHref(nextHref, window.location.origin);
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
        if (hero) {
          snapHomeHero(smooth.scrollTo);
        }
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
    if (pathname === "/") {
      snapHomeHero(smooth.scrollTo);
    }
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

  // Plain <a> tags get the same cover as TransitionLink. Links that already handled the click
  // (TransitionLink, next/link, the nav) have called preventDefault by the time this runs.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || !(event.target instanceof Element)) {
        return;
      }
      const anchor = event.target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || anchor.origin !== window.location.origin) {
        return;
      }
      const kind = classifyNavigation({
        href: `${anchor.pathname}${anchor.search}${anchor.hash}`,
        currentPathname: window.location.pathname,
        target: anchor.target || undefined,
        download: anchor.hasAttribute("download"),
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        button: event.button,
      });
      const samePage = anchor.pathname === window.location.pathname && anchor.search === window.location.search;
      if (!shouldInterceptNavigation(kind) || samePage) {
        return;
      }
      event.preventDefault();
      navigate(`${anchor.pathname}${anchor.search}${anchor.hash}`);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate]);

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
