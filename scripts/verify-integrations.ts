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
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a6GkAAAAASUVORK5CYII=",
      "base64",
    );
    const f = new FormData();
    f.set(
      "file",
      new File([png], "integration-test.png", { type: "image/png" }),
    );
    const response = await fetch(base + "/api/upload", {
      method: "POST",
      headers: { cookie, origin: base },
      body: f,
    });
    const result = await response.json();
    assert.equal(
      response.status,
      400,
      "Product image uploads must be rejected",
    );
    assert.equal(result.error, "Choose an MP4 or WebM video up to 25 MB.");
    console.log(
      "PASS: public routes, anonymous admin redirects, protected uploads, admin pages, hashed admin password, and product image upload rejection.",
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
