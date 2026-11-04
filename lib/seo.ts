import type { Metadata } from "next";
import { LOCALE_TAGS, localePath, type Locale } from "./i18n";
import type { ProjectConfig } from "./project-config";

export const DEFAULT_OG_IMAGE = { path: "/og.png", width: 1200, height: 630 } as const;

export function canonicalUrl(config: ProjectConfig, path = "/"): string {
  // Sanity images come back as absolute CDN URLs; only site paths get the origin.
  if (/^https?:\/\//.test(path)) {
    return path;
  }
  const base = config.site.canonicalUrl.replace(/\/$/, "");
  if (path === "/" || path === "") {
    return `${base}/`;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  // trailingSlash is on, so pages live at /work/ and files (sitemap.xml, og.png) keep their name.
  const last = normalized.split("/").pop() ?? "";
  return `${base}${last.includes(".") || normalized.endsWith("/") ? normalized : `${normalized}/`}`;
}

// Spanish site description. Search-facing only (meta and JSON-LD), so it carries "agencia" for Spanish queries.
export const SITE_DESCRIPTION_ES =
  "Verbo es una agencia y consultora boutique de branding estratégico en Bogotá. Construimos marcas que duran, para empresas que quieren crecer con claridad y propósito.";

export function createMetadata(
  config: ProjectConfig,
  page: {
    title?: string;
    description?: string;
    path?: string;
    ogImage?: string;
    ogImageAlt?: string;
    noIndex?: boolean;
  } = {},
  locale: Locale = "en",
): Metadata {
  const title = page.title
    ? `${page.title} - ${config.site.name}`
    : config.site.name;
  // Describes public/og.png (scripts/make-brand-assets.mjs); pages with their own image pass their own alt.
  const imageAlt =
    page.ogImageAlt ??
    (locale === "es"
      ? `El logotipo de ${config.site.name} con la frase "Creando para transformar el mundo." y el lema "Strategy, Brand & Growth"`
      : `The ${config.site.name} wordmark with the line "Creating to shape the world." and the slogan "Strategy, Brand & Growth"`);
  const description = page.description ?? (locale === "es" ? SITE_DESCRIPTION_ES : config.site.description);
  const path = page.path ?? "/";
  const url = canonicalUrl(config, localePath(locale, path));
  const otherLocale: Locale = locale === "en" ? "es" : "en";
  const customImage = Boolean(page.ogImage);
  const ogImage = canonicalUrl(config, page.ogImage ?? DEFAULT_OG_IMAGE.path);
  const ogImages = customImage
    ? [{ url: ogImage, alt: imageAlt }]
    : [{ url: ogImage, width: DEFAULT_OG_IMAGE.width, height: DEFAULT_OG_IMAGE.height, alt: imageAlt }];

  return {
    metadataBase: new URL(config.site.canonicalUrl),
    title,
    description,
    alternates: page.noIndex
      ? undefined
      : {
          canonical: url,
          languages: {
            [LOCALE_TAGS.en.hreflang]: canonicalUrl(config, localePath("en", path)),
            [LOCALE_TAGS.es.hreflang]: canonicalUrl(config, localePath("es", path)),
            "x-default": canonicalUrl(config, localePath("en", path)),
          },
        },
    robots: page.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: LOCALE_TAGS[locale].og,
      alternateLocale: [LOCALE_TAGS[otherLocale].og],
      url,
      siteName: config.site.name,
      title,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map(({ url: src, alt }) => ({ url: src, alt })),
    },
  };
}

export function organizationId(config: ProjectConfig): string {
  return `${canonicalUrl(config)}#organization`;
}

