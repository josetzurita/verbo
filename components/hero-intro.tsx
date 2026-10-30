"use client";

import { useRef } from "react";
import { verboWordLetters } from "@/lib/brand-paths";
import { close, discoveryLabel, heroLead, heroSlogan } from "@/lib/home-content";
import { gsap, registerGsap, useGSAP } from "./gsap";
import { markHeroDone, onIntroReveal } from "./intro-gate";
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
    <>
      <span className="inline-block overflow-hidden align-bottom pb-[0.18em] -mb-[0.18em]">
        <span className="hero-word inline-block">{children}</span>
      </span>
      {trailing ? null : <span className="word-gap"> </span>}
    </>
  );
}

export function HeroIntro() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    registerGsap();
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" }, onComplete: markHeroDone });
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
      timeline.from(
        ".hero-lead",
        { yPercent: 110, autoAlpha: 0, duration: 0.85 },
        0.62,
      );

      const chars = rootRef.current
        ? Array.from(rootRef.current.querySelectorAll<HTMLElement>(".slogan-char"))
        : [];
      if (chars.length > 0) {
        timeline.to(
          chars,
          { opacity: 1, duration: 0.01, stagger: 0.045, ease: "none" },
          1.05,
        );
      }

      return onIntroReveal(() => {
        timeline.play();
      });
    });

    // Nothing animates, so the hero is done as soon as the page is revealed.
    mm.add("(prefers-reduced-motion: reduce)", () => onIntroReveal(markHeroDone));

    return () => {
      mm.revert();
    };
  }, { scope: rootRef });

  return (
    <div ref={rootRef} className="flex min-h-0 flex-1 flex-col">
      <div className="hero-copy flex min-h-0 w-full flex-1 items-center px-5 pt-24 md:overflow-x-auto md:px-12 md:pt-[8rem]">
        <div className="relative flex w-full flex-col max-md:pb-[4.5rem] md:w-max">
          {/* The CTA sits beside the H1, not inside it, so the heading is only the line. Last-baseline
              alignment keeps it on the baseline of "world." as when it was inline. */}
          <div className="md:flex md:items-baseline-last">
            <h1
              aria-label="Creating to shape the world."
              className="text-[12.2vw] font-light leading-[0.96] tracking-[-0.04em] md:text-[clamp(1.7rem,6.66vw,7.184rem)]"
            >
              <span className="block whitespace-nowrap">
                {firstLine.map((word, index) => (
                  <MaskedWord key={word} trailing={index === firstLine.length - 1}>
                    {word}
                  </MaskedWord>
                ))}
              </span>{" "}
              <span className="block whitespace-nowrap">
                {secondLine.map((word, index) => (
                  <MaskedWord key={word} trailing={index === secondLine.length - 1}>
                    {word}
                  </MaskedWord>
                ))}
                {/* Empty and invisible, with the CTA's box: the masks align to the line bottom, so the line
                    keeps the depth the inline CTA gave it and "shape the world." stays where it was. */}
                <span
                  aria-hidden="true"
                  className="invisible inline-block py-5 align-baseline text-[24px] leading-none max-md:hidden"
                >
                  {"​"}
                </span>
              </span>
            </h1>
            <UnderlineLink
              id="discovery"
              href={close.emailHref}
              entrance="mount"
              delay={0.38}
              ruleClassName="translate-y-3"
              className="bottom-[calc(1.25rem+0.29em)] ml-16 align-baseline max-md:absolute! max-md:bottom-0 max-md:left-0 max-md:ml-0 max-md:text-[20px] max-[360px]:text-[17px]!"
            >
              {discoveryLabel}
            </UnderlineLink>
          </div>
          <div className="mt-6 max-w-[min(48ch,calc(100vw-2.5rem))] overflow-hidden pb-[0.12em] md:max-w-[min(48ch,calc(100vw-6rem))]">
            <p className="hero-lead type-body text-copy">{heroLead}</p>
          </div>
        </div>
      </div>
      <div className="px-5 pb-[3vh] md:px-12">
        <div className="hero-mark @container relative w-full" style={{ aspectRatio: "1632 / 404.901" }}>
          <div role="img" aria-label="Verbo" className="absolute inset-0">
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
          <p className="hero-slogan pointer-events-none absolute top-[0.6%] left-[60.2%] max-w-[19.2%] font-light leading-[1.05] tracking-[-0.03em] text-[2.45cqw]">
            {heroSlogan.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {Array.from(line).map((char, index) => (
                  <span key={index} className="slogan-char motion-safe:opacity-0">
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
