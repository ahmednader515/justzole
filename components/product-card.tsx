import Link from "next/link";
import { Crosshair, Play, Code2 } from "lucide-react";
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
  currency: string;
  imageUrl: string | null;
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
    <Link href={`/products/${p.slug}`} className="product-card">
      <div className="product-art">
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.title} loading="lazy" />
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
        {p.videoUrl && (
          <span className="video-badge">
            <Play size={12} fill="currentColor" /> {text.cardVideo}
          </span>
        )}
      </div>
      <div className="product-body">
        <div className="product-meta">
          <span>{p.game}</span>
          <span>
            <Code2 size={13} /> {p.category}
          </span>
        </div>
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        <div className="product-card-bottom">
          <strong>
            {p.price !== null ? (
              <>
                {Number(p.price).toLocaleString()} <small>{p.currency}</small>
              </>
            ) : (
              text.cardPricing
            )}
          </strong>
          <span>
            {text.cardView} <Crosshair size={15} />
          </span>
        </div>
      </div>
    </Link>
  );
}
