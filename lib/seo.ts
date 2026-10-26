import type { Metadata } from "next";
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
): Metadata {
  const title = page.title
    ? `${page.title} - ${config.site.name}`
    : config.site.name;
  // Describes public/og.png (scripts/make-brand-assets.mjs); pages with their own image pass their own alt.
  const imageAlt =
    page.ogImageAlt ??
    `The ${config.site.name} wordmark with the line "Creating to shape the world." and the slogan "Strategy, Brand & Growth"`;
  const description = page.description ?? config.site.description;
  const url = canonicalUrl(config, page.path ?? "/");
  const customImage = Boolean(page.ogImage);
  const ogImage = canonicalUrl(config, page.ogImage ?? DEFAULT_OG_IMAGE.path);
  const ogImages = customImage
    ? [{ url: ogImage, alt: imageAlt }]
    : [{ url: ogImage, width: DEFAULT_OG_IMAGE.width, height: DEFAULT_OG_IMAGE.height, alt: imageAlt }];

  return {
    metadataBase: new URL(config.site.canonicalUrl),
    title,
    description,
    alternates: page.noIndex ? undefined : { canonical: url },
    robots: page.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: config.site.locale === "en" ? "en_US" : config.site.locale,
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
  const lastModified = new Date();
  return paths.map((path) => ({ url: canonicalUrl(config, path), lastModified }));
}

export function createRobots(config: ProjectConfig): {
  rules: { userAgent: string; allow: string; disallow: string[] };
  sitemap: string;
  host: string;
} {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/styleguide"] },
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
    background_color: "#39170d",
    theme_color: "#39170d",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
