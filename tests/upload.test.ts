import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_VIDEO_BYTES,
  videoUploadSchema,
  readUploadTicket,
} from "../lib/upload";

test("video uploads accept large files through 1 GB and reject invalid metadata", () => {
  for (const size of [30 * 1024 ** 2, MAX_VIDEO_BYTES])
    assert.equal(
      videoUploadSchema.safeParse({ type: "video/mp4", size }).success,
      true,
    );
  for (const size of [0, -1, 0.5, MAX_VIDEO_BYTES + 1])
    assert.equal(
      videoUploadSchema.safeParse({ type: "video/webm", size }).success,
      false,
    );
  assert.equal(
    videoUploadSchema.safeParse({ type: "image/png", size: 100 }).success,
    false,
  );
});

test("plain-text hosting rejection becomes a readable error", async () => {
  await assert.rejects(
    readUploadTicket(new Response("Request Entity Too Large", { status: 413 })),
    /too large/,
  );
  await assert.rejects(
    readUploadTicket(new Response("Bad Gateway", { status: 502 })),
    /502/,
  );
  await assert.rejects(
    readUploadTicket(Response.json({ error: "Unauthorized" }, { status: 403 })),
    /Unauthorized/,
  );
});

test("upload tickets require both URLs", async () => {
  await assert.rejects(
    readUploadTicket(new Response("<html>Sign in</html>")),
    /invalid upload response/,
  );
  await assert.rejects(
    readUploadTicket(Response.json({ url: "https://example.com/video.mp4" })),
    /invalid upload response/,
  );
  const ticket = {
    uploadUrl: "https://storage.example.com/signed",
    url: "https://media.example.com/video.mp4",
  };
  assert.deepEqual(await readUploadTicket(Response.json(ticket)), ticket);
});
