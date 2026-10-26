"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { close, discoveryLabel, menu, type WorkCase } from "@/lib/home-content";
import { gsap, registerGsap, ScrollTrigger, useGSAP } from "./gsap";
import { imageBorders } from "./image-borders";
import { NavMark } from "./nav-mark";
import { ResponsiveImage } from "./responsive-image";
import { TransitionLink } from "./transition-link";
import { useRouteTransition } from "./use-route-transition";
import { useSmoothScroll } from "./use-smooth-scroll";
import { anchorTop, isHomeHeroHref, requestHomeHero } from "./home-scroll";

const linkClass =
  "cursor-pointer whitespace-nowrap text-2xl font-light leading-none tracking-[-0.04em] text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground";

// Phones: the Menu and Close boxes share one look and one spot.
const phoneBoxClass =
  "max-md:inline-flex max-md:min-h-11 max-md:items-center max-md:bg-foreground max-md:px-4 max-md:text-xl max-md:text-background";

const focusClass =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground";

const smallLinkClass = `inline-flex min-h-11 items-center whitespace-nowrap text-sm font-normal leading-none ${focusClass}`;

const headerTargets = new Set(["/work", "#belief", "#services", "#contact"]);

function NavLoopLabel({ children, padClassName = "px-[0.08em] py-[0.28em]" }: { children: string; padClassName?: string }) {
  const clipRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const clip = clipRef.current;
      const track = trackRef.current;
      const trigger = clip?.closest("a, button");
      if (!clip || !track || !trigger) {
        return;
      }

      registerGsap();
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
        const loop = gsap.timeline({ paused: true });
        loop.to(track, { yPercent: -100, duration: 0.42, ease: "power3.out" });

        const onEnter = () => {
          loop.play();
        };
        const onLeave = () => {
          loop.reverse();
        };

        trigger.addEventListener("pointerenter", onEnter);
        trigger.addEventListener("pointerleave", onLeave);
        return () => {
          trigger.removeEventListener("pointerenter", onEnter);
          trigger.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: clipRef },
  );

  return (
    <span ref={clipRef} className="inline-block overflow-hidden align-bottom">
      <span ref={trackRef} className="relative block will-change-transform">
        <span className={`block ${padClassName}`}>{children}</span>
        <span aria-hidden="true" className={`absolute inset-x-0 top-full block ${padClassName}`}>
          {children}
        </span>
      </span>
    </span>
  );
}

