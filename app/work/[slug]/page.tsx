import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/case-study-view";
import { getCaseStudy, caseStudies } from "@/lib/case-study";
import { createMetadata } from "@/lib/seo";
import { projectConfig } from "@/project.config";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) {
    return {};
  }
  return createMetadata(projectConfig, {
    title: `${study.name}, case study`,
    description: study.summary,
    path: `/work/${study.slug}`,
    ogImage: study.hero.src,
  });
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) {
    notFound();
  }
  return <CaseStudyView study={study} />;
}
