import type { Locale } from "./i18n";
import * as en from "./home-content";
import * as es from "./home-content-es";

// One accessor for every translatable block. Components read from here, never from hardcoded copy.
export type Content = {
  menu: typeof es.menu;
  discoveryLabel: string;
  viewLabel: string;
  heroSlogan: readonly [string, string];
  heroLead: string;
  belief: typeof es.belief;
  about: typeof es.about;
  close: typeof es.close;
  legalLinks: typeof es.legalLinks;
  notFound: typeof es.notFound;
  ui: en.Ui;
};

const english: Content = {
  menu: en.menu as unknown as Content["menu"],
  discoveryLabel: en.discoveryLabel,
  viewLabel: en.viewLabel,
  heroSlogan: en.heroSlogan,
  heroLead: en.heroLead,
  belief: en.belief as unknown as Content["belief"],
  about: en.about as unknown as Content["about"],
  close: en.close as unknown as Content["close"],
  legalLinks: en.legalLinks as unknown as Content["legalLinks"],
  notFound: en.notFound as unknown as Content["notFound"],
  ui: en.ui,
};

const spanish: Content = {
  menu: es.menu,
  discoveryLabel: es.discoveryLabel,
  viewLabel: es.viewLabel,
  heroSlogan: es.heroSlogan,
  heroLead: es.heroLead,
  belief: es.belief,
  about: es.about,
  close: es.close,
  legalLinks: es.legalLinks,
  notFound: es.notFound,
  ui: es.ui,
};

export function getContent(locale: Locale): Content {
  return locale === "es" ? spanish : english;
}
