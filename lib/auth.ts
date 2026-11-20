import { cookies, headers } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { db } from "./db";
const digest = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export async function currentUser() {
  const token = (await cookies()).get("zole-session")?.value;
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { id: digest(token) },
    include: { user: true },
  });
  return session && session.expiresAt > new Date() ? session.user : null;
}
export async function requireAdmin() {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");
  return user;
}
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 7 * 86400000);
  await db.session.create({
    data: { id: digest(token), userId, expiresAt: expires },
  });
  (await cookies()).set("zole-session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });
}
export async function destroySession() {
  const token = (await cookies()).get("zole-session")?.value;
  if (token) await db.session.deleteMany({ where: { id: digest(token) } });
  (await cookies()).delete("zole-session");
}
export async function rateLimit(scope: string, identity = "") {
  const h = await headers();
  const address = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const key = digest(`${scope}:${address}:${identity}`);
  const now = new Date();
  await db.rateLimit.deleteMany({ where: { key, resetAt: { lt: now } } });
  const attempt = await db.rateLimit.upsert({
    where: { key },
    create: { key, resetAt: new Date(Date.now() + 15 * 60000) },
    update: { count: { increment: 1 } },
  });
  if (attempt.count > 15)
    throw new Error("Too many attempts. Please try again in 15 minutes.");
}
