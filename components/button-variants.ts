export const BUTTON_VARIANTS = ["primary", "secondary", "ghost"] as const;
export const BUTTON_SIZES = ["sm", "md", "lg"] as const;
export const BUTTON_SPECIMEN_STATES = [
  "default",
  "hover",
  "pressed",
  "focus",
  "disabled",
  "loading",
] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonSize = (typeof BUTTON_SIZES)[number];
export type ButtonSpecimenState = (typeof BUTTON_SPECIMEN_STATES)[number];
