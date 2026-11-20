import { getYouTubeEmbedUrl } from "@/lib/video";

export function ProductVideo({
  url,
  title = "Product video showcase",
  preview = false,
}: {
  url: string;
  title?: string;
  preview?: boolean;
}) {
  const embed = getYouTubeEmbedUrl(url);
  const previewEmbed = embed
    ? `${embed}?autoplay=1&mute=1&controls=0&loop=1&playlist=${embed.split("/").pop()}&playsinline=1&disablekb=1&fs=0`
    : null;
  if (embed)
    return (
      <iframe
        className="product-video"
        src={preview ? (previewEmbed ?? embed) : embed}
        title={title}
        loading="lazy"
        allowFullScreen={!preview}
        tabIndex={preview ? -1 : undefined}
        style={preview ? { pointerEvents: "none" } : undefined}
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
      <video
        className="product-video"
        src={url}
        aria-label={title}
        controls={!preview}
        autoPlay={preview}
        muted={preview}
        loop={preview}
        disablePictureInPicture={preview}
        playsInline
        preload="metadata"
      >
        Your browser does not support video playback.{" "}
        <a href={url}>Watch the preview</a>.
      </video>
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
