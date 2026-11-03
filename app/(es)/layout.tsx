import type { Metadata, Viewport } from "next";
import { RootDocument } from "@/components/root-document";
import { createMetadata } from "@/lib/seo";
import { siteViewport } from "@/lib/viewport";
import { projectConfig } from "@/project.config";

export const metadata: Metadata = createMetadata(projectConfig, {}, "es");
export const viewport: Viewport = siteViewport;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="es">{children}</RootDocument>;
}
