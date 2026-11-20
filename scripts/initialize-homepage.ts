import "dotenv/config";
import { db } from "../lib/db";
import { defaultHomepageContent, homepageKeys } from "../lib/homepage-defaults";

async function initialize() {
  const content = defaultHomepageContent();
  const result = await db.homepageSection.createMany({
    skipDuplicates: true,
    data: homepageKeys.map((key) => ({ key, ...content[key] })),
  });
  console.log(
    `Initialized ${result.count} homepage sections. Existing settings were preserved.`,
  );
}

initialize()
  .catch(() => {
    console.error(
      "Could not initialize homepage settings. Check database access.",
    );
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
