type ImageLoaderParams = { src: string; width: number; quality?: number };

const SANITY_CDN = "https://cdn.sanity.io/";

// Static export has no /_next/image endpoint in production. Sanity assets are
// resized by Sanity's CDN. Local files use Cloudflare Image Transformations when
// NEXT_PUBLIC_CF_IMAGES=true (the domain must be proxied by Cloudflare), and are
// served as-is otherwise.
export default function imageLoader({ src, width, quality }: ImageLoaderParams): string {
  const q = quality ?? 75;

  if (src.startsWith(SANITY_CDN)) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(q));
    url.searchParams.set("auto", "format");
    return url.toString();
  }

  if (process.env.NEXT_PUBLIC_CF_IMAGES === "true" && src.startsWith("/")) {
    return `/cdn-cgi/image/width=${width},quality=${q},format=auto${src}`;
  }

  return src;
}
