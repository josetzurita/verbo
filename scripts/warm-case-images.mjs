// Asks Sanity's image CDN for every project image at the widths case pages use, so the first
// visitor after a deploy or a content change gets cached transforms instead of 1-2 s cold ones.
// Run after publishing: node scripts/warm-case-images.mjs
// Widths and quality mirror components/case-photo.tsx; change them together.

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "3bttmpaw";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const WIDTHS = [640, 1080, 1600, 2560];
const QUALITY = 85;
// Browsers that take AVIF get AVIF; the rest get WebP. Warm both.
const ACCEPTS = ["image/avif,image/webp,*/*", "image/webp,*/*"];
const PARALLEL = 6;

// Every image asset a published project points at, case study or card.
const query = `*[_type == "sanity.imageAsset" && count(*[_type == "project" && references(^._id)]) > 0].url`;
const api = `https://${PROJECT_ID}.api.sanity.io/v2026-10-19/data/query/${DATASET}?query=${encodeURIComponent(query)}&perspective=published`;

const response = await fetch(api);
if (!response.ok) {
  throw new Error(`Sanity query failed: ${response.status} ${await response.text()}`);
}
const { result: urls } = await response.json();

const jobs = urls.flatMap((url) =>
  WIDTHS.flatMap((width) => ACCEPTS.map((accept) => ({ url: `${url}?w=${width}&q=${QUALITY}&auto=format`, accept }))),
);

let done = 0;
let slow = 0;
let failed = 0;
async function worker() {
  for (let job = jobs.shift(); job; job = jobs.shift()) {
    const start = performance.now();
    try {
      const res = await fetch(job.url, { headers: { Accept: job.accept } });
      await res.arrayBuffer();
      if (!res.ok) failed += 1;
    } catch {
      failed += 1;
    }
    if (performance.now() - start > 800) slow += 1;
    done += 1;
  }
}

const total = jobs.length;
const started = performance.now();
await Promise.all(Array.from({ length: PARALLEL }, worker));
const seconds = ((performance.now() - started) / 1000).toFixed(0);
console.log(`${urls.length} images, ${done}/${total} variants in ${seconds}s. ${slow} were cold (over 0.8s), ${failed} failed.`);
