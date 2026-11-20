import { discountedPrice } from "@/lib/pricing";

export function ProductPrice({
  price,
  currency,
  discountPercent = 0,
  fallback = "Ask on Discord",
}: {
  price: string | null;
  currency: string;
  discountPercent?: number;
  fallback?: string;
}) {
  if (price === null) return <>{fallback}</>;
  const discount =
    Number.isInteger(discountPercent) &&
    discountPercent > 0 &&
    discountPercent <= 100;
  return (
    <span className="product-price-display">
      {discount && (
        <span className="product-price-original">
          <del aria-label="Original price">
            {Number(price).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}{" "}
            {currency}
          </del>
          <span className="discount-badge">−{discountPercent}%</span>
        </span>
      )}
      <span className="product-price-current">
        {discountedPrice(price, discountPercent)} <small>{currency}</small>
      </span>
    </span>
  );
}
