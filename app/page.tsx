import { AboutSection } from "@/components/about-section";
import { BeliefSection } from "@/components/belief-section";
import { CloseSection } from "@/components/close-section";
import { HeroIntro } from "@/components/hero-intro";
import { IntroLoader } from "@/components/intro-loader";
import { WorkStage } from "@/components/work-stage";
import { getWorkCases } from "@/lib/projects";
import { getServices } from "@/lib/services";

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
