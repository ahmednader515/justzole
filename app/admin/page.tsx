import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminHeading, Stat, EmptyAdmin } from "@/components/admin-ui";
export default async function Overview() {
  await requireAdmin();
  const [products, users, sales, clicks, recent] = await Promise.all([
    db.product.count(),
    db.user.count({ where: { role: "USER" } }),
    db.sale.aggregate({ _sum: { quantity: true } }),
    db.event.count({ where: { type: "DISCORD_CLICK" } }),
    db.sale.findMany({
      take: 5,
      orderBy: { soldAt: "desc" },
      include: { product: { select: { title: true } } },
    }),
  ]);
  return (
    <>
      <AdminHeading
        title="Your command center"
        description="The latest from your products and community."
        action
      />
      <div className="stats-grid">
        <Stat
          label="Total products"
          value={products}
          detail="Across your catalog"
        />
        <Stat
          label="Units sold"
          value={sales._sum.quantity || 0}
          detail="Manually recorded Discord sales"
        />
        <Stat
          label="Registered users"
          value={users}
          detail="Community accounts"
        />
        <Stat
          label="Discord referrals"
          value={clicks}
          detail="Clicks from your website"
        />
      </div>
      <div className="admin-columns">
        <section className="panel">
          <div className="panel-heading">
            <h2>Recent sales</h2>
            <Link href="/admin/sales">View all</Link>
          </div>
          {recent.length ? (
            recent.map((s) => (
              <div className="activity-row" key={s.id}>
                <div>
                  <b>{s.product.title}</b>
                  <small>
                    {s.soldAt.toLocaleDateString("en-GB")} · {s.quantity} units
                  </small>
                </div>
                <strong>
                  {(Number(s.unitPrice) * s.quantity).toLocaleString()}{" "}
                  {s.currency}
                </strong>
              </div>
            ))
          ) : (
            <EmptyAdmin
              title="Ready for your first sale"
              description="Record purchases made through Discord to see them here."
            />
          )}
        </section>
        <section className="panel quick-start">
          <div className="eyebrow">MAKE IT YOURS</div>
          <h2>Your catalog, in your control.</h2>
          <p>
            Add your first product with images, features, and a video showcase.
            Customers can browse the details and reach you directly on Discord.
          </p>
          <Link className="button button-outline" href="/admin/products/new">
            Create a product
          </Link>
          <Link className="subtle-link" href="/admin/analytics">
            Explore analytics
          </Link>
        </section>
      </div>
    </>
  );
}
