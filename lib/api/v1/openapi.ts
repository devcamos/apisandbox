import { z } from "zod"
import {
  v1CheckpointPutBodySchema,
  v1CheckpointPutResponseSchema,
  v1CourseListResponseSchema,
  v1CourseProgressResponseSchema,
  v1MeResponseSchema,
  v1ProblemSchema,
} from "@/lib/api/v1/schemas"

function jsonSchemaComponent(schema: z.ZodType, name: string) {
  const raw = z.toJSONSchema(schema) as Record<string, unknown>
  const { $schema: _schema, ...rest } = raw
  return { name, schema: rest }
}

const bearerSecurity = [{ bearerAuth: [] }]

/**
 * OpenAPI 3.1 description for `/api/v1`, built from the Zod response/request schemas.
 */
export function buildV1OpenApiDocument() {
  const components = [
    jsonSchemaComponent(v1MeResponseSchema, "MeResponse"),
    jsonSchemaComponent(v1CourseListResponseSchema, "CourseListResponse"),
    jsonSchemaComponent(v1CourseProgressResponseSchema, "CourseProgressResponse"),
    jsonSchemaComponent(v1CheckpointPutBodySchema, "CheckpointPutBody"),
    jsonSchemaComponent(v1CheckpointPutResponseSchema, "CheckpointPutResponse"),
    jsonSchemaComponent(v1ProblemSchema, "Problem"),
  ]

  const schemas = Object.fromEntries(components.map((c) => [c.name, c.schema]))

  const problemResponse = (description: string) => ({
    description,
    headers: {
      "X-Request-Id": {
        schema: { type: "string" },
        description: "Request correlation ID (echoed from request or generated).",
      },
    },
    content: {
      "application/problem+json": {
        schema: { $ref: "#/components/schemas/Problem" },
      },
    },
  })

  const jsonResponse = (ref: string, description: string) => ({
    description,
    headers: {
      "X-Request-Id": {
        schema: { type: "string" },
      },
    },
    content: {
      "application/json": {
        schema: { $ref: `#/components/schemas/${ref}` },
      },
    },
  })

  return {
    openapi: "3.1.0",
    info: {
      title: "API Sandbox Public API",
      version: "1.0.0",
      description:
        "Learner-facing HTTP API authenticated with personal API tokens (`apisb_…`) created in Settings. Session cookies used by the website are not accepted on this surface.",
    },
    servers: [
      {
        url: "/",
        description: "Same origin as the deployed app",
      },
    ],
    tags: [
      { name: "Identity", description: "Caller identity for the token" },
      { name: "Progress", description: "Learning progress owned by the token's user" },
      { name: "Meta", description: "Discovery" },
    ],
    paths: {
      "/api/v1/openapi.json": {
        get: {
          tags: ["Meta"],
          summary: "OpenAPI document",
          security: [],
          responses: {
            "200": {
              description: "OpenAPI 3.1 document",
              content: {
                "application/json": {
                  schema: { type: "object" },
                },
              },
            },
          },
        },
      },
      "/api/v1/me": {
        get: {
          tags: ["Identity"],
          summary: "Current user (no email)",
          description:
            "Returns the authenticated user's id, display name, subscription tier, and the calling token's metadata. Email is intentionally omitted.",
          security: bearerSecurity,
          responses: {
            "200": jsonResponse("MeResponse", "Caller identity"),
            "401": problemResponse("Missing or invalid token"),
            "403": problemResponse("Token lacks profile:read"),
            "429": problemResponse("Rate limited"),
          },
        },
      },
      "/api/v1/progress/courses": {
        get: {
          tags: ["Progress"],
          summary: "List enrolled course progress summaries",
          security: bearerSecurity,
          responses: {
            "200": jsonResponse("CourseListResponse", "Enrollment summaries"),
            "401": problemResponse("Missing or invalid token"),
            "403": problemResponse("Token lacks progress:read"),
            "429": problemResponse("Rate limited"),
          },
        },
      },
      "/api/v1/progress/courses/{courseId}": {
        get: {
          tags: ["Progress"],
          summary: "Get progress for one course",
          security: bearerSecurity,
          parameters: [
            {
              name: "courseId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": jsonResponse("CourseProgressResponse", "Course progress"),
            "401": problemResponse("Missing or invalid token"),
            "403": problemResponse("Token lacks progress:read"),
            "404": problemResponse("Unknown course"),
            "429": problemResponse("Rate limited"),
          },
        },
      },
      "/api/v1/progress/courses/{courseId}/modules/{moduleId}/checkpoints/{checkpointId}": {
        put: {
          tags: ["Progress"],
          summary: "Upsert one checkpoint",
          description:
            "Idempotent upsert on the natural key (user, course, module, checkpoint). Requires progress:write.",
          security: bearerSecurity,
          parameters: [
            { name: "courseId", in: "path", required: true, schema: { type: "string" } },
            { name: "moduleId", in: "path", required: true, schema: { type: "string" } },
            { name: "checkpointId", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CheckpointPutBody" },
              },
            },
          },
          responses: {
            "200": jsonResponse("CheckpointPutResponse", "Updated checkpoint and course progress"),
            "400": problemResponse("Validation failed"),
            "401": problemResponse("Missing or invalid token"),
            "403": problemResponse("Token lacks progress:write"),
            "404": problemResponse("Unknown course or checkpoint"),
            "415": problemResponse("Content-Type must be application/json"),
            "429": problemResponse("Rate limited"),
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          description: "Personal API token from Settings (`apisb_` prefix).",
        },
      },
      schemas,
    },
  }
}
