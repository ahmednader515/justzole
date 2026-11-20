const youtubeHosts = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

export function isProductVideoUrl(value: string): boolean {
  if (getYouTubeEmbedUrl(value)) return true;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      /\.(mp4|webm)$/i.test(url.pathname)
    );
  } catch {
    return false;
  }
}

export function getYouTubeEmbedUrl(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password) return null;

  const parts = url.pathname.split("/").filter(Boolean);
  let id: string | null = null;
  if (url.hostname === "youtu.be" || url.hostname === "www.youtu.be") {
    if (parts.length === 1) id = parts[0];
  } else if (youtubeHosts.has(url.hostname)) {
    if (url.pathname === "/watch") id = url.searchParams.get("v");
    else if (
      parts.length === 2 &&
      ["shorts", "embed", "live"].includes(parts[0])
    ) {
      id = parts[1];
    }
  }

  return id && /^[a-zA-Z0-9_-]{11}$/.test(id)
    ? `https://www.youtube-nocookie.com/embed/${id}`
    : null;
}
