export const PROJECT_THEME_MODES = ["light", "dark", "system"] as const;
export const PROJECT_RADIUS_POLICIES = ["sm", "md", "lg"] as const;
export const PROJECT_MOTION_PROFILES = ["house"] as const;
export const PROJECT_PAGE_TRANSITIONS = ["none", "overlay"] as const;
export const PROJECT_PRESETS = ["minimal", "creative", "storytelling"] as const;
export const PROJECT_POINTER_ACCENT_SHAPES = ["circle", "square", "ring"] as const;
export const PROJECT_POINTER_ACCENT_EASES = [
  "enter",
  "settle",
  "move",
  "exit",
  "linear",
  "power3.out",
] as const;
export const PROJECT_POINTER_ACCENT_BLEND_MODES = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
  "plus-lighter",
] as const;
export const PROJECT_Z_INDEX_LAYERS = [
  "base",
  "raised",
  "sticky",
  "overlay",
  "dialog",
  "toast",
  "debug",
] as const;

export type ProjectThemeMode = (typeof PROJECT_THEME_MODES)[number];
export type ProjectRadiusPolicy = (typeof PROJECT_RADIUS_POLICIES)[number];
export type ProjectMotionProfileName = (typeof PROJECT_MOTION_PROFILES)[number];
export type ProjectPageTransition = (typeof PROJECT_PAGE_TRANSITIONS)[number];
export type ProjectPreset = (typeof PROJECT_PRESETS)[number];
export type ProjectPointerAccentShape = (typeof PROJECT_POINTER_ACCENT_SHAPES)[number];
export type ProjectPointerAccentEase = (typeof PROJECT_POINTER_ACCENT_EASES)[number];
export type ProjectPointerAccentBlendMode =
  (typeof PROJECT_POINTER_ACCENT_BLEND_MODES)[number];
export type ProjectZIndexLayer = (typeof PROJECT_Z_INDEX_LAYERS)[number];

export type ProjectPointerAccentConfig = {
  enabled: boolean;
  size: number;
  color: string;
  opacity: number;
  shape: ProjectPointerAccentShape;
  lag: number;
  ease: ProjectPointerAccentEase;
  stretch: number;
  maxStretch: number;
  offsetX: number;
  offsetY: number;
  blendMode: ProjectPointerAccentBlendMode;
  zIndex: ProjectZIndexLayer;
};

export type ProjectConfig = {
  site: {
    name: string;
    shortName: string;
    description: string;
    locale: string;
    canonicalUrl: string;
  };
  theme: {
    mode: ProjectThemeMode;
    radius: ProjectRadiusPolicy;
  };
  motion: {
    profile: ProjectMotionProfileName;
    smoothScroll: boolean;
    pageTransition: ProjectPageTransition;
  };
  features: {
    analytics: boolean;
    cms: boolean;
  };
  pointerAccent: ProjectPointerAccentConfig;
};

export type ValidateProjectConfigOptions = {
  production?: boolean;
};

export class ProjectConfigError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(`Invalid project configuration: ${issues.join("; ")}`);
    this.name = "ProjectConfigError";
    this.issues = issues;
  }
}

const LOCALE_PATTERN = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, path: string, issues: string[]): string {
  if (typeof value !== "string") {
    issues.push(`${path} must be a string`);
    return "";
  }
  const trimmed = value.trim();
  if (!trimmed) {
    issues.push(`${path} must not be empty`);
    return "";
  }
  return trimmed;
}

function readBoolean(value: unknown, path: string, issues: string[]): boolean {
  if (typeof value !== "boolean") {
    issues.push(`${path} must be a boolean`);
    return false;
  }
  return value;
}

function readNumber(value: unknown, path: string, issues: string[]): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    issues.push(`${path} must be a finite number`);
    return 0;
  }
  return value;
}

export function defaultPointerAccentConfig(): ProjectPointerAccentConfig {
  return {
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
  };
}

function readUnion<T extends string>(
  value: unknown,
  path: string,
  allowed: readonly T[],
  issues: string[],
): T | "" {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    issues.push(`${path} must be one of ${allowed.join(", ")}`);
    return "";
  }
  return value as T;
}

