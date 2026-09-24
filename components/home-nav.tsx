"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { services } from "@/lib/home-content";

const linkClass =
  "whitespace-nowrap text-2xl font-light leading-none tracking-[-0.04em] text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground";

export function HomeNav() {
  const [open, setOpen] = useState(false);
  const [showServices, setShowServices] = useState(false);

  useEffect(() => {
    if (!open || !showServices) {
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("menu-services")?.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, showServices]);

  function openMenu(servicesFirst: boolean) {
    setShowServices(servicesFirst);
    setOpen(true);
  }

  return (
    <header
      className="sticky top-0 bg-background"
      style={{ zIndex: "var(--z-sticky)" }}
    >
      <div className="grid h-[4.5rem] grid-cols-[1fr_auto_1fr] items-center px-5 md:px-12">
        <div className="justify-self-start">
          <button
            type="button"
            className={linkClass}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => openMenu(false)}
          >
            Menu
          </button>
        </div>
        <a href="#top" className="justify-self-center" aria-label="Verbo, home">
          <img
            src="/brand/verbo-mark.svg"
            alt=""
            width={37}
            height={35}
            className="h-[35px] w-[37px]"
          />
        </a>
        <nav aria-label="Primary" className="hidden justify-self-end lg:block">
          <ul className="flex flex-nowrap items-center gap-10 xl:gap-16">
            <li>
              <a href="#belief" className={linkClass}>
                Why us?
              </a>
            </li>
            <li>
              <button type="button" className={linkClass} onClick={() => openMenu(true)}>
                Services
              </button>
            </li>
            <li>
              <a href="#discovery" className={linkClass}>
                Contact
              </a>
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
                    href="#belief"
                    className="text-4xl font-light tracking-[-0.04em] md:text-5xl"
                    onClick={() => setOpen(false)}
                  >
                    Why us?
                  </a>
                </li>
                <li>
                  <a
                    href="#work"
                    className="text-4xl font-light tracking-[-0.04em] md:text-5xl"
                    onClick={() => setOpen(false)}
                  >
                    Work
                  </a>
                </li>
                <li>
                  <a
                    href="#discovery"
                    className="text-4xl font-light tracking-[-0.04em] md:text-5xl"
                    onClick={() => setOpen(false)}
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
