"use client";

import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import { MediaFrame } from "@/components/media-frame";
import { ResponsiveImage } from "@/components/responsive-image";
import { SkipLink } from "@/components/skip-link";
import { TransitionLink } from "@/components/transition-link";
import { StyleguideSection } from "./styleguide-section";

export function ComponentSection() {
  return (
    <StyleguideSection
      description="Live starter components only. No extra catalogue of unused primitives."
      id="components"
      title="Components"
    >
      <div className="space-y-12">
        <div>
          <h3 className="type-h4">Button</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button>Primary action</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>

        <div>
          <h3 className="type-h4">Dialog</h3>
          <div className="mt-4">
            <Dialog>
              <DialogTrigger className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface px-4 text-sm font-medium outline-none hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-ring">
                Open dialog
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Specimen dialog</DialogTitle>
                  <DialogDescription>
                    Focus stays trapped. Escape and the close control dismiss it.
                    Overlay regions should keep data-lenis-prevent when they scroll.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div>
          <h3 className="type-h4">Navigation links</h3>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <TransitionLink className="underline underline-offset-4" href="/">
              Home
            </TransitionLink>
            <TransitionLink className="underline underline-offset-4" href="/work">
              Work
            </TransitionLink>
          </div>
        </div>

        <div>
          <h3 className="type-h4">Skip link</h3>
          <p className="mt-2 max-w-[60ch] text-sm text-foreground/75">
            The production skip link sits at the document top and appears on focus.
            This copy is a visible specimen of the same component.
          </p>
          <div className="relative mt-4 h-14 border border-border bg-surface">
            <SkipLink className="not-sr-only static m-3 inline-flex" />
          </div>
        </div>

        <div>
          <h3 className="type-h4">Responsive image</h3>
          <div className="mt-4 max-w-xs">
            <ResponsiveImage
              alt="Site mark used as a media specimen"
              height={64}
              sizes="64px"
              src="/favicon.svg"
              width={64}
            />
          </div>
        </div>

        <div>
          <h3 className="type-h4">Media frame</h3>
          <MediaFrame className="mt-4 max-w-md border border-border bg-surface-muted">
            <ResponsiveImage
              alt="Wide site mark inside a media frame"
              className="w-full"
              height={180}
              sizes="(min-width: 768px) 28rem, 100vw"
              src="/favicon.svg"
              width={1280}
            />
          </MediaFrame>
        </div>
      </div>
    </StyleguideSection>
  );
}
