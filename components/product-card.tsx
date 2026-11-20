import Link from "next/link";
import { Crosshair, Code2 } from "lucide-react";
import { ProductVideo } from "./video";
import { ProductPrice } from "./product-price";
import { defaultHomepageContent } from "@/lib/homepage-defaults";
const defaultCopy = defaultHomepageContent().products.text;
export type CatalogProduct = {
  id: string;
  slug: string;
  title: string;
  description: string;
  game: string;
  category: string;
  price: string | null;
  discountPercent?: number;
  currency: string;
  videoUrl: string | null;
  status: string;
  featured: boolean;
  createdAt: string;
};
export function ProductCard({
  product: p,
  copy,
}: {
  product: CatalogProduct;
  copy?: Record<string, string>;
}) {
  const text = { ...defaultCopy, ...copy };
  return (
    <article className="product-card">
      <div className="product-art">
        {p.videoUrl ? (
          <ProductVideo url={p.videoUrl} title={`${p.title} preview`} preview />
        ) : (
          <div className="product-placeholder">
            <Crosshair size={90} strokeWidth={0.65} />
            <span>{p.game}</span>
          </div>
        )}
        <span className={`tag status-${p.status.toLowerCase()}`}>
          {p.status === "AVAILABLE"
            ? text.available
            : p.status === "SOLD_OUT"
              ? text.soldOut
              : text.comingSoon}
        </span>
      </div>
      <div className="product-body">
        <div className="product-meta">
          <span>{p.game}</span>
          <span>
            <Code2 size={13} /> {p.category}
          </span>
        </div>
        <h3>
          <Link href={`/products/${p.slug}`}>{p.title}</Link>
        </h3>
        <p>{p.description}</p>
        <div className="product-card-bottom">
          <strong>
            <ProductPrice
              price={p.price}
              currency={p.currency}
              discountPercent={p.discountPercent}
              fallback={text.cardPricing}
            />
          </strong>
          <Link href={`/products/${p.slug}`}>
            {text.cardView} <Crosshair size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
