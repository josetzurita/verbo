import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { caseStudies } from "./lib/case-study";
import { cases } from "./lib/home-content";

const banned = /\u2014|\u2013/;

const sources = [
  "./components/case-study-view.tsx",
  "./components/case-motion.tsx",
  "./components/case-more.tsx",
  "./app/route-overlay.tsx",
  "./app/work/[slug]/page.tsx",
];

const publicFile = (src: string) => new URL(`./public${src}`, import.meta.url);

describe("case study template", () => {
  it("keeps em dashes and en dashes out of the copy", () => {
    expect(JSON.stringify(caseStudies)).not.toMatch(banned);
    for (const source of sources) {
      expect(readFileSync(new URL(source, import.meta.url), "utf8")).not.toMatch(banned);
    }
  });

  it("keeps each hero to two title lines and a short summary", () => {
    for (const study of caseStudies) {
      expect(study.title).toHaveLength(2);
      expect(study.summary.split(/\s+/).filter(Boolean).length).toBeLessThanOrEqual(20);
      expect(study.siteLabel.split(/\s+/).filter(Boolean).length).toBeLessThanOrEqual(2);
    }
  });

  it("keeps paragraphs and lists inside the density limits", () => {
    const words = (text: string) => text.split(/\s+/).filter(Boolean).length;
    for (const study of caseStudies) {
      const paragraphs = [
        study.statement,
        ...study.essay,
        ...study.visible.body,
        study.quote.body,
        ...study.layers.cards.map((card) => card.body),
      ];
      for (const paragraph of paragraphs) {
        expect(words(paragraph), paragraph).toBeLessThanOrEqual(25);
      }
      expect(study.layers.body.length).toBe(3);
      expect(study.impact.length).toBeLessThanOrEqual(5);
      expect(study.shift.pairs.length).toBeLessThanOrEqual(5);
      expect(study.places.items.length).toBeLessThanOrEqual(5);
    }
  });

  it("points every image at a file that exists", () => {
    const json = JSON.stringify(caseStudies);
    const srcs = [...json.matchAll(/"src":"([^"]+)"/g)].map((match) => match[1] ?? "");
    expect(srcs.length).toBeGreaterThan(10);
    for (const src of srcs) {
      expect(existsSync(publicFile(src)), src).toBe(true);
    }
  });

  it("links each homepage project that has a case study to it", () => {
    for (const study of caseStudies) {
      expect(cases.some((item) => item.href === `/work/${study.slug}`)).toBe(true);
    }
  });
});
