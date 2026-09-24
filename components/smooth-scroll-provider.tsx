"use client";

import "lenis/dist/lenis.css";
import { ReactLenis, type LenisRef } from "lenis/react";
import { useReducedMotion } from "motion/react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { FINE_POINTER_QUERY } from "./motion-policy";
import {
  resolveSmoothScrollMode,
  shouldEnableLenis,
  shouldPreventLenis,
  SMOOTH_SCROLL_DEFAULTS,
  type SmoothScrollMode,
} from "./smooth-scroll-options";
import { attachGsapLenisSync } from "./smooth-scroll-sync";
import {
  SmoothScrollContext,
  type SmoothScrollApi,
} from "./use-smooth-scroll";

export type SmoothScrollProviderProps = {
  children: ReactNode;
  lerp?: number;
};

export function SmoothScrollProvider({
  children,
  lerp = SMOOTH_SCROLL_DEFAULTS.lerp,
}: SmoothScrollProviderProps) {
  const reduce = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const lenisRef = useRef<LenisRef>(null);
  const mode: SmoothScrollMode = resolveSmoothScrollMode({
    reduce,
    finePointer,
  });
  const enableLenis = shouldEnableLenis(mode);

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

  useEffect(() => {
    document.documentElement.dataset.smoothScrollMode = mode;
    return () => {
      delete document.documentElement.dataset.smoothScrollMode;
    };
  }, [mode]);

  useEffect(() => {
    if (!enableLenis) {
      return;
    }
    return attachGsapLenisSync(() => lenisRef.current?.lenis ?? null);
  }, [enableLenis]);

  const api = useMemo<SmoothScrollApi>(() => {
    const lenis = enableLenis ? (lenisRef.current?.lenis ?? null) : null;
    return {
      lenis,
      mode,
      scrollTo: (target, options) => {
        const instance = lenisRef.current?.lenis;
        if (instance) {
          instance.scrollTo(target, options);
          return;
        }
        if (typeof window === "undefined") {
          return;
        }
        const behavior = options?.immediate ? "auto" : "smooth";
        if (typeof target === "number") {
          window.scrollTo({ top: target, behavior });
          return;
        }
        if (typeof target === "string") {
          if (target === "top" || target === "start") {
            window.scrollTo({ top: 0, behavior });
            return;
          }
          document.querySelector(target)?.scrollIntoView({
            behavior,
            block: "start",
          });
          return;
        }
        target.scrollIntoView({ behavior, block: "start" });
      },
      start: () => {
        lenisRef.current?.lenis?.start();
      },
      stop: () => {
        lenisRef.current?.lenis?.stop();
      },
      resize: () => {
        lenisRef.current?.lenis?.resize();
      },
    };
  }, [enableLenis, mode]);

  if (!enableLenis) {
    return (
      <SmoothScrollContext.Provider value={{ ...api, lenis: null, mode }}>
        {children}
      </SmoothScrollContext.Provider>
    );
  }

  return (
    <SmoothScrollContext.Provider value={api}>
      <ReactLenis
        root
        ref={lenisRef}
        options={{
          autoRaf: SMOOTH_SCROLL_DEFAULTS.autoRaf,
          lerp,
          anchors: SMOOTH_SCROLL_DEFAULTS.anchors,
          stopInertiaOnNavigate: SMOOTH_SCROLL_DEFAULTS.stopInertiaOnNavigate,
          syncTouch: SMOOTH_SCROLL_DEFAULTS.syncTouch,
          smoothWheel: SMOOTH_SCROLL_DEFAULTS.smoothWheel,
          respectReducedMotion: SMOOTH_SCROLL_DEFAULTS.respectReducedMotion,
          prevent: shouldPreventLenis,
        }}
      >
        {children}
      </ReactLenis>
    </SmoothScrollContext.Provider>
  );
}