function isLocalhostUrl(url: URL): boolean {
  return (
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname === "[::1]" ||
    url.hostname === "::1"
  );
}

function validateCanonicalUrl(
  value: string,
  production: boolean,
  issues: string[],
): string {
  if (!value) {
    return "";
  }
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      issues.push("site.canonicalUrl must use http or https");
      return "";
    }
    if (url.hash) {
      issues.push("site.canonicalUrl must not include a hash");
    }
    if (production && url.protocol !== "https:" && !isLocalhostUrl(url)) {
      issues.push("site.canonicalUrl must use https in production");
    }
    return url.origin + (url.pathname === "/" ? "" : url.pathname.replace(/\/$/, ""));
  } catch {
    issues.push("site.canonicalUrl must be an absolute URL");
    return "";
  }
}

export function validateProjectConfig(
  input: unknown,
  options: ValidateProjectConfigOptions = {},
): ProjectConfig {
  const production = Boolean(options.production);
  const issues: string[] = [];

  if (!isRecord(input)) {
    throw new ProjectConfigError(["configuration must be an object"]);
  }

  const siteInput = isRecord(input.site) ? input.site : null;
  const themeInput = isRecord(input.theme) ? input.theme : null;
  const motionInput = isRecord(input.motion) ? input.motion : null;
  const featuresInput = isRecord(input.features) ? input.features : null;
  const pointerInput = isRecord(input.pointerAccent) ? input.pointerAccent : null;

  if (!siteInput) issues.push("site must be an object");
  if (!themeInput) issues.push("theme must be an object");
  if (!motionInput) issues.push("motion must be an object");
  if (!featuresInput) issues.push("features must be an object");
  if (!pointerInput) issues.push("pointerAccent must be an object");

  const name = readString(siteInput?.name, "site.name", issues);
  const shortName = readString(siteInput?.shortName, "site.shortName", issues);
  const description = readString(siteInput?.description, "site.description", issues);
  const locale = readString(siteInput?.locale, "site.locale", issues);
  const canonicalRaw = readString(siteInput?.canonicalUrl, "site.canonicalUrl", issues);
  const canonicalUrl = validateCanonicalUrl(canonicalRaw, production, issues);

  if (locale && !LOCALE_PATTERN.test(locale)) {
    issues.push("site.locale must be a BCP 47 language tag");
  }

  const mode = readUnion(themeInput?.mode, "theme.mode", PROJECT_THEME_MODES, issues);
  const radius = readUnion(
    themeInput?.radius,
    "theme.radius",
    PROJECT_RADIUS_POLICIES,
    issues,
  );
  const profile = readUnion(
    motionInput?.profile,
    "motion.profile",
    PROJECT_MOTION_PROFILES,
    issues,
  );
  const pageTransition = readUnion(
    motionInput?.pageTransition,
    "motion.pageTransition",
    PROJECT_PAGE_TRANSITIONS,
    issues,
  );
  const smoothScroll = readBoolean(motionInput?.smoothScroll, "motion.smoothScroll", issues);
  const analytics = readBoolean(featuresInput?.analytics, "features.analytics", issues);
  const cms = readBoolean(featuresInput?.cms, "features.cms", issues);
  const pointerEnabled = readBoolean(pointerInput?.enabled, "pointerAccent.enabled", issues);
  const pointerSize = readNumber(pointerInput?.size, "pointerAccent.size", issues);
  const pointerColor = readString(pointerInput?.color, "pointerAccent.color", issues);
  const pointerOpacity = readNumber(pointerInput?.opacity, "pointerAccent.opacity", issues);
  const pointerShape = readUnion(
    pointerInput?.shape,
    "pointerAccent.shape",
    PROJECT_POINTER_ACCENT_SHAPES,
    issues,
  );
  const pointerLag = readNumber(pointerInput?.lag, "pointerAccent.lag", issues);
  const pointerEase = readUnion(
    pointerInput?.ease,
    "pointerAccent.ease",
    PROJECT_POINTER_ACCENT_EASES,
    issues,
  );
  const pointerStretch = readNumber(pointerInput?.stretch, "pointerAccent.stretch", issues);
  const pointerMaxStretch = readNumber(
    pointerInput?.maxStretch,
    "pointerAccent.maxStretch",
    issues,
  );
  const pointerOffsetX = readNumber(pointerInput?.offsetX, "pointerAccent.offsetX", issues);
  const pointerOffsetY = readNumber(pointerInput?.offsetY, "pointerAccent.offsetY", issues);
  const pointerBlend = readUnion(
    pointerInput?.blendMode,
    "pointerAccent.blendMode",
    PROJECT_POINTER_ACCENT_BLEND_MODES,
    issues,
  );
  const pointerZIndex = readUnion(
    pointerInput?.zIndex,
    "pointerAccent.zIndex",
    PROJECT_Z_INDEX_LAYERS,
    issues,
  );

  if (issues.length > 0) {
    throw new ProjectConfigError(issues);
  }

  return {
    site: { name, shortName, description, locale, canonicalUrl },
    theme: { mode: mode as ProjectThemeMode, radius: radius as ProjectRadiusPolicy },
    motion: {
      profile: profile as ProjectMotionProfileName,
      smoothScroll,
      pageTransition: pageTransition as ProjectPageTransition,
    },
    features: { analytics, cms },
    pointerAccent: {
      enabled: pointerEnabled,
      size: pointerSize,
      color: pointerColor,
      opacity: pointerOpacity,
      shape: pointerShape as ProjectPointerAccentShape,
      lag: pointerLag,
      ease: pointerEase as ProjectPointerAccentEase,
      stretch: pointerStretch,
      maxStretch: pointerMaxStretch,
      offsetX: pointerOffsetX,
      offsetY: pointerOffsetY,
      blendMode: pointerBlend as ProjectPointerAccentBlendMode,
      zIndex: pointerZIndex as ProjectZIndexLayer,
    },
  };
}

