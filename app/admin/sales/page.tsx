import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { AdminHeading, EmptyAdmin } from "@/components/admin-ui";
import { SaleForm } from "@/components/sale-form";
import { DeleteTransaction } from "@/components/delete-transaction";
export default async function Sales() {
  await requireAdmin();
  const [products, sales] = await Promise.all([
    db.product.findMany({ orderBy: { title: "asc" } }),
    db.sale.findMany({
      orderBy: { soldAt: "desc" },
      take: 100,
      include: { product: { select: { title: true } } },
    }),
  ]);
  return (
    <>
      <AdminHeading
        title="Sales"
        description="Track purchases completed on your Discord server."
      />
      <div className="admin-columns">
        <section className="panel">
          <h2>Record a sale</h2>
          {products.length ? (
            <SaleForm
              products={products.map((p) => ({
                id: p.id,
                title: p.title,
                price: p.price?.toString() ?? null,
                currency: p.currency,
              }))}
            />
          ) : (
            <EmptyAdmin
              title="Add a product first"
              description="Products need to exist before you can record their sales."
            />
          )}
        </section>
        <section className="panel">
          <h2>Recent transactions</h2>
          <p className="field-help">
            Latest 100 entries. Analytics include all recorded sales.
          </p>
          {sales.length ? (
            sales.map((s) => (
              <div className="activity-row transaction-row" key={s.id}>
                <div className="transaction-summary">
                  <b>{s.product.title}</b>
                  <small>
                    {s.soldAt.toLocaleDateString("en-GB")} · {s.quantity} ×{" "}
                    {Number(s.unitPrice).toLocaleString()} {s.currency}
                  </small>
                  {s.note && <small>{s.note}</small>}
                </div>
                <div className="transaction-actions">
                  <strong>
                    {(s.quantity * Number(s.unitPrice)).toLocaleString()}{" "}
                    {s.currency}
                  </strong>
                  <DeleteTransaction
                    id={s.id}
                    productTitle={s.product.title}
                    summary={`${s.soldAt.toLocaleDateString("en-GB")} · ${s.quantity} × ${Number(s.unitPrice).toLocaleString()} ${s.currency} · Total ${(s.quantity * Number(s.unitPrice)).toLocaleString()} ${s.currency}`}
                  />
                </div>
              </div>
            ))
          ) : (
            <EmptyAdmin
              title="No sales recorded yet"
              description="Your Discord sales will appear here once recorded."
            />
          )}
        </section>
      </div>
    </>
  );
}
