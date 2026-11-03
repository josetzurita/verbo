import type { DurationToken, SpringIntent, TweenIntent } from "@/components/profiles/types";
import type { ButtonSize, ButtonVariant } from "@/components/button-variants";

export const STYLEGUIDE_SECTIONS = [
  { href: "#overview", label: "Overview" },
  { href: "#typography", label: "Typography" },
  { href: "#colors", label: "Colors" },
  { href: "#buttons", label: "Buttons" },
  { href: "#forms", label: "Forms" },
  { href: "#containers", label: "Containers" },
  { href: "#spacing", label: "Spacing" },
  { href: "#radius", label: "Radius" },
  { href: "#motion", label: "Motion" },
  { href: "#pointer-accent", label: "Pointer Accent" },
  { href: "#components", label: "Components" },
] as const;

export type TypeRole = {
  token: string;
  className: string;
  group: "headlines" | "body" | "utility";
  desktopVar: string;
  mobileVar: string;
  leadingVar: string;
  weightVar: string;
  trackingVar: string;
  sample: string;
};

export const TYPE_ROLES: TypeRole[] = [
  {
    token: "display",
    className: "type-display",
    group: "headlines",
    desktopVar: "--type-display-size-desktop",
    mobileVar: "--type-display-size-mobile",
    leadingVar: "--type-display-leading",
    weightVar: "--type-display-weight",
    trackingVar: "--type-display-tracking",
    sample: "North studio archive",
  },
  {
    token: "h1",
    className: "type-h1",
    group: "headlines",
    desktopVar: "--type-h1-size-desktop",
    mobileVar: "--type-h1-size-mobile",
    leadingVar: "--type-h1-leading",
    weightVar: "--type-h1-weight",
    trackingVar: "--type-h1-tracking",
    sample: "Project specimen index",
  },
  {
    token: "h2",
    className: "type-h2",
    group: "headlines",
    desktopVar: "--type-h2-size-desktop",
    mobileVar: "--type-h2-size-mobile",
    leadingVar: "--type-h2-leading",
    weightVar: "--type-h2-weight",
    trackingVar: "--type-h2-tracking",
    sample: "Section title, type scale",
  },
  {
    token: "h3",
    className: "type-h3",
    group: "headlines",
    desktopVar: "--type-h3-size-desktop",
    mobileVar: "--type-h3-size-mobile",
    leadingVar: "--type-h3-leading",
    weightVar: "--type-h3-weight",
    trackingVar: "--type-h3-tracking",
    sample: "Subsection heading",
  },
  {
    token: "h4",
    className: "type-h4",
    group: "headlines",
    desktopVar: "--type-h4-size-desktop",
    mobileVar: "--type-h4-size-mobile",
    leadingVar: "--type-h4-leading",
    weightVar: "--type-h4-weight",
    trackingVar: "--type-h4-tracking",
    sample: "Group label heading",
  },
  {
    token: "h5",
    className: "type-h5",
    group: "headlines",
    desktopVar: "--type-h5-size-desktop",
    mobileVar: "--type-h5-size-mobile",
    leadingVar: "--type-h5-leading",
    weightVar: "--type-h5-weight",
    trackingVar: "--type-h5-tracking",
    sample: "Compact heading",
  },
  {
    token: "h6",
    className: "type-h6",
    group: "headlines",
    desktopVar: "--type-h6-size-desktop",
    mobileVar: "--type-h6-size-mobile",
    leadingVar: "--type-h6-leading",
    weightVar: "--type-h6-weight",
    trackingVar: "--type-h6-tracking",
    sample: "Smallest heading",
  },
  {
    token: "body-lg",
    className: "type-body-lg",
    group: "body",
    desktopVar: "--type-body-lg-size-desktop",
    mobileVar: "--type-body-lg-size-mobile",
    leadingVar: "--type-body-lg-leading",
    weightVar: "--type-body-lg-weight",
    trackingVar: "--type-body-lg-tracking",
    sample:
      "Lead paragraphs introduce a section with a slightly larger body size while staying in the same sans family.",
  },
  {
    token: "body",
    className: "type-body",
    group: "body",
    desktopVar: "--type-body-size-desktop",
    mobileVar: "--type-body-size-mobile",
    leadingVar: "--type-body-leading",
    weightVar: "--type-body-weight",
    trackingVar: "--type-body-tracking",
    sample:
      "Reading text stays at this size for project notes, captions of record, and long-form technical copy.",
  },
  {
    token: "body-sm",
    className: "type-body-sm",
    group: "body",
    desktopVar: "--type-body-sm-size-desktop",
    mobileVar: "--type-body-sm-size-mobile",
    leadingVar: "--type-body-sm-leading",
    weightVar: "--type-body-sm-weight",
    trackingVar: "--type-body-sm-tracking",
    sample: "Secondary notes, helper text, and compact descriptions use the small body size.",
  },
  {
    token: "caption",
    className: "type-caption",
    group: "utility",
    desktopVar: "--type-caption-size-desktop",
    mobileVar: "--type-caption-size-mobile",
    leadingVar: "--type-caption-leading",
    weightVar: "--type-caption-weight",
    trackingVar: "--type-caption-tracking",
    sample: "Figure notes and media credits sit here.",
  },
  {
    token: "label",
    className: "type-label",
    group: "utility",
    desktopVar: "--type-label-size-desktop",
    mobileVar: "--type-label-size-mobile",
    leadingVar: "--type-label-leading",
    weightVar: "--type-label-weight",
    trackingVar: "--type-label-tracking",
    sample: "Token name",
  },
  {
    token: "mono",
    className: "type-mono",
    group: "utility",
    desktopVar: "--type-mono-size-desktop",
    mobileVar: "--type-mono-size-mobile",
    leadingVar: "--type-mono-leading",
    weightVar: "--type-mono-weight",
    trackingVar: "--type-mono-tracking",
    sample: "--accent / project.config.ts",
  },
];

