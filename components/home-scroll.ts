export const HOME_SCROLL_KEY = "verbo-home-scroll";
export const HOME_SCROLL_RESET_KEY = "verbo-home-scroll-reset";

export function isHomeHeroHref(href: string, origin = "http://localhost") {
  if (href === "/") {
    return true;
  }
  try {
    const url = new URL(href, origin);
    return url.pathname === "/" && url.hash === "";
  } catch {
    return false;
  }
}

export function requestHomeHero() {
  sessionStorage.setItem(HOME_SCROLL_RESET_KEY, "1");
}

export function cancelHomeHero() {
  sessionStorage.removeItem(HOME_SCROLL_RESET_KEY);
}

export function homeHeroRequested() {
  return sessionStorage.getItem(HOME_SCROLL_RESET_KEY) === "1";
}

export function finishHomeHero() {
  sessionStorage.removeItem(HOME_SCROLL_RESET_KEY);
  sessionStorage.setItem(HOME_SCROLL_KEY, "0");
}
