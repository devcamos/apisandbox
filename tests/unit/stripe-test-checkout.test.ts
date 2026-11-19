import { describe, expect, it } from "vitest"
import { isSameStripeTestCheckout, readStripeTestCheckout } from "../helpers/stripe-test-checkout"

const sessionId = "cs_test_example"
const url = "https://checkout.stripe.com/c/pay/cs_test_example"
const response = { sessionId, url, livemode: false }

describe("Stripe TEST checkout verification", () => {
  it("matches the issued session across hosted paths without relying on a fixed prefix", () => {
    const checkout = readStripeTestCheckout(response)
    expect(isSameStripeTestCheckout(new URL(url), checkout)).toBe(true)
    expect(isSameStripeTestCheckout(new URL("https://checkout.stripe.com/pay/cs_test_example#checkout"), checkout)).toBe(true)
    expect(isSameStripeTestCheckout(new URL(url + "_other"), checkout)).toBe(false)
  })

  it("requires the exact issued URL when the hosted path is opaque", () => {
    const opaqueUrl = "https://checkout.stripe.com/session/example#config"
    const checkout = readStripeTestCheckout({ ...response, url: opaqueUrl })
    expect(isSameStripeTestCheckout(new URL(opaqueUrl), checkout)).toBe(true)
    expect(isSameStripeTestCheckout(new URL(opaqueUrl.replace("example", "other")), checkout)).toBe(false)
    expect(isSameStripeTestCheckout(new URL("https://checkout.stripe.com/"), checkout)).toBe(false)
  })

  it.each([
    { livemode: true },
    { livemode: undefined },
    { sessionId: "cs_live_example" },
    { url: "https://checkout.stripe.com/c/pay/cs_live_example" },
    { url: "https://checkout.stripe.com/c/pay/cs_test_other" },
    { url: "https://checkout.stripe.com.example/c/pay/cs_test_example" },
    { url: "http://checkout.stripe.com/c/pay/cs_test_example" },
  ])("rejects an unsafe or mismatched checkout response %#", (override) => {
    expect(() => readStripeTestCheckout({ ...response, ...override })).toThrow("Stripe TEST session")
  })

  it("rejects a subsequent live checkout or an origin change", () => {
    const checkout = readStripeTestCheckout(response)
    expect(isSameStripeTestCheckout(new URL(url.replace("cs_test_", "cs_live_")), checkout)).toBe(false)
    expect(isSameStripeTestCheckout(new URL(url.replace("checkout.stripe.com", "example.test")), checkout)).toBe(false)
  })
})
