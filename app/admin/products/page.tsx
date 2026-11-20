import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { Pencil, Package } from "lucide-react";
import { db } from "@/lib/db";
import { AdminHeading, EmptyAdmin } from "@/components/admin-ui";
import { DeleteProduct } from "@/components/delete-product";
export default async function Products() {
  await requireAdmin();
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { sales: { select: { quantity: true } } },
  });
  return (
    <>
      <AdminHeading
        title="Products"
        description="Create, edit, and manage your product catalog."
        action
      />
      <section className="panel">
        {products.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Units sold</th>
                  <th>Visibility</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="table-product">
                        <span className="table-product-icon">
                          <Package size={20} />
                        </span>
                        <div>
                          <b>{p.title}</b>
                          <small>
                            {p.game} · {p.category}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`tag status-${p.status.toLowerCase()}`}>
                        {p.status.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td>
                      {p.price !== null
                        ? `${Number(p.price).toLocaleString()} ${p.currency}`
                        : "Ask on Discord"}
                    </td>
                    <td>{p.sales.reduce((sum, s) => sum + s.quantity, 0)}</td>
                    <td>
                      {p.published ? "Published" : "Draft"}
                      {p.featured ? " · Featured" : ""}
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          className="icon-button"
                          aria-label={`Edit ${p.title}`}
                          href={`/admin/products/${p.id}`}
                        >
                          <Pencil size={16} />
                        </Link>
                        <DeleteProduct id={p.id} title={p.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyAdmin
            title="Your catalog starts here"
            description="Add a real product from your server. No placeholder products have been added."
          />
        )}
      </section>
    </>
  );
}
