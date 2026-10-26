import type { CSSProperties } from "react";
import type { CaseImage, CaseStudy } from "@/lib/case-study";
import { cn } from "@/lib/utils";
import { CaseMore } from "./case-more";
import { CaseMotion } from "./case-motion";
import { CasePhoto } from "./case-photo";
import { CloseSection } from "./close-section";
import { UnderlineLink } from "./underline-link";

const FULL_WIDTH = "(min-width: 768px) calc(100vw - 6rem), calc(100vw - 2.5rem)";

const label = "text-sm font-normal leading-relaxed tracking-[-0.02em] text-foreground/60";
const body = "text-[18px] font-light leading-[1.25] tracking-[-0.04em] text-copy";
const sectionTitle = "text-[clamp(2.5rem,4.2vw,4.75rem)] font-light leading-[0.95] tracking-[-0.04em]";
const gutter = "px-5 md:px-12";
const section = "pt-24 md:pt-40";

function Frame({
  image,
  sizes,
  className,
  priority,
  cover,
  natural,
  eager,
}: {
  image: CaseImage;
  sizes: string;
  className?: string;
  priority?: boolean;
  cover?: boolean;
  /** Frame takes the image's own shape, so nothing is cropped. */
  natural?: boolean;
  /** Fetch right after the hero instead of waiting for the scroll to come near. */
  eager?: boolean;
}) {
  return (
    <div
      data-case-frame=""
      className={cn(cover ? "absolute inset-0" : "relative", "overflow-hidden bg-surface", className)}
      style={natural ? { aspectRatio: `${image.width} / ${image.height}` } : undefined}
    >
      <CasePhoto
        src={image.src}
        alt={image.alt}
        lqip={image.lqip}
        fill
        sizes={sizes}
        priority={priority}
        loading={eager ? "eager" : undefined}
        fetchPriority={eager ? "low" : undefined}
        className="object-cover will-change-transform"
        style={{ objectPosition: image.focus }}
      />
    </div>
  );
}

function MaskedLine({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span aria-hidden="true" className="block whitespace-nowrap">
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.18em] -mb-[0.18em] align-bottom">
          <span data-case-word="" className="inline-block will-change-transform">
            {word}
            {index < words.length - 1 ? "\u00a0" : ""}
          </span>
        </span>
      ))}
    </span>
  );
}

function Practices({ study, meta }: { study: CaseStudy; meta: Record<string, string> }) {
  return (
    <>
      <p {...meta} className={cn(label, "col-start-1 md:col-span-2 md:col-start-7")}>
        What we did
      </p>
      <ul {...meta} className={cn(body, "md:col-span-4")}>
        {study.practices.map((practice) => (
          <li key={practice}>{practice}</li>
        ))}
      </ul>
    </>
  );
}

function HeroMeta({ study }: { study: CaseStudy }) {
  const meta = { "data-case-hero-meta": "" };
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-5 gap-y-10 md:grid-cols-12">
      <div {...meta} className="col-span-2 md:col-span-5">
        <p className={cn(body, "max-w-[34ch]")}>{study.summary}</p>
        {study.siteHref ? (
          <UnderlineLink href={study.siteHref} className="mt-3" entrance="mount" delay={0.9} cursor="mark">
            {study.siteLabel}
          </UnderlineLink>
        ) : null}
      </div>
      <Practices study={study} meta={meta} />
    </div>
  );
}

function ClosingMeta({ study }: { study: CaseStudy }) {
  const meta = { "data-case-reveal": "" };
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-5 gap-y-10 md:grid-cols-12">
      <p {...meta} className={cn(label, "md:col-span-2")}>
        Case study
      </p>
      <p {...meta} className="text-[24px] font-light leading-none tracking-[-0.04em] md:col-span-4">
        {study.name}
      </p>
      <Practices study={study} meta={meta} />
    </div>
  );
}

