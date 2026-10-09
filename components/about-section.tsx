"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { about } from "@/lib/home-content";
import { gsap, registerGsap, ScrollTrigger, useGSAP } from "./gsap";
import { ResponsiveImage } from "./responsive-image";
import { UnderlineLink } from "./underline-link";

const COPY_BLOCKS = about.lead.length + 1;

function groupWords(container: HTMLElement) {
  const tokens = [...container.querySelectorAll<HTMLElement>("[data-about-token]")];
  const groups: string[][] = [];
  let lastTop = Number.NaN;
  for (const token of tokens) {
    const word = token.dataset.aboutToken ?? "";
    const top = token.offsetTop;
    const current = groups[groups.length - 1];
    if (!current || Math.abs(top - lastTop) > 1) {
      groups.push([word]);
      lastTop = top;
    } else {
      current.push(word);
    }
  }
  return groups.map((group) => group.join(" "));
}

function AboutParagraph({
  text,
  className,
  onReady,
}: {
  text: string;
  className?: string;
  onReady: () => void;
}) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<string[]>([]);

  useLayoutEffect(() => {
    const host = measureRef.current;
    if (!host) {
      return;
    }
    const measure = () => {
      const next = groupWords(host);
      setLines((current) => (current.join("\n") === next.join("\n") ? current : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    return () => {
      observer.disconnect();
    };
  }, [text]);

  useLayoutEffect(() => {
    if (lines.length === 0) {
      return;
    }
    onReady();
  }, [lines, onReady]);

  return (
    <p className={`relative ${className ?? ""}`}>
      <span ref={measureRef} aria-hidden="true" className="invisible block">
        {text.split(" ").map((word, index) => (
          <span key={`${index}-${word}`} data-about-token={word} className="inline">
            {index > 0 ? " " : null}
            {word}
          </span>
        ))}
      </span>
      <span className="absolute inset-0">
        {lines.map((line, index) => (
          <span key={`${index}-${line}`} className="block overflow-hidden">
            <span className="about-line block">{line}</span>
          </span>
        ))}
      </span>
    </p>
  );
}

function AboutWords({ text }: { text: string }) {
  return text.split(" ").map((word, index) => (
    <span
      key={`${index}-${word}`}
      className="mr-[0.22em] inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] leading-[inherit]"
    >
      <span className="about-word inline-block leading-[inherit]">{word}</span>
    </span>
  ));
}

export function AboutSection() {
  const rootRef = useRef<HTMLElement>(null);
  const readyCount = useRef(0);
  const [copyReady, setCopyReady] = useState(false);
  const markCopyReady = useCallback(() => {
    readyCount.current += 1;
    if (readyCount.current >= COPY_BLOCKS) {
      setCopyReady(true);
    }
  }, []);

  useGSAP(
    (_context, contextSafe) => {
      registerGsap();
      const root = rootRef.current;
      if (!root || !contextSafe || !copyReady) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".about-word", { yPercent: 0 });
        gsap.set(".about-line", { yPercent: 0 });
        gsap.set(".about-card", { y: 0, scale: 1, autoAlpha: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine) and (hover: hover)", () => {
        const portraits = gsap.utils.toArray<HTMLElement>(".about-portrait", root);
        gsap.set(portraits, { transformOrigin: "50% 50%", scale: 1 });
        const cleanups: Array<() => void> = [];

        for (const portrait of portraits) {
          const card = portrait.closest(".about-card");
          if (!card) {
            continue;
          }
          const grow = contextSafe(() => {
            gsap.to(portrait, {
              scale: 1.08,
              duration: 0.8,
              ease: "power3.out",
              overwrite: "auto",
            });
          });
          const settle = contextSafe(() => {
            gsap.to(portrait, {
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              overwrite: "auto",
            });
          });
          card.addEventListener("pointerenter", grow);
          card.addEventListener("pointerleave", settle);
          cleanups.push(() => {
            card.removeEventListener("pointerenter", grow);
            card.removeEventListener("pointerleave", settle);
          });
        }

        return () => {
          for (const cleanup of cleanups) {
            cleanup();
          }
        };
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const headlineWords = gsap.utils.toArray<HTMLElement>(".about-headline .about-word", root);
        const copyLines = gsap.utils.toArray<HTMLElement>(".about-line", root);
        gsap.set(headlineWords, { yPercent: 120 });
        gsap.set(copyLines, { yPercent: 120 });

        const playCopy = () => {
          const lines = gsap.utils.toArray<HTMLElement>(".about-line", root);
          gsap.to(headlineWords, {
            yPercent: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.07,
            overwrite: true,
          });
          gsap.fromTo(
            lines,
            { yPercent: 120 },
            {
              yPercent: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0,
              overwrite: true,
            },
          );
        };

        const intro = root.querySelector(".about-intro");
        const introTrigger = ScrollTrigger.create({
          trigger: intro ?? root,
          start: "top 82%",
          once: true,
          onEnter: playCopy,
        });

        const cards = gsap.utils.toArray<HTMLElement>(".about-card", root);
        gsap.set(cards, { y: 72, scale: 0.98, autoAlpha: 0 });
        const cardTween = gsap.to(cards, {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 1.25,
          ease: "power3.out",
          stagger: 0.1,
          paused: true,
          overwrite: true,
        });
        const row = root.querySelector(".about-team");
        const cardTrigger = ScrollTrigger.create({
          trigger: row ?? root,
          start: "top 78%",
          once: true,
          onEnter: () => {
            cardTween.play();
          },
        });

        return () => {
          introTrigger.kill();
          cardTrigger.kill();
          cardTween.kill();
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [copyReady] },
  );

  return (
    <section
      ref={rootRef}
      id="about"
      data-theme="dark"
      className="relative z-[var(--z-raised)] bg-background px-5 pt-[9.25rem] text-foreground md:px-12"
    >
      <div className="about-intro flex flex-col gap-12 min-[1500px]:flex-row min-[1500px]:items-end">
        <h2 className="about-headline max-w-[29.25rem] shrink-0 text-[clamp(3.25rem,5.09vw,5.5rem)] font-light leading-[0.9] tracking-[-0.04em]">
          {about.title.map((line) => (
            <span key={line} className="block min-[1500px]:whitespace-nowrap">
              <AboutWords text={line} />
            </span>
          ))}
        </h2>

        <div className="about-copy flex w-full min-w-0 flex-col gap-10 md:flex-row md:items-stretch md:gap-x-8 min-[1500px]:ml-auto min-[1500px]:w-auto min-[1500px]:gap-x-[3.9375rem]">
          <div className="grid min-w-0 flex-1 gap-[1.2em] text-[18px] font-light leading-[1.2] tracking-[-0.04em] min-[1500px]:w-[31.25rem] min-[1500px]:flex-none">
            {about.lead.map((paragraph) => (
              <AboutParagraph key={paragraph} text={paragraph} onReady={markCopyReady} />
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-col min-[1500px]:w-[31.5rem] min-[1500px]:flex-none">
            <AboutParagraph
              text={about.aside}
              className="text-[18px] font-light leading-[1.2] tracking-[-0.04em]"
              onReady={markCopyReady}
            />
            <UnderlineLink
              href={about.ctaHref}
              trailX="right"
              trailY="top"
              trailCount={6}
              trailSet="people"
              className="mt-8 self-start min-[1500px]:mt-auto"
            >
              {about.cta}
            </UnderlineLink>
          </div>
        </div>
      </div>

      <ul id="team" className="about-team mt-16 gap-3 min-[1500px]:mt-20">
        {about.tones.map((tone) => (
          <li
            key={tone}
            data-coordinate-label="meet"
            className="about-card flex min-h-[34rem] flex-col overflow-hidden px-3 pt-3 pb-6 text-background min-[1500px]:min-h-[52rem]"
            style={{ backgroundColor: tone }}
          >
            <div className="relative aspect-[292/380] w-full overflow-hidden">
              <ResponsiveImage
                src={about.portrait}
                alt=""
                width={605}
                height={908}
                sizes="(min-width: 1500px) 18vw, (min-width: 640px) 46vw, 92vw"
                className="about-portrait absolute inset-0 h-full w-full max-w-none object-cover"
                style={{ objectFit: "cover", objectPosition: "center", width: "100%", height: "100%", maxWidth: "none" }}
              />
            </div>
            <p className="mt-3 text-[18px] font-light leading-[1.2] tracking-[-0.04em]">{about.quote}</p>
            <div aria-hidden="true" className="mt-[0.9375rem] h-px w-full bg-background" />
            <p className="mt-auto pt-8 text-[14px] font-normal leading-[1.1] tracking-[-0.04em]">{about.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
