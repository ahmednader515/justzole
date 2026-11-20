"use client";
import { useEffect, useState } from "react";
import { activeDiscount, countdownParts, discountedPrice } from "@/lib/pricing";

export function ProductPriceLive({
  price,
  currency,
  discountPercent = 0,
  fallback = "Ask on Discord",
  discountEndsAt,
  showCountdown = false,
  initialNow,
}: {
  price: string | null;
  currency: string;
  discountPercent?: number;
  fallback?: string;
  discountEndsAt?: string | null;
  showCountdown?: boolean;
  initialNow: number;
}) {
  const [now, setNow] = useState(initialNow);
  useEffect(() => {
    if (!discountEndsAt) return;
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [discountEndsAt]);
  if (price === null) return <>{fallback}</>;
  const discount = activeDiscount(discountPercent, discountEndsAt, now);
  return (
    <span
      className={`product-price-display${showCountdown && discount > 0 && discountEndsAt ? " product-price-with-countdown" : ""}`}
    >
      {discount > 0 && (
        <span className="product-price-original">
          <del aria-label="Original price">
            {Number(price).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}{" "}
            {currency}
          </del>
          <span className="discount-badge">−{discount}%</span>
        </span>
      )}
      <span className="product-price-current">
        {discountedPrice(price, discount)} <small>{currency}</small>
      </span>
      {showCountdown && discount > 0 && discountEndsAt && (
        <span
          className="discount-countdown"
          role="timer"
          aria-label="Discount time remaining"
          aria-live="off"
        >
          <span className="discount-countdown-digits">
            {countdownParts(discountEndsAt, now).map((value, index) => (
              <span className="discount-time-unit" key={index}>
                <b>{String(value).padStart(2, "0")}</b>
                <small>{["days", "hrs", "min", "sec"][index]}</small>
              </span>
            ))}
          </span>
        </span>
      )}
    </span>
  );
}