export function HomeNav({ cases }: { cases: readonly WorkCase[] }) {
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const enterRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);
  const exitRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);
  const closingRef = useRef(false);
  const openRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });
  // The panel mounts through Radix's portal, so the effects that need it key off the node itself.
  const [panelNode, setPanelNode] = useState<HTMLDivElement | null>(null);
  const bindPanel = useCallback((node: HTMLDivElement | null) => {
    panelRef.current = node;
    setPanelNode(node);
  }, []);
  // trailingSlash is on, so /work/slug arrives as /work/slug/. Compare without it.
  const pathname = usePathname().replace(/(.)\/+$/, "$1");
  const transition = useRouteTransition();
  const { scrollTo } = useSmoothScroll();
  const onHome = pathname === "/";
  const compactNav = /^\/work\/[^/]+$/.test(pathname);
  const barHeight = compactNav ? "h-20" : "h-[5.25rem] md:h-[8rem]";
  const featured = cases.filter((item) => item.href).slice(0, 3);

  function hashHref(hash: string) {
    if (hash.startsWith("/")) {
      return hash;
    }
    return onHome ? hash : `/${hash}`;
  }

  // Every way out of the menu (Close, Escape, a link) comes through here, so each one gets the exit:
  // the content leaves upward, then the curtain lifts. A second request while it plays is ignored.
  function requestClose() {
    if (!openRef.current || closingRef.current) {
      return;
    }
    const panel = panelRef.current;
    if (!panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(false);
      return;
    }
    closingRef.current = true;
    enterRef.current?.kill();
    panel.style.pointerEvents = "none";
    const links = Array.from(panel.querySelectorAll(".menu-link-rise")).reverse();
    exitRef.current = gsap
      .timeline({
        onComplete: () => {
          closingRef.current = false;
          setOpen(false);
        },
      })
      .to(links, { yPercent: -105, duration: 0.35, ease: "power3.in", stagger: 0.03 }, 0)
      .to(panel.querySelectorAll(".menu-fade-item"), { autoAlpha: 0, duration: 0.25, ease: "power2.in" }, 0)
      .to(panel, { yPercent: -100, duration: 0.5, ease: "power4.inOut" }, 0.15);
  }

  function modified(event: MouseEvent<HTMLAnchorElement>) {
    return event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  }

  // Section links. Behind the open menu the page jumps, so the lifting curtain uncovers the section;
  // from the bar it travels there.
  function go(event: MouseEvent<HTMLAnchorElement>, target: string) {
    if (modified(event)) {
      return;
    }
    event.preventDefault();
    const fromMenu = openRef.current;
    if (target.startsWith("/")) {
      if (pathname !== target) {
        transition.navigate(target);
      }
      requestClose();
      return;
    }
    if (!onHome) {
      transition.navigate(`/${target}`);
      requestClose();
      return;
    }
    const node = document.querySelector<HTMLElement>(target);
    if (node) {
      scrollTo(anchorTop(node), fromMenu ? { immediate: true, force: true } : { force: true });
    }
    requestClose();
  }

  function navigateHome(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (onHome || modified(event)) {
      return;
    }
    event.preventDefault();
    if (isHomeHeroHref(href)) {
      requestHomeHero();
    }
    transition.navigate(href);
    requestClose();
  }

  // Phone carousel arrows: one card per press.
  function step(direction: 1 | -1) {
    const track = trackRef.current;
    const card = track?.querySelector("li");
    if (!track || !card) {
      return;
    }
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: reduce ? "auto" : "smooth" });
  }

  openRef.current = open;
  registerGsap();

  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header) {
        return;
      }

      const mm = gsap.matchMedia();

      const bind = (reduce: boolean) => {
        let hidden = false;
        const apply = (next: boolean) => {
          if (next === hidden) {
            return;
          }
          hidden = next;
          gsap.to(header, {
            yPercent: next ? -100 : 0,
            autoAlpha: next ? 0 : 1,
            duration: reduce ? 0 : next ? 0.4 : 0.55,
            ease: next ? "power3.in" : "power3.out",
            overwrite: "auto",
          });
        };

        const work = document.getElementById("work");
        let paper: ScrollTrigger | null = null;
        // Read the position, not paper.isActive: ScrollTrigger counts progress 0 as inactive, and
        // arriving on /#work lands exactly on the start line, where Work already covers the header.
        const workActive = () => {
          if (!paper) {
            return false;
          }
          const scroll = paper.scroll();
          return scroll >= paper.start && scroll < paper.end;
        };
        const coversHeader = (node: HTMLElement | null) => {
          if (!node) {
            return false;
          }
          const rect = node.getBoundingClientRect();
          return rect.top <= 8 && rect.bottom > 48;
        };
        const closeOn = () => {
          // On phones the reveal spacer is hidden and the footer sits in the page flow, so measure the footer.
          const spacer = document.getElementById("close-reveal");
          const reveal = spacer && spacer.offsetHeight > 0 ? spacer : document.getElementById("close");
          if (!reveal) {
            return false;
          }
          const rect = reveal.getBoundingClientRect();
          const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
          return visible / window.innerHeight >= 0.9;
        };
        const syncPaper = () => {
          if (compactNav) {
            if (coversHeader(document.getElementById("case-more"))) {
              delete header.dataset.surface;
              return;
            }
            header.dataset.surface = "paper";
            return;
          }
          if ((workActive() || closeOn()) && work?.dataset.returning !== "true") {
            header.dataset.surface = "paper";
            return;
          }
          delete header.dataset.surface;
        };

        const trigger = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            syncPaper();
            // On phones the Menu button stays put so it is always reachable.
            if (openRef.current || self.scroll() < 48 || window.matchMedia("(max-width: 767px)").matches) {
              apply(false);
              return;
            }
            if (self.direction === 1) {
              apply(true);
            } else if (self.direction === -1) {
              apply(false);
            }
          },
        });

        const stageQuery = window.matchMedia(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        );
        const mountPaper = () => {
          paper?.kill();
          if (!work) {
            paper = null;
            syncPaper();
            return;
          }
          const handoff = work.querySelector<HTMLElement>(".services-handoff-reading");
          const followReading = !stageQuery.matches && Boolean(handoff);
          paper = ScrollTrigger.create({
            trigger: work,
            start: "top top",
            endTrigger: followReading ? handoff ?? undefined : work,
            end: followReading ? "top top" : "bottom top",
            onUpdate: syncPaper,
          });
          syncPaper();
        };
        mountPaper();
        syncPaper();
        stageQuery.addEventListener("change", mountPaper);

        return () => {
          trigger.kill();
          paper?.kill();
          stageQuery.removeEventListener("change", mountPaper);
          delete header.dataset.surface;
        };
      };

      mm.add("(prefers-reduced-motion: reduce)", () => bind(true));
      mm.add("(prefers-reduced-motion: no-preference)", () => bind(false));

      return () => {
        mm.revert();
      };
    },
    { scope: headerRef, dependencies: [pathname], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".nav-enter", {
          yPercent: -120,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
        });
      });
      return () => {
        mm.revert();
      };
    },
    { scope: headerRef },
  );

  // Menu entrance: the curtain drops over the page, then Close, the links, the button, the projects and
  // the bottom row come in after it. Reduced motion opens straight into the end state.
  useGSAP(
    () => {
      const panel = panelNode;
      if (!panel) {
        return;
      }
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = (selector: string) => panel.querySelectorAll(selector);
        enterRef.current = gsap
          .timeline()
          .from(panel, { yPercent: -100, duration: 0.65, ease: "power4.inOut" }, 0)
          .from(q(".menu-close-rise"), { yPercent: 100, duration: 0.6, ease: "power4.out" }, 0.3)
          .from(q(".menu-mark"), { autoAlpha: 0, duration: 0.5, ease: "power2.out" }, 0.3)
          .from(q(".menu-link-rise"), { yPercent: 105, duration: 0.9, ease: "power4.out", stagger: 0.07 }, 0.32)
          .from(q(".menu-cta"), { y: 16, autoAlpha: 0, duration: 0.6, ease: "power3.out" }, 0.55)
          .from(q(".menu-work-head, .menu-card-item"), { y: 24, autoAlpha: 0, duration: 0.7, ease: "power4.out", stagger: 0.08 }, 0.6)
          .from(q(".menu-thumb img"), { scale: 1.12, duration: 1, ease: "power3.out", stagger: 0.08 }, 0.6)
          .from(q(".menu-foot"), { autoAlpha: 0, duration: 0.5, ease: "power2.out" }, 0.75);
      });
      return () => {
        enterRef.current = null;
        exitRef.current?.kill();
        exitRef.current = null;
        closingRef.current = false;
        mm.revert();
      };
    },
    { dependencies: [panelNode], revertOnUpdate: true },
  );

  // Phone carousel: the arrows switch off at either end.
  useEffect(() => {
    const track = trackRef.current;
    if (!panelNode || !track) {
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = track.scrollWidth - track.clientWidth;
      setEdges({ start: track.scrollLeft <= 2, end: track.scrollLeft >= max - 2 });
    };
    const schedule = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };
    update();
    track.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      track.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [panelNode]);

  // Only ever set paper here. This runs after the scroll binding above, which owns the home surface
  // (and clears it on revert), so clearing here would undo the paper it just set over Work.
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (header && compactNav) {
      header.dataset.surface = "paper";
    }
  }, [compactNav]);

  return (
    <header
      ref={headerRef}
      // Phones: only the Menu box, floating below the top edge. A fixed element touching the edge makes
      // iOS 26 Safari paint solid bars instead of letting the page run under them.
      className="pointer-events-none fixed inset-x-0 top-0 bg-transparent max-md:right-auto! max-md:top-[calc(env(safe-area-inset-top)+1rem)]! md:pointer-events-auto"
      style={{ zIndex: "var(--z-sticky)" }}
    >
      <div
        className={`home-nav-bar grid grid-cols-[1fr_auto_1fr] items-center px-5 max-md:h-auto! md:px-12 ${barHeight}`}
      >
        <div className="justify-self-start">
          <span className="inline-block overflow-hidden">
            <button
              ref={menuButtonRef}
              type="button"
              className={`nav-enter ${linkClass} ${phoneBoxClass} pointer-events-auto md:pointer-events-auto`}
              data-coordinate-mark=""
              aria-label={menu.title}
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <NavLoopLabel>{menu.title}</NavLoopLabel>
            </button>
          </span>
        </div>
        <a href={onHome ? "#top" : "/"} onClick={(event) => navigateHome(event, "/")} className="nav-enter justify-self-center max-md:hidden" aria-label="Verbo, home" data-coordinate-mark="">
          <NavMark />
        </a>
        <nav aria-label="Primary" className="hidden justify-self-end lg:block">
          <ul className="flex flex-nowrap items-center gap-10 xl:gap-16">
            {menu.links
              .filter((link) => headerTargets.has(link.target))
              .map((link) => (
                <li key={link.target}>
                  <span className="inline-block overflow-hidden">
                    <a
                      href={hashHref(link.target)}
                      onClick={(event) => go(event, link.target)}
                      aria-label={link.target === "/work" ? menu.headerWorkLabel : link.label}
                      data-coordinate-mark=""
                      className={`nav-enter ${linkClass}`}
                    >
                      <NavLoopLabel>{link.target === "/work" ? menu.headerWorkLabel : link.label}</NavLoopLabel>
                    </a>
                  </span>
                </li>
              ))}
          </ul>
        </nav>
      </div>

      <Dialog.Root open={open} onOpenChange={(next) => (next ? setOpen(true) : requestClose())}>
        <Dialog.Portal>
          {/* Transparent: it only holds Radix's scroll lock. The panel itself is the curtain. */}
          <Dialog.Overlay className="fixed inset-0" style={{ zIndex: "var(--z-overlay)" }} />
          <Dialog.Content
            ref={bindPanel}
            data-lenis-prevent=""
            aria-describedby={undefined}
            // Menu is a plain button, not a Radix trigger, so hand focus back to it by hand.
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              menuButtonRef.current?.focus({ preventScroll: true });
            }}
            // One screen tall at every size; the scroll is only a safety net for a landscape phone.
            className="fixed inset-x-0 top-0 flex h-[100dvh] flex-col overflow-y-auto overscroll-contain bg-background text-foreground will-change-transform"
            style={{ zIndex: "var(--z-dialog)" }}
          >
            <Dialog.Title className="sr-only">{menu.title}</Dialog.Title>

            {/* The header's own bar, so opening the menu only swaps Menu for Close. */}
            <div
              className={`home-nav-bar sticky top-0 z-[1] grid shrink-0 grid-cols-[1fr_auto_1fr] items-center bg-background px-5 max-md:h-auto! max-md:pt-[calc(env(safe-area-inset-top)+1rem)] max-md:pb-2 md:px-12 ${barHeight}`}
            >
              <div className="justify-self-start">
                <span className="inline-block overflow-hidden">
                  <Dialog.Close className={`menu-close-rise menu-fade-item ${linkClass} ${phoneBoxClass}`} data-coordinate-mark="">
                    <NavLoopLabel>{menu.closeLabel}</NavLoopLabel>
                  </Dialog.Close>
                </span>
              </div>
              <a
                href={onHome ? "#top" : "/"}
                onClick={(event) => (onHome ? go(event, "#top") : navigateHome(event, "/"))}
                className={`menu-mark menu-fade-item justify-self-center max-md:hidden ${focusClass}`}
                aria-label="Verbo, home"
                data-coordinate-mark=""
              >
                <NavMark />
              </a>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] content-between gap-6 px-5 pt-[min(2rem,3svh)] pb-2 md:gap-12 md:px-12 md:pt-8 md:pb-8 lg:grid-cols-12 lg:content-center lg:items-center lg:gap-x-5 lg:py-10">
              <div className="lg:col-span-7">
                <nav aria-label={menu.title}>
                  <ul className="grid">
                    {menu.links.map((link) => (
                      <li key={link.target}>
                        <a
                          href={hashHref(link.target)}
                          onClick={(event) => go(event, link.target)}
                          data-coordinate-mark=""
                          className={`menu-link inline-block text-[clamp(1.75rem,min(12vw,5.5svh),4rem)] font-light leading-none tracking-[-0.045em] md:text-[min(8vw,5.5rem,7.5svh)] lg:text-[clamp(3rem,min(5.4vw,9.5svh),7.5rem)] ${focusClass}`}
                        >
                          <span className="block overflow-hidden">
                            <span className="menu-link-rise block">
                              <NavLoopLabel padClassName="px-[0.02em] py-[0.11em]">{link.label}</NavLoopLabel>
                            </span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="menu-cta menu-fade-item mt-[min(2rem,3svh)] md:mt-10">
                  <a
                    href={close.emailHref}
                    data-coordinate-mark=""
                    className={`inline-flex min-h-11 items-center md:min-h-12 justify-center whitespace-nowrap bg-foreground px-5 text-[min(4.8vw,1.125rem)] font-light leading-none tracking-[-0.03em] text-background max-md:w-full max-md:px-3 md:text-lg ${focusClass}`}
                  >
                    <NavLoopLabel padClassName="px-0 py-[0.2em]">{discoveryLabel}</NavLoopLabel>
                  </a>
                </div>
              </div>

              <section aria-labelledby="menu-work-label" className="w-full lg:col-span-4 lg:col-start-9 lg:max-w-[36rem] lg:justify-self-end">
                <div className="menu-work-head menu-fade-item flex items-center justify-between gap-3 max-[359px]:[&_*]:text-xs">
                  <h2 id="menu-work-label" className="whitespace-nowrap text-sm font-normal leading-none">
                    {menu.selectedWorkLabel}
                  </h2>
                  <div className="flex items-center gap-3">
                    <TransitionLink
                      href={menu.allProjectsHref}
                      onClick={() => requestClose()}
                      aria-current={pathname === menu.allProjectsHref ? "page" : undefined}
                      data-coordinate-mark=""
                      className={smallLinkClass}
                    >
                      <NavLoopLabel padClassName="px-0 py-[0.2em]">{menu.allProjectsLabel}</NavLoopLabel>
                    </TransitionLink>
                    {featured.length > 1 ? (
                      <div className="flex gap-2 md:hidden">
                        {([
                          [-1, "←", menu.previousLabel, edges.start],
                          [1, "→", menu.nextLabel, edges.end],
                        ] as const).map(([direction, glyph, label, atEdge]) => (
                          <button
                            key={label}
                            type="button"
                            aria-label={label}
                            aria-controls="menu-work-track"
                            disabled={atEdge}
                            onClick={() => step(direction)}
                            className={`inline-flex size-11 items-center justify-center border border-foreground text-xl font-light leading-none transition-opacity duration-150 active:scale-95 disabled:opacity-40 ${focusClass}`}
                          >
                            <span aria-hidden="true">{glyph}</span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                {/* Phones: a swipeable row that snaps card by card. Tablet: three across. Desktop: a stacked list. */}
                <ul
                  ref={trackRef}
                  id="menu-work-track"
                  className="menu-track -mx-5 mt-3 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 md:mx-0 md:grid md:snap-none md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-1 lg:gap-4"
                >
                    {featured.map((item) => (
                      <li key={item.name} className="menu-card-item menu-fade-item w-[86%] shrink-0 snap-start md:w-auto">
                        <TransitionLink
                          href={item.href ?? menu.allProjectsHref}
                          onClick={() => requestClose()}
                          data-coordinate-project=""
                          className={`menu-card grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-4 md:grid-cols-1 md:items-start md:gap-3 lg:grid-cols-[clamp(6.5rem,8vw,10rem)_minmax(0,1fr)_auto] lg:items-center lg:gap-5 ${focusClass}`}
                        >
                          <span
                            className="menu-thumb relative block aspect-[4/3] overflow-hidden border-2 bg-surface"
                            style={{ borderColor: imageBorders[cases.indexOf(item)] ?? "var(--foreground)" }}
                          >
                            <ResponsiveImage
                              src={item.image}
                              alt=""
                              width={item.width}
                              height={item.height}
                              sizes="(min-width: 1024px) 160px, (min-width: 768px) 30vw, 88px"
                              className="absolute inset-0 max-w-none"
                              style={{ height: "100%", width: "100%", objectFit: "cover", objectPosition: item.focus }}
                            />
                          </span>
                          <span className="grid min-w-0 gap-1.5">
                            <span className="text-xs font-normal leading-snug text-copy md:text-sm">{item.tag}</span>
                            <span className="text-base font-light leading-[1.1] tracking-[-0.03em] min-[360px]:text-lg md:text-xl lg:text-2xl">{item.name}</span>
                          </span>
                          <span aria-hidden="true" className="menu-card-arrow hidden text-xl font-light leading-none lg:block">
                            →
                          </span>
                        </TransitionLink>
                      </li>
                    ))}
                </ul>
              </section>
            </div>

            <div className="menu-foot menu-fade-item flex shrink-0 flex-wrap items-center justify-between gap-x-8 gap-y-1 px-5 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-sm font-light leading-none tracking-[-0.02em] md:px-12 md:pb-6">
              <p className="whitespace-nowrap max-md:hidden">
                {close.studio} - {close.practice}
              </p>
              <div className="flex gap-x-6">
                <a href={close.emailHref} className={`inline-flex min-h-11 items-center ${focusClass}`}>
                  {close.email}
                </a>
                <a
                  href={close.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={close.whatsappLabel}
                  className={`inline-flex min-h-11 items-center ${focusClass}`}
                >
                  {menu.whatsappShort}
                </a>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
