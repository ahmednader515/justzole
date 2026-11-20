"use client";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, PackageOpen, X } from "lucide-react";
import { ProductCard, type CatalogProduct } from "./product-card";
export function Catalog({
  products,
  compact = false,
}: {
  products: CatalogProduct[];
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All products");
  const [game, setGame] = useState("All games");
  const [sort, setSort] = useState("featured");
  const categories = [
    "All products",
    ...new Set(products.map((p) => p.category)),
  ];
  const visible = useMemo(
    () =>
      products
        .filter(
          (p) =>
            (category === "All products" || p.category === category) &&
            (game === "All games" || p.game === game) &&
            `${p.title} ${p.game} ${p.description}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "price-low"
            ? Number(a.price ?? Infinity) - Number(b.price ?? Infinity)
            : sort === "name"
              ? a.title.localeCompare(b.title)
              : (sort === "featured"
                  ? Number(b.featured) - Number(a.featured)
                  : 0) || +new Date(b.createdAt) - +new Date(a.createdAt),
        ),
    [products, category, game, query, sort],
  );
  return (
    <div>
      <div className="catalog-toolbar">
        <div
          className="category-tabs"
          role="group"
          aria-label="Product categories"
        >
          {categories.map((c) => (
            <button
              key={c}
              className={category === c ? "active" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
              {c === "All products" && <span>{products.length}</span>}
            </button>
          ))}
        </div>
        <label className="search-box">
          <Search size={17} />
          <input
            aria-label="Search products"
            placeholder="Search your next advantage..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button aria-label="Clear search" onClick={() => setQuery("")}>
              <X size={15} />
            </button>
          )}
        </label>
      </div>
      <div className="catalog-subtoolbar">
        <span>
          {visible.length} {visible.length === 1 ? "product" : "products"} to
          explore
        </span>
        <div>
          <SlidersHorizontal size={15} />
          <select
            aria-label="Filter by game"
            value={game}
            onChange={(e) => setGame(e.target.value)}
          >
            <option>All games</option>
            {[...new Set(products.map((p) => p.game))].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="featured">Featured first</option>
            <option value="newest">Newest first</option>
            <option value="price-low">Price: low to high</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>
      </div>
      {visible.length ? (
        <div className="product-grid">
          {visible.slice(0, compact ? 6 : undefined).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <PackageOpen size={32} strokeWidth={1.3} />
          </div>
          <h3>
            {products.length
              ? "No products match your search"
              : "The next drop is on its way."}
          </h3>
          <p>
            {products.length
              ? "Try another game, category, or search term."
              : "New scripts. New possibilities. Join Discord to see what’s available and hear about upcoming releases."}
          </p>
          {products.length ? (
            <button
              className="button button-outline"
              onClick={() => {
                setCategory("All products");
                setGame("All games");
                setQuery("");
              }}
            >
              Clear filters
            </button>
          ) : (
            <a className="button button-outline" href="/go/discord">
              Explore the community
            </a>
          )}
        </div>
      )}
    </div>
  );
}
