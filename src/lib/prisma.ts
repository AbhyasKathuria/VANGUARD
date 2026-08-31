import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Initialize SQLite database location for serverless environments (e.g., Vercel)
function resolveDatabaseUrl(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === "production") {
    const tmpDb = "/tmp/dev.db";

    if (!fs.existsSync(tmpDb)) {
      const searchPaths = [
        path.join(process.cwd(), "prisma", "dev.db"),
        path.join(process.cwd(), "dev.db"),
        path.join(__dirname, "dev.db"),
        path.join(__dirname, "..", "dev.db"),
        path.join(__dirname, "..", "prisma", "dev.db"),
      ];

      for (const p of searchPaths) {
        if (fs.existsSync(p)) {
          try {
            fs.copyFileSync(p, tmpDb);
            console.log(`[Prisma] Successfully initialized /tmp/dev.db from ${p}`);
            break;
          } catch (e) {
            console.warn(`[Prisma] Could not copy from ${p}:`, e);
          }
        }
      }
    }

    if (fs.existsSync(tmpDb)) {
      return `file:${tmpDb}`;
    }
  }

  return process.env.DATABASE_URL && process.env.DATABASE_URL.trim()
    ? process.env.DATABASE_URL
    : "file:./dev.db";
}

process.env.DATABASE_URL = resolveDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: resolveDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
