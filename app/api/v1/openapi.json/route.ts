import { NextRequest, NextResponse } from "next/server"
import { buildV1OpenApiDocument } from "@/lib/api/v1/openapi"
import { REQUEST_ID_HEADER, resolveRequestId } from "@/lib/api/v1/request-id"

export async function GET(request: NextRequest) {
  const requestId = resolveRequestId(request)
  const document = buildV1OpenApiDocument()
  return NextResponse.json(document, {
    headers: {
      [REQUEST_ID_HEADER]: requestId,
      "Cache-Control": "public, max-age=300",
    },
  })
}
