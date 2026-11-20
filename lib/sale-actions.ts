"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "./auth";
import { db } from "./db";

export async function deleteSale(form: FormData): Promise<{ error?: string }> {
  await requireAdmin();
  const parsed = z.string().min(1).max(100).safeParse(form.get("id"));
  if (!parsed.success) return { error: "Invalid transaction." };

  try {
    const deleted = await db.sale.deleteMany({ where: { id: parsed.data } });
    if (!deleted.count)
      return { error: "This transaction no longer exists. Refresh the page." };
  } catch {
    return { error: "Could not delete this transaction. Please try again." };
  }

  // Sales totals, product sale counts, and analytics are calculated from Sale
  // records, so refreshing the layouts reflects the removal everywhere.
  revalidatePath("/", "layout");
  return {};
}
