import { loadProjectConfig, type ProjectConfig } from "./lib/project-config";

const input = {
  site: {
    name: "Verbo",
    shortName: "Verbo",
    description:
      "Consultora boutique de branding estratégico. Construimos marcas desde el entendimiento del negocio y las personas, con rigor, criterio y alma.",
    locale: "es",
    canonicalUrl: "http://127.0.0.1:4317",
  },
  theme: {
    mode: "dark",
    radius: "sm",
  },
  motion: {
    profile: "house",
    smoothScroll: true,
    pageTransition: "none",
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
