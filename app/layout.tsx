import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { HomeNav } from "../components/home-nav";
import { MainContent } from "../components/main-content";
import { SkipLink } from "../components/skip-link";
import { createMetadata, jsonLdWebSite } from "../lib/seo";
import { htmlLang, htmlThemeDataset } from "../lib/project-config";
import { projectConfig } from "../project.config";
import { Providers } from "./providers";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  weight: "300",
  display: "swap",
  variable: "--font-figtree",
});

export const metadata: Metadata = createMetadata(projectConfig);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={htmlLang(projectConfig)}
      data-theme={htmlThemeDataset(projectConfig)}
      data-radius={projectConfig.theme.radius}
      className={figtree.variable}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdWebSite(projectConfig)),
          }}
        />
        <Providers config={projectConfig}>
          <SkipLink />
          <HomeNav />
          <MainContent>{children}</MainContent>
        </Providers>
      </body>
    </html>
  );
}
