import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { CoordinateCursor } from "../components/coordinate-cursor";
import { HomeNav } from "../components/home-nav";
import { introSkipScript } from "../components/intro-gate";
import { MainContent } from "../components/main-content";
import { SkipLink } from "../components/skip-link";
import { createMetadata, jsonLdWebSite } from "../lib/seo";
import { getServices } from "../lib/services";
import { htmlLang, htmlThemeDataset } from "../lib/project-config";
import { projectConfig } from "../project.config";
import { Providers } from "./providers";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-figtree",
});

export const metadata: Metadata = createMetadata(projectConfig);

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const services = await getServices();

  return (
    <html
      lang={htmlLang(projectConfig)}
      data-theme={htmlThemeDataset(projectConfig)}
      data-radius={projectConfig.theme.radius}
      className={figtree.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introSkipScript }} />
        <noscript>
          <style>{".intro-loader{display:none}"}</style>
        </noscript>
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdWebSite(projectConfig)),
          }}
        />
        <Providers config={projectConfig}>
          <SkipLink />
          <CoordinateCursor />
          <HomeNav services={services} />
          <MainContent>{children}</MainContent>
        </Providers>
      </body>
    </html>
  );
}
