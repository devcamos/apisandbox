#!/usr/bin/env node
/**
 * Upserts a PREMIUM demo user for live / preview "Try demo" flows.
 *
 * Env:
 *   DATABASE_URL          — required
 *   DEMO_USER_EMAIL       — optional, default demo@apisandbox.demo
 *   DEMO_USER_PASSWORD    — required (generate a strong password for production)
 *
 * Production guard:
 *   DEMO_ALLOW_PRODUCTION_SEED=true  — required when NODE_ENV=production
 *
 * Usage:
 *   DEMO_USER_PASSWORD='...' node scripts/ensure-demo-user.js
 *   npm run db:ensure-demo-user
 */

const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
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

const DEFAULT_EMAIL = "demo@apisandbox.demo";

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

  const email = (process.env.DEMO_USER_EMAIL || DEFAULT_EMAIL).trim().toLowerCase();
  const password = process.env.DEMO_USER_PASSWORD;
  if (!password || password.length < 12) {
    throw new Error("DEMO_USER_PASSWORD is required and must be at least 12 characters.");
  }

  const prisma = new PrismaClient();
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name: "Demo Explorer",
        passwordHash,
        isActive: true,
        loginAttempts: 0,
        subscriptionTier: "PREMIUM",
      },
      update: {
        name: "Demo Explorer",
        passwordHash,
        isActive: true,
        loginAttempts: 0,
        lockedUntil: null,
        subscriptionTier: "PREMIUM",
      },
    });

    await prisma.userProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        firstName: "Demo",
        lastName: "Explorer",
        roleLabel: "Live demo",
        identityStatement: "Shared demo account — sign out when finished.",
      },
      update: {
        firstName: "Demo",
        lastName: "Explorer",
        roleLabel: "Live demo",
        identityStatement: "Shared demo account — sign out when finished.",
      },
    });

    console.log(`Demo user ready: ${email} (PREMIUM). Password from DEMO_USER_PASSWORD.`);
    console.log("Set NEXT_PUBLIC_FF_DEMO_LOGIN=true and matching NEXT_PUBLIC_DEMO_USER_EMAIL in Vercel.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
