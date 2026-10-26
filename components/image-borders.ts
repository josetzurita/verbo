// Border colors for project images, in project order: the Work stage and the menu share them.
export const imageBorders = [
  "var(--trail-blue)",
  "var(--trail-amber)",
  "var(--trail-yellow)",
  "var(--foreground)",
  "color-mix(in srgb, var(--trail-blue) 55%, var(--foreground))",
  "color-mix(in srgb, var(--trail-amber) 50%, var(--foreground))",
] as const;
