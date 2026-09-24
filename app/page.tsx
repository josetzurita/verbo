import { ResponsiveImage } from "@/components/responsive-image";
import { Reveal } from "@/components/reveal";
import { belief, cases, discoveryLabel } from "@/lib/home-content";

export default function HomePage() {
  return (
    <>
      <section id="top" className="flex min-h-[calc(100dvh-4.5rem)] flex-col">
        <div className="px-5 pt-8 md:px-12 md:pt-[12vh]">
          <div className="flex flex-col gap-10 xl:flex-row xl:items-end xl:justify-between">
            <Reveal as="h1" y={28}>
              <span className="block whitespace-nowrap text-[clamp(1.7rem,6.66vw,7.184rem)] font-light leading-[0.96] tracking-[-0.04em]">
                Creating to shape
              </span>
              <span className="block whitespace-nowrap text-[clamp(1.7rem,6.66vw,7.184rem)] font-light leading-[0.96] tracking-[-0.04em]">
                the world.
              </span>
            </Reveal>
            <Reveal delay={0.12} y={20} className="shrink-0 xl:pb-3">
              <a
                id="discovery"
                href="mailto:hola@verbobrands.co"
                className="inline-flex max-w-full items-center gap-4 border-b border-foreground py-5 text-[clamp(0.95rem,3.4vw,1.5rem)] font-light leading-none tracking-[-0.04em] whitespace-nowrap text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground active:translate-y-px"
              >
                {discoveryLabel}
                <span aria-hidden="true" className="block h-px w-5 bg-foreground" />
              </a>
            </Reveal>
          </div>
        </div>
        <Reveal as="div" delay={0.18} y={24} className="mt-auto px-[2.78vw] pb-[3vh]">
          <img
            src="/brand/verbo-wordmark.svg"
            alt="Verbo"
            width={1632}
            height={405}
            className="mx-auto block h-auto w-auto max-h-[34dvh] max-w-full"
          />
        </Reveal>
      </section>

      <section
        id="belief"
        className="scroll-mt-24 px-5 py-32 md:px-12 md:py-48"
      >
        <Reveal className="max-w-[34rem]">
          <p className="text-[0.6875rem] uppercase tracking-[0.18em] text-foreground/70">
            {belief.eyebrow}
          </p>
          <h2 className="mt-8 text-[clamp(2rem,4vw,3.25rem)] font-light leading-[1.15] tracking-[-0.03em]">
            {belief.headline}
          </h2>
          <div className="mt-10 grid gap-6 text-base leading-relaxed text-foreground/75">
            <p>{belief.paragraphs[0]}</p>
            <p className="text-foreground">{belief.paragraphs[1]}</p>
            <p>{belief.paragraphs[2]}</p>
            <p className="text-foreground">{belief.paragraphs[3]}</p>
          </div>
        </Reveal>
      </section>

      <section id="work" className="scroll-mt-24 px-5 pb-32 md:px-12 md:pb-48">
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
