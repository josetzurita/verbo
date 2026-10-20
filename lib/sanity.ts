import { createClient } from "@sanity/client";

// Public read of published content. The Studio lives in ../studio-verbo-brands.
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "3bttmpaw",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-10-19",
  // The site is a static export rebuilt on publish, so read fresh content, not the CDN cache.
  useCdn: false,
  perspective: "published",
});
