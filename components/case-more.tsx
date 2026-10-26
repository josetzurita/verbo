"use client";

import { useRef } from "react";
import type { CaseMoreItem } from "@/lib/case-study";
import { gsap, registerGsap, useGSAP } from "./gsap";
import { CasePhoto } from "./case-photo";
import { TransitionLink } from "./transition-link";

export function CaseMore({ items }: { items: readonly CaseMoreItem[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = rootRef.current;
      const frame = frameRef.current;
      const track = trackRef.current;
      if (!root || !frame || !track) {
        return;
      }

      const distance = () => Math.max(0, track.scrollWidth - frame.clientWidth);
      const mm = gsap.matchMedia();

      // The pin is desktop only. On phones it held about 2.6 screens of scroll, so there the strip swipes.
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        frame.style.overflow = "hidden";
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            pinType: "fixed",
            scrub: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        return () => {
          frame.style.overflow = "";
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      mm.add("(prefers-reduced-motion: reduce), (max-width: 767px)", () => {
        frame.style.overflowX = "auto";
        return () => {
          frame.style.overflowX = "";
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [items] },
  );

  return (
    <section
      ref={rootRef}
      id="case-more"
      aria-labelledby="case-more-title"
      className="flex h-[110vh] flex-col max-md:h-auto max-md:py-24 items-center justify-center gap-10 overflow-hidden bg-background text-foreground md:gap-14"
    >
      <h2
        id="case-more-title"
        className="px-5 text-center text-[clamp(5.5rem,16vw,14rem)] font-light leading-[0.82] tracking-[-0.06em] md:px-12"
      >
        More work
      </h2>
      <div ref={frameRef} className="swipe-track @container w-full overscroll-x-contain max-md:snap-x max-md:snap-mandatory max-md:scroll-px-5">
        <ul ref={trackRef} aria-label="More work" className="flex w-max items-start gap-4 px-5 will-change-transform md:gap-5 md:px-12">
          {items.map((item) => (
            <li key={item.name} className="w-[84cqw] shrink-0 snap-start md:w-[calc((100cqw-6rem-1.25rem)/2)]">
              <TransitionLink
                href={item.href}
                data-coordinate-project=""
                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
              >
                <div className="relative aspect-[16/10] max-h-[42vh] w-full overflow-hidden bg-surface">
                  <CasePhoto
                    src={item.image.src}
                    alt={item.image.alt}
                    lqip={item.image.lqip}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] motion-safe:group-hover:scale-[1.04]"
                    style={{ objectPosition: item.image.focus }}
                  />
                </div>
                <p className="mt-4 text-[clamp(1.75rem,2.4vw,2.75rem)] font-light leading-none tracking-[-0.04em]">{item.name}</p>
                <p className="mt-2 max-w-[36ch] text-base font-normal leading-relaxed text-copy">{item.line}</p>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
