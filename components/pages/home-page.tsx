import type { Metadata } from "next";
import { AboutSection } from "@/components/about-section";
import { BeliefSection } from "@/components/belief-section";
import { CloseSection } from "@/components/close-section";
import { HeroIntro } from "@/components/hero-intro";
import { IntroLoader } from "@/components/intro-loader";
import { WorkStage } from "@/components/work-stage";
import type { Locale } from "@/lib/i18n";
import { getWorkCases } from "@/lib/projects";
import { getServices } from "@/lib/services";
import { createMetadata } from "@/lib/seo";
import { projectConfig } from "@/project.config";

const meta = {
  en: {
    title: "Strategic branding consultancy in Bogotá",
    description:
      "Verbo is a boutique branding consultancy in Bogotá. Research, strategy, naming, identity and websites for brands built on real understanding.",
  },
  // From the translation file, section 1.
  es: {
    // Title and description only show in the browser tab and in search results, not on the page.
    title: "Agencia de branding estratégico en Bogotá",
    description:
      "Agencia y consultora boutique de branding estratégico en Bogotá. Investigación, estrategia, naming, identidad y sitios web para marcas que duran.",
  },
} as const;

export function homeMetadata(locale: Locale): Metadata {
  return createMetadata(projectConfig, { ...meta[locale], path: "/" }, locale);
}

export async function HomePage({ locale }: { locale: Locale }) {
  const [cases, services] = await Promise.all([getWorkCases(locale), getServices(locale)]);

  return (
    <>
      <IntroLoader cases={cases} />
      <div data-edge-source="" className="relative z-[var(--z-raised)] bg-background">
        <section id="top" className="flex min-h-[100dvh] flex-col">
          <HeroIntro />
        </section>

        <BeliefSection />

        <WorkStage cases={cases} services={services} />

        <AboutSection />
      </div>
      <CloseSection />
    </>
  );
}
