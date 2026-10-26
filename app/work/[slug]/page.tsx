import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/case-study-view";
import { getCaseStudies, getCaseStudy } from "@/lib/projects";
import { createMetadata } from "@/lib/seo";
import { projectConfig } from "@/project.config";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

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
    title: `${study.name}, case study`,
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
  return <CaseStudyView study={study} />;
}
