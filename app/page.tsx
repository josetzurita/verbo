import { BeliefSection } from "@/components/belief-section";
import { CoordinateCursor } from "@/components/coordinate-cursor";
import { HeroIntro } from "@/components/hero-intro";
import { ResponsiveImage } from "@/components/responsive-image";
import { Reveal } from "@/components/reveal";
import { cases } from "@/lib/home-content";

export default function HomePage() {
  return (
    <>
      <CoordinateCursor />
      <section id="top" className="flex min-h-[100dvh] flex-col">
        <HeroIntro />
      </section>

      <BeliefSection />

      <section
        id="work"
        className="theme-paper relative z-[var(--z-raised)] scroll-mt-24 px-5 pb-32 md:px-12 md:pb-48"
      >
        <h2 className="sr-only">Trabajo</h2>
        <ol className="grid">
          {cases.map((item, index) => (
            <li key={item.index}>
              <Reveal
                delay={index * 0.05}
                className="grid grid-cols-1 items-start gap-8 py-16 md:grid-cols-12 md:gap-x-8 md:py-24"
              >
                <p className="text-2xl font-light tabular-nums tracking-[-0.04em] text-foreground/55 md:col-span-1">
                  {item.index}
                </p>
                <div className="md:col-span-6 md:col-start-2">
                  <p className="text-sm leading-relaxed text-foreground/60">{item.tag}</p>
                  <h3 className="mt-3 text-[clamp(2rem,3.2vw,3.25rem)] font-light leading-[1.1] tracking-[-0.03em]">
                    {item.name}
                  </h3>
                  <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-foreground/75">
                    {item.description}
                  </p>
                  <p className="mt-6 max-w-[42ch] text-sm leading-relaxed text-foreground/60">
                    {item.services}
                  </p>
                </div>
                <div className={item.frame}>
                  <ResponsiveImage
                    src={item.image}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="h-auto w-full"
                    fallback={
                      <p className="bg-surface px-4 py-16 text-sm text-foreground/70">
                        {item.name}
                      </p>
                    }
                  />
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
