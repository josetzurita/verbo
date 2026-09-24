import { notFound } from "next/navigation";
import { ButtonSection } from "./_components/button-section";
import { ColorSection } from "./_components/color-section";
import { ComponentSection } from "./_components/component-section";
import { ContainerSection } from "./_components/container-section";
import { FormSection } from "./_components/form-section";
import { MotionSection } from "./_components/motion-section";
import { PointerAccentSection } from "./_components/pointer-accent-section";
import { RadiusSection } from "./_components/radius-section";
import { SpacingSection } from "./_components/spacing-section";
import { StyleguideSection } from "./_components/styleguide-section";
import { TypographySection } from "./_components/typography-section";
import { STYLEGUIDE_SECTIONS } from "./_data/styleguide-data";
import { createMetadata } from "@/lib/seo";
import { isStyleguideEnabled } from "@/lib/styleguide-access";
import { projectConfig } from "@/project.config";

export const dynamic = "force-dynamic";

export const metadata = createMetadata(projectConfig, {
  title: "Styleguide",
  path: "/styleguide",
  noIndex: true,
});

export default function StyleguidePage() {
  if (
    !isStyleguideEnabled({
      NODE_ENV: process.env.NODE_ENV,
      ENABLE_STYLEGUIDE: process.env.ENABLE_STYLEGUIDE,
    })
  ) {
    notFound();
  }

  const pointer = projectConfig.pointerAccent;

  return (
    <div className="content-full min-w-0 overflow-x-clip py-16">
      <StyleguideSection
        description="Internal specimen for this client project. Layout stays shared. Tokens, type, motion, and pointer settings change per project."
        id="overview"
        title={projectConfig.site.name}
      >
        <p className="max-w-[65ch] text-foreground/75">{projectConfig.site.description}</p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="border-t border-border pt-3">
            <dt className="type-label text-foreground/55">Theme</dt>
            <dd className="mt-1 text-sm">{projectConfig.theme.mode}</dd>
          </div>
          <div className="border-t border-border pt-3">
            <dt className="type-label text-foreground/55">Motion profile</dt>
            <dd className="mt-1 text-sm">{projectConfig.motion.profile}</dd>
          </div>
          <div className="border-t border-border pt-3">
            <dt className="type-label text-foreground/55">Smooth scroll</dt>
            <dd className="mt-1 text-sm">
              {projectConfig.motion.smoothScroll ? "enabled" : "disabled"}
            </dd>
          </div>
          <div className="border-t border-border pt-3">
            <dt className="type-label text-foreground/55">Pointer Accent</dt>
            <dd className="mt-1 text-sm">{pointer.enabled ? "enabled" : "disabled"}</dd>
          </div>
          <div className="border-t border-border pt-3">
            <dt className="type-label text-foreground/55">Radius policy</dt>
            <dd className="mt-1 text-sm">{projectConfig.theme.radius}</dd>
          </div>
          <div className="border-t border-border pt-3">
            <dt className="type-label text-foreground/55">Page transition</dt>
            <dd className="mt-1 text-sm">{projectConfig.motion.pageTransition}</dd>
          </div>
        </dl>
        <nav aria-label="Styleguide sections" className="mt-10 border-t border-border pt-6">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {STYLEGUIDE_SECTIONS.map((section) => (
              <li key={section.href}>
                <a className="underline-offset-4 hover:underline" href={section.href}>
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </StyleguideSection>

      <TypographySection />
      <ColorSection />
      <ButtonSection />
      <FormSection />
      <ContainerSection />
      <SpacingSection />
      <RadiusSection />
      <MotionSection />
      <PointerAccentSection config={projectConfig} />
      <ComponentSection />
    </div>
  );
}
