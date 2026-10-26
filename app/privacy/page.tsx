import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { privacyPolicy } from "@/lib/legal-content";
import { createMetadata } from "@/lib/seo";
import { projectConfig } from "@/project.config";

export const metadata: Metadata = createMetadata(projectConfig, {
  title: privacyPolicy.title,
  description: privacyPolicy.description,
  path: "/privacy",
});

export default function Page() {
  return <LegalPage document={privacyPolicy} />;
}
