"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { getContent, type Content } from "@/lib/content";
import { DEFAULT_LOCALE, localePath, type Locale } from "@/lib/i18n";

type LocaleValue = { locale: Locale; content: Content; path: (href: string) => string };

const LocaleContext = createContext<LocaleValue>({
  locale: DEFAULT_LOCALE,
  content: getContent(DEFAULT_LOCALE),
  path: (href) => href,
});

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo<LocaleValue>(
    () => ({ locale, content: getContent(locale), path: (href) => localePath(locale, href) }),
    [locale],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext).locale;
export const useContent = () => useContext(LocaleContext).content;
/** Prefixes a site path with /es when the page is Spanish. */
export const useLocalePath = () => useContext(LocaleContext).path;
