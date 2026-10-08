import { BeliefSection } from "@/components/belief-section";
import { CoordinateCursor } from "@/components/coordinate-cursor";
import { HeroIntro } from "@/components/hero-intro";
import { WorkStage } from "@/components/work-stage";

export default function HomePage() {
  return (
    <>
      <CoordinateCursor />
      <section id="top" className="flex min-h-[100dvh] flex-col">
        <HeroIntro />
      </section>

      <BeliefSection />

      <WorkStage />
    </>
  );
}
