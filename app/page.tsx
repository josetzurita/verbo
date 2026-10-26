import type { Metadata } from "next";
import { AboutSection } from "@/components/about-section";
import { BeliefSection } from "@/components/belief-section";
import { CloseSection } from "@/components/close-section";
import { HeroIntro } from "@/components/hero-intro";
import { IntroLoader } from "@/components/intro-loader";
import { WorkStage } from "@/components/work-stage";
import { getWorkCases } from "@/lib/projects";
import { getServices } from "@/lib/services";
import { createMetadata } from "@/lib/seo";
import { projectConfig } from "@/project.config";

export const metadata: Metadata = createMetadata(projectConfig, {
  title: "Strategic branding consultancy in Bogotá",
  description:
    "Verbo is a boutique branding consultancy in Bogotá. Research, strategy, naming, identity and websites for brands built on real understanding.",
  path: "/",
});

export default async function HomePage() {
  const [cases, services] = await Promise.all([getWorkCases(), getServices()]);

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
