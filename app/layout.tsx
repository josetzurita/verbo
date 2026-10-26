import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { AnalyticsConsent } from "../components/analytics-consent";
import { CoordinateCursor } from "../components/coordinate-cursor";
import { EdgeTint } from "../components/edge-tint";
import { HomeNav } from "../components/home-nav";
import { introSkipScript } from "../components/intro-gate";
import { MainContent } from "../components/main-content";
import { SkipLink } from "../components/skip-link";
import { WhatsappFab } from "../components/whatsapp-fab";
import { createMetadata, jsonLdWebSite } from "../lib/seo";
import { getWorkCases } from "../lib/projects";
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

// Edge to edge on phones: the page runs under the status bar and the browser toolbar. Safari 26 ignores
// theme-color (EdgeTint steers its tint); Android Chrome and older iOS still read it. #39170d is the field color.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#39170d",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cases = await getWorkCases();

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
          <HomeNav cases={cases} />
          <EdgeTint />
          <MainContent>{children}</MainContent>
          <WhatsappFab />
          <AnalyticsConsent />
        </Providers>
      </body>
    </html>
  );
}
