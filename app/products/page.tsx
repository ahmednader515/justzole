import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Catalog } from "@/components/catalog";
import { getCatalog } from "@/lib/products";
import { StructuredData } from "@/components/structured-data";
import { absoluteUrl, isDemoProduct, pageMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "For Honor Scripts & Hacks Catalog",
  "Explore Just Zole's For Honor scripts and hacks catalog. Watch video previews, compare listed features, and ask about pricing and availability on Discord.",
  "/products",
);
export default async function Products() {
  const products = await getCatalog();
  const realProducts = products.filter((p) => !isDemoProduct(p));
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "For Honor Scripts & Hacks Catalog",
          url: absoluteUrl("/products"),
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: realProducts.length,
            itemListElement: realProducts.map((p, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: p.title,
              url: absoluteUrl(`/products/${encodeURIComponent(p.slug)}`),
            })),
          },
        }}
      />
      <Header />
      <main className="container section">
        <div className="eyebrow">THE JUST ZOLE COLLECTION</div>
        <h1 className="page-title">
          FOR HONOR SCRIPTS<span>.</span>
        </h1>
        <p className="page-description">
          Explore For Honor scripts and hacks. Compare product details, watch
          video previews, and contact Just Zole on Discord for purchases and
          support.
        </p>
        <Catalog products={products} />
      </main>
      <Footer />
    </>
  );
}
