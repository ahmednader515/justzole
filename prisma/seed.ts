import "dotenv/config";
import { hash } from "bcryptjs";
import { db } from "../lib/db";
import { seedReviews } from "../lib/seed-reviews";
async function seed() {
  const email = "admin@zole.com";
  const existing = await db.user.findUnique({ where: { email } });
  if (!existing) {
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (!password)
      throw new Error("Set SEED_ADMIN_PASSWORD before the first seed.");
    await db.user.create({
      data: {
        name: "Zole Admin",
        email,
        passwordHash: await hash(password, 12),
        role: "ADMIN",
      },
    });
    console.log("Administrator created.");
  } else console.log("Administrator already exists; credentials unchanged.");
  const reviews = await seedReviews();
  console.log(
    `Added ${reviews.count} supplied community reviews; existing reviews unchanged.`,
  );
  console.log(
    "No unverified products are seeded. Use the dashboard or Discord importer for real listings.",
  );
}
seed()
  .catch(() => {
    console.error("Seed failed. Check configuration and database access.");
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
