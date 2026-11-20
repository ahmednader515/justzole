import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminHeading } from "@/components/admin-ui";
import { ProductForm } from "@/components/product-form";
export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const p = await db.product.findUnique({ where: { id } });
  if (!p) notFound();
  return (
    <>
      <AdminHeading
        title="Edit product"
        description={`Update ${p.title} and its availability.`}
      />
      <ProductForm
        product={{
          ...p,
          price: p.price?.toString() ?? null,
          discountEndsAt: p.discountEndsAt?.toISOString() ?? null,
        }}
      />
    </>
  );
}
