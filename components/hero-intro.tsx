"use client";

import { useRef } from "react";
import { verboWordLetters } from "@/lib/brand-paths";
import { discoveryLabel } from "@/lib/home-content";
import { gsap, registerGsap, useGSAP } from "./gsap";
import { UnderlineLink } from "./underline-link";

const firstLine = ["Creating", "to"] as const;
const secondLine = ["shape", "the", "world."] as const;

function MaskedWord({
  children,
  trailing = false,
}: {
  children: string;
  trailing?: boolean;
}) {
  return (
    <span
      className={`inline-block overflow-hidden align-bottom pb-[0.18em] -mb-[0.18em] ${trailing ? "" : "mr-[0.22em]"}`}
    >
      <span className="hero-word inline-block">{children}</span>
    </span>
  );
}

export function HeroIntro() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    registerGsap();
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline.from(".hero-word", {
        yPercent: 120,
        duration: 0.85,
        stagger: 0.09,
      });
      timeline.from(
        ".logo-letter",
        { yPercent: 115, duration: 0.8, stagger: 0.08 },
        0.58,
      );
    });

    return () => {
      mm.revert();
    };
  }, { scope: rootRef });

  return (
    <div ref={rootRef} className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 w-full flex-1 items-center overflow-x-auto px-5 pt-[8rem] md:px-12">
        <h1
          aria-label="Creating to shape the world."
          className="w-max text-[clamp(1.7rem,6.66vw,7.184rem)] font-light leading-[0.96] tracking-[-0.04em]"
        >
          <span className="block whitespace-nowrap">
            {firstLine.map((word, index) => (
              <MaskedWord key={word} trailing={index === firstLine.length - 1}>
                {word}
              </MaskedWord>
            ))}
          </span>
          <span className="block whitespace-nowrap">
            {secondLine.map((word, index) => (
              <MaskedWord key={word} trailing={index === secondLine.length - 1}>
                {word}
              </MaskedWord>
            ))}
            <UnderlineLink
              id="discovery"
              href="mailto:hola@verbobrands.co"
              entrance="mount"
              delay={0.38}
              ruleClassName="translate-y-3"
              className="bottom-[calc(1.25rem+0.29em)] ml-16 align-baseline"
            >
              {discoveryLabel}
            </UnderlineLink>
          </span>
        </h1>
      </div>
      <div className="px-5 pb-[3vh] md:px-12">
        <div
          role="img"
          aria-label="Verbo"
          className="relative w-full"
          style={{ aspectRatio: "1632 / 404.901" }}
        >
          {verboWordLetters.map((letter, index) => (
            <span key={index} className="absolute inset-0 overflow-hidden">
              <svg
                viewBox="0 0 1632 404.901"
                aria-hidden="true"
                className="logo-letter absolute inset-0 h-full w-full"
              >
                <path d={letter} fill="currentColor" />
              </svg>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
