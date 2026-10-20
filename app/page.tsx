import { AboutSection } from "@/components/about-section";
import { BeliefSection } from "@/components/belief-section";
import { CloseSection } from "@/components/close-section";
import { HeroIntro } from "@/components/hero-intro";
import { IntroLoader } from "@/components/intro-loader";
import { WorkStage } from "@/components/work-stage";
import { getWorkCases } from "@/lib/projects";

export default async function HomePage() {
  const cases = await getWorkCases();

  return (
    <>
      <IntroLoader cases={cases} />
      <div className="relative z-[var(--z-raised)] bg-background">
        <section id="top" className="flex min-h-[100dvh] flex-col">
          <HeroIntro />
        </section>

        <BeliefSection />

        <WorkStage cases={cases} />

        <AboutSection />
      </div>
      <CloseSection />
    </>
  );
}
