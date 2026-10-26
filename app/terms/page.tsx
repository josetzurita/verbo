import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { termsOfUse } from "@/lib/legal-content";
import { createMetadata } from "@/lib/seo";
import { projectConfig } from "@/project.config";

export const metadata: Metadata = createMetadata(projectConfig, {
  title: termsOfUse.title,
  description: termsOfUse.description,
  path: "/terms",
});

export default function Page() {
  return <LegalPage document={termsOfUse} />;
}
