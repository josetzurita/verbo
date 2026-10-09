import { AboutSection } from "@/components/about-section";
import { BeliefSection } from "@/components/belief-section";
import { CloseSection } from "@/components/close-section";
import { HeroIntro } from "@/components/hero-intro";
import { WorkStage } from "@/components/work-stage";

export default function HomePage() {
  return (
    <>
      <div className="relative z-[var(--z-raised)] bg-background">
        <section id="top" className="flex min-h-[100dvh] flex-col">
          <HeroIntro />
        </section>

        <BeliefSection />

        <WorkStage />

        <AboutSection />
      </div>
      <CloseSection />
    </>
  );
}
