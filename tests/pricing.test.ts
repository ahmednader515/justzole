import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  activeDiscount,
  countdownParts,
  discountedPrice,
} from "../lib/pricing";
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

test("discount deadline expires at the saved instant and countdown never goes negative", () => {
  const deadline = "2026-11-22T18:00:00.000Z";
  const end = Date.parse(deadline);
  assert.deepEqual(countdownParts(deadline, end - 48 * 3600000), [2, 0, 0, 0]);
  assert.deepEqual(countdownParts(deadline, end - 3661000), [0, 1, 1, 1]);
  assert.deepEqual(countdownParts(deadline, end + 1000), [0, 0, 0, 0]);
  assert.equal(discountedPrice("100", 40, deadline, end - 1), "60.00");
  assert.equal(discountedPrice("100", 40, deadline, end), "100.00");
  assert.equal(discountedPrice("100", 40, null, end), "60.00");
  assert.equal(activeDiscount(40, "invalid", end), 0);
});

test("expired discounts disappear from the price display and structured data", () => {
  const props = {
    price: "100",
    currency: "USD",
    discountPercent: 40,
    discountEndsAt: "2020-01-01T00:00:00Z",
    showCountdown: true,
  };
  const html = renderToStaticMarkup(createElement(ProductPrice, props));
  assert.ok(!html.includes("<del"));
  assert.ok(!html.includes('role="timer"'));
  assert.ok(html.includes("100.00"));
  const data = productStructuredData({
    ...props,
    id: "expiry",
    slug: "script",
    title: "Script",
    description: "Details",
    category: "Scripts",
    status: "AVAILABLE",
  });
  assert.equal(data.offers?.price, "100.00");
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
