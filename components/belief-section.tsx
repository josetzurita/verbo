"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import { belief } from "@/lib/home-content";
import { gsap, registerGsap, useGSAP } from "./gsap";
import { UnderlineLink } from "./underline-link";

const [openingLine, secondLine, bridge] = belief.lines;
const [restingLead, ...restingLines] = belief.resting;
const FRAME_HOLD_MS = 700;

const FRAME_PLACEMENTS = [
  { width: "100%", height: "121.1155%", left: "0%", top: "-21.1155%" },
  { width: "120.3629%", height: "123.9044%", left: "-10.0806%", top: "-23.506%" },
  { width: "158.6694%", height: "133.0677%", left: "-15.7258%", top: "-32.6693%" },
] as const;

function BeliefWords({ text }: { text: string }) {
  return text.split(" ").map((word, index) => (
    <span key={`${index}-${word}`}>
      {index > 0 ? " " : null}
      <span className="belief-word opacity-[0.24]">{word}</span>
    </span>
  ));
}

function BeliefSequence() {
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }
    const frames = [...root.querySelectorAll<HTMLElement>("[data-belief-frame]")];
    const first = frames[0];
    if (!first) {
      return;
    }
    for (const frame of frames) {
      frame.style.opacity = frame === first ? "1" : "0";
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || frames.length < 2) {
      return;
    }
    let index = 0;
    const timer = window.setInterval(() => {
      const current = frames[index];
      index = (index + 1) % frames.length;
      const next = frames[index];
      if (current) {
        current.style.opacity = "0";
      }
      if (next) {
        next.style.opacity = "1";
      }
    }, FRAME_HOLD_MS);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <span
      ref={rootRef}
      className="pointer-events-none absolute top-1/2 left-full z-[-1] ml-[0.18em] h-[0.62em] -translate-y-1/3"
      style={{ aspectRatio: "496 / 251" }}
    >
      {belief.frames.map((frame, index) => {
        const placement = FRAME_PLACEMENTS[index];
        if (!placement) {
          return null;
        }
        return (
          <span key={frame.src} data-belief-frame="" className="absolute inset-0">
            <img
              src={frame.src}
              alt=""
              className="absolute max-w-none"
              style={placement}
            />
          </span>
        );
      })}
    </span>
  );
}

export function BeliefSection() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".belief-word", { opacity: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const headline = rootRef.current?.querySelector("h2");
        if (!headline) {
          return;
        }
        gsap.set(".belief-word", { opacity: 0.24 });
        gsap.to(".belief-word", {
          opacity: 1,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: {
            trigger: headline,
            start: "top 90%",
            end: "bottom 95%",
            scrub: true,
          },
        });
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const paragraphs = root.querySelectorAll(".belief-paragraph");
    if (reduce || paragraphs.length === 0) {
      return;
    }

    registerGsap();
    gsap.set(paragraphs, { yPercent: 120 });
    const copy = root.querySelector(".belief-copy");
    if (!copy) {
      gsap.set(paragraphs, { yPercent: 0 });
      return;
    }

    const play = () => {
      gsap.to(paragraphs, {
        yPercent: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        overwrite: true,
      });
    };
    const rect = copy.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      play();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }
        play();
        observer.disconnect();
      },
      { threshold: 0.01 },
    );
    observer.observe(copy);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <section
        ref={rootRef}
        id="belief"
        className="sticky top-0 flex h-dvh items-end bg-background pb-16 pl-5 pr-5 md:pb-[120px] md:pl-12 md:pr-12"
      >
        <div className="grid w-full items-end gap-12 xl:grid-cols-12 xl:gap-x-8">
          <h2
            className="min-w-0 font-light leading-[0.95] tracking-[-0.04em] xl:col-span-8 [font-size:clamp(2.35rem,9.75vw,4.25rem)] xl:[font-size:var(--belief-size)]"
            style={
              {
                "--belief-size":
                  "clamp(4.25rem, min(calc((100dvh - 8rem - 65px) / 6.45), calc((100vw - 344px - 8rem) * 0.1085)), 9.25rem)",
              } as CSSProperties
            }
          >
            <span className="relative z-[1] block">
              <BeliefWords text={openingLine} />
            </span>
            <span className="relative z-[1] block">
              <span className="relative isolate inline-block">
                <BeliefWords text={secondLine} />
                <BeliefSequence />
              </span>
            </span>
            <span className="relative z-[1] block">
              <BeliefWords text={`${bridge} ${restingLead}`} />
            </span>
            {restingLines.map((line) => (
              <span key={line} className="relative z-[1] block">
                <BeliefWords text={line} />
              </span>
            ))}
          </h2>

          <div className="belief-copy relative z-[1] w-full min-w-0 max-w-[344px] justify-self-start xl:col-span-4 xl:col-start-9 xl:w-[344px]">
            <div className="grid gap-[1.2em] text-[18px] leading-[1.2] tracking-[-0.04em]">
              {belief.paragraphs.map((paragraph) => (
                <p key={paragraph} className="overflow-hidden">
                  <span className="belief-paragraph block">{paragraph}</span>
                </p>
              ))}
            </div>
            <UnderlineLink
              href={belief.ctaHref}
              delay={0.5}
              trailUnder
              trailX="left"
              trailY="level"
              trailSpread={1.35}
              trailInset={40}
              trailCount={6}
              className="mt-[45px]"
            >
              {belief.cta}
            </UnderlineLink>
          </div>
        </div>
      </section>
      <div aria-hidden="true" className="h-[40dvh]" />
    </>
  );
}
