import assert from "node:assert/strict";
import test from "node:test";
import {
  absoluteUrl,
  isDemoProduct,
  pageMetadata,
  productStructuredData,
  serializeJsonLd,
  type SearchProduct,
} from "../lib/seo";
import robots from "../app/robots";

const product: SearchProduct = {
  id: "test-product",
  slug: "for-honor-script",
  title: "For Honor Script",
  description: "Listed product features and video preview.",
  category: "Scripts",
  price: "19.99",
  currency: "USD",
  status: "AVAILABLE",
};

test("canonical and social URLs identify each page on the configured domain", () => {
  const metadata = pageMetadata(
    "For Honor Scripts",
    "Description",
    "/products",
  );
  assert.equal(metadata.alternates?.canonical, absoluteUrl("/products"));
  assert.equal(metadata.openGraph?.url, absoluteUrl("/products"));
  assert.ok(
    JSON.stringify(metadata.openGraph?.images).includes(
      absoluteUrl("/opengraph-image"),
    ),
  );
  assert.equal(new URL(absoluteUrl()).protocol, "https:");
});

test("product offers use actual price and availability without inventing unknown prices or preorders", () => {
  assert.equal(productStructuredData(product).offers?.price, "19.99");
  assert.equal(
    productStructuredData(product).offers?.availability,
    "https://schema.org/InStock",
  );
  assert.equal(
    productStructuredData({ ...product, status: "SOLD_OUT" }).offers
      ?.availability,
    "https://schema.org/OutOfStock",
  );
  assert.equal(
    productStructuredData({ ...product, price: null }).offers,
    undefined,
  );
  assert.equal(
    productStructuredData({ ...product, status: "COMING_SOON" }).offers,
    undefined,
  );
});

test("demo listings never advertise sample prices as real offers", () => {
  for (const demo of [
    { ...product, slug: "demo-for-honor-starter" },
    { ...product, title: "Starter (Demo)" },
  ]) {
    assert.ok(isDemoProduct(demo));
    assert.equal(productStructuredData(demo).offers, undefined);
  }
  assert.equal(isDemoProduct(product), false);
});

test("structured data cannot close its script element through product text", () => {
  const title = '</script><script>alert("test")</script>';
  const serialized = serializeJsonLd({ name: title });
  assert.equal(serialized.includes("<"), false);
  assert.equal(JSON.parse(serialized).name, title);
});

test("search crawlers can discover public pages and the sitemap", () => {
  const config = robots();
  assert.equal(config.sitemap, absoluteUrl("/sitemap.xml"));
  assert.ok(!Array.isArray(config.rules));
  const rule = config.rules as {
    userAgent: string;
    allow: string;
    disallow: string[];
  };
  assert.equal(rule.userAgent, "*");
  assert.equal(rule.allow, "/");
  assert.ok(rule.disallow.includes("/api/"));
  assert.ok(!rule.disallow.includes("/products"));
});
