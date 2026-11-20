import "dotenv/config";
import { db } from "../lib/db";

const demos = [
  {
    slug: "demo-for-honor-starter",
    videoUrl: "https://www.youtube.com/watch?v=zkK5xtMJ58U",
  },
  {
    slug: "demo-for-honor-duelist",
    videoUrl: "https://www.youtube.com/watch?v=cBzhMK22XRs",
  },
];

async function main() {
  let count = 0;
  for (const { slug, videoUrl } of demos) {
    const result = await db.product.updateMany({
      where: { slug },
      data: { videoUrl },
    });
    count += result.count;
  }
  console.log(
    `Updated ${count} demo video previews. These are official For Honor trailers, not script demonstrations.`,
  );
}

main()
  .catch(() => {
    console.error("Could not update demo videos. Check database access.");
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
