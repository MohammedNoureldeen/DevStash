// Prisma 7: datasource URL is configured here, NOT in schema.prisma
// dotenv/config loads .env for CLI commands (migrate, generate, etc.)
// process.env fallback allows `prisma generate` to run without a real DB URL

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
