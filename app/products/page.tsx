import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Catalog } from "@/components/catalog";
import { getCatalog } from "@/lib/products";
export const dynamic = "force-dynamic";
export const metadata = { title: "Explore products" };
export default async function Products() {
  return (
    <>
      <Header />
      <main className="container section">
        <div className="eyebrow">THE JUST ZOLE COLLECTION</div>
        <h1 className="page-title">
          THE ARSENAL<span>.</span>
        </h1>
        <p className="page-description">
          Your next advantage is a click away. Browse here, get it on Discord.
        </p>
        <Catalog products={await getCatalog()} />
      </main>
      <Footer />
    </>
  );
}
