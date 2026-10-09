import { describe, expect, it } from "vitest";
import { isHomeHeroHref } from "./components/home-scroll";

describe("home hero navigation", () => {
  it("treats the logo href as the hero", () => {
    expect(isHomeHeroHref("/")).toBe(true);
    expect(isHomeHeroHref("/", "https://verbo.test")).toBe(true);
  });

  it("leaves section links alone", () => {
    expect(isHomeHeroHref("/#work")).toBe(false);
    expect(isHomeHeroHref("/#belief")).toBe(false);
    expect(isHomeHeroHref("/work/lienzo")).toBe(false);
  });
});