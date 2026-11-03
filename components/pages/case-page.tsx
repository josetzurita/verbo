import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/case-study-view";
import { JsonLd } from "@/components/json-ld";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { getCaseStudies, getCaseStudy } from "@/lib/projects";
import { createMetadata, jsonLdCaseStudy } from "@/lib/seo";
import { projectConfig } from "@/project.config";

export async function caseStaticParams(locale: Locale) {
  const slugs = (await getCaseStudies(locale)).map((study) => ({ slug: study.slug }));
  // Static export fails on an empty list, so with no case studies emit one 404 page.
  return slugs.length > 0 ? slugs : [{ slug: "_" }];
}

export async function caseMetadata(slug: string, locale: Locale): Promise<Metadata> {
  const study = await getCaseStudy(slug, locale);
  if (!study) {
    return {};
  }
  return createMetadata(
    projectConfig,
    {
      title: getContent(locale).ui.caseTitle(study.name, study.practices),
      description: study.summary,
      path: `/work/${study.slug}`,
      ogImage: study.hero.src,
      ogImageAlt: study.hero.alt || `${study.name} - Verbo case study`,
    },
    locale,
  );
}

export async function CasePage({ slug, locale }: { slug: string; locale: Locale }) {
  const study = await getCaseStudy(slug, locale);
  if (!study) {
    notFound();
  }
  return (
    <>
      <JsonLd
        data={jsonLdCaseStudy(
          projectConfig,
          {
            name: study.name,
            slug: study.slug,
            summary: study.summary,
            image: study.hero.src,
            practices: study.practices,
            updatedAt: study.updatedAt,
          },
          locale,
        )}
      />
      <CaseStudyView study={study} locale={locale} />
    </>
  );
}
