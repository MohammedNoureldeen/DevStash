// Run with: npx tsx scripts/test-db.ts
// Requires DATABASE_URL in .env

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Check your .env file.");
  }

  console.log("Connecting to:", process.env.DATABASE_URL.replace(/:\/\/.*@/, "://<credentials>@"));

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  try {
    // Verify each table is reachable
    const [users, items, itemTypes, collections, tags] = await Promise.all([
      prisma.user.count(),
      prisma.item.count(),
      prisma.itemType.count(),
      prisma.collection.count(),
      prisma.tag.count(),
    ]);

    console.log("\n✓ Database connection successful\n");
    console.log("Table row counts:");
    console.log(`  User:       ${users}`);
    console.log(`  Item:       ${items}`);
    console.log(`  ItemType:   ${itemTypes}`);
    console.log(`  Collection: ${collections}`);
    console.log(`  Tag:        ${tags}`);
    console.log("\nAll tables are accessible.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("Database test failed:", err.message);
  process.exit(1);
});
