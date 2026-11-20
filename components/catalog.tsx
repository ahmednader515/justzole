"use client";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, PackageOpen, X } from "lucide-react";
import { ProductCard, type CatalogProduct } from "./product-card";
import { defaultHomepageContent } from "@/lib/homepage-defaults";
const defaultCopy = defaultHomepageContent().products.text;
export function Catalog({
  products,
  compact = false,
  copy,
}: {
  products: CatalogProduct[];
  compact?: boolean;
  copy?: Record<string, string>;
}) {
  const text = { ...defaultCopy, ...copy };
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
              {c === "All products" ? text.allProducts : c}
              {c === "All products" && <span>{products.length}</span>}
            </button>
          ))}
        </div>
        <label className="search-box">
          <Search size={17} />
          <input
            aria-label="Search products"
            placeholder={text.search}
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
          {visible.length} {visible.length === 1 ? text.singular : text.plural}{" "}
          {text.countSuffix}
        </span>
        <div>
          <SlidersHorizontal size={15} />
          <select
            aria-label="Filter by game"
            value={game}
            onChange={(e) => setGame(e.target.value)}
          >
            <option value="All games">{text.allGames}</option>
            {[...new Set(products.map((p) => p.game))].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="featured">{text.featured}</option>
            <option value="newest">{text.newest}</option>
            <option value="price-low">{text.priceLow}</option>
            <option value="name">{text.nameSort}</option>
          </select>
        </div>
      </div>
      {visible.length ? (
        <div className="product-grid">
          {visible.slice(0, compact ? 2 : undefined).map((p) => (
            <ProductCard key={p.id} product={p} copy={text} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <PackageOpen size={32} strokeWidth={1.3} />
          </div>
          <h3>{products.length ? text.noMatchTitle : text.emptyTitle}</h3>
          <p>
            {products.length ? text.noMatchDescription : text.emptyDescription}
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
              {text.clearFilters}
            </button>
          ) : (
            <a className="button button-outline" href="/go/discord">
              {text.communityButton}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
