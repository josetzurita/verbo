"use client";

import { LocaleProvider } from "../components/locale-provider";
import { ProjectProviders } from "../components/project-providers";
import type { Locale } from "../lib/i18n";
import type { ProjectConfig } from "../lib/project-config";
import type { ReactNode } from "react";
import { RouteOverlay } from "./route-overlay";

export function Providers({
  config,
  locale,
  children,
}: {
  config: ProjectConfig;
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LocaleProvider locale={locale}>
      <ProjectProviders config={config} renderOverlay={(state) => <RouteOverlay {...state} />}>
        {children}
      </ProjectProviders>
    </LocaleProvider>
  );
}
