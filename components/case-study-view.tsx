import type { CaseImage, CaseStudy } from "@/lib/case-study";
import { cn } from "@/lib/utils";
import { CaseMore } from "./case-more";
import { CaseMotion } from "./case-motion";
import { CloseSection } from "./close-section";
import { ResponsiveImage } from "./responsive-image";
import { UnderlineLink } from "./underline-link";

const CARD_SPANS = ["md:col-span-5", "md:col-span-4", "md:col-span-3"] as const;

const label = "text-sm font-normal leading-relaxed tracking-[-0.02em] text-foreground/60";
const body = "text-[18px] font-light leading-[1.25] tracking-[-0.04em]";
const sectionTitle = "text-[clamp(2.5rem,4.2vw,4.75rem)] font-light leading-[0.95] tracking-[-0.04em]";
const gutter = "px-5 md:px-12";
const section = "pt-24 md:pt-40";

function Frame({
  image,
  sizes,
  className,
  priority,
  cover,
}: {
  image: CaseImage;
  sizes: string;
  className?: string;
  priority?: boolean;
  cover?: boolean;
}) {
  return (
    <div
      data-case-frame=""
      className={cn(cover ? "absolute inset-0" : "relative", "overflow-hidden bg-surface", className)}
    >
      <ResponsiveImage
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover will-change-transform"
      />
    </div>
  );
}

function MaskedLine({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span aria-hidden="true" className="block whitespace-nowrap">
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.22em] align-bottom">
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
        <UnderlineLink href={study.siteHref} className="mt-3" entrance="mount" delay={0.9} cursor="mark">
          {study.siteLabel}
        </UnderlineLink>
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
  const [trioA, trioB, trioC] = study.gallery.trio;
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
                className="text-[clamp(2.25rem,11.6vw,15rem)] font-light leading-[0.92] tracking-[-0.055em]"
              >
                <MaskedLine text={study.title[0]} />
                <MaskedLine text={study.title[1]} />
              </h1>
              <div className="mt-14 md:mt-20">
                <HeroMeta study={study} />
              </div>
            </header>

            <figure data-case-hero="" className="relative mt-14 h-[78svh] overflow-hidden bg-surface md:mt-20 md:h-auto md:aspect-[16/9]">
              <ResponsiveImage
                src={study.hero.src}
                alt={study.hero.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover will-change-transform"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-foreground/35" />
              <p
                aria-hidden="true"
                data-case-wordmark=""
                className="absolute inset-0 flex items-center justify-center text-background"
              >
                <span className="w-[min(18.75rem,78vw)] text-center text-[clamp(4rem,14vw,5.75rem)] font-light leading-[0.85] tracking-[-0.06em]">
                  {study.wordmark}
                </span>
              </p>
            </figure>

            <section aria-labelledby="case-statement" className={cn(gutter, section, "grid gap-16 md:grid-cols-12 md:gap-5")}>
              <div className="md:col-span-5">
                <h2
                  id="case-statement"
                  data-case-reveal=""
                  className="max-w-[16ch] text-[clamp(2rem,3.4vw,3.75rem)] font-light leading-[1] tracking-[-0.04em] md:sticky md:top-28"
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
              <Frame image={study.gallery.wide} sizes="100vw" className="aspect-[16/9]" />
              <div className="grid gap-5 md:grid-cols-[1.25fr_0.8fr_1.25fr]">
                <Frame image={trioA} sizes="(min-width: 768px) 38vw, 100vw" className="aspect-[4/5] md:aspect-auto md:h-[40vw]" />
                <Frame image={trioB} sizes="(min-width: 768px) 25vw, 100vw" className="aspect-[3/4] md:aspect-auto md:h-[40vw]" />
                <Frame image={trioC} sizes="(min-width: 768px) 38vw, 100vw" className="aspect-[4/5] md:aspect-auto md:h-[40vw]" />
              </div>
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
              <ul className="mt-5 grid gap-5 md:grid-cols-12">
                {study.layers.cards.map((card, index) => (
                    <li key={card.title} className={cn("relative flex min-h-[34rem] flex-col justify-end overflow-hidden bg-surface p-3 md:h-[44vw] md:max-h-[52rem] md:p-4", CARD_SPANS[index])}>
                      <Frame image={card.image} sizes="(min-width: 768px) 40vw, 100vw" cover />
                      <div data-case-reveal="" className="relative bg-surface p-5 md:p-6">
                        <p className="text-sm font-normal leading-relaxed tracking-[-0.02em]">{card.label}</p>
                        <h3 className="mt-1 text-[clamp(1.75rem,2.6vw,2.75rem)] font-light leading-none tracking-[-0.04em]">{card.title}</h3>
                        <p className="mt-4 max-w-[30ch] text-base font-light leading-[1.25] tracking-[-0.03em]">{card.body}</p>
                      </div>
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
                    className="grid gap-x-5 gap-y-1 overflow-hidden border-t border-foreground/15 py-5 text-[clamp(1.9rem,3.6vw,4.25rem)] font-light leading-[1.02] tracking-[-0.045em] md:grid-cols-2 md:py-7"
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
