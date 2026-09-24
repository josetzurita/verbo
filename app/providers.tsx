"use client";

import { ProjectProviders } from "../components/project-providers";
import type { ProjectConfig } from "../lib/project-config";
import type { ReactNode } from "react";
import { RouteOverlay } from "./route-overlay";

export function Providers({
  config,
  children,
}: {
  config: ProjectConfig;
  children: ReactNode;
}) {
  return (
    <ProjectProviders config={config} renderOverlay={(state) => <RouteOverlay {...state} />}>
      {children}
    </ProjectProviders>
  );
}
