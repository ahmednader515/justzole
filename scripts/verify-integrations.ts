import "dotenv/config";
import assert from "node:assert/strict";
import { createHash, randomBytes } from "node:crypto";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { db } from "../lib/db";
async function main() {
  const base = "http://localhost:3000";
  for (const route of ["/", "/products", "/login", "/register"])
    assert.equal((await fetch(base + route)).status, 200, route);
  for (const route of [
    "/admin",
    "/admin/users",
    "/admin/analytics",
    "/admin/products/new",
  ]) {
    const r = await fetch(base + route, { redirect: "manual" });
    assert.equal(r.status, 307);
    assert.equal(r.headers.get("location"), "/login");
  }
  assert.equal(
    (await fetch(base + "/api/upload", { method: "POST" })).status,
    403,
  );
  const admin = await db.user.findUniqueOrThrow({
    where: { email: "admin@zole.com" },
  });
  assert.equal(admin.role, "ADMIN");
  assert.ok(admin.passwordHash.startsWith("$2"));
  const token = randomBytes(32).toString("hex");
  const id = createHash("sha256").update(token).digest("hex");
  await db.session.create({
    data: { id, userId: admin.id, expiresAt: new Date(Date.now() + 600000) },
  });
  let objectKey: string | undefined;
  try {
    const cookie = `zole-session=${token}`;
    for (const route of [
      "/admin",
      "/admin/products",
      "/admin/sales",
      "/admin/users",
      "/admin/analytics",
      "/admin/products/new",
    ])
      assert.equal(
        (await fetch(base + route, { headers: { cookie } })).status,
        200,
        route,
      );
    const sign = (type: string, size: number) =>
      fetch(base + "/api/upload", {
        method: "POST",
        headers: { cookie, origin: base, "content-type": "application/json" },
        body: JSON.stringify({ type, size }),
      });
    const response = await sign("image/png", 100);
    const result = await response.json();
    assert.equal(
      response.status,
      400,
      "Product image uploads must be rejected",
    );
    assert.equal(result.error, "Choose an MP4 or WebM video up to 1 GB.");
    assert.equal((await sign("video/mp4", 1024 ** 3 + 1)).status, 400);
    const video = Buffer.alloc(30 * 1024 * 1024);
    const ticketResponse = await sign("video/mp4", video.length);
    assert.equal(ticketResponse.status, 200);
    const ticket = await ticketResponse.json();
    objectKey = new URL(ticket.url).pathname.split("/").slice(-2).join("/");
    const preflight = await fetch(ticket.uploadUrl, {
      method: "OPTIONS",
      headers: {
        Origin: "https://justzole.com",
        "Access-Control-Request-Method": "PUT",
        "Access-Control-Request-Headers": "content-type",
      },
    });
    assert.ok(preflight.ok, "Production upload CORS preflight");
    assert.equal(
      preflight.headers.get("access-control-allow-origin"),
      "https://justzole.com",
    );
    const uploaded = await fetch(ticket.uploadUrl, {
      method: "PUT",
      headers: { "content-type": "video/mp4" },
      body: video,
    });
    assert.ok(uploaded.ok, `Direct 30 MB upload: ${uploaded.status}`);
    const publicVideo = await fetch(ticket.url, { method: "HEAD" });
    assert.equal(publicVideo.status, 200);
    assert.equal(
      Number(publicVideo.headers.get("content-length")),
      video.length,
    );
    console.log(
      "PASS: public/admin routes, protected signing, file validation, production CORS, and direct 30 MB R2 upload/public delivery. Temporary upload removed.",
    );
  } finally {
    await db.session.deleteMany({ where: { id } });
    if (objectKey) {
      const s3 = new S3Client({
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
      });
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: objectKey,
        }),
      );
    }
  }
}
main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : "Verification failed");
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
