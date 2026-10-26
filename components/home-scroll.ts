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

// Where a home section starts. A sticky section reports where it is stuck, not where it starts,
// so measure it from the block before it.
export function anchorTop(node: HTMLElement) {
  const before = node.previousElementSibling;
  if (getComputedStyle(node).position === "sticky" && before) {
    return before.getBoundingClientRect().bottom + window.scrollY;
  }
  return node.getBoundingClientRect().top + window.scrollY;
}

export function finishHomeHero() {
  sessionStorage.removeItem(HOME_SCROLL_RESET_KEY);
  sessionStorage.setItem(HOME_SCROLL_KEY, "0");
}
