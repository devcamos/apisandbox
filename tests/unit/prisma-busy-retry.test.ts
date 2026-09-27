import { describe, expect, it, vi } from "vitest"
import { Prisma } from "@prisma/client"
import { withPrismaBusyRetry } from "@/lib/prisma-busy-retry"

function busyError() {
  return Object.assign(Object.create(Prisma.PrismaClientInitializationError.prototype), {
    name: "PrismaClientInitializationError",
    message: "FATAL: (EMAXCONNSESSION) max clients reached in session mode",
    clientVersion: "test",
  })
}

describe("withPrismaBusyRetry", () => {
  it("returns on first success", async () => {
    const sleep = vi.fn(async () => undefined)
    const result = await withPrismaBusyRetry(async () => "ok", { sleep })
    expect(result).toBe("ok")
    expect(sleep).not.toHaveBeenCalled()
  })

  it("retries once on EMAXCONNSESSION then succeeds", async () => {
    const sleep = vi.fn(async () => undefined)
    const op = vi
      .fn()
      .mockRejectedValueOnce(busyError())
      .mockResolvedValueOnce("recovered")

    const result = await withPrismaBusyRetry(op, {
      sleep,
      random: () => 0,
      minDelayMs: 100,
      maxDelayMs: 100,
    })

    expect(result).toBe("recovered")
    expect(op).toHaveBeenCalledTimes(2)
    expect(sleep).toHaveBeenCalledWith(100)
  })

  it("does not retry non-busy errors", async () => {
    const sleep = vi.fn(async () => undefined)
    const err = new Error("CREDENTIALS_INVALID")
    await expect(withPrismaBusyRetry(async () => {
      throw err
    }, { sleep })).rejects.toBe(err)
    expect(sleep).not.toHaveBeenCalled()
  })

  it("rethrows after exhausting retries", async () => {
    const sleep = vi.fn(async () => undefined)
    const err = busyError()
    await expect(
      withPrismaBusyRetry(async () => {
        throw err
      }, { sleep, tries: 2, random: () => 0, minDelayMs: 10, maxDelayMs: 10 }),
    ).rejects.toBe(err)
    expect(sleep).toHaveBeenCalledTimes(1)
  })
})
