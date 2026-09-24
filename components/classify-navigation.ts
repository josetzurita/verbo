export type NavigationKind =
  | "internal"
  | "hash"
  | "external"
  | "download"
  | "new-tab"
  | "modified";

export type ClassifyNavigationInput = {
  href: string;
  currentPathname: string;
  target?: string | null;
  download?: boolean;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  button?: number;
};

export function classifyNavigation(input: ClassifyNavigationInput): NavigationKind {
  if (input.button != null && input.button !== 0) {
    return "modified";
  }
  if (input.metaKey || input.ctrlKey || input.shiftKey || input.altKey) {
    return "modified";
  }
  if (input.download) {
    return "download";
  }
  if (input.target === "_blank") {
    return "new-tab";
  }

  const href = input.href.trim();
  if (!href || href === "#") {
    return "hash";
  }
  if (
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("sms:")
  ) {
    return "external";
  }

  if (href.startsWith("//")) {
    return "external";
  }
  try {
    const url = new URL(href, "http://cds.local");
    if (url.protocol === "http:" || url.protocol === "https:") {
      const isAbsolute = /^https?:\/\//i.test(href);
      if (isAbsolute) {
        return "external";
      }
    }
    if (href.startsWith("#") || (url.pathname === input.currentPathname && url.hash)) {
      return "hash";
    }
    return "internal";
  } catch {
    return "external";
  }
}

export function shouldInterceptNavigation(kind: NavigationKind): boolean {
  return kind === "internal";
}
