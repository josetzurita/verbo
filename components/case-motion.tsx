"use client";

import { useRef, type ReactNode } from "react";
import { gsap, registerGsap, ScrollTrigger, useGSAP } from "./gsap";
import { useRouteTransition } from "./use-route-transition";

export function CaseMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { phase } = useRouteTransition();
  const arrivedThroughOverlay = useRef(phase !== "idle");

  useGSAP(
    () => {
      registerGsap();
      const root = rootRef.current;
      if (!root) {
        return;
      }

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const delay = arrivedThroughOverlay.current ? 0.55 : 0.1;
        const q = gsap.utils.selector(root);

        gsap.from(q("[data-case-word]"), {
          yPercent: 120,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.05,
          delay,
        });
        gsap.from(q("[data-case-hero-meta]"), {
          y: 24,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          delay: delay + 0.35,
        });

        const hero = root.querySelector<HTMLElement>("[data-case-hero]");
        const heroMedia = hero?.querySelector("img");
        if (hero && heroMedia) {
          gsap.fromTo(
            heroMedia,
            { yPercent: -5, scale: 1.12 },
            {
              yPercent: 5,
              scale: 1.12,
              ease: "none",
              scrollTrigger: { trigger: hero, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }

        const reveals = q("[data-case-reveal]");
        gsap.set(reveals, { y: 48, autoAlpha: 0 });
        ScrollTrigger.batch(reveals, {
          start: "top 88%",
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              y: 0,
              autoAlpha: 1,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: true,
            });
          },
        });

        for (const frame of q("[data-case-frame]")) {
          const media = frame.querySelector("img");
          if (!media) {
            continue;
          }
          gsap.fromTo(
            media,
            { scale: 1.14 },
            {
              scale: 1,
              duration: 1.6,
              ease: "power3.out",
              scrollTrigger: { trigger: frame, start: "top 90%", once: true },
            },
          );
        }

        for (const row of q("[data-case-shift]")) {
          const from = row.querySelector("[data-case-from]");
          const to = row.querySelector("[data-case-to]");
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: row, start: "top 88%", end: "top 52%", scrub: 0.6 },
          });
          if (from) {
            timeline.fromTo(from, { xPercent: -18, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "none" }, 0);
          }
          if (to) {
            timeline.fromTo(to, { opacity: 0.12 }, { opacity: 1, ease: "none" }, 0.15);
          }
        }
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  return <div ref={rootRef}>{children}</div>;
}
