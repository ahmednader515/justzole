import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { discountedPrice } from "../lib/pricing";
import { ProductPrice } from "../components/product-price";
import { productStructuredData } from "../lib/seo";

test("discounts round to cents and preserve zero and full discount cases", () => {
  assert.equal(discountedPrice("19.99", 20), "15.99");
  assert.equal(discountedPrice("100.05", 10), "90.05");
  assert.equal(discountedPrice("19.99", 0), "19.99");
  assert.equal(discountedPrice("19.99", 100), "0.00");
  for (const invalid of [-1, 101, 3.5, NaN])
    assert.equal(discountedPrice("19.99", invalid), "19.99");
});

test("price display shows the original, discount, and current price only for a discount", () => {
  const props = { price: "19.99", currency: "USD", discountPercent: 20 };
  const sale = renderToStaticMarkup(createElement(ProductPrice, props));
  assert.ok(sale.includes("<del"));
  assert.ok(sale.includes("19.99 USD"));
  assert.ok(sale.includes("15.99"));
  assert.ok(sale.includes("−20%"));
  assert.ok(
    !renderToStaticMarkup(
      createElement(ProductPrice, { ...props, discountPercent: 0 }),
    ).includes("<del"),
  );
  const unknown = renderToStaticMarkup(
    createElement(ProductPrice, { ...props, price: null }),
  );
  assert.equal(unknown, "Ask on Discord");
});

test("search product offers use the same discounted price as the storefront", () => {
  const data = productStructuredData({
    id: "price-test",
    slug: "for-honor-script",
    title: "For Honor script",
    description: "Example details",
    category: "Scripts",
    price: "19.99",
    currency: "USD",
    status: "AVAILABLE",
    discountPercent: 20,
  });
  assert.equal(data.offers?.price, "15.99");
});
