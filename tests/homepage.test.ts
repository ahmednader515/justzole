import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  defaultHomepageContent,
  homepageKeys,
  mergeHomepageContent,
} from "../lib/homepage-defaults";
import { ServerRules } from "../components/server-rules";

test("existing homepage content stays available before the first admin save", () => {
  const content = mergeHomepageContent([]);
  assert.ok(homepageKeys.every((key) => content[key].visible));
  assert.equal(content.hero.text.titleFirst, "YOUR GAME.");
  assert.equal(content.howToUse.text.firstTitle, "Run the Script");
  assert.ok(content.rules.text.licenseRules.includes("ONE PC ONLY"));
});

test("hidden sections retain edits, and new fields inherit defaults", () => {
  const rows = [
    {
      key: "hero",
      visible: false,
      text: { titleFirst: "CUSTOM HEADING", description: "" },
    },
  ];
  const content = mergeHomepageContent(rows);
  assert.equal(content.hero.visible, false);
  assert.equal(content.hero.text.titleFirst, "CUSTOM HEADING");
  assert.equal(content.hero.text.description, "");
  assert.equal(content.hero.text.titleAccent, "EDGE.");
  assert.equal(content.products.visible, true);
  assert.equal(
    mergeHomepageContent([{ ...rows[0], visible: true }]).hero.text.titleFirst,
    "CUSTOM HEADING",
  );
});

test("malformed stored fields and unknown sections cannot override defaults", () => {
  const content = mergeHomepageContent([
    { key: "unknown", visible: false, text: { titleFirst: "wrong" } },
    {
      key: "hero",
      visible: true,
      text: { titleFirst: 42, unexpected: "ignored" },
    },
    { key: "footer", visible: true, text: null },
  ]);
  assert.equal(content.hero.text.titleFirst, "YOUR GAME.");
  assert.equal(content.hero.text.unexpected, undefined);
  assert.ok(content.footer.text.copyright.includes("{year}"));
});

test("edited rule lists render safely as text and support additional lines", () => {
  const text = defaultHomepageContent().rules.text;
  const markup = renderToStaticMarkup(
    createElement(ServerRules, {
      text: {
        ...text,
        licenseRules: '<script>alert("x")</script>\nA newly added rule',
      },
    }),
  );
  assert.ok(!markup.includes("<script>"));
  assert.ok(markup.includes("&lt;script&gt;"));
  assert.ok(markup.includes("A newly added rule"));
});
