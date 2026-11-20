import Link from "next/link";
import { Crosshair, Play, Code2 } from "lucide-react";
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
export function ProductCard({ product: p }: { product: CatalogProduct }) {
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
          {p.status.replaceAll("_", " ")}
        </span>
        {p.videoUrl && (
          <span className="video-badge">
            <Play size={12} fill="currentColor" /> Showcase
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
              "Ask on Discord"
            )}
          </strong>
          <span>
            View product <Crosshair size={15} />
          </span>
        </div>
      </div>
    </Link>
  );
}
