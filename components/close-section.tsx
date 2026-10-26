"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { close } from "@/lib/home-content";
import { verboWordLetters } from "@/lib/brand-paths";
import { gsap, registerGsap, useGSAP } from "./gsap";
import { ResponsiveImage } from "./responsive-image";

const FRAMES = [
  { src: "/close/frames/01-apollo-square.png", aspect: "square", face: "var(--background)", ink: "var(--foreground)", edge: "var(--trail-amber)" },
  { src: "/close/frames/02-stoneware-vase-square.png", aspect: "square", face: "var(--surface)", ink: "var(--foreground)", edge: "var(--trail-blue)" },
  { src: "/close/frames/03-soft-portrait-square.png", aspect: "square", face: "var(--destructive)", ink: "var(--foreground)", edge: "var(--trail-amber)" },
  { src: "/close/frames/04-classical-facade-square.png", aspect: "square", face: "var(--trail-amber)", ink: "var(--background)", edge: "var(--destructive)" },
  { src: "/close/frames/05-ceramic-lamp-square.png", aspect: "square", face: "var(--trail-blue)", ink: "var(--foreground)", edge: "var(--foreground)" },
  { src: "/close/frames/06-aphrodite-3x4.png", aspect: "portrait", face: "var(--trail-yellow)", ink: "var(--background)", edge: "var(--trail-amber)" },
  { src: "/close/frames/07-cobalt-pitcher-3x4.png", aspect: "portrait", face: "var(--foreground)", ink: "var(--background)", edge: "var(--trail-blue)" },
  { src: "/close/frames/08-motion-portrait-3x4.png", aspect: "portrait", face: "var(--trail-amber)", ink: "var(--surface)", edge: "var(--trail-yellow)" },
  { src: "/close/frames/09-spiral-stairwell-3x4.png", aspect: "portrait", face: "var(--trail-blue)", ink: "var(--background)", edge: "var(--foreground)" },
  { src: "/close/frames/10-marble-hand-3x4.png", aspect: "portrait", face: "var(--trail-yellow)", ink: "var(--surface)", edge: "var(--trail-yellow)" },
  { src: "/close/frames/11-ceramic-collection-4x3.png", aspect: "landscape", face: "var(--background)", ink: "var(--trail-yellow)", edge: "var(--trail-blue)" },
  { src: "/close/frames/12-museum-sculptures-4x3.png", aspect: "landscape", face: "var(--surface)", ink: "var(--trail-yellow)", edge: "var(--trail-yellow)" },
  { src: "/close/frames/13-intimate-portrait-4x3.png", aspect: "landscape", face: "var(--destructive)", ink: "var(--trail-yellow)", edge: "var(--destructive)" },
  { src: "/close/frames/14-brutalist-detail-4x3.png", aspect: "landscape", face: "var(--foreground)", ink: "var(--trail-blue)", edge: "var(--trail-amber)" },
  { src: "/close/frames/15-ceramic-chrome-4x3.png", aspect: "landscape", face: "var(--trail-amber)", ink: "var(--foreground)", edge: "var(--destructive)" },
] as const;

const ASPECT_CLASS = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
} as const;

const PLATES = [
  { frame: 0, left: "2%", width: "8.5rem", duration: 24, progress: 0.05 },
  { frame: 6, left: "7%", width: "7rem", duration: 28, progress: 0.42 },
  { frame: 11, left: "12%", width: "11rem", duration: 22, progress: 0.78 },
  { frame: 3, left: "16%", width: "8rem", duration: 30, progress: 0.18 },
  { frame: 8, left: "21%", width: "7.25rem", duration: 26, progress: 0.55 },
  { frame: 9, left: "38%", width: "6.25rem", duration: 33, progress: 0.86 },
  { frame: 4, left: "62%", width: "6.5rem", duration: 29, progress: 0.2 },
  { frame: 2, left: "79%", width: "8.25rem", duration: 23, progress: 0.16 },
  { frame: 8, left: "84%", width: "6.5rem", duration: 34, progress: 0.09 },
  { frame: 10, left: "88%", width: "13rem", duration: 22, progress: 0.51 },
  { frame: 3, left: "93%", width: "7rem", duration: 28, progress: 0.61 },
  { frame: 5, left: "97%", width: "7.75rem", duration: 25, progress: 0.73 },
] as const;

