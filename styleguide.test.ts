import { describe, expect, it } from "vitest";
import { isStyleguideEnabled } from "./lib/styleguide-access";
import { STYLEGUIDE_SECTIONS, TYPE_ROLES } from "./app/styleguide/_data/styleguide-data";

describe("styleguide access", () => {
  it("is available outside production", () => {
    expect(isStyleguideEnabled({ NODE_ENV: "development" })).toBe(true);
    expect(isStyleguideEnabled({ NODE_ENV: "test" })).toBe(true);
  });

  it("returns 404 in production unless ENABLE_STYLEGUIDE is true", () => {
    expect(isStyleguideEnabled({ NODE_ENV: "production" })).toBe(false);
    expect(
      isStyleguideEnabled({ NODE_ENV: "production", ENABLE_STYLEGUIDE: "false" }),
    ).toBe(false);
    expect(
      isStyleguideEnabled({ NODE_ENV: "production", ENABLE_STYLEGUIDE: "true" }),
    ).toBe(true);
  });
});

describe("styleguide specimen data", () => {
  it("covers the required sections and type roles", () => {
    expect(STYLEGUIDE_SECTIONS.map((section) => section.href)).toEqual([
      "#overview",
      "#typography",
      "#colors",
      "#buttons",
      "#forms",
      "#containers",
      "#spacing",
      "#radius",
      "#motion",
      "#pointer-accent",
      "#components",
    ]);
    expect(TYPE_ROLES.map((role) => role.token)).toEqual([
      "display",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "body-lg",
      "body",
      "body-sm",
      "caption",
      "label",
      "mono",
    ]);
  });
});
