"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, registerGsap, useGSAP } from "./gsap";
import { useContent } from "./locale-provider";

// The colored square is the same WhatsApp square the footer strip and the desktop cursor use.
// On home it waits until the hero has been scrolled past, and it steps aside while the footer is on screen,
// where the same square already sits in the strip. Other pages have no hero, so it shows from the start.
// It pops in and out with a scale (GSAP); reduced motion just swaps the state.
export function WhatsappFab() {
  const pathname = usePathname();
  const { close } = useContent();
  const ref = useRef<HTMLAnchorElement>(null);
  const [overHero, setOverHero] = useState(false);
  const [overFooter, setOverFooter] = useState(false);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOverHero(false);
    setOverFooter(false);
    setReady(false);
    // Let the observers report once before the first show, so it never flashes over the hero.
    const settle = window.setTimeout(() => setReady(true), 150);
    const observers: IntersectionObserver[] = [];
    const frame = window.requestAnimationFrame(() => {
      const watch = (id: string, threshold: number[], onChange: (ratio: number) => void) => {
        const node = document.getElementById(id);
        if (!node) {
          return;
        }
        const observer = new IntersectionObserver(
          ([entry]) => onChange(entry?.intersectionRatio ?? 0),
          { threshold },
        );
        observer.observe(node);
        observers.push(observer);
      };
      // Hidden while more than a fifth of the hero is still on screen.
      watch("top", [0, 0.2, 0.4, 1], (ratio) => setOverHero(ratio > 0.2));
      // From md up the footer is fixed behind the page (always "visible"), so watch the spacer that reveals it.
      const footer = document.getElementById("close");
      const fixedFooter = footer ? getComputedStyle(footer).position === "fixed" : false;
      watch(fixedFooter ? "close-reveal" : "close", [0, 0.05, 1], (ratio) => setOverFooter(ratio > 0.05));
    });
    return () => {
      window.clearTimeout(settle);
      window.cancelAnimationFrame(frame);
      observers.forEach((observer) => observer.disconnect());
    };
  }, [pathname]);

  const hidden = overHero || overFooter || !ready;

  useGSAP(
    () => {
      registerGsap();
      const node = ref.current;
      if (!node) {
        return;
      }
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (hidden) {
          gsap.to(node, { scale: 0.6, opacity: 0, duration: 0.2, ease: "power2.in", overwrite: true });
        } else {
          gsap.fromTo(
            node,
            { scale: 0.4, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.8)", overwrite: true },
          );
        }
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(node, { scale: hidden ? 0.6 : 1, opacity: hidden ? 0 : 1 });
      });
      mm.add("(pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)", () => {
        const enter = () => !hidden && gsap.to(node, { scale: 1.08, duration: 0.25, ease: "power2.out", overwrite: true });
        const leave = () => !hidden && gsap.to(node, { scale: 1, duration: 0.3, ease: "power2.out", overwrite: true });
        node.addEventListener("pointerenter", enter);
        node.addEventListener("pointerleave", leave);
        return () => {
          node.removeEventListener("pointerenter", enter);
          node.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [hidden] },
  );

  return (
    <a
      ref={ref}
      href={close.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={close.whatsappLabel}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      data-coordinate-label="WhatsApp"
      data-coordinate-variant="whatsapp"
      style={{ opacity: 0 }}
      className={`fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[var(--z-sticky)] flex size-[3.25rem] items-center justify-center border-2 border-destructive bg-[var(--trail-amber)] text-background will-change-transform md:right-8 md:bottom-8 md:size-16 ${hidden ? "pointer-events-none" : ""}`}
    >
      <span aria-hidden="true" className="close-whatsapp-icon size-7! md:size-8!" />
    </a>
  );
}
