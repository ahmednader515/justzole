import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { currentUser } from "@/lib/auth";
import { videoUploadSchema } from "@/lib/upload";
import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const user = await currentUser();
  if (user?.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  // Only metadata crosses the application; video bytes go straight to R2.
  if (Number(request.headers.get("content-length") || 0) > 8192)
    return NextResponse.json(
      { error: "Send video metadata only." },
      { status: 413 },
    );
  let data: unknown;
  try {
    const body = await request.text();
    if (body.length > 8192) throw new Error("Metadata too large");
    data = JSON.parse(body);
  } catch {
    return NextResponse.json(
      { error: "Invalid upload request." },
      { status: 400 },
    );
  }
  const parsed = videoUploadSchema.safeParse(data);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Choose an MP4 or WebM video up to 1 GB." },
      { status: 400 },
    );
  const {
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME,
    R2_PUBLIC_URL,
  } = process.env;
  if (
    !R2_ACCOUNT_ID ||
    !R2_ACCESS_KEY_ID ||
    !R2_SECRET_ACCESS_KEY ||
    !R2_BUCKET_NAME ||
    !R2_PUBLIC_URL
  )
    return NextResponse.json(
      {
        error:
          "Video storage is not configured. Check the R2 environment variables.",
      },
      { status: 503 },
    );
  try {
    const { type, size } = parsed.data;
    const key = `products/${crypto.randomUUID()}.${type === "video/mp4" ? "mp4" : "webm"}`;
    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        ContentType: type,
        ContentLength: size,
      }),
      {
        expiresIn: 1800,
        signableHeaders: new Set(["content-type", "content-length"]),
      },
    );
    return NextResponse.json(
      { uploadUrl, url: `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}` },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not prepare the upload. Check Cloudflare R2 configuration.",
      },
      { status: 502 },
    );
  }
}
