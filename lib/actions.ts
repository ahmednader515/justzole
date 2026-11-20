"use server";
import { hash, compare } from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "./db";
import { createSession, destroySession, rateLimit, requireAdmin } from "./auth";
export type FormState = { error?: string; success?: string };
export async function authenticate(
  mode: "login" | "register",
  _: FormState,
  form: FormData,
): Promise<FormState> {
  const credentials = z
    .object({
      email: z.email().max(254),
      password: z
        .string()
        .min(mode === "register" ? 8 : 1)
        .max(128),
      name: z
        .string()
        .trim()
        .min(mode === "register" ? 2 : 0)
        .max(80),
    })
    .safeParse({
      email: String(form.get("email") || "")
        .trim()
        .toLowerCase(),
      password: form.get("password"),
      name: form.get("name") || "",
    });
  if (!credentials.success)
    return {
      error:
        mode === "register"
          ? "Enter a name, valid email, and password of at least 8 characters."
          : "Enter a valid email and password.",
    };
  let admin = false;
  try {
    await rateLimit(mode);
    const { email, password, name } = credentials.data;
    let user = await db.user.findUnique({ where: { email } });
    if (mode === "register") {
      if (user) return { error: "An account with this email already exists." };
      user = await db.user.create({
        data: { email, name, passwordHash: await hash(password, 12) },
      });
    } else if (!user || !(await compare(password, user.passwordHash)))
      return { error: "Email or password is incorrect." };
    await createSession(user!.id);
    admin = user!.role === "ADMIN";
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message.startsWith("Too many")
          ? e.message
          : "Unable to sign in. Please try again.",
    };
  }
  redirect(admin ? "/admin" : "/");
}
export async function logout() {
  await destroySession();
  redirect("/");
}
const safeUrl = z.union([
  z.literal(""),
  z.url().refine((value) => {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password;
  }, "Use a public HTTPS URL"),
]);
const productSchema = z.object({
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().min(10).max(10000),
  game: z.string().trim().min(2).max(80),
  category: z.string().trim().min(2).max(80),
  price: z.union([z.literal(""), z.coerce.number().min(0).max(9999999999)]),
  currency: z.string().regex(/^[A-Z]{3}$/),
  videoUrl: safeUrl,
  discordUrl: safeUrl.refine(
    (v) => !v || ["discord.com", "discord.gg"].includes(new URL(v).hostname),
    "Use a Discord URL",
  ),
  status: z.enum(["AVAILABLE", "SOLD_OUT", "COMING_SOON"]),
});
export async function saveProduct(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  if (form.get("videoUrlUploading") === "yes")
    return { error: "Wait for media uploads to finish before saving." };
  const result = productSchema.safeParse(Object.fromEntries(form));
  if (!result.success)
    return {
      error: result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(". "),
    };
  const { price, ...values } = result.data;
  const data = {
    ...values,
    price: price === "" ? null : price,
    videoUrl: values.videoUrl || null,
    discordUrl: values.discordUrl || null,
    features: String(form.get("features") || "")
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean)
      .slice(0, 30),
    featured: form.get("featured") === "on",
    published: form.get("published") === "on",
  };
  try {
    const id = String(form.get("id") || "");
    if (id) await db.product.update({ where: { id }, data });
    else
      await db.product.create({
        data: {
          ...data,
          slug: `${
            data.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "") || "product"
          }-${crypto.randomUUID().slice(0, 8)}`,
        },
      });
  } catch {
    return { error: "Could not save this product. Please try again." };
  }
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}
export async function deleteProduct(form: FormData) {
  await requireAdmin();
  await db.product.delete({ where: { id: String(form.get("id")) } });
  revalidatePath("/", "layout");
}
export async function recordSale(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = z
    .object({
      productId: z.string().min(1),
      quantity: z.coerce.number().int().min(1).max(100000),
      unitPrice: z.coerce.number().min(0).max(9999999999),
      note: z.string().max(500),
    })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return { error: "Enter a valid quantity and unit price." };
  try {
    await db.$transaction(async (tx) => {
      const product = await tx.product.findUniqueOrThrow({
        where: { id: parsed.data.productId },
      });
      await tx.sale.create({
        data: { ...parsed.data, currency: product.currency },
      });
      if (form.get("soldOut") === "on")
        await tx.product.update({
          where: { id: product.id },
          data: { status: "SOLD_OUT" },
        });
    });
  } catch {
    return { error: "Could not record the sale." };
  }
  revalidatePath("/", "layout");
  return { success: "Sale recorded. Analytics have been updated." };
}
