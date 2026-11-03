// English lives at the root (/work), Spanish under /es (/es/work). Pure helpers, safe on server and client.

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** localStorage key that holds the visitor's explicit language choice. */
export const LOCALE_STORAGE_KEY = "verbo-lang";

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "es";
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";
}

/** Drops the /es prefix: "/es/work/" becomes "/work/", "/es" becomes "/". */
export function stripLocale(pathname: string): string {
  if (pathname === "/es") return "/";
  return pathname.startsWith("/es/") ? pathname.slice(3) : pathname;
}

/**
 * Site path for a language. Absolute URLs, mailto:, tel: and bare "#hash" links pass through untouched;
 * "/#about" keeps its hash and becomes "/es/#about".
 */
export function localePath(locale: Locale, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const bare = stripLocale(href.split(/[?#]/)[0] ?? "/");
  const rest = href.slice((href.split(/[?#]/)[0] ?? "").length);
  if (locale === "en") {
    return `${bare}${rest}`;
  }
  const prefixed = bare === "/" ? "/es/" : `/es${bare}`;
  return `${prefixed}${rest}`;
}

/** The same page in the other language, keeping query and hash. */
export function alternatePath(locale: Locale, href: string): string {
  return localePath(locale === "en" ? "es" : "en", href);
}

export const LOCALE_TAGS: Record<Locale, { html: string; og: string; hreflang: string }> = {
  en: { html: "en", og: "en_US", hreflang: "en" },
  es: { html: "es", og: "es_CO", hreflang: "es" },
};

/** True for "/" and "/es/", with or without a trailing slash. */
export function isHomePath(pathname: string): boolean {
  return stripLocale(pathname.replace(/(.)\/+$/, "$1")) === "/";
}
