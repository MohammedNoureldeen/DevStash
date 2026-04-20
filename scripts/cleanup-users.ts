// Delete ALL users and their content (no exceptions)
// Run with: npx tsx scripts/cleanup-users.ts
// Add --force to skip the confirmation prompt

import "dotenv/config";
import * as readline from "readline";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

function separator() {
  console.log("─".repeat(60));
}

function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Check your .env file.");
  }

  const force = process.argv.includes("--force");

  const users = await prisma.user.findMany({
    select: {
      email: true,
      name: true,
      _count: { select: { items: true, collections: true } },
    },
  });

  const tokenCount = await prisma.verificationToken.count();

  separator();
  console.log("\n🔍 Dry run — the following will be deleted:\n");

  if (users.length === 0) {
    console.log("  No users in the database.");
    separator();
    return;
  }

  for (const u of users) {
    console.log(`  • ${u.email} (${u.name ?? "no name"}) — ${u._count.items} items, ${u._count.collections} collections`);
  }

  console.log(`\n  Total users:              ${users.length}`);
  console.log(`  Verification tokens:      ${tokenCount}`);
  console.log(`\n  Cascade deletes will also remove: items, collections, item types,`);
  console.log(`  tags-on-items, item-collections, accounts, and sessions for each user.`);
  separator();

  if (!force) {
    const ok = await confirm("\n⚠️  Proceed? This cannot be undone. (y/N) ");
    if (!ok) {
      console.log("\n  Aborted. No changes made.");
      return;
    }
  }

  console.log("\n🗑️  Deleting...\n");

  const { count: deletedTokens } = await prisma.verificationToken.deleteMany();
  const { count: deletedUsers } = await prisma.user.deleteMany();
  const { count: deletedTags } = await prisma.tag.deleteMany({ where: { items: { none: {} } } });

  separator();
  console.log("\n✅ Done.\n");
  console.log(`  Users deleted:             ${deletedUsers}`);
  console.log(`  Verification tokens:       ${deletedTokens}`);
  console.log(`  Orphaned tags cleaned up:  ${deletedTags}`);
  separator();
}

main()
  .catch((err) => {
    console.error("\n❌ Script failed:", err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
