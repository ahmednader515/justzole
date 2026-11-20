import "dotenv/config";
import { db } from "../lib/db";
import { mergeHomepageContent } from "../lib/homepage-defaults";

async function main() {
  const content = mergeHomepageContent(await db.homepageSection.findMany());
  const slug = content.products.text.spotlightSlug;
  const product = await db.product.findFirst({
    where: { published: true, ...(slug ? { slug } : {}) },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  if (!product || !product.discountPercent || product.price === null) {
    console.log("No discounted homepage product to initialize.");
    return;
  }
  const endsAt = new Date(Date.now() + 48 * 3600000);
  const result = await db.product.updateMany({
    where: { id: product.id, discountEndsAt: null },
    data: { discountEndsAt: endsAt },
  });
  console.log(
    result.count
      ? `Started a 48-hour countdown for ${product.title}; ends ${endsAt.toISOString()}.`
      : "Existing countdown preserved.",
  );
}
main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
