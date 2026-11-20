export function discountedPrice(price: string, discountPercent = 0): string {
  const cents = Math.round(Number(price) * 100);
  const discount =
    Number.isInteger(discountPercent) &&
    discountPercent >= 0 &&
    discountPercent <= 100
      ? discountPercent
      : 0;
  return (Math.round((cents * (100 - discount)) / 100) / 100).toFixed(2);
}
