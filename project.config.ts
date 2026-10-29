import { loadProjectConfig, type ProjectConfig } from "./lib/project-config";

const input = {
  site: {
    name: "Verbo",
    shortName: "Verbo",
    description:
      "Verbo is a boutique strategic branding consultancy in Bogotá. We build brands from a deep understanding of the business and the people, with rigor, judgment and soul.",
    locale: "en",
    // Set NEXT_PUBLIC_SITE_URL at build time to serve from another address (the workers.dev preview).
    canonicalUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://verbobrands.com",
    organization: {
      email: "juliana@verbobrands.com",
      locality: "Bogotá",
      country: "CO",
    },
  },
  theme: {
    mode: "dark",
    radius: "sm",
  },
  motion: {
    profile: "house",
    smoothScroll: true,
    pageTransition: "overlay",
  },
  features: {
    analytics: false,
    cms: false,
  },
  pointerAccent: {
    enabled: false,
    size: 14,
    color: "oklch(0.97 0.004 250)",
    opacity: 1,
    shape: "circle",
    lag: 0.4,
    ease: "power3.out",
    stretch: 0.2,
    maxStretch: 0.6,
    offsetX: 0,
    offsetY: 0,
    blendMode: "difference",
    zIndex: "debug",
  },
} as const satisfies ProjectConfig;

export const projectConfig = loadProjectConfig(input);
