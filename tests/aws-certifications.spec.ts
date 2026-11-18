import { expect, test, type APIRequestContext } from "@playwright/test"
import { randomUUID } from "node:crypto"

const practitionerCourseId = "aws-cloud-practitioner-clf-c02-v1"

async function createAuthenticatedSession(request: APIRequestContext) {
  const response = await request.post("/api/auth/register", {
    data: {
      email: `aws-cert-${Date.now()}-${randomUUID()}@example.com`,
      password: "Test1234!@#$",
      firstName: "AWS",
      lastName: "Learner",
    },
  })
  expect(response.ok()).toBeTruthy()
  const body = await response.json()
  return body.data.token as string
}

async function applySession(page: import("@playwright/test").Page, token: string) {
  await page.context().addCookies([
    {
      name: "auth_token",
      value: token,
      url: "http://localhost:4000",
      httpOnly: true,
      sameSite: "Lax",
    },
  ])
}

test.describe("AWS certification journey", () => {
  test("shows the complete certification ladder and opens an architecture lab", async ({ page }) => {
    await page.goto("/cloud/aws/certifications")

    await expect(page.getByRole("heading", { name: "AWS Certification Journey" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Cloud Practitioner" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "AI Practitioner" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Solutions Architect Associate" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Solutions Architect Professional" })).toBeVisible()

    await page.goto("/cloud/aws/certifications/associate")
    await expect(page).toHaveURL(/\/login\?callbackUrl=/)

    const token = await createAuthenticatedSession(page.request)
    await applySession(page, token)
    await page.goto("/cloud/aws/certifications/associate/resilient-architectures")
    await expect(page.getByRole("article").getByRole("heading", { name: "Design resilient architectures" })).toBeVisible()
    await page.getByText("Publish durable work to SQS and acknowledge the webhook promptly", { exact: true }).click()
    await expect(page.getByText("Decision trace")).toBeVisible()
    await expect(page.getByText("Retry independently")).toBeVisible()

    await page.goto("/cloud/aws/certifications/ai-practitioner/rag")
    await expect(page).toHaveURL("/cloud/aws/certifications/ai-practitioner/domains/foundation-models/capabilities/rag")
    await expect(page.getByRole("article").getByRole("heading", { name: "Retrieval-augmented generation (RAG)", exact: true })).toBeVisible()
    await expect(page.getByText("Opening this capability", { exact: false })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Problem", exact: true })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Build", exact: true })).toBeVisible()
    await expect(page.getByRole("heading", { name: "AWS Map", exact: true })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Exam", exact: true })).toBeVisible()
    await expect(page.getByText("Java 21", { exact: true })).toBeVisible()
  })

  test("runs the capability learning loop and exports its evidence", async ({ page }) => {
    const token = await createAuthenticatedSession(page.request)
    await applySession(page, token)
    await page.route("**/api/learning/capability-explanations", (route) => route.fulfill({
      json: { data: [
        { criterion: "Correct hierarchy", status: "covered", feedback: "The hierarchy is clear." },
        { criterion: "Problem-to-technique mapping", status: "covered", feedback: "The fixed policy suits rules." },
        { criterion: "One rejected alternative", status: "missing", feedback: "Which approach would you reject?", href: "#stage-learn-trade-offs" },
      ] },
    }))

    await page.goto("/cloud/aws/certifications/ai-practitioner/domains/ai-ml-fundamentals/capabilities/ai-vs-ml-vs-deep-learning")
    const predict = page.locator("#stage-predict")
    await predict.getByRole("radio", { name: "Explicit rules plus an escalation path" }).check()
    await predict.getByRole("button", { name: "Commit prediction" }).click()
    await predict.getByLabel("Final takeaway").fill("Escalate ambiguous tickets instead of forcing a label.")

    const recall = page.locator("#stage-recall").getByRole("listitem").first()
    await expect(recall.getByText("AI is the broad pursuit", { exact: false })).toBeHidden()
    await recall.getByText("Show hint", { exact: true }).click()
    await recall.getByText("Reveal canonical answer", { exact: true }).click()
    await expect(recall.getByText("AI is the broad pursuit", { exact: false })).toBeVisible()

    await page.getByRole("button", { name: "Run starter" }).click()
    await expect(page.locator("#stage-build")).toContainText('["billing","billing"]')
    await page.getByRole("button", { name: "Run Fault" }).click()
    await expect(page.locator("#stage-break")).toContainText('["billing","access"]')
    await page.getByRole("button", { name: "Check recovery" }).click()
    await expect(page.getByText("Recovery failed", { exact: true })).toBeVisible()
    const recovery = page.getByLabel("Edit your recovery")
    await recovery.fill((await recovery.inputValue()).replace(
      'score >= 0 ?', 'Math.abs(score) < 0.1 ? "ABSTAIN" : score >= 0 ?',
    ))
    await page.getByRole("button", { name: "Check recovery" }).click()
    await expect(page.getByText("Recovery passed", { exact: true })).toBeVisible()

    const explanation = page.locator("#stage-explain").getByRole("textbox")
    const draft = "AI includes ML and layered neural networks. Stable audit policy is best encoded in rules."
    await explanation.fill(draft)
    await page.getByRole("button", { name: "Check explanation" }).click()
    await expect(page.getByText("Which approach would you reject?")).toBeVisible()
    await page.reload()
    await expect(explanation).toHaveValue(draft)
    await expect(page.getByText("Which approach would you reject?")).toBeVisible()

    const checkpoint = page.locator("#stage-exam")
    await checkpoint.getByRole("radio", { name: "Deep learning is ML, and ML is one approach to AI" }).check()
    await checkpoint.getByRole("radio", { name: "Semantic generation is required" }).check()
    await checkpoint.getByRole("button", { name: "Submit checkpoint" }).click()
    await expect(checkpoint.getByRole("link", { name: "Review this concept" })).toHaveAttribute("href", "#stage-aws-map-row-1")
    await expect(checkpoint.getByText("Recall practice scheduled")).toBeVisible()
    const download = page.waitForEvent("download")
    await checkpoint.getByRole("button", { name: "Export Capability Evidence" }).click()
    const file = await download
    expect(file.suggestedFilename()).toBe("ai-vs-ml-vs-deep-learning-capability-evidence.md")
    const stream = await file.createReadStream()
    const chunks: Buffer[] = []
    for await (const chunk of stream) chunks.push(Buffer.from(chunk))
    const markdown = Buffer.concat(chunks).toString("utf8")
    expect(markdown).toContain("Escalate ambiguous tickets")
    expect(markdown).toContain('["billing","access"]')
    expect(markdown).toContain("ABSTAIN")
    expect(markdown).toContain(draft)
    expect(markdown).toContain("Which approach would you reject?")
    expect(markdown).toContain("1/2 correct (50%)")
  })

  test("persists AI domain explanations and rubric feedback", async ({ page }) => {
    const token = await createAuthenticatedSession(page.request)
    await applySession(page, token)
    await page.route("**/api/learning/capability-explanations", (route) => route.fulfill({
      json: { data: [
        { status: "covered", feedback: "You explained what retrieval supplies." },
        { status: "missing", feedback: "Which artifact stays fixed?" },
        { status: "partial", feedback: "When would you choose fine-tuning?" },
      ] },
    }))
    await page.goto("/cloud/aws/certifications/ai-practitioner/foundation-model-applications")
    const draft = "Retrieval finds the latest approved documents and adds them to the prompt."
    const explanation = page.getByRole("region", { name: "Explain it back" }).getByRole("textbox")
    await explanation.fill(draft)
    await page.getByRole("button", { name: "Check explanation" }).click()
    await expect(page.getByText("Which artifact stays fixed?")).toBeVisible()
    await page.reload()
    await expect(explanation).toHaveValue(draft)
    await expect(page.getByText("Which artifact stays fixed?")).toBeVisible()
  })

  test("serves AIF-C01 practice by domain with explanations after submit", async ({ page }) => {
    const token = await createAuthenticatedSession(page.request)
    await applySession(page, token)

    await page.goto("/cloud/aws/certifications/ai-practitioner/practice?filter=metrics&limit=2")
    await expect(page.getByRole("heading", { name: "Exam-style practice" })).toBeVisible()
    await expect(page.getByText("D1 metrics focus")).toBeVisible()

    const fieldsets = page.locator("fieldset")
    await expect(fieldsets).toHaveCount(2)

    for (let index = 0; index < 2; index += 1) {
      const fieldset = fieldsets.nth(index)
      const formatHint = await fieldset.locator("text=/Pick \\d+/").textContent()
      const pickCount = Number.parseInt(formatHint?.match(/Pick (\d+)/)?.[1] ?? "1", 10)
      const options = fieldset.locator("label")
      for (let optionIndex = 0; optionIndex < pickCount; optionIndex += 1) {
        await options.nth(optionIndex).click()
      }
    }

    await page.getByRole("button", { name: "Submit practice set" }).click()
    await expect(page.getByRole("heading", { name: "Practice result" })).toBeVisible()
    await expect(page.locator("fieldset").first().locator("p").first()).toBeVisible()
  })

  test("persists certification assessment mastery through the shared API", async ({ request }) => {
    const token = await createAuthenticatedSession(request)
    const headers = { Authorization: `Bearer ${token}` }
    const endpoint = `/api/learning/assessments/${practitionerCourseId}/cloud-concepts`

    const response = await request.post(endpoint, {
      headers,
      data: {
        answers: {
          "cloud-elasticity": "Elasticity",
          "az-role": "Regional high availability",
          "well-architected-purpose": "A consistent way to review architecture trade-offs",
        },
      },
    })
    expect(response.ok()).toBeTruthy()
    expect((await response.json()).data.result).toMatchObject({
      correctAnswers: 3,
      totalQuestions: 3,
      mastered: true,
    })

    const summary = await request.get(`/api/learning/assessments/${practitionerCourseId}`, { headers })
    expect(summary.ok()).toBeTruthy()
    expect((await summary.json()).data).toMatchObject({ totalUnits: 5, masteredUnits: 1, percent: 20 })
  })
})
