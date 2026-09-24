export type StyleguideAccessEnv = {
  NODE_ENV?: string;
  ENABLE_STYLEGUIDE?: string;
};

export function isStyleguideEnabled(
  env: StyleguideAccessEnv = process.env,
): boolean {
  if (env.NODE_ENV !== "production") {
    return true;
  }
  return env.ENABLE_STYLEGUIDE === "true";
}
