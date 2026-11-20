import "dotenv/config";
import { db } from "../lib/db";
const token = process.env.DISCORD_BOT_TOKEN;
const guild = "1543137111526473790";
type Message = {
  id: string;
  content: string;
  timestamp: string;
  author: { bot?: boolean };
  attachments: { url: string; content_type?: string; filename: string }[];
  embeds: {
    title?: string;
    description?: string;
    url?: string;
    image?: { url: string };
    video?: { url: string };
  }[];
};
async function discord<T>(path: string): Promise<T> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await fetch(`https://discord.com/api/v10${path}`, {
      headers: { Authorization: `Bot ${token}` },
    });
    if (response.status === 429) {
      const data = await response.json();
      await new Promise((r) =>
        setTimeout(r, Math.min(Number(data.retry_after) * 1000, 10000)),
      );
      continue;
    }
    if (!response.ok)
      throw new Error(
        `Discord returned ${response.status}. Check bot permissions and channel IDs.`,
      );
    return response.json();
  }
  throw new Error("Discord rate limit reached. Retry later.");
}
async function main() {
  if (!token)
    throw new Error(
      "Add DISCORD_BOT_TOKEN to .env. The bot needs View Channels, Read Message History, and Message Content Intent.",
    );
  const channelIds = (process.env.DISCORD_PRODUCT_CHANNEL_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!channelIds.length)
    throw new Error(
      "Set DISCORD_PRODUCT_CHANNEL_IDS to comma-separated product channel IDs. Only explicitly selected channels are imported.",
    );
  let imported = 0;
  for (const channelId of channelIds) {
    if (!/^\d+$/.test(channelId)) throw new Error("Invalid channel ID.");
    const channel = await discord<{ guild_id: string; name: string }>(
      `/channels/${channelId}`,
    );
    if (channel.guild_id !== guild)
      throw new Error(
        "A selected channel is not part of the Just Zole server.",
      );
    let before = "";
    for (let page = 0; page < 20; page++) {
      const messages = await discord<Message[]>(
        `/channels/${channelId}/messages?limit=100${before ? `&before=${before}` : ""}`,
      );
      if (!messages.length) break;
      for (const m of messages) {
        if (
          await db.product.findUnique({
            where: { sourceMessageId: m.id },
            select: { id: true },
          })
        )
          continue;
        const text = [
          m.content,
          ...m.embeds.flatMap((e) => [e.title, e.description].filter(Boolean)),
        ]
          .filter(Boolean)
          .join("\n\n")
          .trim();
        if (!text && !m.attachments.length) continue;
        const image =
          m.attachments.find((a) => a.content_type?.startsWith("image/"))
            ?.url || m.embeds.find((e) => e.image)?.image?.url;
        const video =
          m.attachments.find((a) => a.content_type?.startsWith("video/"))
            ?.url ||
          m.embeds.find((e) => e.video)?.video?.url ||
          text.match(
            /https:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/,
          )?.[0];
        const title = (
          m.embeds.find((e) => e.title)?.title ||
          text.split("\n")[0] ||
          "Untitled Discord listing"
        )
          .replace(/^[#*\s]+|[*\s]+$/g, "")
          .slice(0, 150);
        await db.product.create({
          data: {
            title,
            slug: `discord-${m.id}`,
            description:
              text ||
              "Media imported from Discord. Add product details before publishing.",
            game: "Needs review",
            category: "Scripts",
            imageUrl: image,
            videoUrl: video,
            features: [],
            published: false,
            sourceMessageId: m.id,
            discordUrl: `https://discord.com/channels/${guild}/${channelId}/${m.id}`,
          },
        });
        imported++;
      }
      before = messages[messages.length - 1].id;
      if (messages.length < 100) break;
    }
  }
  console.log(
    `Imported ${imported} new draft listings. Review each in the dashboard: set game, price, features, and upload Discord media to R2 before publishing. Discord attachment URLs can expire.`,
  );
}
main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : "Import failed");
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
