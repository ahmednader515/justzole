"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "./auth";
import { db } from "./db";
import type { FormState } from "./actions";

const reviewSchema = z.object({
  author: z.string().trim().min(1, "Enter a display name.").max(80),
  content: z.string().trim().min(3, "Enter the review text.").max(5000),
  sortOrder: z.coerce.number().int().min(0).max(100000),
});

export async function saveReview(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  const result = reviewSchema.safeParse(Object.fromEntries(form));
  if (!result.success)
    return {
      error: result.error.issues.map((issue) => issue.message).join(" "),
    };

  try {
    const data = { ...result.data, published: form.get("published") === "on" };
    const id = String(form.get("id") || "");
    if (id) await db.review.update({ where: { id }, data });
    else await db.review.create({ data });
  } catch {
    return { error: "Could not save this review. Please try again." };
  }
  revalidatePath("/");
  revalidatePath("/admin/reviews");
  redirect("/admin/reviews");
}

export async function deleteReview(form: FormData) {
  await requireAdmin();
  const id = z.string().min(1).parse(form.get("id"));
  await db.review.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/reviews");
}
