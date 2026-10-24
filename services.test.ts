import { beforeEach, describe, expect, it, vi } from "vitest";
import { services as placeholders } from "./lib/home-content";

const fetch = vi.fn();
vi.mock("./lib/sanity", () => ({ sanityClient: { fetch } }));

async function load() {
  vi.resetModules();
  return import("./lib/services");
}

describe("services from Sanity", () => {
  beforeEach(() => fetch.mockReset());

  it("falls back to the lib/ services, Website design included", async () => {
    fetch.mockResolvedValue([]);
    const services = await (await load()).getServices();
    expect(services.map((service) => service.slug)).toEqual(placeholders.map((service) => service.slug));
    expect(services.find((service) => service.slug === "website-design")?.deliverables[0]).toEqual({
      slug: "sitemap",
      name: "Sitemap",
    });
  });

  it("maps documents and drops broken references", async () => {
    fetch.mockResolvedValue([
      { slug: "brand-book", name: "Brand book", title: ["Brand", "book"], description: "D", deliverables: [{ slug: "logo", name: "Logo" }, null] },
      { name: "No slug" },
    ]);
    const services = await (await load()).getServices();
    expect(services).toEqual([
      { slug: "brand-book", name: "Brand book", title: ["Brand", "book"], description: "D", deliverables: [{ slug: "logo", name: "Logo" }] },
    ]);
  });
});
