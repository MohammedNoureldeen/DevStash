// Prisma 7: import from the generated output path (not "@prisma/client")
// Driver adapter required in Prisma 7 — all databases need one
// Global singleton pattern prevents multiple instances in Next.js dev HMR

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  // pg is changing sslmode=require to mean "no cert verification" (libpq compat).
  // Neon has valid certs, so use verify-full to keep the current verified behavior.
  const connectionString = (process.env.DATABASE_URL ?? "").replace(
    "sslmode=require",
    "sslmode=verify-full"
  );
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
