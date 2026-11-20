import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { getYouTubeEmbedUrl, isProductVideoUrl } from "../lib/video";
import { ProductVideo } from "../components/video";

const id = "M7lc1UVf-VE";
const embed = `https://www.youtube-nocookie.com/embed/${id}`;

test("feature video previews autoplay muted, loop, and expose no controls", () => {
  const markup = renderToStaticMarkup(
    createElement(ProductVideo, {
      url: "https://media.example/feature.mp4",
      preview: true,
    }),
  );
  for (const attribute of [
    'autoPlay=""',
    'muted=""',
    'loop=""',
    'playsInline=""',
    'disablePictureInPicture=""',
    'disableRemotePlayback=""',
  ])
    assert.ok(markup.includes(attribute), attribute);
  assert.ok(!markup.includes('controls=""'));
  const youtube = renderToStaticMarkup(
    createElement(ProductVideo, {
      url: `https://youtu.be/${id}`,
      preview: true,
    }),
  );
  for (const parameter of [
    "autoplay=1",
    "mute=1",
    "loop=1",
    "controls=0",
    `playlist=${id}`,
  ])
    assert.ok(youtube.includes(parameter));
});

test("feature video fields accept playable HTTPS videos and reject unsupported or unsafe links", () => {
  for (const url of [
    `https://youtu.be/${id}`,
    "https://media.example/video.mp4?token=abc",
    "https://media.example/video.webm#t=1",
  ])
    assert.ok(isProductVideoUrl(url));
  for (const url of [
    "",
    "https://",
    "http://media.example/video.mp4",
    "https://media.example/image.png",
    "https://user:secret@media.example/video.mp4",
    "javascript:alert(1)",
  ])
    assert.equal(isProductVideoUrl(url), false);
});

test("recognizes watch, shared, mobile, Shorts, live, and embed links", () => {
  for (const url of [
    `https://www.youtube.com/watch?v=${id}&feature=shared`,
    `https://youtu.be/${id}?si=shared`,
    `https://youtu.be/${id}/`,
    `https://m.youtube.com/watch?v=${id}`,
    `https://music.youtube.com/watch?v=${id}`,
    `https://www.youtube.com/shorts/${id}?feature=share`,
    `https://www.youtube.com/live/${id}`,
    `https://www.youtube.com/embed/${id}`,
    embed,
  ])
    assert.equal(getYouTubeEmbedUrl(url), embed, url);
});

test("rejects invalid URLs, video IDs, and lookalike domains", () => {
  for (const url of [
    "",
    "not a URL",
    "javascript:alert(1)",
    `https://youtube.com.evil.example/watch?v=${id}`,
    `https://evil.example/watch?v=${id}`,
    `https://youtube.com@evil.example/watch?v=${id}`,
    `https://user:pass@youtube.com/watch?v=${id}`,
    `https://youtube.com/watch?v=invalid`,
    `https://youtu.be/${id}/extra`,
  ])
    assert.equal(getYouTubeEmbedUrl(url), null, url);
});

test("renders the privacy-enhanced player with referrer and playback permissions", () => {
  const markup = renderToStaticMarkup(
    createElement(ProductVideo, { url: `https://youtu.be/${id}` }),
  );
  assert.ok(markup.includes(`src="${embed}"`));
  assert.ok(
    markup.includes('referrerPolicy="strict-origin-when-cross-origin"'),
  );
  assert.ok(markup.includes("encrypted-media"));
  assert.ok(markup.includes("picture-in-picture"));
  assert.ok(markup.includes('allowFullScreen=""'));
});

test("retains direct video support and handles incomplete editor input safely", () => {
  const markup = renderToStaticMarkup(
    createElement(ProductVideo, {
      url: "https://media.example/video.mp4?token=example",
    }),
  );
  assert.ok(markup.includes("<video"));
  assert.ok(markup.includes('controls=""'));
  assert.equal(
    renderToStaticMarkup(createElement(ProductVideo, { url: "https://" })),
    "",
  );
});
