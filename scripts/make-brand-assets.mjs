// Builds the favicon set and the Open Graph image from the brand paths and Figtree Light (scripts/fonts, OFL).
// Run with: node scripts/make-brand-assets.mjs
import { readFileSync, writeFileSync, rmSync, existsSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const paths = readFileSync(join(root, "lib/brand-paths.ts"), "utf8");
const read = (name) => paths.match(new RegExp(`export const ${name} = "([^"]+)"`))[1];
const ring = read("verboMarkRing");
const pupil = read("verboMarkPupil");
const letters = [...paths.matchAll(/"(M[^"]+)"/g)]
  .map((m) => m[1])
  .filter((d) => d !== ring && d !== pupil && d.length < 20000)
  .slice(-6);
const wordPaths = paths.match(/export const verboWordLetters = \[([\s\S]*?)\] as const/);
const wordLetters = wordPaths ? [...wordPaths[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]) : letters;

const FIELD = "#39170d";
const TYPE = "#faf5ee";
const MARK_W = 36.7778;
const MARK_H = 34.9572;

// The mark centered in a square. `field` fills the square (home-screen icons need one); null leaves it
// transparent. `ink` is a fill color, or "adaptive" for field-colored on light tabs and type-colored on dark ones.
function markSvg(size, scale, { field = FIELD, ink = TYPE } = {}) {
  const w = size * scale;
  const k = w / MARK_W;
  const x = (size - MARK_W * k) / 2;
  const y = (size - MARK_H * k) / 2;
  const adaptive = ink === "adaptive";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${
    adaptive
      ? `
  <style>.mark{fill:${FIELD}}@media (prefers-color-scheme: dark){.mark{fill:${TYPE}}}</style>`
      : ""
  }${field ? `
  <rect width="${size}" height="${size}" fill="${field}"/>` : ""}
  <g class="mark" transform="translate(${x} ${y}) scale(${k})"${adaptive ? "" : ` fill="${ink}"`}>
    <path fill-rule="evenodd" clip-rule="evenodd" d="${ring}"/>
    <path d="${pupil}"/>
  </g>
</svg>`;
}

const png = (svg) => sharp(Buffer.from(svg)).png().toBuffer();
const out = (file, data) => writeFileSync(join(root, file), data);

// Favicon set. The tab icon is transparent and follows the browser theme; home-screen icons keep the field.
const tabIcon = markSvg(32, 0.94, { field: null, ink: "adaptive" });
out("app/icon.svg", tabIcon);
out("public/favicon.svg", tabIcon);
out("app/apple-icon.png", await png(markSvg(180, 0.6)));
out("public/icon-192.png", await png(markSvg(192, 0.64)));
out("public/icon-512.png", await png(markSvg(512, 0.64)));
out("public/icon-maskable-512.png", await png(markSvg(512, 0.46)));
if (existsSync(join(root, "app/apple-icon.svg"))) rmSync(join(root, "app/apple-icon.svg"));

// favicon.ico: three PNG entries in an ICO container, for browsers without SVG icons. An ICO cannot
// follow the theme, so it uses the field color, which reads on the light tab strips those browsers default to.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(markSvg(s, 0.94, { field: null, ink: FIELD }))));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const at = 6 + i * 16;
  header.writeUInt8(s, at);
  header.writeUInt8(s, at + 1);
  header.writeUInt16LE(1, at + 4);
  header.writeUInt16LE(32, at + 6);
  header.writeUInt32LE(images[i].length, at + 8);
  header.writeUInt32LE(offset, at + 12);
  offset += images[i].length;
});
out("app/favicon.ico", Buffer.concat([header, ...images]));

// Open Graph image: the hero as a poster. The headline at the top, the wordmark across the bottom
// with the slogan set where the hero sets it (left 60.2%, top 0.6%, 2.45% of the wordmark width).
const W = 1200;
const H = 630;
const padX = 56;
const padTop = 52;
const padBottom = 44;
const wordW = W - padX * 2;
const wordH = Math.round((wordW * 404.901) / 1632);
const wordTop = H - padBottom - wordH;
const wordmark = `<svg xmlns="http://www.w3.org/2000/svg" width="${wordW}" height="${wordH}" viewBox="0 0 1632 404.901">${wordLetters
  .map((d) => `<path d="${d}" fill="${TYPE}"/>`)
  .join("")}</svg>`;

// Figtree Light through Pango. Sizes are pixels (dpi 72), tracking is in em, leading is a multiple of the size.
// Pango cannot open a font under a non-ASCII path (this repo sits in "JOSÉ TOVAR DOCS"), so it reads a temp copy.
const fontfile = join(tmpdir(), "verbo-figtree-light.ttf");
copyFileSync(join(root, "scripts/fonts/Figtree-Light.ttf"), fontfile);
const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
function setType(lines, size, tracking, leading) {
  const spacing = Math.round(tracking * size * 1024);
  const text = lines
    .map((line) => `<span foreground="${TYPE}" letter_spacing="${spacing}">${escape(line)}</span>`)
    .join("\n");
  return sharp({
    text: { text, font: `Figtree Light ${size}`, fontfile, dpi: 72, rgba: true, spacing: Math.round(size * (leading - 1.2)) },
  })
    .png()
    .toBuffer();
}

const headline = await setType(["Creating to shape", "the world."], 92, -0.04, 0.96);
const sloganSize = Math.round(wordW * 0.0245);
const slogan = await setType(["Strategy", "Brand & Growth"], sloganSize, -0.03, 1.05);

await sharp({ create: { width: W, height: H, channels: 3, background: FIELD } })
  .composite([
    { input: headline, left: padX - 4, top: padTop },
    { input: Buffer.from(wordmark), left: padX, top: wordTop },
    { input: slogan, left: Math.round(padX + wordW * 0.602), top: Math.round(wordTop + wordH * 0.006) },
  ])
  .png()
  .toFile(join(root, "public/og.png"));

console.log("Brand assets written.");
