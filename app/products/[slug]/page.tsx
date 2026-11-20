import Link from "next/link";
import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { Check, ShieldCheck, MessageCircle } from "lucide-react";
import { db } from "@/lib/db";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DiscordIcon } from "@/components/icons";
import { ProductVideo } from "@/components/video";
import { StructuredData } from "@/components/structured-data";
import {
  absoluteUrl,
  isDemoProduct,
  pageMetadata,
  productStructuredData,
} from "@/lib/seo";
export const dynamic = "force-dynamic";
const getProduct = cache(async (slug: string) =>
  db.product.findFirst({ where: { slug, published: true } }),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  return {
    ...pageMetadata(
      `${product.title} — ${product.game} ${product.category}`,
      product.description.replace(/\s+/g, " ").trim().slice(0, 160),
      `/products/${encodeURIComponent(product.slug)}`,
    ),
    ...(isDemoProduct(product)
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}
export default async function Product({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();
  return (
    <>
      {!isDemoProduct(p) && <StructuredData data={productStructuredData(p)} />}
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Products",
              item: absoluteUrl("/products"),
            },
            {
              "@type": "ListItem",
              position: 2,
              name: p.title,
              item: absoluteUrl(`/products/${encodeURIComponent(p.slug)}`),
            },
          ],
        }}
      />
      <Header />
      <main className="container section">
        <div className="breadcrumbs">
          <Link href="/products">Products</Link>
          <span>/</span>
          <span>{p.title}</span>
        </div>
        <div className="product-detail">
          <div>
            <div className="detail-art">
              {p.videoUrl ? (
                <ProductVideo url={p.videoUrl} title={`${p.title} preview`} />
              ) : (
                <div className="detail-placeholder">
                  Z<span>{p.game}</span>
                </div>
              )}
            </div>
          </div>
          <div className="detail-copy">
            <div className="eyebrow">
              {p.game} / {p.category}
            </div>
            <h1>{p.title}</h1>
            <span className={`tag status-${p.status.toLowerCase()}`}>
              {p.status.replaceAll("_", " ")}
            </span>
            <p className="detail-description">{p.description}</p>
            <div className="detail-price">
              {p.price !== null ? (
                <>
                  {Number(p.price).toLocaleString()} <small>{p.currency}</small>
                </>
              ) : (
                "Ask for pricing"
              )}
              <span>Purchase exclusively through our Discord server.</span>
            </div>
            {p.status === "AVAILABLE" ? (
              <a
                className="button full-width"
                href={`/go/discord?product=${p.id}`}
              >
                <DiscordIcon /> Get it on Discord
              </a>
            ) : (
              <a
                className="button button-outline full-width"
                href={`/go/discord?product=${p.id}`}
              >
                <MessageCircle size={18} /> Ask about availability
              </a>
            )}
            <p className="detail-reassurance">
              <ShieldCheck size={16} /> Questions? Our team is here to help on
              Discord.
            </p>
            {p.features.length > 0 && (
              <div className="features-list">
                <h3>What’s included</h3>
                {p.features.map((f, i) => (
                  <p key={i}>
                    <Check size={16} />
                    {f}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
