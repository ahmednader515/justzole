import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("product");
  const product = id
    ? await db.product.findFirst({ where: { id, published: true } })
    : null;
  await db.event.create({
    data: { type: "DISCORD_CLICK", productId: product?.id },
  });
  return NextResponse.redirect(
    product?.discordUrl || "https://discord.gg/cagxJRAY",
  );
}
