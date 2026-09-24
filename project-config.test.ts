import { describe, expect, it } from "vitest";
import { projectConfig } from "./project.config";

describe("project configuration", () => {
  it("loads a complete identity", () => {
    expect(projectConfig.site.name.length).toBeGreaterThan(0);
    expect(projectConfig.site.canonicalUrl).toMatch(/^https?:\/\//);
  });
});
