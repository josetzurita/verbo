// Runs after `next build`. In production the styleguide page renders the 404 body, but the static export
// still writes it as out/styleguide/index.html, which Workers serves with a 200 (a soft 404). Removing it
// lets not_found_handling answer with the real 404 page.
import { rm } from "node:fs/promises";

if (process.env.ENABLE_STYLEGUIDE !== "true") {
  await rm(new URL("../out/styleguide", import.meta.url), { recursive: true, force: true });
  await rm(new URL("../out/styleguide.txt", import.meta.url), { force: true });
}
