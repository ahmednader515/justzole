import { getYouTubeEmbedUrl } from "@/lib/video";

export function ProductVideo({ url }: { url: string }) {
  const embed = getYouTubeEmbedUrl(url);
  if (embed)
    return (
      <iframe
        className="product-video"
        src={embed}
        title="Product video showcase"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || parsed.username || parsed.password)
      return null;
  } catch {
    return null;
  }
  if (/\.(mp4|webm)(\?|$)/i.test(url))
    return (
      <video className="product-video" src={url} controls preload="metadata" />
    );
  return (
    <a
      className="button button-outline"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      Watch product showcase
    </a>
  );
}
