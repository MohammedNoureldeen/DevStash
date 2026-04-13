// Run with: npx tsx scripts/test-db.ts
// Requires DATABASE_URL in .env

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

function separator() {
  console.log("─".repeat(60));
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Check your .env file.");
  }

  console.log("🔌 Connecting to:", process.env.DATABASE_URL.replace(/:\/\/.*@/, "://<credentials>@"));
  separator();

  // ── Table Row Counts ──
  const [users, items, itemTypes, collections, tags] = await Promise.all([
    prisma.user.count(),
    prisma.item.count(),
    prisma.itemType.count(),
    prisma.collection.count(),
    prisma.tag.count(),
  ]);

  console.log("\n📊 Table Row Counts");
  separator();
  console.log(`  User:       ${users}`);
  console.log(`  Item:       ${items}`);
  console.log(`  ItemType:   ${itemTypes}`);
  console.log(`  Collection: ${collections}`);
  console.log(`  Tag:        ${tags}`);

  // ── Demo User ──
  const user = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
  });

  if (user) {
    separator();
    console.log("\n👤 Demo User");
    separator();
    console.log(`  Name:          ${user.name}`);
    console.log(`  Email:         ${user.email}`);
    console.log(`  Is Pro:        ${user.isPro}`);
    console.log(`  Email Verified: ${user.emailVerified?.toLocaleDateString() ?? "No"}`);
    console.log(`  Created:       ${user.createdAt.toLocaleDateString()}`);
  } else {
    separator();
    console.log("\n⚠️  Demo user not found. Run `npm run db:seed` first.");
  }

  // ── Item Types ──
  const itemTypeList = await prisma.itemType.findMany({
    orderBy: { name: "asc" },
  });

  if (itemTypeList.length > 0) {
    separator();
    console.log("\n🏷️  Item Types");
    separator();
    console.log(`  ${"Name".padEnd(12)} ${"Icon".padEnd(14)} ${"Color".padEnd(10)} System`);
    console.log("  " + "─".repeat(48));
    for (const it of itemTypeList) {
      console.log(`  ${it.name.padEnd(12)} ${it.icon.padEnd(14)} ${it.color.padEnd(10)} ${it.isSystem}`);
    }
  }

  // ── Collections with Item Counts ──
  const collectionList = await prisma.collection.findMany({
    include: {
      _count: { select: { items: true } },
    },
    orderBy: { name: "asc" },
  });

  if (collectionList.length > 0) {
    separator();
    console.log("\n📁 Collections");
    separator();
    for (const col of collectionList) {
      console.log(`\n  📂 ${col.name} (${col._count.items} items)`);
      if (col.description) console.log(`     ${col.description}`);
    }
  }

  // ── Items per Collection ──
  if (collectionList.length > 0) {
    separator();
    console.log("\n📝 Items by Collection");
    separator();

    for (const col of collectionList) {
      const itemsWithRelations = await prisma.itemCollection.findMany({
        where: { collectionId: col.id },
        include: {
          item: {
            include: {
              itemType: true,
            },
          },
        },
        orderBy: { item: { title: "asc" } },
      });

      console.log(`\n  📂 ${col.name}`);
      console.log("  " + "─".repeat(56));

      if (itemsWithRelations.length === 0) {
        console.log("     (empty)");
      } else {
        for (const ic of itemsWithRelations) {
          const item = ic.item;
          const preview =
            item.content && item.content.length > 60
              ? item.content.substring(0, 60) + "..."
              : item.content ?? "";
          console.log(`  • ${item.title}`);
          console.log(`    Type: ${item.itemType.name} | Content: ${preview}`);
        }
      }
    }
  }

  // ── Content Type Distribution ──
  separator();
  console.log("\n📄 Content Type Distribution");
  separator();
  const contentTypes = await prisma.item.groupBy({
    by: ["contentType"],
    _count: { contentType: true },
  });
  for (const ct of contentTypes) {
    console.log(`  ${ct.contentType}: ${ct._count.contentType}`);
  }

  separator();
  console.log("\n✅ Database test completed successfully. All tables are accessible.");
  separator();
}

main()
  .catch((err) => {
    console.error("\n❌ Database test failed:", err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
