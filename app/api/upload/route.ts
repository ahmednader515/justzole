import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const user = await currentUser();
  if (user?.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > 26 * 1024 * 1024)
    return NextResponse.json(
      { error: "Maximum upload is 25 MB." },
      { status: 413 },
    );
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid upload request." },
      { status: 400 },
    );
  }
  const file = data.get("file");
  const types: Record<string, string> = {
    "video/mp4": "mp4",
    "video/webm": "webm",
  };
  if (
    !(file instanceof File) ||
    !types[file.type] ||
    !file.size ||
    file.size > 25 * 1024 * 1024
  )
    return NextResponse.json(
      { error: "Choose an MP4 or WebM video up to 25 MB." },
      { status: 400 },
    );
  try {
    const key = `products/${crypto.randomUUID()}.${types[file.type]}`;
    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    return NextResponse.json({
      url: `${process.env.R2_PUBLIC_URL!.replace(/\/$/, "")}/${key}`,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Upload failed. Check Cloudflare R2 configuration and bucket permissions.",
      },
      { status: 502 },
    );
  }
}
