import { AdminHeading } from "@/components/admin-ui";
import { ProductForm } from "@/components/product-form";
import { requireAdmin } from "@/lib/auth";
export default async function NewProduct() {
  await requireAdmin();
  return (
    <>
      <AdminHeading
        title="Add a product"
        description="Give your community something new to explore."
      />
      <ProductForm />
    </>
  );
}