export function CaseStudyView({ study }: { study: CaseStudy }) {
  const [visibleA, visibleB, visibleC, visibleD] = study.visible.items;
  const [pairNarrow, pairWide] = study.pair;

  return (
    <>
      <div className="relative z-[var(--z-raised)]">
      <div className="theme-paper">
        <CaseMotion>
          <article>
            <header className={cn(gutter, "pt-24")}>
              <h1
                aria-label={study.title.join(" ")}
                className="case-title font-light leading-[0.95] tracking-[-0.055em]"
                style={{ "--title-chars": Math.max(...study.title.map((line) => line.length)) } as CSSProperties}
              >
                <MaskedLine text={study.title[0]} />
                <MaskedLine text={study.title[1]} />
              </h1>
              <div className="mt-14 md:mt-20">
                <HeroMeta study={study} />
              </div>
            </header>

            <figure data-case-hero="" className="relative mt-14 h-[78svh] overflow-hidden bg-surface md:mt-20 md:h-auto md:aspect-[16/9]">
              <CasePhoto
                src={study.hero.src}
                alt={study.hero.alt}
                lqip={study.hero.lqip}
                fill
                priority
                        sizes="100vw"
                className="object-cover will-change-transform"
                style={{ objectPosition: study.hero.focus }}
              />
            </figure>

            <section aria-labelledby="case-statement" className={cn(gutter, section, "grid gap-16 md:grid-cols-12 md:gap-5")}>
              <div className="md:col-span-5">
                <h2
                  id="case-statement"
                  data-case-reveal=""
                  className="text-[1.75rem] font-light md:max-w-[16ch] md:text-[clamp(2rem,3.4vw,3.75rem)] leading-[1] tracking-[-0.04em] md:sticky md:top-28"
                >
                  {study.statement}
                </h2>
              </div>
              <div className="grid gap-16 md:col-span-6 md:col-start-7">
                <div data-case-reveal="" className="bg-surface p-6 md:p-10">
                  <h3 className="text-sm font-normal leading-relaxed tracking-[-0.02em]">{study.impactTitle}</h3>
                  <ul className="mt-6">
                    {study.impact.map((item) => (
                      <li
                        key={item}
                        className="border-t border-foreground/15 py-4 text-[clamp(1.25rem,1.7vw,1.75rem)] font-light leading-[1.1] tracking-[-0.04em]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div data-case-reveal="" className="grid max-w-[52ch] gap-5">
                  {study.essay.map((paragraph) => (
                    <p key={paragraph} className={body}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            <section aria-label="Gallery" className={cn(gutter, section, "grid gap-5")}>
              <Frame image={study.gallery.wide} sizes={FULL_WIDTH} className="aspect-[16/9]" eager />
              {study.gallery.trio.map((image) => (
                <Frame key={image.src} image={image} sizes={FULL_WIDTH} natural />
              ))}
              <div className="relative">
                <Frame image={study.gallery.plate} sizes="100vw" className="aspect-[4/5] md:aspect-[21/9]" />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-foreground/25" />
                <p className="absolute top-5 left-5 max-w-[14ch] text-[clamp(1.5rem,2.6vw,3rem)] font-light leading-[1] tracking-[-0.04em] text-background md:top-10 md:left-10">
                  {study.gallery.plateNote[0]}
                </p>
                <p className="absolute right-5 bottom-5 max-w-[14ch] text-right text-[clamp(1.5rem,2.6vw,3rem)] font-light leading-[1] tracking-[-0.04em] text-background md:right-10 md:bottom-10">
                  {study.gallery.plateNote[1]}
                </p>
              </div>
            </section>

            <section aria-labelledby="case-layers" className={cn(gutter, section)}>
              <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-5">
                <Frame image={study.layers.image} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-square md:col-span-4" />
                <div data-case-reveal="" className="md:col-span-5 md:col-start-8">
                  <h2 id="case-layers" className={sectionTitle}>
                    {study.layers.title}
                  </h2>
                  <div className="mt-6 grid max-w-[52ch] gap-[1.25em]">
                    {study.layers.body.map((paragraph) => (
                      <p key={paragraph} className={body}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <ul className="mt-16 grid gap-16 md:mt-24 md:gap-24">
                {study.layers.cards.map((card) => (
                  <li key={card.title} className="grid gap-6 md:grid-cols-12 md:items-start md:gap-5">
                    <div data-case-reveal="" className="max-md:order-last md:sticky md:top-28 md:col-span-4">
                      <p className="text-sm font-normal leading-relaxed tracking-[-0.02em]">{card.label}</p>
                      <h3 className="mt-1 text-[clamp(1.75rem,2.6vw,2.75rem)] font-light leading-none tracking-[-0.04em]">{card.title}</h3>
                      <p className="mt-4 max-w-[30ch] text-base font-light leading-[1.25] tracking-[-0.03em] text-copy">{card.body}</p>
                    </div>
                    <Frame image={card.image} sizes="(min-width: 768px) 66vw, calc(100vw - 2.5rem)" natural className="md:col-span-8" />
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="case-shift" className={cn(gutter, section)}>
              <h2 id="case-shift" data-case-reveal="" className="text-[24px] font-light leading-none tracking-[-0.04em]">
                {study.shift.title}
              </h2>
              <ul className="mt-10 border-b border-foreground/15 md:mt-16">
                {study.shift.pairs.map((pair) => (
                  <li
                    key={pair.from}
                    data-case-shift=""
                    className="grid gap-x-5 gap-y-1 overflow-hidden border-t border-foreground/15 py-5 text-[1.5rem] font-light leading-[1.02] tracking-[-0.045em] md:grid-cols-2 md:py-7 md:text-[clamp(1.9rem,3.6vw,4.25rem)]"
                  >
                    <span data-case-from="" className="block text-foreground/35 will-change-transform">
                      {pair.from}
                    </span>{" "}
                    <span data-case-to="" className="block">
                      {pair.to}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-label="On the road" className={cn(gutter, section, "grid gap-5 md:grid-cols-[1fr_2fr]")}>
              <Frame image={pairNarrow} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[3/4]" />
              <Frame image={pairWide} sizes="(min-width: 768px) 66vw, 100vw" className="aspect-[4/3] md:aspect-auto md:h-full" />
            </section>

            {study.quote.body ? (
              <section aria-labelledby="case-quote" className={cn(gutter, section, "text-center")}>
                <figure data-case-reveal="" className="mx-auto max-w-[60rem]">
                  <h2 id="case-quote" className="text-[24px] font-light leading-none tracking-[-0.04em]">
                    {study.quote.title}
                  </h2>
                  <blockquote className="mx-auto mt-10 max-w-[34ch] text-[clamp(1.75rem,3vw,3.5rem)] font-light leading-[1.05] tracking-[-0.045em]">
                    <p>{study.quote.body}</p>
                  </blockquote>
                  <figcaption className={cn(label, "mt-8")}>Founder, {study.name}</figcaption>
                </figure>
              </section>
            ) : null}

            <section aria-labelledby="case-visible" className={cn(gutter, section, "grid gap-y-16 md:grid-cols-12 md:gap-x-5 md:gap-y-24")}>
              <figure className="md:col-span-5">
                <Frame image={visibleA.image} sizes="(min-width: 768px) 42vw, 100vw" className="aspect-[4/3]" />
                <figcaption className={cn(label, "mt-3")}>{visibleA.caption}</figcaption>
              </figure>
              <figure className="md:col-span-3 md:col-start-9 md:mt-48">
                <Frame image={visibleB.image} sizes="(min-width: 768px) 25vw, 100vw" className="aspect-square" />
                <figcaption className={cn(label, "mt-3")}>{visibleB.caption}</figcaption>
              </figure>
              <figure className="md:col-span-4 md:col-start-4 md:-mt-32">
                <Frame image={visibleC.image} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/3]" />
                <figcaption className={cn(label, "mt-3")}>{visibleC.caption}</figcaption>
              </figure>
              <figure className="md:col-span-3 md:col-start-1">
                <Frame image={visibleD.image} sizes="(min-width: 768px) 25vw, 100vw" className="aspect-square" />
                <figcaption className={cn(label, "mt-3")}>{visibleD.caption}</figcaption>
              </figure>
              <div data-case-reveal="" className="self-end md:col-span-4 md:col-start-8">
                <h2 id="case-visible" className={sectionTitle}>
                  {study.visible.title.split("\n").map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
                <div className="mt-6 grid max-w-[42ch] gap-5">
                  {study.visible.body.map((paragraph) => (
                    <p key={paragraph} className={body}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            <section aria-labelledby="case-places" className={cn(gutter, section, "grid gap-5 md:grid-cols-2")}>
              <Frame image={study.places.image} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/5] md:aspect-auto md:h-full" />
              <div className="bg-surface p-6 md:p-10">
                <h2 id="case-places" className="text-sm font-normal leading-relaxed tracking-[-0.02em] text-foreground/60">
                  {study.places.title}
                </h2>
                <ul className="mt-8">
                  {study.places.items.map((place) => (
                    <li key={place.name} data-case-reveal="" className="flex items-center gap-5 border-t border-foreground/15 py-4">
                      <Frame image={place.image} sizes="96px" className="size-16 shrink-0 md:size-20" />
                      <p className="min-w-0 text-[clamp(1.75rem,3vw,3.25rem)] font-light leading-none tracking-[-0.045em]">
                        {place.name}
                      </p>
                      <p className="ml-auto hidden shrink-0 text-sm font-normal text-foreground/60 sm:block">{place.region}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section aria-label="Case details" className={cn(gutter, section, "pb-24 md:pb-40")}>
              <ClosingMeta study={study} />
            </section>
          </article>
        </CaseMotion>
      </div>
      <CaseMore items={study.more} />
      </div>
      <CloseSection />
    </>
  );
}
