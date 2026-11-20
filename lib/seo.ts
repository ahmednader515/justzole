import type { Metadata } from "next";
import { discountedPrice } from "./pricing";

export const siteUrl = new URL(process.env.SITE_URL || "https://justzole.com")
  .origin;
export const siteDescription =
  "Browse For Honor scripts and hacks at Just Zole. Compare product features, watch video previews, and contact the team on Discord for pricing and availability.";

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteUrl}/`).toString();
}

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Just Zole",
      title: `${title} | Just Zole`,
      description,
      url,
      images: [
        {
          url: absoluteUrl("/opengraph-image"),
          width: 1200,
          height: 630,
          alt: "Just Zole — For Honor Scripts & Hacks",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Just Zole`,
      description,
      images: [absoluteUrl("/opengraph-image")],
    },
  };
}

export function isDemoProduct(product: { slug: string; title: string }) {
  return product.slug.startsWith("demo-") || /\(demo\)/i.test(product.title);
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export type SearchProduct = {
  discountPercent?: number;
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  price: { toString(): string } | string | null;
  currency: string;
  status: string;
};

export function productStructuredData(product: SearchProduct) {
  const url = absoluteUrl(`/products/${encodeURIComponent(product.slug)}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.title,
    description: product.description,
    category: product.category,
    sku: product.id,
    url,
    brand: { "@type": "Brand", name: "Just Zole" },
    ...(product.price !== null &&
    !isDemoProduct(product) &&
    product.status !== "COMING_SOON"
      ? {
          offers: {
            "@type": "Offer",
            url,
            price: discountedPrice(
              product.price.toString(),
              product.discountPercent,
            ),
            priceCurrency: product.currency,
            availability: `https://schema.org/${
              product.status === "AVAILABLE" ? "InStock" : "OutOfStock"
            }`,
            seller: { "@id": absoluteUrl("/#organization") },
          },
        }
      : {}),
  };
}
