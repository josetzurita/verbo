import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/case-study-view";
import { JsonLd } from "@/components/json-ld";
import { getCaseStudies, getCaseStudy } from "@/lib/projects";
import { createMetadata, jsonLdCaseStudy } from "@/lib/seo";
import { projectConfig } from "@/project.config";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

// "Lukatto: strategy and naming case study". The first two practices say what kind of work it was.
function caseTitle(name: string, practices: readonly string[]) {
  const kinds = practices.slice(0, 2).map((practice) => practice.toLowerCase());
  return kinds.length > 0 ? `${name}: ${kinds.join(" and ")} case study` : `${name}, case study`;
}

export async function generateStaticParams() {
  const slugs = (await getCaseStudies()).map((study) => ({ slug: study.slug }));
  // Static export fails on an empty list, so with no case studies emit one 404 page.
  return slugs.length > 0 ? slugs : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) {
    return {};
  }
  return createMetadata(projectConfig, {
    title: caseTitle(study.name, study.practices),
    description: study.summary,
    path: `/work/${study.slug}`,
    ogImage: study.hero.src,
    ogImageAlt: study.hero.alt || `${study.name} - Verbo case study`,
  });
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) {
    notFound();
  }
  return (
    <>
      <JsonLd
        data={jsonLdCaseStudy(projectConfig, {
          name: study.name,
          slug: study.slug,
          summary: study.summary,
          image: study.hero.src,
          practices: study.practices,
          updatedAt: study.updatedAt,
        })}
      />
      <CaseStudyView study={study} />
    </>
  );
}