export type ColorSwatch = {
  token: string;
  cssVar: string;
  use: string;
  foreground: string;
};

export type ColorGroup = {
  id: string;
  title: string;
  swatches: ColorSwatch[];
};

export const COLOR_GROUPS: ColorGroup[] = [
  {
    id: "foundations",
    title: "Foundations",
    swatches: [
      {
        token: "background",
        cssVar: "--background",
        use: "Document canvas",
        foreground: "--foreground",
      },
      {
        token: "foreground",
        cssVar: "--foreground",
        use: "Default text and icons",
        foreground: "--background",
      },
    ],
  },
  {
    id: "surfaces",
    title: "Surfaces",
    swatches: [
      {
        token: "surface",
        cssVar: "--surface",
        use: "Raised panels, inputs, dialogs",
        foreground: "--foreground",
      },
      {
        token: "surface-muted",
        cssVar: "--surface-muted",
        use: "Secondary fills and hover beds",
        foreground: "--foreground",
      },
    ],
  },
  {
    id: "text",
    title: "Text",
    swatches: [
      {
        token: "foreground",
        cssVar: "--foreground",
        use: "Primary copy",
        foreground: "--background",
      },
      {
        token: "accent-foreground",
        cssVar: "--accent-foreground",
        use: "Text on accent fills",
        foreground: "--accent",
      },
    ],
  },
  {
    id: "border-focus",
    title: "Border and focus",
    swatches: [
      {
        token: "border",
        cssVar: "--border",
        use: "Hairlines and control edges",
        foreground: "--foreground",
      },
      {
        token: "ring",
        cssVar: "--ring",
        use: "Keyboard focus ring",
        foreground: "--background",
      },
    ],
  },
  {
    id: "accent",
    title: "Accent",
    swatches: [
      {
        token: "accent",
        cssVar: "--accent",
        use: "Primary actions and emphasis",
        foreground: "--accent-foreground",
      },
      {
        token: "accent-foreground",
        cssVar: "--accent-foreground",
        use: "Readable type on accent",
        foreground: "--accent",
      },
    ],
  },
  {
    id: "feedback",
    title: "Feedback",
    swatches: [
      {
        token: "destructive",
        cssVar: "--destructive",
        use: "Errors and destructive actions",
        foreground: "--destructive-foreground",
      },
      {
        token: "destructive-foreground",
        cssVar: "--destructive-foreground",
        use: "Text on destructive fills",
        foreground: "--destructive",
      },
    ],
  },
];

export const CONTRAST_PAIRS = [
  { name: "Body on canvas", foreground: "--foreground", background: "--background" },
  { name: "Body on surface", foreground: "--foreground", background: "--surface" },
  { name: "Primary button", foreground: "--accent-foreground", background: "--accent" },
  {
    name: "Destructive button",
    foreground: "--destructive-foreground",
    background: "--destructive",
  },
] as const;