export function assertProjectConfig(
  input: unknown,
  options?: ValidateProjectConfigOptions,
): ProjectConfig {
  return validateProjectConfig(input, options);
}

export function createProjectConfig(
  input: ProjectConfig,
  options?: ValidateProjectConfigOptions,
): ProjectConfig {
  return validateProjectConfig(input, options);
}

export function isProductionBuild(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.NODE_ENV === "production";
}

export function loadProjectConfig(
  input: unknown,
  env: NodeJS.ProcessEnv = process.env,
): ProjectConfig {
  return validateProjectConfig(input, { production: isProductionBuild(env) });
}

export function presetMotionDefaults(preset: ProjectPreset): ProjectConfig["motion"] {
  if (preset === "minimal") {
    return { profile: "house", smoothScroll: false, pageTransition: "none" };
  }
  if (preset === "creative") {
    return { profile: "house", smoothScroll: true, pageTransition: "overlay" };
  }
  return { profile: "house", smoothScroll: true, pageTransition: "overlay" };
}

export function registryItemsForPreset(preset: ProjectPreset): string[] {
  if (preset === "minimal") {
    return ["production-shell"];
  }
  if (preset === "creative") {
    return ["production-shell", "motion-foundations", "pointer-accent"];
  }
  return [
    "production-shell",
    "motion-foundations",
    "pointer-accent",
    "scroll-storytelling",
  ];
}

export function createPresetProjectConfig(options: {
  name: string;
  title: string;
  preset: ProjectPreset;
  canonicalUrl: string;
}): ProjectConfig {
  return createProjectConfig({
    site: {
      name: options.title,
      shortName: options.name,
      description: `${options.title} client site.`,
      locale: "en",
      canonicalUrl: options.canonicalUrl,
    },
    theme: {
      mode: "system",
      radius: "md",
    },
    motion: presetMotionDefaults(options.preset),
    features: {
      analytics: false,
      cms: false,
    },
    pointerAccent: defaultPointerAccentConfig(),
  });
}

export function htmlLang(config: ProjectConfig): string {
  return config.site.locale;
}

export function htmlThemeDataset(config: ProjectConfig): string | undefined {
  if (config.theme.mode === "system") {
    return undefined;
  }
  return config.theme.mode;
}
