import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { Brand, DiscordIcon } from "./icons";
import { ProductVideo } from "./video";
import type { CatalogProduct } from "./product-card";

export function ProductShowcase({
  products,
  text,
  brand,
}: {
  products: CatalogProduct[];
  text: Record<string, string>;
  brand?: Record<string, string>;
}) {
  const product = text.spotlightSlug
    ? products.find((p) => p.slug === text.spotlightSlug)
    : products[0];
  if (!product)
    return (
      <section id="products" className="container section empty-state">
        <h2>{text.emptyTitle}</h2>
        <p>{text.emptyDescription}</p>
        <a href="/go/discord" className="button button-outline">
          {text.communityButton}
        </a>
      </section>
    );
  return (
    <section
      id="products"
      className="container section product-showcase"
      aria-labelledby="showcase-product-title"
    >
      <div className="showcase-copy">
        <div className="showcase-brand">
          <Brand copy={brand} />
        </div>
        <div className="eyebrow">
          {product.game} / {product.category}
        </div>
        <h2 id="showcase-product-title">{product.title}</h2>
        <p className="showcase-description">{product.description}</p>
        <div className="showcase-purchase">
          <strong className="showcase-price">
            {product.price !== null ? (
              <>
                {Number(product.price).toLocaleString()}{" "}
                <small>{product.currency}</small>
              </>
            ) : (
              text.cardPricing
            )}
          </strong>
          <span className={`tag status-${product.status.toLowerCase()}`}>
            {product.status === "AVAILABLE"
              ? text.available
              : product.status === "SOLD_OUT"
                ? text.soldOut
                : text.comingSoon}
          </span>
        </div>
        <a href={`/go/discord?product=${product.id}`} className="button">
          <DiscordIcon />
          {product.status === "AVAILABLE"
            ? "Get it on Discord"
            : "Ask about availability"}
          <ArrowUpRight size={17} />
        </a>
        <Link href={`/products/${product.slug}`} className="showcase-details">
          {text.cardView}
          <ArrowUpRight size={15} />
        </Link>
      </div>
      <div className="showcase-videos" aria-label="Product feature previews">
        {(["first", "second", "third"] as const).map((key, index) => {
          const url = text[`${key}VideoUrl`];
          return (
            <figure className="showcase-feature" key={key}>
              <div className="showcase-video">
                {url ? (
                  <ProductVideo
                    url={url}
                    title={`${product.title}: ${text[`${key}VideoTitle`]}`}
                    preview
                  />
                ) : (
                  <div className="showcase-video-empty">
                    <Play size={28} strokeWidth={1} />
                    <span>{text[`${key}VideoTitle`]} preview coming soon</span>
                  </div>
                )}
                <span className="showcase-video-number" aria-hidden="true">
                  0{index + 1}
                </span>
              </div>
              <figcaption>
                <h3>{text[`${key}VideoTitle`]}</h3>
                <p>{text[`${key}VideoDescription`]}</p>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
