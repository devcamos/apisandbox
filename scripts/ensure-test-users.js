#!/usr/bin/env node

const fs = require("fs");
const path = require("node:path");
const crypto = require("crypto");
const { execFileSync } = require("node:child_process");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

function findSqlite3Binary() {
  if (process.env.SQLITE3_BIN) return process.env.SQLITE3_BIN;
  try {
    const candidate = execFileSync("which", ["sqlite3"], {
      encoding: "utf8",
      env: { PATH: "/usr/bin:/bin:/usr/sbin:/sbin" },
    })
      .trim()
      .split("\n")[0];
    return candidate || "sqlite3";
  } catch {
    return "sqlite3";
  }
}

function loadEnv() {
  const candidates = [".env.local", ".env"];
  for (const filename of candidates) {
    const fullPath = path.resolve(process.cwd(), filename);
    if (fs.existsSync(fullPath)) {
      dotenv.config({ path: fullPath, override: false });
    }
  }
}

function sqliteQuery(dbPath, sql) {
  const sqlite3 = findSqlite3Binary();
  return execFileSync(sqlite3, [dbPath, sql], {
    encoding: "utf8",
    env: { PATH: "/usr/bin:/bin:/usr/sbin:/sbin" },
  }).trim();
}

function quoteSqlValue(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return String(value);
  return `'${String(value).replaceAll("'", "''")}'`;
}

async function main() {
  loadEnv();

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Configure .env.local or .env first.");
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to create local test users in production.");
  }

  const testUsers = [
    {
      email: "test@example.com",
      name: "Test User",
      password: process.env.ENSURE_TEST_USERS_PASSWORD || "Test1234!@#$", // NOSONAR S2068 — local-only script; set ENSURE_TEST_USERS_PASSWORD
    },
    {
      email: "qa@example.com",
      name: "QA User",
      password: process.env.ENSURE_TEST_USERS_PASSWORD_QA || "QaTest1234!@#$", // NOSONAR
    },
  ];

  const dbUrl = process.env.DATABASE_URL || "";

  // Legacy local mode fallback: support file-based SQLite DATABASE_URL.
  if (dbUrl.startsWith("file:")) {
    const sqlitePath = path.resolve(process.cwd(), dbUrl.replace(/^file:/, ""));
    if (!fs.existsSync(sqlitePath)) {
      throw new Error(`SQLite database not found: ${sqlitePath}`);
    }

    const countRaw = sqliteQuery(sqlitePath, 'SELECT COUNT(*) FROM "User";');
    const existingUserCount = Number(countRaw || 0);

    if (existingUserCount > 0) {
      console.log(
        `Skipped: found ${existingUserCount} existing user(s). Test users are created only when the database is empty.`
      );
      return;
    }

    const columnRows = sqliteQuery(sqlitePath, 'PRAGMA table_info("User");')
      .split("\n")
      .filter(Boolean);
    const availableColumns = new Set(columnRows.map((line) => line.split("|")[1]));

    for (const user of testUsers) {
      const passwordHash = await bcrypt.hash(user.password, 12);
      const id = `usr_${crypto.randomUUID().replaceAll("-", "").slice(0, 24)}`;
      const now = new Date().toISOString();

      const candidateValues = {
        id,
        name: user.name,
        email: user.email,
        passwordHash,
        loginAttempts: 0,
        isActive: 1,
        subscriptionTier: "FREE",
        createdAt: now,
        updatedAt: now,
      };

      const insertColumns = Object.keys(candidateValues).filter((col) =>
        availableColumns.has(col)
      );
      const insertValues = insertColumns.map((col) =>
        quoteSqlValue(candidateValues[col])
      );

      const sql = `INSERT INTO "User" (${insertColumns
        .map((col) => `"${col}"`)
        .join(",")}) VALUES (${insertValues.join(",")});`;
      sqliteQuery(sqlitePath, sql);
    }

    console.log("Created local test users:");
    for (const user of testUsers) {
      console.log(`- ${user.email} / ${user.password}`);
    }
    return;
  }

  const prisma = new PrismaClient();

  try {
    const existingUserCount = await prisma.user.count();

    if (existingUserCount > 0) {
      console.log(
        `Skipped: found ${existingUserCount} existing user(s). Test users are created only when the database is empty.`
      );
      return;
    }

    for (const user of testUsers) {
      const passwordHash = await bcrypt.hash(user.password, 12);
      await prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          passwordHash,
          isActive: true,
        },
      });
    }

    console.log("Created local test users:");
    for (const user of testUsers) {
      console.log(`- ${user.email} / ${user.password}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
