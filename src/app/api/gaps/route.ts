/**
 * /api/gaps — Review questions the chat couldn't answer confidently.
 *
 * GET   Returns all logged gaps (requires admin auth)
 * DELETE Clears the gap log (requires admin auth)
 */

import { NextRequest, NextResponse } from "next/server";
import { readAllGaps } from "@/lib/gapLogger";
import { config } from "@/lib/config";

export const runtime = "nodejs";

function authorized(req: NextRequest): boolean {
  return req.headers.get("authorization") === `Bearer ${config.admin.secret}`;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const gaps = readAllGaps();
  return NextResponse.json({
    total: gaps.length,
    gaps,
    note: "These are questions visitors asked that had no high-confidence match in Pinecone. Add information about these topics to your data files and re-run /api/ingest.",
  });
}
