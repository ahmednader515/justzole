-- Additive, idempotent upgrade for existing databases; preserves all product data.
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "discountPercent" INTEGER NOT NULL DEFAULT 0;
