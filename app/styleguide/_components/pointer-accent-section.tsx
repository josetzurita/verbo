"use client";

import { Button } from "@/components/button";
import { PointerAccent } from "@/components/pointer-accent";
import { ResponsiveImage } from "@/components/responsive-image";
import type { ProjectConfig } from "@/lib/project-config";
import { StyleguideSection } from "./styleguide-section";

export function PointerAccentSection({ config }: { config: ProjectConfig }) {
  const pointer = config.pointerAccent;

  return (
    <StyleguideSection
      description="Optional kinetic accent. The operating-system cursor stays visible. Slow travel lags as a disc. Faster travel stretches along the path, then settles. Touch, coarse pointers, and reduced motion never render it. Site-wide enablement stays off until the project opts in. This field is a specimen only."
      id="pointer-accent"
      title="Pointer Accent"
    >
      <div data-testid="pointer-accent-styleguide">
        <PointerAccent
          blendMode={pointer.blendMode}
          color={pointer.color}
          ease={pointer.ease}
          enabled
          hoverGrow
          hoverScaleMax={1.5}
          lag={pointer.lag}
          maxStretch={pointer.maxStretch}
          opacity={pointer.opacity}
          shape={pointer.shape}
          size={pointer.size}
          stretch={pointer.stretch}
          zIndex={pointer.zIndex}
        />
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="type-label text-foreground/55">Site-wide</dt>
            <dd className="mt-1 text-sm">{pointer.enabled ? "enabled" : "disabled"}</dd>
          </div>
          <div>
            <dt className="type-label text-foreground/55">Size</dt>
            <dd className="mt-1 type-mono text-sm">{pointer.size}</dd>
          </div>
          <div>
            <dt className="type-label text-foreground/55">Color</dt>
            <dd className="mt-1 type-mono text-sm">{pointer.color}</dd>
          </div>
          <div>
            <dt className="type-label text-foreground/55">Lag</dt>
            <dd className="mt-1 type-mono text-sm">{pointer.lag}</dd>
          </div>
          <div>
            <dt className="type-label text-foreground/55">Ease</dt>
            <dd className="mt-1 type-mono text-sm">{pointer.ease}</dd>
          </div>
          <div>
            <dt className="type-label text-foreground/55">Stretch</dt>
            <dd className="mt-1 type-mono text-sm">
              {pointer.stretch} / {pointer.maxStretch}
            </dd>
          </div>
          <div>
            <dt className="type-label text-foreground/55">Blend</dt>
            <dd className="mt-1 type-mono text-sm">{pointer.blendMode}</dd>
          </div>
          <div>
            <dt className="type-label text-foreground/55">Specimen</dt>
            <dd className="mt-1 text-sm">forced on for this section</dd>
          </div>
        </dl>
        <div className="mt-8 space-y-0 border border-border">
          <div className="bg-background px-6 py-16 md:px-10">
            <p
              className="max-w-[12ch] text-5xl font-medium tracking-tight md:text-6xl"
              data-pointer-accent-text=""
            >
              Move through this field.
            </p>
            <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-foreground/75">
              Flick across the headline, then rest. Hover the line below to invert
              it. Native selection and clicks still belong to the page.
            </p>
            <p
              className="mt-4 max-w-[36ch] text-lg font-medium"
              data-pointer-accent-text=""
            >
              Marked text inverts under the disc.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a className="text-sm underline underline-offset-4" href="#pointer-accent">
                In-page link
              </a>
              <Button type="button">Primary action</Button>
            </div>
          </div>
          <div className="grid gap-0 md:grid-cols-2">
            <div className="bg-background px-6 py-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
                Light surface
              </p>
              <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-foreground/70">
                Select this sentence. The accent must not steal clicks or text
                selection.
              </p>
            </div>
            <div className="bg-foreground px-6 py-12 text-background">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-background/55">
                Dark surface
              </p>
              <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-background/75">
                Difference blend against off-black. Color and blend stay a project
                choice.
              </p>
              <a
                className="mt-4 inline-block text-sm underline underline-offset-4"
                href="#components"
              >
                Jump to components
              </a>
            </div>
          </div>
          <figure className="border-t border-border">
            <ResponsiveImage
              alt="Site mark used to test the pointer accent over an image"
              className="w-full"
              height={720}
              sizes="100vw"
              src="/favicon.svg"
              width={1280}
            />
            <figcaption className="px-6 py-3 text-sm text-foreground/65">
              Image coverage. The follower sits above pixels without blocking them.
            </figcaption>
          </figure>
          <div className="border-t border-border px-6 py-10">
            <p className="max-w-[62ch] text-sm leading-relaxed text-foreground/75">
              Enable prefers-reduced-motion in the operating system. The accent
              node should disappear. Restore motion to see it after the next
              pointer move.
            </p>
          </div>
        </div>
      </div>
    </StyleguideSection>
  );
}
