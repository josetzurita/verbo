import { Figtree } from "next/font/google";
import { Providers } from "../app/providers";
import { AnalyticsConsent } from "./analytics-consent";
import { CoordinateCursor } from "./coordinate-cursor";
import { EdgeTint } from "./edge-tint";
import { HomeNav } from "./home-nav";
import { introSkipScript } from "./intro-gate";
import { JsonLd } from "./json-ld";
import { localeGateScript } from "./locale-gate";
import { MainContent } from "./main-content";
import { SkipLink } from "./skip-link";
import { WhatsappFab } from "./whatsapp-fab";
import { getContent } from "../lib/content";
import { LOCALE_TAGS, type Locale } from "../lib/i18n";
import { getWorkCases } from "../lib/projects";
import { getServices } from "../lib/services";
import { htmlThemeDataset } from "../lib/project-config";
import { jsonLdSite } from "../lib/seo";
import { projectConfig } from "../project.config";
import "../app/globals.css";

const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-figtree",
});

// One root layout per language (app/(en), app/(es)), so each static page carries its own <html lang>.
export async function RootDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const [cases, services] = await Promise.all([getWorkCases(locale), getServices(locale)]);
  const { skipLink } = getContent(locale).ui;

  return (
    <html
      lang={LOCALE_TAGS[locale].html}
      data-theme={htmlThemeDataset(projectConfig)}
      data-radius={projectConfig.theme.radius}
      className={figtree.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: localeGateScript }} />
        <script dangerouslySetInnerHTML={{ __html: introSkipScript }} />
        <noscript>
          <style>{".intro-loader{display:none}"}</style>
        </noscript>
      </head>
      <body>
        <JsonLd data={jsonLdSite(projectConfig, services.map((service) => service.name), locale)} />
        <Providers config={projectConfig} locale={locale}>
          <SkipLink>{skipLink}</SkipLink>
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