// Phones have no hover and no room for plates drifting through the copy, so the plates become one slow
// strip of their own. An item with `ink` is a WhatsApp square (the colored square the desktop cursor
// turns into); the rest are photos. A square is always on screen and tappable.
const STRIP = [
  { frame: 0 },
  { frame: 5 },
  { frame: 3, ink: "var(--foreground)" },
  { frame: 10 },
  { frame: 7 },
  { frame: 4, ink: "var(--foreground)" },
  { frame: 1 },
  { frame: 12 },
  { frame: 5, ink: "var(--foreground)" },
  { frame: 8 },
] as const;

function frameSize(aspect: (typeof FRAMES)[number]["aspect"]) {
  if (aspect === "portrait") {
    return { width: 900, height: 1200 };
  }
  if (aspect === "landscape") {
    return { width: 1200, height: 900 };
  }
  return { width: 1200, height: 1200 };
}

const SLOW_RATE = 0.32;

export function CloseSection() {
  const rootRef = useRef<HTMLElement>(null);

  // From md up the footer is fixed behind the whole page. Safari 26 (iPad too) tints its toolbars from
  // fixed elements at the edges, so the footer stays the dark field color until the reveal is about a
  // screen away. On phones it is in the page flow and the spacer is hidden, so it never arms (see CSS).
  useEffect(() => {
    const footer = rootRef.current;
    const reveal = document.getElementById("close-reveal");
    if (!footer || !reveal) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => footer.classList.toggle("close-armed", Boolean(entry?.isIntersecting)),
      { rootMargin: "100% 0px 100% 0px" },
    );
    observer.observe(reveal);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      registerGsap();
      const root = rootRef.current;
      if (!root) {
        return;
      }

      const mm = gsap.matchMedia();

      const mount = (reduced: boolean, wide: boolean) => {
        const all = gsap.utils.toArray<HTMLElement>("[data-close-float]", root);
        const nodes = wide ? all : all.filter((node) => node.dataset.wide !== "true");
        const hidden = all.filter((node) => !nodes.includes(node));
        const tweens: gsap.core.Tween[] = [];
        const rate = { value: 1 };
        let rateTween: gsap.core.Tween | null = null;
        let active: HTMLElement | null = null;

        gsap.set(hidden, { autoAlpha: 0 });
        gsap.set(nodes, { autoAlpha: 1, filter: "blur(0px)" });

        const applyRate = () => {
          for (const tween of tweens) {
            tween.timeScale(rate.value);
          }
        };

        const setRate = (value: number) => {
          rateTween?.kill();
          if (reduced) {
            rate.value = value;
            applyRate();
            return;
          }
          rateTween = gsap.to(rate, {
            value,
            duration: 0.7,
            ease: "power2.out",
            onUpdate: applyRate,
          });
        };

        const photosOf = (plate: HTMLElement) => plate.querySelector<HTMLElement>(".close-float-photo");

        const focusPlate = (plate: HTMLElement) => {
          active = plate;
          setRate(SLOW_RATE);
          gsap.set(plate, { zIndex: 2 });
          const others = nodes.filter((node) => node !== plate);
          for (const node of others) {
            gsap.set(node, { zIndex: 1 });
          }
          if (reduced) {
            return;
          }
          gsap.to(others, {
            filter: "blur(3px)",
            duration: 0.45,
            ease: "power2.out",
            overwrite: "auto",
          });
          gsap.to(plate, {
            filter: "blur(0px)",
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
          const photo = photosOf(plate);
          if (photo) {
            gsap.to(photo, {
              scale: 1.06,
              duration: 0.8,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        };

        const clearPlate = () => {
          active = null;
          setRate(1);
          if (reduced) {
            return;
          }
          gsap.to(nodes, {
            filter: "blur(0px)",
            duration: 0.55,
            ease: "power2.out",
            overwrite: "auto",
          });
          gsap.to(
            nodes
              .map((node) => photosOf(node))
              .filter((photo): photo is HTMLElement => photo !== null),
            {
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              overwrite: "auto",
            },
          );
        };

        const build = () => {
          for (const tween of tweens) {
            tween.kill();
          }
          tweens.length = 0;
          const height = root.offsetHeight;
          for (const node of nodes) {
            const distance = height + node.offsetHeight;
            const progress = Number(node.dataset.progress);
            const start = Number.isFinite(progress) ? progress : 0;
            if (reduced) {
              gsap.set(node, { y: -distance * start });
              continue;
            }
            const duration = Number(node.dataset.duration);
            const tween = gsap.fromTo(
              node,
              { y: 0 },
              {
                y: -distance,
                duration: Number.isFinite(duration) ? duration : 24,
                ease: "none",
                repeat: -1,
              },
            );
            tween.progress(start);
            tween.timeScale(rate.value);
            tweens.push(tween);
          }
        };

        build();

        const cleanups: Array<() => void> = [];
        // Hover slow-down, blur and the click-through are for a mouse; a tap on a phone just follows the link.
        const mouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        for (const node of mouse ? nodes : []) {
          const enter = () => focusPlate(node);
          const open = () => window.open(close.whatsappHref, "_blank", "noopener,noreferrer");
          const leave = (event: PointerEvent) => {
            const next = event.relatedTarget;
            if (next instanceof Element && next.closest("[data-close-float]") === node) {
              return;
            }
            if (active === node) {
              clearPlate();
            }
          };
          node.addEventListener("pointerenter", enter);
          node.addEventListener("pointerleave", leave);
          node.addEventListener("click", open);
          cleanups.push(() => {
            node.removeEventListener("pointerenter", enter);
            node.removeEventListener("pointerleave", leave);
            node.removeEventListener("click", open);
          });
        }

        const onResize = () => build();
        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("resize", onResize);
          for (const cleanup of cleanups) {
            cleanup();
          }
          rateTween?.kill();
          for (const tween of tweens) {
            tween.kill();
          }
        };
      };

      mm.add("(max-width: 767px) and (prefers-reduced-motion: reduce)", () => mount(true, false));
      mm.add("(min-width: 768px) and (prefers-reduced-motion: reduce)", () => mount(true, true));
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => mount(false, false));
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => mount(false, true));
    },
    { scope: rootRef },
  );

  return (
    <>
      {/* The menu's Contact link lands here: the end of the page, where the footer is fully shown. */}
      <span id="contact" aria-hidden="true" className="block" />
      <div id="close-reveal" aria-hidden="true" className="pointer-events-none h-[100dvh] max-md:hidden" />
      <footer
        ref={rootRef}
        id="close"
        // Phones: a normal block at the end of the page, not a fixed layer revealed from behind it.
        className="theme-paper fixed inset-x-0 bottom-0 z-0 flex h-[100dvh] flex-col overflow-hidden bg-background pt-20 text-foreground max-md:static! max-md:h-auto! max-md:min-h-svh md:pt-[8rem]"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 max-md:hidden">
          {PLATES.map((plate) => {
            const frame = FRAMES[plate.frame];
            const size = frameSize(frame.aspect);
            return (
              <div
                key={`${plate.left}-${plate.frame}-${plate.progress}`}
                data-close-float
                data-coordinate-label="WhatsApp"
                data-coordinate-variant="whatsapp"
                data-coordinate-face={frame.face}
                data-coordinate-ink={frame.ink}
                data-duration={plate.duration}
                data-progress={plate.progress}
                className={`close-float pointer-events-auto absolute top-full z-[1] overflow-hidden border-2 will-change-transform ${ASPECT_CLASS[frame.aspect]}`}
                style={{ left: plate.left, borderColor: frame.edge, "--close-float-w": plate.width } as CSSProperties}
              >
                <ResponsiveImage
                  src={frame.src}
                  alt=""
                  width={size.width}
                  height={size.height}
                  sizes="220px"
                  className="close-float-photo absolute inset-0 h-full w-full max-w-none object-cover will-change-transform"
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    maxWidth: "none",
                    transformOrigin: "50% 50%",
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="pointer-events-none relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-5 text-center md:gap-6 md:px-12">
          <div className="relative z-10 flex flex-col items-center gap-4 text-foreground md:text-[var(--blend-difference)] md:mix-blend-difference md:gap-6">
            <p className="type-label">{close.label}</p>
            <h2 className="w-full max-w-[40em] text-[2.4rem] font-light md:text-[clamp(2.6rem,6.4vw,5.75rem)] leading-[1.05] tracking-[-0.045em]">
              <span className="block">{close.titleLead}</span>
              <span className="block">
                {close.titleRest} {close.titleEmphasis}
              </span>
            </h2>
            <p className="copy-dim max-w-[34ch] text-[16px] font-light leading-[1.4] tracking-[-0.03em] md:text-[19px]">
              {close.body}
            </p>
          </div>
          <a
            href={close.emailHref}
            className="pointer-events-auto relative z-10 inline-flex whitespace-nowrap border border-foreground px-6 py-3 text-[0.6875rem] font-normal uppercase tracking-[0.12em] transition-[transform,background-color,color] duration-[var(--duration-fast)] ease-[var(--ease-out-expo)] hover:bg-foreground hover:text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground active:scale-[0.98]"
          >
            {close.email}
          </a>
        </div>
        <div className="close-strip relative mb-3 overflow-hidden md:hidden">
          <ul className="close-strip-track flex w-max">
            {[0, 1].flatMap((copy) =>
              STRIP.map((item, index) => {
                const frame = FRAMES[item.frame];
                const size = frameSize(frame.aspect);
                return (
                  // The strip is two identical runs so it loops without a seam; the second is a repeat for assistive tech.
                  <li
                    key={`${copy}-${index}`}
                    aria-hidden={copy === 1 || undefined}
                    className="mr-3 shrink-0"
                    style={{ height: "var(--strip-h)" }}
                  >
                    {"ink" in item ? (
                      <a
                        href={close.whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={close.whatsappLabel}
                        tabIndex={copy === 1 ? -1 : undefined}
                        className="flex aspect-square h-full items-center justify-center border-2 transition-[scale] duration-150 active:scale-95"
                        style={{ backgroundColor: frame.face, borderColor: frame.edge, color: item.ink }}
                      >
                        <span aria-hidden="true" className="close-whatsapp-icon" />
                      </a>
                    ) : (
                      <div
                        className={`relative h-full overflow-hidden border-2 ${ASPECT_CLASS[frame.aspect]}`}
                        style={{ borderColor: frame.edge }}
                      >
                        <ResponsiveImage
                          src={frame.src}
                          alt=""
                          width={size.width}
                          height={size.height}
                          sizes="160px"
                          className="absolute inset-0 h-full w-full max-w-none object-cover"
                          style={{ height: "100%", width: "100%", objectFit: "cover", maxWidth: "none" }}
                        />
                      </div>
                    )}
                  </li>
                );
              }),
            )}
          </ul>
        </div>
        <div className="pointer-events-none relative px-5 pb-2 md:px-12">
          <div role="img" aria-label="Verbo" className="close-mark relative mx-auto">
            {verboWordLetters.map((letter, index) => (
              <svg
                key={index}
                viewBox="0 0 1632 404.901"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
              >
                <path d={letter} fill="currentColor" />
              </svg>
            ))}
          </div>
        </div>
        <div className="pointer-events-none relative z-30 flex items-center justify-between gap-6 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-[12px] font-light leading-none tracking-[-0.03em] md:px-12">
          <p className="whitespace-nowrap">{close.studio}</p>
          <p className="whitespace-nowrap">{close.practice}</p>
        </div>
      </footer>
    </>
  );
}
