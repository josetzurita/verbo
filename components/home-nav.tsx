"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { services } from "@/lib/home-content";
import { gsap, registerGsap, ScrollTrigger, useGSAP } from "./gsap";
import { NavMark } from "./nav-mark";
import { useRouteTransition } from "./use-route-transition";
import { isHomeHeroHref, requestHomeHero } from "./home-scroll";

const linkClass =
  "cursor-pointer whitespace-nowrap text-2xl font-light leading-none tracking-[-0.04em] text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground";

function NavLoopLabel({ children }: { children: string }) {
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
        <span className="block px-[0.08em] py-[0.28em]">{children}</span>
        <span aria-hidden="true" className="absolute inset-x-0 top-full block px-[0.08em] py-[0.28em]">
          {children}
        </span>
      </span>
    </span>
  );
}

export function HomeNav() {
  const headerRef = useRef<HTMLElement>(null);
  const openRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const pathname = usePathname();
  const transition = useRouteTransition();
  const onHome = pathname === "/";
  const compactNav = /^\/work\/[^/]+$/.test(pathname);

  function hashHref(hash: string) {
    return onHome ? hash : `/${hash}`;
  }

  function navigateHome(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (onHome || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    setOpen(false);
    if (isHomeHeroHref(href)) {
      requestHomeHero();
    }
    transition.navigate(href);
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
        let workActive = false;
        const coversHeader = (node: HTMLElement | null) => {
          if (!node) {
            return false;
          }
          const rect = node.getBoundingClientRect();
          return rect.top <= 8 && rect.bottom > 48;
        };
        const closeOn = () => {
          const reveal = document.getElementById("close-reveal");
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
          if ((workActive || closeOn()) && work?.dataset.returning !== "true") {
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
            if (openRef.current || self.scroll() < 48) {
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

        let paper: ScrollTrigger | null = null;
        const stageQuery = window.matchMedia(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        );
        const mountPaper = () => {
          paper?.kill();
          if (!work) {
            paper = null;
            workActive = false;
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
            onUpdate: (self) => {
              workActive = self.isActive;
              syncPaper();
            },
          });
          workActive = paper.isActive;
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

  useEffect(() => {
    if (!open || !showServices) {
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("menu-services")?.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, showServices]);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) {
      return;
    }
    if (compactNav) {
      header.dataset.surface = "paper";
      return;
    }
    delete header.dataset.surface;
  }, [compactNav]);

  function openMenu(servicesFirst: boolean) {
    setShowServices(servicesFirst);
    setOpen(true);
  }

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 bg-transparent"
      style={{ zIndex: "var(--z-sticky)" }}
    >
      <div
        className={`grid grid-cols-[1fr_auto_1fr] items-center px-5 md:px-12 ${compactNav ? "h-20" : "h-[8rem]"}`}
      >
        <div className="justify-self-start">
          <span className="inline-block overflow-hidden">
            <button
              type="button"
              className={`nav-enter ${linkClass}`}
              data-coordinate-mark=""
              aria-label="Menu"
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={() => openMenu(false)}
            >
              <NavLoopLabel>Menu</NavLoopLabel>
            </button>
          </span>
        </div>
        <a href={onHome ? "#top" : "/"} onClick={(event) => navigateHome(event, "/")} className="nav-enter justify-self-center" aria-label="Verbo, home" data-coordinate-mark="">
          <NavMark />
        </a>
        <nav aria-label="Primary" className="hidden justify-self-end lg:block">
          <ul className="flex flex-nowrap items-center gap-10 xl:gap-16">
            <li>
              <span className="inline-block overflow-hidden">
                <a href={hashHref("#belief")} onClick={(event) => navigateHome(event, "/#belief")} aria-label="Why us?" data-coordinate-mark="" className={`nav-enter ${linkClass}`}>
                  <NavLoopLabel>Why us?</NavLoopLabel>
                </a>
              </span>
            </li>
            <li>
              <span className="inline-block overflow-hidden">
                <button type="button" aria-label="Services" data-coordinate-mark="" className={`nav-enter ${linkClass}`} onClick={() => openMenu(true)}>
                  <NavLoopLabel>Services</NavLoopLabel>
                </button>
              </span>
            </li>
            <li>
              <span className="inline-block overflow-hidden">
                <a href={hashHref("#discovery")} onClick={(event) => navigateHome(event, "/#discovery")} aria-label="Contact" data-coordinate-mark="" className={`nav-enter ${linkClass}`}>
                  <NavLoopLabel>Contact</NavLoopLabel>
                </a>
              </span>
            </li>
          </ul>
        </nav>
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0 bg-background"
            style={{ zIndex: "var(--z-overlay)" }}
          />
          <Dialog.Content
            data-lenis-prevent=""
            aria-describedby={undefined}
            className="fixed inset-0 overflow-y-auto bg-background px-5 py-8 text-foreground md:px-12"
            style={{ zIndex: "var(--z-dialog)" }}
          >
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-2xl font-light tracking-[-0.04em]">
                Menu
              </Dialog.Title>
              <button
                type="button"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-16 grid gap-16 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] md:gap-24">
              <ul className="grid content-start gap-6">
                <li>
                  <a
                    href={hashHref("#belief")}
                    className="text-4xl font-light tracking-[-0.04em] md:text-5xl"
                    onClick={(event) => {
                      setOpen(false);
                      navigateHome(event, "/#belief");
                    }}
                  >
                    Why us?
                  </a>
                </li>
                <li>
                  <a
                    href={hashHref("#work")}
                    className="text-4xl font-light tracking-[-0.04em] md:text-5xl"
                    onClick={(event) => {
                      setOpen(false);
                      navigateHome(event, "/#work");
                    }}
                  >
                    Work
                  </a>
                </li>
                <li>
                  <a
                    href={hashHref("#discovery")}
                    className="text-4xl font-light tracking-[-0.04em] md:text-5xl"
                    onClick={(event) => {
                      setOpen(false);
                      navigateHome(event, "/#discovery");
                    }}
                  >
                    Contact
                  </a>
                </li>
              </ul>
              <div id="menu-services">
                <h2 className="text-4xl font-light tracking-[-0.04em] md:text-5xl">
                  Services
                </h2>
                <ol className="mt-8 grid gap-8">
                  {services.map((service) => (
                    <li key={service.name} className="max-w-[46ch]">
                      <p className="text-xl font-light">{service.name}</p>
                      <p className="mt-2 text-base leading-relaxed text-foreground/75">
                        {service.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
