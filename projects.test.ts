import { beforeEach, describe, expect, it, vi } from "vitest";
import { caseStudies } from "./lib/case-study";
import { cases } from "./lib/home-content";

const fetch = vi.fn();
vi.mock("./lib/sanity", () => ({ sanityClient: { fetch } }));

const lienzo = caseStudies[0]!;
const { slug, name, more, ...lienzoStudy } = lienzo;
const image = { src: "https://cdn.sanity.io/images/x/production/a-10x10.jpg", alt: "A", width: 10, height: 10 };

async function load() {
  vi.resetModules();
  return import("./lib/projects");
}

describe("projects from Sanity", () => {
  beforeEach(() => fetch.mockReset());

  it("falls back to the placeholders while the dataset is empty", async () => {
    fetch.mockResolvedValue([]);
    const projects = await load();
    expect(await projects.getWorkCases()).toEqual(cases);
    expect(await projects.getCaseStudies()).toEqual(caseStudies);
  });

  it("maps projects into cards, case studies, and the more strip", async () => {
    fetch.mockResolvedValue([
      {
        name,
        slug,
        tag: "Tag",
        description: "D",
        services: [{ slug: "a", name: "A" }, { slug: "b", name: "B" }],
        deliverables: [{ slug: "logo", name: "Logo" }],
        image,
        hasCaseStudy: true,
        caseStudy: lienzoStudy,
      },
      { name: "Other", slug: "other", tag: "Other tag", moreLine: "Short pitch", image, hasCaseStudy: false },
    ]);
    const projects = await load();
    const work = await projects.getWorkCases();
    expect(work.map((item) => [item.index, item.href, item.services])).toEqual([
      ["01", `/work/${slug}`, "A / B"],
      ["02", null, ""],
    ]);
    const study = await projects.getCaseStudy(slug);
    expect(study?.title).toEqual(lienzo.title);
    expect(study?.more).toEqual([{ name: "Other", line: "Short pitch", href: "/#work", image }]);
  });

  it("carries category slugs for the work filter", async () => {
    fetch.mockResolvedValue([
      { name, slug, services: [{ slug: "brand-book", name: "Brand book" }], deliverables: [{ slug: "logo", name: "Logo" }], image },
      { name: "Legacy", slug: "legacy", services: ["Web"], image },
    ]);
    const projects = await load();
    const work = await projects.getWorkCases();
    expect(work.map((item) => [item.services, item.serviceSlugs, item.deliverableSlugs])).toEqual([
      ["Brand book", ["brand-book"], ["logo"]],
      ["Web", ["Web"], []],
    ]);
  });

  it("lets a places row fall back to the places image", async () => {
    const places = { ...lienzoStudy.places, items: [{ name: "Here", region: "There" }] };
    fetch.mockResolvedValue([{ name, slug, image, hasCaseStudy: true, caseStudy: { ...lienzoStudy, places } }]);
    const projects = await load();
    const study = await projects.getCaseStudy(slug);
    expect(study?.places.items[0]?.image).toEqual(lienzoStudy.places.image);
  });

  it("skips an incomplete case study instead of failing the build", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    fetch.mockResolvedValue([
      { name, slug, image, hasCaseStudy: true, caseStudy: { ...lienzoStudy, pair: [image] } },
    ]);
    const projects = await load();
    expect(await projects.getCaseStudies()).toEqual([]);
    expect((await projects.getWorkCases())[0]?.href).toBeNull();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
