"use client";

import { useRef } from "react";
import { verboMarkPupil, verboMarkRing } from "@/lib/brand-paths";
import { cases } from "@/lib/home-content";
import { CustomEase, gsap, registerGsap, useGSAP } from "./gsap";
import { introPending, releaseIntro } from "./intro-gate";

const MARK_W = 36.7778;
const MARK_H = 34.9572;
const MARK_RATIO = MARK_H / MARK_W;
const PUPIL_RATIO = 5.48 / MARK_W;
/**
 * Inner contour of `verboMarkRing`, in mark units. The ring is thicker on the
 * sides than on the top and bottom, so each side has its own inset from the
 * outer edge, and the inner curve is a slight ellipse.
 */
const RING_INNER = {
  left: 3.843,
  right: 3.844,
  top: 0.807,
  bottom: 1.008,
  rx: 14.5455,
  ry: 16.571,
} as const;
/** Pulls each corner arc this far onto the image so no hairline shows between them. */
const CORNER_OVERLAP = 0.5;
/** The counter reaches 100 no sooner than this, measured from the first frame. */
const MIN_SECONDS = 1.9;
/** The counter finishes by this point even if images are still loading. */
const CAP_SECONDS = 4;
const CUT_SECONDS = 0.16;
const SKIP_SPEED = 2.5;
/** Scroll input this soon after the start is momentum, not intent. */
const SKIP_GRACE_MS = 600;
/** The start waits for fonts at most this long. */
const FONT_WAIT_MS = 300;

const quadrants = [
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 1 },
  { x: 1, y: 1 },
] as const;

const shots = cases.map((item) => ({ src: item.image, key: item.index }));

const scrollKeys = new Set([" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"]);

function frameSize() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(vw * (vw < 768 ? 0.72 : 0.34), vh * 0.46 * (4 / 3));
  const mark = Math.min(Math.max(vw * 0.035, 48), 72);
  return { width, height: width * 0.75, mark };
}

