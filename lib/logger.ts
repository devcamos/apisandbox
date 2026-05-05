import pino from "pino"

const isProduction = process.env.NODE_ENV === "production"
const isServer = typeof window === "undefined"

export const logger = isServer
  ? pino({
      level: process.env.LOG_LEVEL ?? (isProduction ? "info" : "debug"),
      ...(isProduction
        ? { formatters: { level: (label) => ({ level: label }) } }
        : { transport: { target: "pino-pretty", options: { colorize: true } } }),
    })
  : {
      info: (...args: unknown[]) => console.info("[info]", ...args),
      warn: (...args: unknown[]) => console.warn("[warn]", ...args),
      error: (...args: unknown[]) => console.error("[error]", ...args),
      debug: (...args: unknown[]) => console.debug("[debug]", ...args),
      fatal: (...args: unknown[]) => console.error("[fatal]", ...args),
      child: () => logger,
    }

export type Logger = typeof logger
