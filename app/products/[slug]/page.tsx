import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ShieldCheck, MessageCircle } from "lucide-react";
import { db } from "@/lib/db";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DiscordIcon } from "@/components/icons";
import { ProductVideo } from "@/components/video";
export const dynamic = "force-dynamic";
export default async function Product({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await db.product.findFirst({
    where: { slug, published: true },
    include: { sales: { select: { quantity: true } } },
  });
  if (!p) notFound();
  return (
    <>
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
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.title} />
              ) : (
                <div className="detail-placeholder">
                  Z<span>{p.game}</span>
                </div>
              )}
            </div>
            {p.videoUrl && (
              <div className="panel">
                <h3>See it in action</h3>
                <ProductVideo url={p.videoUrl} />
              </div>
            )}
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
