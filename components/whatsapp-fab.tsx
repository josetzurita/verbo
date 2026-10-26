"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { close } from "@/lib/home-content";

// Phones only. The colored square is the same WhatsApp square the footer strip and the desktop cursor use.
// On home it waits until the hero has been scrolled past, and it steps aside while the footer is on screen,
// where the same square already sits in the strip. Other pages have no hero, so it shows from the start.
export function WhatsappFab() {
  const pathname = usePathname();
  const [overHero, setOverHero] = useState(false);
  const [overFooter, setOverFooter] = useState(false);

  useEffect(() => {
    setOverHero(false);
    setOverFooter(false);
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
      watch("close", [0, 0.05, 1], (ratio) => setOverFooter(ratio > 0.05));
    });
    return () => {
      window.cancelAnimationFrame(frame);
      observers.forEach((observer) => observer.disconnect());
    };
  }, [pathname]);

  const hidden = overHero || overFooter;

  return (
    <a
      href={close.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={close.whatsappLabel}
      tabIndex={hidden ? -1 : undefined}
      className={`fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[var(--z-sticky)] flex size-[3.25rem] items-center justify-center border-2 border-destructive bg-[var(--trail-amber)] text-background transition-[opacity,scale] duration-300 active:scale-95 md:hidden ${hidden ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <span aria-hidden="true" className="close-whatsapp-icon size-7!" />
    </a>
  );
}
