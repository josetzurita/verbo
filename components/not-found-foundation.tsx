"use client";

import { useRef } from "react";
import { notFound } from "@/lib/home-content";
import { gsap, registerGsap, useGSAP } from "./gsap";
import { TransitionLink } from "./transition-link";
import { UnderlineLink } from "./underline-link";

const digits = Array.from(notFound.code);

// Same frame and timing as the button trail in cursor-trail.ts.
const FRAME_WIDTH = 195;
const FRAME_HEIGHT = 210;
const SCALE_DURATION = 0.32;
const EXIT_STAGGER = 0.06;
const HOLD = 0.45;
const DROP_PX = 90;
const JITTER_PX = 14;
const MAX_FRAMES = 12;
const strokes = ["var(--trail-amber)", "var(--foreground)", "var(--trail-blue)", "var(--trail-yellow)"] as const;

export type NotFoundProject = {
  src: string;
  focus?: string;
};

function shuffled<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = copy[i];
    const b = copy[j];
    if (a !== undefined && b !== undefined) {
      copy[i] = b;
      copy[j] = a;
    }
  }
  return copy;
}

function jitter(): number {
  return (Math.random() - 0.5) * JITTER_PX * 2;
}

export function NotFoundFoundation({ projects }: { projects: readonly NotFoundProject[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLHeadingElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        timeline.from(".nf-digit", { yPercent: 115, duration: 0.9, stagger: 0.09 });
        timeline.from(".nf-copy", { yPercent: 110, autoAlpha: 0, duration: 0.85, stagger: 0.08 }, 0.35);
        return () => {
          timeline.kill();
        };
      });

      mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine) and (hover: hover)", () => {
        const code = codeRef.current;
        const layer = layerRef.current;
        if (!code || !layer || projects.length === 0) {
          return;
        }

        const deck = shuffled(projects);
        for (const project of deck) {
          const preload = new Image();
          preload.src = project.src;
        }

        let live: HTMLDivElement[] = [];
        let count = 0;
        let last: { x: number; y: number } | null = null;

        const exit = (el: HTMLDivElement, delay: number) => {
          live = live.filter((frame) => frame !== el);
          gsap.killTweensOf(el);
          gsap.to(el, {
            scale: 0,
            duration: SCALE_DURATION,
            delay,
            ease: "power3.in",
            onComplete: () => el.remove(),
          });
        };

        const drop = (x: number, y: number) => {
          const project = deck[count % deck.length];
          const stroke = strokes[count % strokes.length];
          if (!project || !stroke) {
            return;
          }
          count += 1;

          const el = document.createElement("div");
          el.className = "absolute top-0 left-0 box-border overflow-hidden border border-solid";
          el.style.width = `${FRAME_WIDTH}px`;
          el.style.height = `${FRAME_HEIGHT}px`;
          el.style.borderColor = stroke;

          const image = document.createElement("img");
          image.src = project.src;
          image.alt = "";
          image.draggable = false;
          image.className = "size-full object-cover";
          image.style.objectPosition = project.focus ?? "50% 50%";
          el.appendChild(image);
          layer.appendChild(el);

          live.push(el);
          const oldest = live.length > MAX_FRAMES ? live[0] : undefined;
          if (oldest) {
            exit(oldest, 0);
          }

          gsap.set(el, {
            x: x - FRAME_WIDTH / 2 + jitter(),
            y: y - FRAME_HEIGHT / 2 + jitter(),
            scale: 0,
          });
          gsap
            .timeline()
            .to(el, { scale: 1, duration: SCALE_DURATION, ease: "power3.out" })
            .to(el, { scale: 0, duration: SCALE_DURATION, ease: "power3.in" }, `+=${HOLD}`)
            .eventCallback("onComplete", () => {
              live = live.filter((frame) => frame !== el);
              el.remove();
            });
        };

        const onEnter = (event: PointerEvent) => {
          if (event.pointerType === "touch") {
            return;
          }
          last = { x: event.clientX, y: event.clientY };
          drop(event.clientX, event.clientY);
        };

        const onMove = (event: PointerEvent) => {
          if (event.pointerType === "touch") {
            return;
          }
          if (!last) {
            onEnter(event);
            return;
          }
          if (Math.hypot(event.clientX - last.x, event.clientY - last.y) >= DROP_PX) {
            last = { x: event.clientX, y: event.clientY };
            drop(event.clientX, event.clientY);
          }
        };

        const onLeave = () => {
          last = null;
          live
            .slice()
            .reverse()
            .forEach((el, index) => exit(el, index * EXIT_STAGGER));
        };

        code.addEventListener("pointerenter", onEnter);
        code.addEventListener("pointermove", onMove);
        code.addEventListener("pointerleave", onLeave);
        return () => {
          code.removeEventListener("pointerenter", onEnter);
          code.removeEventListener("pointermove", onMove);
          code.removeEventListener("pointerleave", onLeave);
          for (const el of Array.from(layer.children)) {
            gsap.killTweensOf(el);
            el.remove();
          }
          live = [];
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [projects] },
  );

  return (
    <div
      ref={rootRef}
      className="not-found flex h-[100dvh] flex-col overflow-hidden px-5 pb-[3vh] pt-24 md:px-12 md:pt-[8rem]"
    >
      <h1 ref={codeRef} className="flex min-h-0 flex-1">
        <TransitionLink
          href="/work"
          aria-label={`${notFound.code}, see our work`}
          className="flex flex-1 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-foreground"
        >
          <span className="not-found-code flex select-none whitespace-nowrap font-light leading-[0.8] tracking-[-0.04em]">
            {digits.map((digit, index) => (
              <span key={index} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <span aria-hidden="true" className="nf-digit inline-block">
                  {digit}
                </span>
              </span>
            ))}
          </span>
        </TransitionLink>
      </h1>
      <div className="flex flex-col items-start gap-2">
        <div className="overflow-hidden">
          <p className="nf-copy not-found-title pb-[0.14em]">{notFound.title}</p>
        </div>
        <UnderlineLink href="/" entrance="mount" delay={0.5} trailSet="brand">
          {notFound.cta}
        </UnderlineLink>
      </div>
      <div ref={layerRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5] overflow-hidden" />
    </div>
  );
}
