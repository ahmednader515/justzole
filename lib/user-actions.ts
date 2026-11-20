"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "./auth";
import { db } from "./db";

export async function deleteUser(form: FormData): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  const parsed = z
    .object({
      id: z.string().min(1).max(100),
      email: z.email().max(254),
    })
    .safeParse({
      id: form.get("id"),
      email: String(form.get("email") || "")
        .trim()
        .toLowerCase(),
    });

  if (!parsed.success)
    return { error: "Enter the account’s email address to confirm deletion." };

  try {
    // Filter role and identity in the delete itself so protected accounts cannot
    // be removed, including if their role changes after this page was loaded.
    const result = await db.user.deleteMany({
      where: {
        id: { equals: parsed.data.id, not: admin.id },
        email: parsed.data.email,
        role: "USER",
      },
    });
    if (!result.count)
      return {
        error:
          "Account not found, email does not match, or this account is protected.",
      };
    // The database cascades deletion to all sessions belonging to the user.
  } catch {
    return { error: "Could not delete this account. Please try again." };
  }

  revalidatePath("/", "layout");
  return {};
}
