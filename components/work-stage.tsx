"use client";

import { useRef } from "react";
import { cases } from "@/lib/home-content";
import { CustomEase, gsap, registerGsap, ScrollTrigger, useGSAP } from "./gsap";
import { ResponsiveImage } from "./responsive-image";
import { HANDOFF_VIEWPORTS, ServicesHandoff } from "./services-handoff";
import { useSmoothScroll, type SmoothScrollToOptions } from "./use-smooth-scroll";

const imageBorders = [
  "var(--trail-blue)",
  "var(--trail-amber)",
  "var(--trail-yellow)",
  "var(--foreground)",
  "color-mix(in srgb, var(--trail-blue) 55%, var(--foreground))",
  "color-mix(in srgb, var(--trail-amber) 50%, var(--foreground))",
] as const;

const STEP_EASE = "power3.out";
const CARD_EASE = "service-card-out";
const CARD_DURATION = 1.2;
const CARD_PEEK = 32;
const CARD_SCALE = 0.97;
const MOVE_DURATION = 1;

function cardSettleEase() {
  registerGsap();
  if (!CustomEase.get(CARD_EASE)) {
    CustomEase.create(CARD_EASE, "0.23,1,0.32,1");
  }
  return CARD_EASE;
}
const FADE_DURATION = 0.8;
const STEP = 0.9;
const GATE = 0.55;

function stepSpans(count: number, viewHeight: number) {
  const span = Math.round(viewHeight * STEP);
  return Array.from({ length: Math.max(0, count - 1) }, () => span);
}

function offsetForIndex(index: number, spans: readonly number[]) {
  let sum = 0;
  for (let cursor = 0; cursor < index; cursor += 1) {
    sum += spans[cursor] ?? 0;
  }
  return sum;
}

function indexAtDistance(distance: number, spans: readonly number[]) {
  let cursor = 0;
  for (let index = 0; index < spans.length; index += 1) {
    const span = spans[index] ?? 0;
    if (distance < cursor + span * GATE) {
      return index;
    }
    cursor += span;
  }
  return spans.length;
}

function titleOpacity(distance: number) {
  if (distance <= 0) {
    return 1;
  }
  if (distance === 1) {
    return 0.28;
  }
  if (distance === 2) {
    return 0.12;
  }
  return 0;
}

