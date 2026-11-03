import type { Metadata } from "next";
import { CasePage, caseMetadata, caseStaticParams } from "@/components/pages/case-page";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStaticParams("es");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return caseMetadata(slug, "es");
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <CasePage slug={slug} locale="es" />;
}
