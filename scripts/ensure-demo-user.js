#!/usr/bin/env node
/**
 * Optional maintenance: delete expired ephemeral demo users.
 *
 * Demo login no longer seeds a shared PREMIUM account. Each POST /api/auth/demo
 * creates an isolated FREE user (`demo.<id>@apisandbox.demo`) and cleans up
 * expired rows opportunistically. Run this script if you want an explicit purge.
 *
 * Env:
 *   DATABASE_URL           — required
 *   DEMO_USER_TTL_HOURS    — optional, default 24
 *
 * Production guard:
 *   DEMO_ALLOW_PRODUCTION_SEED=true  — required when NODE_ENV=production
 *
 * Usage:
 *   node scripts/ensure-demo-user.js
 *   npm run db:ensure-demo-user
 */

const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

function loadEnv() {
  const candidates = [".env.local", ".env"];
  for (const filename of candidates) {
    const fullPath = path.resolve(process.cwd(), filename);
    if (fs.existsSync(fullPath)) {
      dotenv.config({ path: fullPath, override: false });
    }
  }
}

function ttlHours() {
  const raw = process.env.DEMO_USER_TTL_HOURS;
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  if (Number.isFinite(parsed) && parsed > 0 && parsed <= 24 * 30) return parsed;
  return 24;
}

async function main() {
  loadEnv();

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set.");
  }

  if (process.env.NODE_ENV === "production" && process.env.DEMO_ALLOW_PRODUCTION_SEED !== "true") {
    throw new Error(
      "Refusing to modify production DB without DEMO_ALLOW_PRODUCTION_SEED=true (set explicitly after review)."
    );
  }

  const prisma = new PrismaClient();
  const hours = ttlHours();
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);

  try {
    const result = await prisma.user.deleteMany({
      where: {
        AND: [
          { email: { startsWith: "demo." } },
          { email: { endsWith: "@apisandbox.demo" } },
          { createdAt: { lt: cutoff } },
        ],
      },
    });

    console.log(
      `Demo cleanup complete: removed ${result.count} ephemeral demo user(s) older than ${hours}h (cutoff ${cutoff.toISOString()}).`
    );
    console.log(
      "No shared demo seed is required. Enable NEXT_PUBLIC_FF_DEMO_LOGIN=true; POST /api/auth/demo creates Phase-1-only sessions on demand."
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