export function WorkStage() {
  const rootRef = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();
  const scrollToRef = useRef(scrollTo);
  scrollToRef.current = scrollTo;

  useGSAP(
    () => {
      registerGsap();
      const root = rootRef.current;
      if (!root) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.querySelector<HTMLElement>(".work-track");
        const scene = root.querySelector<HTMLElement>(".work-scene");
        const column = root.querySelector<HTMLElement>(".work-stage-copy");
        const cards = gsap.utils.toArray<HTMLElement>(".work-card", root);
        const hits = gsap.utils.toArray<HTMLElement>(".work-card-hit", root);
        const hitLayer = root.querySelector<HTMLElement>(".work-card-hits");
        const copies = gsap.utils.toArray<HTMLElement>(".work-copy", root);
        const metas = gsap.utils.toArray<HTMLElement>(".work-meta-card", root);
        const projectLayers = gsap.utils.toArray<HTMLElement>(
          ".work-stage-meta, .work-stage-scene, .work-stage-copy",
          root,
        );
        const veil = root.querySelector<HTMLElement>(".services-veil");
        const titleRow = root.querySelector<HTMLElement>(".services-title-row");
        const titleWords = gsap.utils.toArray<HTMLElement>(".services-title-word", root);
        const serviceCards = gsap.utils.toArray<HTMLElement>(".services-handoff-stage .services-card", root);
        const count = cards.length;
        if (!track || !scene || !column || count < 2) {
          return;
        }

        let settled = 0;
        let aligned = -1;
        let armed = true;
        let armTimer = 0;
        let alive = true;
        const progress = { value: 0 };
        let moveTween: gsap.core.Tween | null = null;

        const syncCopyPointer = (line: HTMLElement) => {
          const current = Number(gsap.getProperty(line, "opacity"));
          line.style.pointerEvents = current <= 0.001 ? "none" : "";
        };

        const fadeTitles = (active: number, immediate: boolean) => {
          copies.forEach((line, index) => {
            gsap.to(line, {
              opacity: titleOpacity(Math.abs(index - active)),
              duration: immediate ? 0 : FADE_DURATION,
              ease: STEP_EASE,
              overwrite: "auto",
              onUpdate: () => {
                syncCopyPointer(line);
              },
              onComplete: () => {
                syncCopyPointer(line);
              },
            });
          });
          aligned = active;
        };

        const placeCopies = () => {
          const columnRect = column.getBoundingClientRect();
          const nextY = copies.map((copy, index) => {
            const card = cards[index];
            if (!card) {
              return 0;
            }
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.top + cardRect.height / 2;
            return cardCenter - columnRect.top - copy.offsetHeight / 2;
          });
          copies.forEach((copy, index) => {
            gsap.set(copy, { y: nextY[index] ?? 0 });
          });
        };

        const render = (progress: number, active: number) => {
          const span = scene.clientHeight || window.innerHeight;
          cards.forEach((card, index) => {
            const dist = index - progress;
            const abs = Math.abs(dist);
            gsap.set(card, {
              xPercent: -50,
              yPercent: -50,
              y: dist * span * 0.46,
              rotationX: dist * 42,
              z: abs * -180,
              scale: gsap.utils.clamp(0.72, 1, 1 - abs * 0.12),
              opacity: gsap.utils.clamp(0, 1, 1.05 - abs * 0.3),
              zIndex: Math.round(20 - abs * 4),
              transformOrigin: "50% 50%",
            });
          });
          if (hitLayer) {
            const layerRect = hitLayer.getBoundingClientRect();
            cards.forEach((card, index) => {
              const hit = hits[index];
              if (!hit) {
                return;
              }
              const rect = card.getBoundingClientRect();
              gsap.set(hit, {
                x: rect.left - layerRect.left,
                y: rect.top - layerRect.top,
                width: rect.width,
                height: rect.height,
              });
            });
          }
          placeCopies();
          if (aligned !== active) {
            fadeTitles(active, aligned < 0);
          }
          metas.forEach((meta, index) => {
            const visible = index === active;
            gsap.set(meta, {
              yPercent: -50,
              y: 0,
              opacity: visible ? 1 : 0,
            });
            meta.style.pointerEvents = visible ? "" : "none";
          });
        };

        const syncHeader = (veilOpacity: number, active: boolean) => {
          const header = document.querySelector("header");
          if (!header) {
            return;
          }
          if (veilOpacity > 0.7) {
            root.dataset.returning = "true";
            delete header.dataset.surface;
            return;
          }
          delete root.dataset.returning;
          if (active) {
            header.dataset.surface = "paper";
          }
        };

        const ease = cardSettleEase();
        let cardActive = -2;

        const layoutCards = (nextActive: number, immediate: boolean) => {
          if (!immediate && nextActive === cardActive) {
            return;
          }
          const stop = window.innerHeight * 0.36;
          const below = window.innerHeight + 80;
          serviceCards.forEach((card) => {
            card.style.height = "auto";
          });
          const tallest = Math.max(...serviceCards.map((card) => card.offsetHeight));
          serviceCards.forEach((card) => {
            card.style.height = `${tallest}px`;
          });
          if (titleRow?.parentElement) {
            titleRow.parentElement.style.clipPath = "";
          }
          serviceCards.forEach((card, index) => {
            const behind = nextActive - index;
            const waiting = behind < 0;
            const y = waiting ? below : stop - Math.max(0, behind) * CARD_PEEK;
            const scale = waiting || behind === 0 ? 1 : CARD_SCALE ** behind;
            gsap.set(card, {
              zIndex: index + 2,
              transformOrigin: "50% 0%",
            });
            const pose = { xPercent: -50, yPercent: 0, y, scale, opacity: 1 };
            if (immediate) {
              gsap.set(card, pose);
            } else {
              gsap.to(card, {
                ...pose,
                duration: CARD_DURATION,
                ease,
                overwrite: "auto",
              });
            }
            card.style.pointerEvents = waiting ? "none" : "auto";
          });
          cardActive = nextActive;
        };

        const renderHandoff = (progress: number, active: boolean, immediate = false) => {
          const view = window.innerHeight;
          const lift = gsap.utils.clamp(0, 1, progress / 0.6);
          const fade = gsap.utils.clamp(0, 1, (progress - 0.08) / 0.2);
          gsap.set(projectLayers, {
            y: -view * 1.05 * lift,
            opacity: 1 - fade,
          });
          if (veil) {
            gsap.set(veil, {
              opacity: fade,
              y: (1 - fade) * view,
            });
          }
          titleWords.forEach((word, index) => {
            const start = 0.08 + index * 0.1;
            const local = gsap.utils.clamp(0, 1, (progress - start) / 0.14);
            const eased = local * local * (3 - 2 * local);
            word.style.transform = `translateY(${(1 - eased) * 110}%)`;
          });
          if (titleRow) {
            const pan = gsap.utils.clamp(0, 1, (progress - 0.42) / 0.4);
            const overflow = Math.max(0, titleRow.scrollWidth - window.innerWidth);
            gsap.set(titleRow, { x: -overflow * pan });
          }
          let nextActive = -1;
          serviceCards.forEach((_, index) => {
            const start = 0.32 + index * 0.1;
            if (progress >= start) {
              nextActive = index;
            }
          });
          layoutCards(nextActive, immediate);
          syncHeader(fade, active);
        };

        const arm = () => {
          armed = true;
        };

        const playTo = (index: number) => {
          render(progress.value, index);
          moveTween = gsap.to(progress, {
            value: index,
            duration: MOVE_DURATION,
            ease: STEP_EASE,
            overwrite: "auto",
            onUpdate: () => render(progress.value, settled),
          });
        };

        render(0, 0);
        renderHandoff(0, false, true);

        const trigger = ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: () => {
            const spans = stepSpans(count, window.innerHeight);
            const handoff = Math.round(window.innerHeight * HANDOFF_VIEWPORTS);
            return `+=${offsetForIndex(count - 1, spans) + handoff}`;
          },
          pin: track,
          pinType: "fixed",
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            aligned = -1;
            render(progress.value, settled);
            const spans = stepSpans(count, window.innerHeight);
            const lastOffset = offsetForIndex(count - 1, spans);
            const handoff = Math.round(window.innerHeight * HANDOFF_VIEWPORTS);
            const distance = self.scroll() - self.start;
            renderHandoff(
              gsap.utils.clamp(0, 1, (distance - lastOffset) / Math.max(handoff, 1)),
              self.isActive,
              true,
            );
          },
          onUpdate: (self) => {
            const spans = stepSpans(count, window.innerHeight);
            const lastOffset = offsetForIndex(count - 1, spans);
            const handoff = Math.round(window.innerHeight * HANDOFF_VIEWPORTS);
            const distance = self.scroll() - self.start;
            renderHandoff(
              gsap.utils.clamp(0, 1, (distance - lastOffset) / Math.max(handoff, 1)),
              self.isActive,
            );
            if (settled === count - 1 && distance > lastOffset) {
              return;
            }
            const next = indexAtDistance(distance, spans);
            if (!armed) {
              if (next === settled) {
                arm();
              }
              return;
            }
            if (next === settled) {
              return;
            }
            const step = gsap.utils.clamp(0, count - 1, settled + Math.sign(next - settled));
            if (step === settled) {
              return;
            }
            settled = step;
            playTo(step);
            armed = false;
            window.clearTimeout(armTimer);
            armTimer = window.setTimeout(arm, 700);
            const options: SmoothScrollToOptions = { immediate: true };
            scrollToRef.current(self.start + offsetForIndex(step, spans), options);
          },
        });

        document.fonts.ready
          .then(() => {
            if (!alive) {
              return;
            }
            aligned = -1;
            render(progress.value, settled);
            const spans = stepSpans(count, window.innerHeight);
            const lastOffset = offsetForIndex(count - 1, spans);
            const handoff = Math.round(window.innerHeight * HANDOFF_VIEWPORTS);
            const distance = trigger.scroll() - trigger.start;
            renderHandoff(
              gsap.utils.clamp(0, 1, (distance - lastOffset) / Math.max(handoff, 1)),
              trigger.isActive,
              true,
            );
          })
          .catch(() => undefined);

        return () => {
          alive = false;
          window.clearTimeout(armTimer);
          moveTween?.kill();
          trigger.kill();
          delete root.dataset.returning;
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="work"
      className="theme-paper relative z-[var(--z-raised)] bg-background text-foreground"
    >
      <div className="work-track relative bg-background">
        <div className="work-stage relative h-[100dvh] items-center gap-8 overflow-hidden px-12 pt-[8rem] pb-12">
          <div className="work-stage-meta relative z-[1] h-full min-h-0 min-w-0">
            <h2 className="pointer-events-none absolute top-0 left-0 text-[clamp(2.6rem,4vw,4.75rem)] font-light leading-[0.95] tracking-[-0.04em]">
              Our
              <br />
              selected
              <br />
              projects
            </h2>
            <div aria-hidden="true" className="flex h-full min-h-0 flex-col justify-center">
              <div className="relative min-h-[14rem]">
                {cases.map((item) => (
                  <div key={item.name} data-coordinate-project="" className="work-meta-card absolute inset-x-0 top-1/2">
                    <p className="text-[clamp(3.25rem,6vw,5.75rem)] font-medium leading-none tracking-[-0.04em] tabular-nums">
                      {item.index}
                    </p>
                    <p className="mt-6 max-w-[24ch] text-sm font-normal leading-relaxed">{item.tag}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="work-stage-scene relative z-[1] h-full min-w-0">
            <div aria-hidden="true" className="work-scene absolute inset-0 [perspective:1100px]">
              <ol className="absolute inset-0 [transform-style:preserve-3d]">
                {cases.map((item, index) => (
                  <li key={item.name} className="work-card pointer-events-none absolute top-1/2 left-1/2 w-[min(92%,32rem)] will-change-transform">
                    <div
                      className="h-[34dvh] overflow-hidden border-2 bg-surface"
                      style={{ borderColor: imageBorders[index] ?? "var(--foreground)" }}
                    >
                      <ResponsiveImage
                        src={item.image}
                        alt=""
                        width={item.width}
                        height={item.height}
                        sizes="(min-width: 768px) 40vw, 100vw"
                        className="max-w-none"
                        style={{ height: "100%", width: "100%", objectFit: "cover" }}
                        fallback={
                          <p className="flex h-full items-end px-4 py-6 text-sm text-foreground/70">{item.name}</p>
                        }
                      />
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="work-card-hits pointer-events-none absolute inset-0 z-[2]">
              {cases.map((item) => (
                <div key={item.name} data-coordinate-project="" className="work-card-hit pointer-events-auto absolute top-0 left-0" />
              ))}
            </div>
          </div>

          <div aria-hidden="true" className="work-stage-copy relative z-[1] h-full min-h-0 min-w-0">
            <ol className="absolute inset-0">
              {cases.map((item) => (
                <li key={item.name} data-coordinate-project="" className="work-copy absolute top-0 left-0 w-full">
                  <p className="text-sm font-normal leading-relaxed">{item.tag}</p>
                  <h3 className="mt-3 text-[clamp(2.75rem,3.6vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.04em]">
                    {item.name}
                  </h3>
                  <p className="work-copy-body mt-4 text-base font-normal leading-relaxed">{item.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <ServicesHandoff variant="stage" />
      </div>

      <h2 className="work-reading-title px-5 pt-16 text-[clamp(2.75rem,10vw,4.25rem)] font-light leading-[0.95] tracking-[-0.04em]">
        Our
        <br />
        selected
        <br />
        projects
      </h2>
      <ol className="work-reading grid">
        {cases.map((item, index) => (
          <li key={item.name} data-coordinate-project="" className="grid gap-6 px-5 py-16">
            <p className="text-sm font-normal tabular-nums">{item.index}</p>
            <p className="text-sm font-normal leading-relaxed">{item.tag}</p>
            <h3 className="text-[clamp(2.25rem,8vw,3rem)] font-medium leading-[1.05] tracking-[-0.04em]">{item.name}</h3>
            <div
              className="border-2 bg-surface"
              style={{ borderColor: imageBorders[index] ?? "var(--foreground)" }}
            >
              <ResponsiveImage
                src={item.image}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes="100vw"
                className="h-auto w-full"
                fallback={<p className="px-4 py-16 text-sm">{item.name}</p>}
              />
            </div>
            <p className="text-base font-normal leading-relaxed">{item.description}</p>
            <p className="text-sm font-normal leading-relaxed">{item.services}</p>
          </li>
        ))}
      </ol>
      <ServicesHandoff variant="reading" />
    </section>
  );
}
