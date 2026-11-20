import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { absoluteUrl, isDemoProduct } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await db.product.findMany({
    where: { published: true },
    select: { slug: true, title: true, updatedAt: true },
  });
  return [
    { url: absoluteUrl("/"), priority: 1 },
    { url: absoluteUrl("/products"), priority: 0.9 },
    ...products
      .filter((p) => !isDemoProduct(p))
      .map((p) => ({
        url: absoluteUrl(`/products/${encodeURIComponent(p.slug)}`),
        lastModified: p.updatedAt,
        priority: 0.8,
      })),
  ];
}