export const BUTTON_MATRIX: { variant: ButtonVariant; label: string }[] = [
  { variant: "primary", label: "Primary" },
  { variant: "secondary", label: "Secondary" },
  { variant: "ghost", label: "Ghost" },
];

export const BUTTON_SIZE_ROWS: { size: ButtonSize; label: string }[] = [
  { size: "sm", label: "sm" },
  { size: "md", label: "md" },
  { size: "lg", label: "lg" },
];

export type ContainerSpecimen = {
  token: string;
  className: string;
  maxWidthVar: string;
  gutterVar: string;
  use: string;
};

export const CONTAINER_SPECIMENS: ContainerSpecimen[] = [
  {
    token: "full",
    className: "content-full",
    maxWidthVar: "--container-full",
    gutterVar: "--gutter",
    use: "Page chrome and wide catalogues",
  },
  {
    token: "wide",
    className: "content-wide",
    maxWidthVar: "--container-wide",
    gutterVar: "--gutter",
    use: "Project pages with media and tables",
  },
  {
    token: "reading",
    className: "content-reading",
    maxWidthVar: "--container-reading",
    gutterVar: "--gutter",
    use: "Long-form copy",
  },
  {
    token: "narrow",
    className: "content-narrow",
    maxWidthVar: "--container-narrow",
    gutterVar: "--gutter",
    use: "Forms and focused asides",
  },
];

export type SpacingRow = {
  token: string;
  cssVar: string;
  mobileVar?: string;
  tabletVar?: string;
  desktopVar?: string;
  use: string;
};

export const SECTION_SPACING: SpacingRow[] = [
  {
    token: "section",
    cssVar: "--space-section",
    mobileVar: "--space-section-mobile",
    tabletVar: "--space-section-tablet",
    desktopVar: "--space-section-desktop",
    use: "Vertical rhythm between major sections",
  },
];

export const COMPONENT_SPACING: SpacingRow[] = [
  { token: "space-2", cssVar: "--space-2", use: "Tight control padding" },
  { token: "space-3", cssVar: "--space-3", use: "Compact stacks" },
  { token: "space-4", cssVar: "--space-4", use: "Default component gap" },
  { token: "space-6", cssVar: "--space-6", use: "Grouped blocks" },
  { token: "space-8", cssVar: "--space-8", use: "Local section padding" },
  { token: "space-12", cssVar: "--space-12", use: "Large component separation" },
];

export const GUTTER_SPACING: SpacingRow[] = [
  {
    token: "gutter",
    cssVar: "--gutter",
    mobileVar: "--gutter-mobile",
    tabletVar: "--gutter-tablet",
    desktopVar: "--gutter-desktop",
    use: "Page side inset",
  },
  { token: "grid-gap", cssVar: "--grid-gap", use: "12-column track gap" },
];

export const RADIUS_SPECIMENS = [
  { token: "radius-sm", cssVar: "--radius-sm", use: "Checkboxes, small chips" },
  { token: "radius-md", cssVar: "--radius-md", use: "Buttons and fields" },
  { token: "radius-lg", cssVar: "--radius-lg", use: "Dialogs and media frames" },
] as const;

export type MotionIntentRow = {
  intent: TweenIntent | SpringIntent;
  durationToken?: DurationToken;
  kind: "tween" | "spring";
  use: string;
};

export const MOTION_INTENTS: MotionIntentRow[] = [
  {
    intent: "enter",
    durationToken: "base",
    kind: "tween",
    use: "Arrivals, reveals, first paint of a block",
  },
  {
    intent: "settle",
    durationToken: "slow",
    kind: "tween",
    use: "Returning to rest after travel",
  },
  {
    intent: "move",
    durationToken: "fast",
    kind: "tween",
    use: "Positional shifts that stay in view",
  },
  {
    intent: "exit",
    durationToken: "fast",
    kind: "tween",
    use: "Departures and dismissals",
  },
  {
    intent: "pop",
    kind: "spring",
    use: "Small confirmation pops. Keep the bounce.",
  },
  {
    intent: "linear",
    durationToken: "base",
    kind: "tween",
    use: "Discrete linear motion only. Scrubbed scroll stays linear and is not eased by this profile. Lenis lerp is scroll physics, not an animation easing.",
  },
];