export function IntroLoader() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) {
        return;
      }
      if (!introPending()) {
        // Client navigation back home after the intro already ran in this tab.
        root.style.display = "none";
        return;
      }

      registerGsap();
      const ease = CustomEase.create("verbo-intro", "0.76,0,0.24,1");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const frame = root.querySelector<HTMLElement>(".intro-frame");
        const mark = root.querySelector<HTMLElement>(".intro-mark");
        const pupil = root.querySelector<SVGElement>(".intro-pupil");
        const counter = root.querySelector<HTMLElement>(".intro-count");
        const arcs = gsap.utils.toArray<HTMLElement>(".intro-arc", root);
        const images = gsap.utils.toArray<HTMLImageElement>(".intro-shot", root);
        if (!frame || !mark || !pupil || !counter) {
          return;
        }

        const { width, height, mark: markSize } = frameSize();
        const markHeight = markSize * MARK_RATIO;
        const pupilSize = markSize * PUPIL_RATIO;
        const pupilScale = { scaleX: pupilSize / width, scaleY: pupilSize / height };

        const unit = markSize / MARK_W;

        // Each arc's inner curve lands on the frame edge, and the frame corners
        // share that curve, so the image fills exactly what the arcs draw.
        const cornerAt = (scale: number) => ({
          x: (index: number) => {
            const side = quadrants[index]?.x ?? 1;
            const inset = (side < 0 ? RING_INNER.left : RING_INNER.right) * unit;
            return side * ((width * scale) / 2 + inset - markSize / 2 - CORNER_OVERLAP);
          },
          y: (index: number) => {
            const side = quadrants[index]?.y ?? 1;
            const inset = (side < 0 ? RING_INNER.top : RING_INNER.bottom) * unit;
            return side * ((height * scale) / 2 + inset - markHeight / 2 - CORNER_OVERLAP);
          },
        });

        // autoRound off: whole-pixel sizes would shift the arcs off the image edge.
        gsap.set(frame, {
          width,
          height,
          autoRound: false,
          x: -width / 2,
          y: -height / 2,
          ...pupilScale,
          autoAlpha: 0,
        });
        // Set directly: GSAP would read the elliptical "x / y" form as shorthand.
        frame.style.borderRadius = `${RING_INNER.rx * unit}px / ${RING_INNER.ry * unit}px`;
        gsap.set(mark, {
          autoRound: false,
          width: markSize,
          height: markHeight,
          left: -markSize / 2,
          top: -markHeight / 2,
        });
        gsap.set(pupil, { transformOrigin: "50% 50%" });
        gsap.set(images, { autoAlpha: 0 });
        gsap.set(images[0] ?? [], { autoAlpha: 1 });

        let fast = false;
        let loaded = 0;
        let shown = 0;
        let cutIndex = 0;
        let introDone = false;
        let outro: gsap.core.Timeline | undefined;
        let cut: gsap.core.Tween | undefined;
        let startedAt = 0;
        let startFrame = 0;
        let disposed = false;
        const total = images.length + 1;

        const bump = () => {
          loaded += 1;
        };
        void document.fonts.ready.then(bump, bump);
        for (const image of images) {
          image.decode().then(bump, bump);
        }

        const intro = gsap.timeline({
          paused: true,
          onComplete: () => {
            introDone = true;
            nextCut();
          },
        });
        intro
          .fromTo(
            mark,
            { autoAlpha: 0, scale: 0.9 },
            { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power2.out" },
          )
          .fromTo(counter, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.1)
          .addLabel("dilate", 0.35)
          .to(pupil, { scale: 2.4, autoAlpha: 0, duration: 0.2, ease: "power2.in" }, "dilate")
          .set(frame, { autoAlpha: 1 }, "dilate")
          .to(frame, { scaleX: 1, scaleY: 1, duration: 0.5, ease: "expo.inOut" }, "dilate")
          .to(arcs, { ...cornerAt(1), duration: 0.5, ease: "expo.inOut" }, "dilate");

        function nextCut() {
          const current = images[cutIndex % images.length];
          cutIndex += 1;
          const following = images[cutIndex % images.length];
          if (current && following && current !== following) {
            gsap.set(current, { autoAlpha: 0 });
            gsap.set(following, { autoAlpha: 1 });
            gsap.fromTo(following, { scale: 1.06 }, { scale: 1, duration: 0.3, ease: "power2.out" });
          }
          cut = gsap.delayedCall(CUT_SECONDS / (fast ? SKIP_SPEED : 1), nextCut);
        }

        const tick = () => {
          const elapsed = (performance.now() - startedAt) / 1000;
          const timeShare = fast ? 1 : Math.min(elapsed / MIN_SECONDS, 1);
          const target =
            elapsed >= CAP_SECONDS ? 100 : 100 * Math.min(loaded / total, timeShare);
          shown += (target - shown) * (fast ? 0.5 : 0.14);
          if (target === 100 && shown > 99.5) {
            shown = 100;
          }
          counter.textContent = String(Math.round(shown)).padStart(2, "0");
          if (shown === 100 && introDone && !outro) {
            startOutro();
          }
        };

        // Start once hydration has settled, so the first beats are never eaten
        // by main-thread work right after mount.
        const fontsOrTimeout = Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, FONT_WAIT_MS)),
        ]);
        void fontsOrTimeout.then(() => {
          startFrame = requestAnimationFrame(() => {
            startFrame = requestAnimationFrame(() => {
              if (disposed) {
                return;
              }
              startedAt = performance.now();
              intro.play();
              gsap.ticker.add(tick);
            });
          });
        });

        // The image shrinks back into the pupil and the corners close into the
        // ring, so the intro ends on the eye it started from.
        function startOutro() {
          gsap.ticker.remove(tick);
          cut?.kill();
          outro = gsap.timeline({ onComplete: finish });
          outro
            .to(frame, { scale: 1.03, duration: 0.15, ease: "power2.out" })
            .to(arcs, { ...cornerAt(1.03), duration: 0.15, ease: "power2.out" }, 0)
            .addLabel("close")
            .to(frame, { ...pupilScale, duration: 0.6, ease }, "close")
            .to(arcs, { x: 0, y: 0, duration: 0.6, ease }, "close")
            .to(counter, { autoAlpha: 0, duration: 0.3 }, "close")
            .set(frame, { autoAlpha: 0 }, "close+=0.5")
            .to(pupil, { scale: 1, autoAlpha: 1, duration: 0.15, ease: "power2.out" }, "close+=0.5")
            .addLabel("lift", "close+=0.95")
            .call(releaseIntro, [], "lift+=0.05")
            .to(root, { yPercent: -100, duration: 0.7, ease }, "lift");
          outro.timeScale(fast ? SKIP_SPEED : 1);
        }

        function finish() {
          detach();
          gsap.set(root, { display: "none" });
        }

        // The loader covers the page, so scroll input fast-forwards it
        // instead of moving the page underneath.
        const speedUp = () => {
          if (fast || !startedAt || performance.now() - startedAt < SKIP_GRACE_MS) {
            return;
          }
          fast = true;
          intro.timeScale(SKIP_SPEED);
          outro?.timeScale(SKIP_SPEED);
        };
        const holdScroll = (event: Event) => {
          if (event.cancelable) {
            event.preventDefault();
          }
          // Lenis listens on window too, so stop it at the same node.
          event.stopImmediatePropagation();
          speedUp();
        };
        const onKey = (event: KeyboardEvent) => {
          if (scrollKeys.has(event.key)) {
            holdScroll(event);
          }
        };
        const capture = { capture: true, passive: false } as const;
        window.addEventListener("wheel", holdScroll, capture);
        window.addEventListener("touchmove", holdScroll, capture);
        window.addEventListener("keydown", onKey, capture);

        function detach() {
          window.removeEventListener("wheel", holdScroll, capture);
          window.removeEventListener("touchmove", holdScroll, capture);
          window.removeEventListener("keydown", onKey, capture);
        }

        return () => {
          disposed = true;
          cancelAnimationFrame(startFrame);
          detach();
          gsap.ticker.remove(tick);
          cut?.kill();
          outro?.kill();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const fade = gsap.to(root, {
          autoAlpha: 0,
          duration: 0.3,
          delay: 0.1,
          paused: true,
          onStart: releaseIntro,
          onComplete: () => {
            gsap.set(root, { display: "none" });
          },
        });
        void document.fonts.ready.then(() => fade.play());
        return () => {
          fade.kill();
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="intro-loader fixed inset-0 overflow-hidden bg-background text-foreground"
      style={{ zIndex: "var(--z-dialog)" }}
    >
      <div className="absolute top-1/2 left-1/2 h-0 w-0">
        <div className="intro-frame absolute top-0 left-0 overflow-hidden bg-foreground opacity-0">
          {shots.map((shot) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={shot.key}
              src={shot.src}
              alt=""
              decoding="async"
              className="intro-shot absolute inset-0 h-full w-full object-cover"
            />
          ))}
        </div>
        <div className="intro-mark absolute">
          {quadrants.map((quadrant, index) => (
            <span
              key={index}
              className="intro-arc absolute h-1/2 w-1/2 overflow-hidden"
              style={{
                left: quadrant.x < 0 ? 0 : "50%",
                top: quadrant.y < 0 ? 0 : "50%",
              }}
            >
              <svg
                viewBox={`0 0 ${MARK_W} ${MARK_H}`}
                className="absolute h-[200%] w-[200%]"
                style={{
                  left: quadrant.x < 0 ? 0 : "-100%",
                  top: quadrant.y < 0 ? 0 : "-100%",
                }}
              >
                <path d={verboMarkRing} fill="currentColor" />
              </svg>
            </span>
          ))}
          <svg viewBox={`0 0 ${MARK_W} ${MARK_H}`} className="intro-pupil absolute inset-0 h-full w-full">
            <path d={verboMarkPupil} fill="currentColor" />
          </svg>
        </div>
      </div>
      <p className="intro-count type-body absolute right-5 bottom-[3vh] tabular-nums md:right-12">00</p>
    </div>
  );
}
