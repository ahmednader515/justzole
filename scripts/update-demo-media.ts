import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { db } from "../lib/db";

const demos = [
  { slug: "demo-for-honor-starter", price: "9.99", video: "zkK5xtMJ58U" },
  { slug: "demo-for-honor-duelist", price: "19.99", video: "cBzhMK22XRs" },
  { slug: "demo-for-honor-dominion", price: "29.99", video: "zkK5xtMJ58U" },
  { slug: "demo-for-honor-controller", price: "14.99", video: "cBzhMK22XRs" },
  { slug: "demo-for-honor-training", price: "7.99", video: "zkK5xtMJ58U" },
  { slug: "demo-for-honor-complete", price: null, video: "cBzhMK22XRs" },
];
const mediaNote =
  "Images and video are official For Honor promotional media used for this demo, not demonstrations of a script.";

type SteamDetails = {
  "304390": {
    success: boolean;
    data: { name: string; screenshots: { path_full: string }[] };
  };
};

async function main() {
  const response = await fetch(
    "https://store.steampowered.com/api/appdetails?appids=304390",
  );
  if (!response.ok)
    throw new Error("Could not read the official For Honor media listing.");
  const listing = ((await response.json()) as SteamDetails)["304390"];
  if (!listing.success || listing.data.screenshots.length < demos.length)
    throw new Error("Not enough official screenshots available.");

  const directory = path.join(process.cwd(), "artifacts", "demo-products");
  await mkdir(directory, { recursive: true });
  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
  const updates: {
    id: string;
    imageUrl: string;
    videoUrl: string;
    price: string | null;
    description: string;
  }[] = [];
  const sources: { product: string; image: string; video: string }[] = [];

  for (const [index, demo] of demos.entries()) {
    const product = await db.product.findUnique({ where: { slug: demo.slug } });
    if (!product)
      throw new Error(
        `Missing demo product: ${demo.slug}. Run db:seed:demo first.`,
      );
    const source = listing.data.screenshots[index].path_full;
    const imageResponse = await fetch(source);
    if (
      !imageResponse.ok ||
      !imageResponse.headers.get("content-type")?.startsWith("image/")
    )
      throw new Error("Screenshot download failed.");
    const bytes = Buffer.from(await imageResponse.arrayBuffer());
    if (
      bytes[0] !== 0xff ||
      bytes[1] !== 0xd8 ||
      bytes.length > 8 * 1024 * 1024
    )
      throw new Error("Unexpected screenshot format.");
    const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
    const filename = `${demo.slug}-${hash}.jpg`;
    await writeFile(path.join(directory, filename), bytes);
    const key = `products/demos/${filename}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: bytes,
        ContentType: "image/jpeg",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    const imageUrl = `${process.env.R2_PUBLIC_URL!.replace(/\/$/, "")}/${key}`;
    const check = await fetch(imageUrl, { method: "HEAD" });
    if (!check.ok || !check.headers.get("content-type")?.startsWith("image/"))
      throw new Error("Public R2 image is not accessible.");
    const videoUrl = `https://www.youtube.com/watch?v=${demo.video}`;
    updates.push({
      id: product.id,
      imageUrl,
      videoUrl,
      price: demo.price,
      description: product.description.includes(mediaNote)
        ? product.description
        : `${product.description}\n\n${mediaNote}`,
    });
    sources.push({ product: demo.slug, image: source, video: videoUrl });
    console.log(`Prepared image and video for ${product.title}.`);
  }

  await db.$transaction(
    updates.map(({ id, ...data }) =>
      db.product.update({ where: { id }, data: { ...data, currency: "USD" } }),
    ),
  );
  await writeFile(
    path.join(directory, "sources.json"),
    JSON.stringify(
      {
        source: "https://store.steampowered.com/app/304390/",
        note: mediaNote,
        products: sources,
      },
      null,
      2,
    ),
  );
  console.log(
    "Updated all six demo products with verified public images, YouTube trailers, and sample USD prices. Other products and recorded sales were preserved.",
  );
}

main()
  .catch((error) => {
    console.error(
      error instanceof Error ? error.message : "Could not update demo media.",
    );
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
