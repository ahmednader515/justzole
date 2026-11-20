import { db } from "./db";
export async function getCatalog() {
  const products = await db.product.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return products.map((p) => ({
    ...p,
    price: p.price?.toString() ?? null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
}
