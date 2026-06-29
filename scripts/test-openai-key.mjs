import process from "node:process";
import { Writable } from "node:stream";
import { pathToFileURL } from "node:url";
import path from "node:path";
import readline from "node:readline";

import OpenAI from "openai";

export function classifyResult(status, code) {
  if (status === 401) return "Invalid, revoked, or malformed API key.";
  if (status === 403) return "The key was recognized but lacks permission for this endpoint.";
  if (status === 429 && code === "insufficient_quota") {
    return "The key was recognized, but its API project has insufficient quota.";
  }
  if (status === 429) return "The key was recognized, but the API rate limit was reached.";
  if (status >= 500) return "OpenAI returned a service error; retry before replacing the key.";
  return "The result was inconclusive; check network access and API project configuration.";
}

function promptForKey() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error("OPENAI_API_KEY is not set and a secure interactive prompt is unavailable.");
  }

  return new Promise((resolve) => {
    let muted = false;
    const hiddenOutput = new Writable({
      write(chunk, encoding, callback) {
        if (!muted) process.stdout.write(chunk, encoding);
        callback();
      },
    });
    const terminal = readline.createInterface({
      input: process.stdin,
      output: hiddenOutput,
      terminal: true,
    });

    terminal.question("OpenAI API key: ", (value) => {
      muted = false;
      terminal.close();
      process.stdout.write("\n");
      resolve(value.trim());
    });
    muted = true;
  });
}

async function main() {
  let apiKey = process.env.OPENAI_API_KEY?.trim();

  try {
    if (!apiKey) apiKey = await promptForKey();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 2;
    return;
  }

  if (!apiKey) {
    process.stderr.write("No API key was provided.\n");
    process.exitCode = 2;
    return;
  }

  try {
    const client = new OpenAI({ apiKey, maxRetries: 0, timeout: 20_000 });
    await client.models.list();
    process.stdout.write("Valid: OpenAI accepted the key (HTTP 200).\n");
  } catch (error) {
    const status = Number(error?.status) || 0;
    const code = typeof error?.code === "string" ? error.code : "";
    const statusLabel = status ? `HTTP ${status}` : "no HTTP response";
    process.stderr.write(`Not usable: ${classifyResult(status, code)} (${statusLabel})\n`);
    process.exitCode = 1;
  } finally {
    apiKey = undefined;
    delete process.env.OPENAI_API_KEY;
  }
}

const isEntryPoint =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isEntryPoint) await main();
