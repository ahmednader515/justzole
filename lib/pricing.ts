export function activeDiscount(
  discountPercent = 0,
  endsAt?: string | Date | null,
  now = Date.now(),
): number {
  if (
    !Number.isInteger(discountPercent) ||
    discountPercent < 0 ||
    discountPercent > 100
  )
    return 0;
  if (endsAt && !(new Date(endsAt).getTime() > now)) return 0;
  return discountPercent;
}

export function countdownParts(endsAt: string, now: number) {
  const seconds = Math.max(
    0,
    Math.ceil((new Date(endsAt).getTime() - now) / 1000),
  );
  return [
    Math.floor(seconds / 86400),
    Math.floor(seconds / 3600) % 24,
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ];
}

export function discountedPrice(
  price: string,
  discountPercent = 0,
  endsAt?: string | Date | null,
  now = Date.now(),
): string {
  const cents = Math.round(Number(price) * 100);
  const discount = activeDiscount(discountPercent, endsAt, now);
  return (Math.round((cents * (100 - discount)) / 100) / 100).toFixed(2);
}
