import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { belief, cases, discoveryLabel, services } from "./lib/home-content";

const banned = /\u2014|\u2013/;

describe("visible home copy", () => {
  it("keeps em dashes and en dashes out of the home strings", () => {
    const blob = JSON.stringify({ belief, cases, discoveryLabel, services });
    expect(blob).not.toMatch(banned);
  });

  it("keeps the headline to two lines of copy", () => {
    expect(discoveryLabel.split(/\s+/).length).toBeGreaterThan(0);
    expect("Creating to shape".includes("\u2014")).toBe(false);
  });
});

describe("page source", () => {
  it("does not render banned dashes in the home page", () => {
    const page = readFileSync(new URL("./app/page.tsx", import.meta.url), "utf8");
    expect(page).not.toMatch(banned);
  });
});
