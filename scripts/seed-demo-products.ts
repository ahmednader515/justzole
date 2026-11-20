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
    category: "Scripts",
    featured: true,
    features: [
      "Example duel preset",
      "Sample configurable hotkeys",
      "Example per-hero profiles",
      "Demo listing — no functionality is supplied",
    ],
  },
  {
    slug: "demo-for-honor-dominion",
    title: "For Honor Dominion (Demo)",
    description:
      "Demo product with a sample price. A sample team-mode script pack for showing product details and features. This listing does not represent a real script available for purchase.",
    price: "29.99",
    category: "Script packs",
    features: [
      "Example team-mode profile",
      "Sample preset switching",
      "Example configuration guide",
      "Demo listing — check Discord for actual availability",
    ],
  },
  {
    slug: "demo-for-honor-controller",
    title: "For Honor Controller (Demo)",
    description:
      "Demo product with a sample price. A controller-oriented script listing that demonstrates how configuration options can be presented. Compatibility claims are examples only.",
    price: "14.99",
    category: "Scripts",
    features: [
      "Example controller layout",
      "Sample button mapping",
      "Example sensitivity profiles",
      "Demo listing — real device compatibility is unverified",
    ],
  },
  {
    slug: "demo-for-honor-training",
    title: "For Honor Training Pack (Demo)",
    description:
      "Demo product with a sample price. A sample training script pack, marked sold out to demonstrate catalog availability states. No actual sales are implied or recorded.",
    price: "7.99",
    category: "Script packs",
    status: "SOLD_OUT" as const,
    features: [
      "Example practice presets",
      "Sample timing configuration",
      "Example training notes",
      "Demo sold-out state — no sales history",
    ],
  },
  {
    slug: "demo-for-honor-complete",
    title: "For Honor Complete Bundle (Demo)",
    description:
      "Demo product. An upcoming bundle placeholder for previewing the coming-soon state and Discord pricing. No release date, real features, or actual availability is confirmed.",
    price: null,
    category: "Bundles",
    status: "COMING_SOON" as const,
    features: [
      "Example bundle of script profiles",
      "Sample configuration collection",
      "Example setup documentation",
      "Demo coming-soon state — no release commitment",
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
