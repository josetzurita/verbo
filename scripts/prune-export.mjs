// Runs after `next build`. In production the styleguide page renders the 404 body, but the static export
// still writes it as out/styleguide/index.html, which Workers serves with a 200 (a soft 404). Removing it
// lets not_found_handling answer with the real 404 page.
import { readFile, rename, rm } from "node:fs/promises";

if (process.env.ENABLE_STYLEGUIDE !== "true") {
  await rm(new URL("../out/styleguide", import.meta.url), { recursive: true, force: true });
  await rm(new URL("../out/styleguide.txt", import.meta.url), { force: true });
}

// The Spanish 404 is built as a normal page (app/(es)/es/404). Moving it to out/es/404.html makes it the nearest
// 404 for every /es/* URL, and removes /es/404/ as a page that would answer 200.
const spanish404 = new URL("../out/es/404/index.html", import.meta.url);
try {
  await readFile(spanish404);
  await rename(spanish404, new URL("../out/es/404.html", import.meta.url));
  await rm(new URL("../out/es/404", import.meta.url), { recursive: true, force: true });
  await rm(new URL("../out/es/404.txt", import.meta.url), { force: true });
} catch {
  console.warn("[prune-export] No out/es/404/index.html to move.");
}