// Organization plus WebSite, one graph in the root layout. Case and index pages point back with @id.
export function jsonLdSite(config: ProjectConfig, services: readonly string[] = [], locale: Locale = "en") {
  const org = config.site.organization;
  const id = organizationId(config);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": id,
        name: config.site.name,
        ...(config.site.legalName ? { alternateName: config.site.legalName } : {}),
        description: locale === "es" ? SITE_DESCRIPTION_ES : config.site.description,
        url: canonicalUrl(config, localePath(locale, "/")),
        logo: canonicalUrl(config, "/icon-512.png"),
        image: canonicalUrl(config, DEFAULT_OG_IMAGE.path),
        ...(org
          ? {
              email: org.email,
              telephone: org.telephone,
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "sales",
                email: org.email,
                telephone: org.telephone,
              },
              address: { "@type": "PostalAddress", addressLocality: org.locality, addressCountry: org.country },
              areaServed: [
                { "@type": "City", name: org.locality },
                { "@type": "Country", name: org.country },
              ],
            }
          : {}),
        ...(services.length > 0 ? { knowsAbout: services } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${canonicalUrl(config)}#website`,
        name: config.site.name,
        description: locale === "es" ? SITE_DESCRIPTION_ES : config.site.description,
        url: canonicalUrl(config, localePath(locale, "/")),
        inLanguage: LOCALE_TAGS[locale].html,
        publisher: { "@id": id },
      },
    ],
  };
}

export function jsonLdBreadcrumbs(
  config: ProjectConfig,
  trail: ReadonlyArray<{ name: string; path: string }>,
  locale: Locale = "en",
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: canonicalUrl(config, localePath(locale, crumb.path)),
    })),
  };
}

export function jsonLdWebPage(
  config: ProjectConfig,
  page: {
    type?: "WebPage" | "CollectionPage";
    title: string;
    path: string;
    description?: string;
    breadcrumbs?: ReadonlyArray<{ name: string; path: string }>;
  },
  locale: Locale = "en",
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": page.type ?? "WebPage",
        name: page.title,
        description: page.description ?? (locale === "es" ? SITE_DESCRIPTION_ES : config.site.description),
        url: canonicalUrl(config, localePath(locale, page.path)),
        inLanguage: LOCALE_TAGS[locale].html,
        isPartOf: { "@id": `${canonicalUrl(config)}#website` },
      },
      ...(page.breadcrumbs ? [jsonLdBreadcrumbs(config, page.breadcrumbs, locale)] : []),
    ],
  };
}

export function jsonLdCaseStudy(
  config: ProjectConfig,
  study: { name: string; slug: string; summary: string; image: string; practices: readonly string[]; updatedAt?: string },
  locale: Locale = "en",
) {
  const path = `/work/${study.slug}`;
  const url = canonicalUrl(config, localePath(locale, path));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        mainEntityOfPage: url,
        isPartOf: { "@id": `${canonicalUrl(config)}#website` },
        name: study.name,
        headline: locale === "es" ? `${study.name}, caso de estudio` : `${study.name}, case study`,
        description: study.summary,
        url,
        image: study.image,
        inLanguage: LOCALE_TAGS[locale].html,
        creator: { "@id": organizationId(config) },
        ...(study.practices.length > 0 ? { genre: study.practices } : {}),
        ...(study.updatedAt ? { dateModified: study.updatedAt } : {}),
      },
      jsonLdBreadcrumbs(
        config,
        [
          { name: config.site.name, path: "/" },
          { name: locale === "es" ? "Trabajo" : "Work", path: "/work" },
          { name: study.name, path },
        ],
        locale,
      ),
    ],
  };
}

// Pages without a real modified date leave lastmod out instead of stamping the build time.
// Every page is listed once per language, each entry pointing at its twin.
export function createSitemap(
  config: ProjectConfig,
  entries: ReadonlyArray<{ path: string; lastModified?: string }>,
): Array<{ url: string; lastModified?: string; alternates: { languages: Record<string, string> } }> {
  return entries.flatMap(({ path, lastModified }) => {
    const languages = {
      en: canonicalUrl(config, localePath("en", path)),
      es: canonicalUrl(config, localePath("es", path)),
    };
    return (["en", "es"] as const).map((locale) => ({
      url: languages[locale],
      ...(lastModified ? { lastModified } : {}),
      alternates: { languages },
    }));
  });
}

export function createRobots(config: ProjectConfig): {
  rules: { userAgent: string; allow: string; disallow: string[] };
  sitemap: string;
} {
  // No Host line: only Yandex ever read it, and the canonical tags already name the host.
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/styleguide"] },
    sitemap: canonicalUrl(config, "/sitemap.xml"),
  };
}

export function createWebManifest(config: ProjectConfig) {
  return {
    name: config.site.name,
    short_name: config.site.shortName,
    description: config.site.description,
    start_url: "/",
    display: "browser",
    lang: config.site.locale,
    background_color: "#39170d",
    theme_color: "#39170d",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
