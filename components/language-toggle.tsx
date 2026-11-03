"use client";

import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { LOCALE_STORAGE_KEY, alternatePath, type Locale } from "@/lib/i18n";
import { useContent, useLocale } from "./locale-provider";

const options: ReadonlyArray<{ locale: Locale; label: string; lang: string }> = [
  { locale: "en", label: "ENG", lang: "en" },
  { locale: "es", label: "ESP", lang: "es" },
];

/**
 * ENG / ESP switch. The two languages are separate static pages, so a click is a full page load. It saves the
 * choice first, so the language gate on the next page honors it over the browser's language.
 */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const current = useLocale();
  const pathname = usePathname();
  const { languageLabel } = useContent().ui;

  function choose(event: MouseEvent<HTMLAnchorElement>, locale: Locale, href: string) {
    if (locale === current) {
      event.preventDefault();
      return;
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Private mode: the switch still works for this visit.
    }
    window.location.assign(`${href}${window.location.search}${window.location.hash}`);
  }

  return (
    <div role="group" aria-label={languageLabel} className={`flex items-baseline gap-3 ${className}`}>
      {options.map(({ locale, label, lang }) => {
        const active = locale === current;
        const href = locale === current ? pathname : alternatePath(current, pathname);
        return (
          <a
            key={locale}
            href={href}
            hrefLang={lang}
            lang={lang}
            aria-current={active ? "true" : undefined}
            onClick={(event) => choose(event, locale, href)}
            className={`text-[17px] font-light leading-none tracking-[-0.03em] transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground ${active ? "opacity-100" : "opacity-45 hover:opacity-100"}`}
          >
            {label}
          </a>
        );
      })}
    </div>
  );
}
