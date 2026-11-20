import "dotenv/config";
import { db } from "../lib/db";
import type { Prisma } from "../generated/prisma/client";

const demos: Prisma.ProductCreateManyInput[] = [
  {
    slug: "demo-for-honor-starter",
    title: "For Honor Starter (Demo)",
    description:
      "Demo product with a sample price. A starter script listing for exploring the Just Zole catalog. This is placeholder content, not a verified product or playable script.",
    price: "9.99",
    videoUrl: "https://www.youtube.com/watch?v=zkK5xtMJ58U",
    category: "Scripts",
    featured: true,
    features: [
      "Example starter configuration",
      "Sample keyboard and mouse profile",
      "Example setup instructions",
      "Demo listing — confirm real offerings on Discord",
    ],
  },
  {
    slug: "demo-for-honor-duelist",
    title: "For Honor Duelist (Demo)",
    description:
      "Demo product with a sample price. A duel-focused script listing with example customization options. Features are fictional examples for the catalog layout.",
    price: "19.99",
    videoUrl: "https://www.youtube.com/watch?v=cBzhMK22XRs",
    category: "Scripts",
    featured: true,
    features: [
      "Example duel preset",
      "Sample configurable hotkeys",
      "Example per-hero profiles",
      "Demo listing — no functionality is supplied",
    ],
  },
].map((product) => ({
  game: "For Honor",
  currency: "USD",
  published: true,
  ...product,
}));

async function main() {
  const result = await db.product.createMany({
    data: demos,
    skipDuplicates: true,
  });
  const products = await db.product.findMany({
    where: { slug: { in: demos.map((product) => product.slug) } },
    select: {
      title: true,
      published: true,
      status: true,
      _count: { select: { sales: true } },
    },
    orderBy: { title: "asc" },
  });
  console.log(
    `Added ${result.count} For Honor demo products. Existing products were preserved.`,
  );
  console.log(JSON.stringify(products, null, 2));
}

main()
  .catch(() => {
    console.error("Could not seed demo products. Check database access.");
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
