import { ProductPriceLive } from "./product-price-live";
import type { ComponentProps } from "react";

export function ProductPrice(
  props: Omit<ComponentProps<typeof ProductPriceLive>, "initialNow">,
) {
  return <ProductPriceLive {...props} initialNow={Date.now()} />;
}
