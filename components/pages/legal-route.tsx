import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import type { Locale } from "@/lib/i18n";
import { getLegalDocument } from "@/lib/legal";
import { createMetadata } from "@/lib/seo";
import { projectConfig } from "@/project.config";

export function legalMetadata(slug: "privacy" | "terms", locale: Locale): Metadata {
  const document = getLegalDocument(slug, locale);
  return createMetadata(
    projectConfig,
    { title: document.title, description: document.description, path: `/${slug}` },
    locale,
  );
}

export function LegalRoute({ slug, locale }: { slug: "privacy" | "terms"; locale: Locale }) {
  return <LegalPage document={getLegalDocument(slug, locale)} />;
}
