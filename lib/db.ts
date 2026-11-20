import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const globalDb = globalThis as unknown as { prisma?: PrismaClient };
const connection = new URL(process.env.DATABASE_URL!);
// Preserve the driver's current strict TLS semantics explicitly.
if (
  ["require", "prefer", "verify-ca"].includes(
    connection.searchParams.get("sslmode") || "",
  )
)
  connection.searchParams.set("sslmode", "verify-full");
export const db =
  globalDb.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: connection.toString() }),
  });
if (process.env.NODE_ENV !== "production") globalDb.prisma = db;
