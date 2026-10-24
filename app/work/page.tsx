import type { Metadata } from "next";
import { WorkIndex } from "@/components/work-index";
import { getWorkCases } from "@/lib/projects";
import { getServices } from "@/lib/services";
import { createMetadata } from "@/lib/seo";
import { projectConfig } from "@/project.config";

export const metadata: Metadata = createMetadata(projectConfig, {
  title: "Work",
  description: "Selected branding projects by Verbo, filterable by service.",
  path: "/work",
});

export default async function WorkPage() {
  const [cases, services] = await Promise.all([getWorkCases(), getServices()]);
  return <WorkIndex cases={cases} services={services} />;
}
