import type { Metadata } from "next";
import type { ProjectConfig } from "./project-config";

export function canonicalUrl(config: ProjectConfig, path = "/"): string {
  const base = config.site.canonicalUrl.replace(/\/$/, "");
  if (path === "/" || path === "") {
    return `${base}/`;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function createMetadata(
  config: ProjectConfig,
  page: {
    title?: string;
    description?: string;
    path?: string;
    ogImage?: string;
    noIndex?: boolean;
  } = {},
): Metadata {
  const title = page.title
    ? `${page.title} - ${config.site.name}`
    : config.site.name;
  const description = page.description ?? config.site.description;
  const url = canonicalUrl(config, page.path ?? "/");
  const ogImage = page.ogImage
    ? canonicalUrl(config, page.ogImage)
    : undefined;

  return {
    metadataBase: new URL(config.site.canonicalUrl),
    title,
    description,
    alternates: { canonical: url },
    robots: page.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: config.site.locale,
      url,
      siteName: config.site.name,
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}

export function jsonLdWebSite(config: ProjectConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.site.name,
    description: config.site.description,
    url: canonicalUrl(config),
    inLanguage: config.site.locale,
  };
}

export function jsonLdWebPage(
  config: ProjectConfig,
  page: { title: string; path: string; description?: string },
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description ?? config.site.description,
    url: canonicalUrl(config, page.path),
    isPartOf: {
      "@type": "WebSite",
      name: config.site.name,
      url: canonicalUrl(config),
    },
  };
}

export function createSitemap(
  config: ProjectConfig,
  paths: string[],
): Array<{ url: string; lastModified?: Date }> {
  return paths.map((path) => ({ url: canonicalUrl(config, path) }));
}

export function createRobots(config: ProjectConfig): {
  rules: { userAgent: string; allow: string };
  sitemap: string;
  host: string;
} {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: canonicalUrl(config, "/sitemap.xml"),
    host: config.site.canonicalUrl,
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
    background_color: "#f4f4f5",
    theme_color: "#1f1f24",
  };
}
