/**
 * /api/ingest
 *
 * Rebuilds the Pinecone knowledge base from all site content.
 * Call this whenever you update any data file or page content.
 *
 * POST  Authorization: Bearer <ADMIN_SECRET>
 * GET   Returns usage instructions
 */

import { NextRequest, NextResponse } from "next/server";
import { generateEmbeddings } from "@/lib/openai";
import { getPineconeIndex, upsertVectors } from "@/lib/pinecone";
import { getAllContentChunks } from "@/lib/siteContent";
import { config } from "@/lib/config";

export const runtime = "nodejs";
export const maxDuration = 120;

const BATCH_SIZE = 20;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${config.admin.secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!config.openai.isConfigured) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 503 });
  }

  try {
    const index = getPineconeIndex();

    // ── 1. Clear existing vectors ──────────────────────────────────
    try {
      await index.deleteAll();
    } catch {
      // Index may be empty on first run — that's fine
    }

    // ── 2. Extract all site content ────────────────────────────────
    const chunks = getAllContentChunks();

    if (!chunks.length) {
      return NextResponse.json({ message: "No content to ingest", chunks: 0 });
    }

    // ── 3. Embed + upsert in batches ───────────────────────────────
    let processed = 0;

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const texts = batch.map((c) => c.text);
      const embeddings = await generateEmbeddings(texts);

      const vectors = batch.map((chunk, j) => ({
        id: chunk.id,
        values: embeddings[j],
        metadata: {
          text: chunk.text,
          category: chunk.category,
          ...chunk.metadata,
        },
      }));

      await upsertVectors(vectors);
      processed += batch.length;
    }

    return NextResponse.json({
      message: "Ingestion complete — Pinecone index rebuilt from all site content.",
      chunksIngested: processed,
      categories: [...new Set(chunks.map((c) => c.category))],
    });
  } catch (error) {
    console.error("[ingest] error:", error);
    return NextResponse.json(
      { error: "Ingestion failed", detail: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    usage: "POST to this endpoint with 'Authorization: Bearer <ADMIN_SECRET>' header to rebuild the Pinecone knowledge base.",
    note: "This clears the existing index and re-ingests all content from src/data/ JSON files. Run this after updating any data file.",
    contentSources: [
      "src/data/profile.json    — name, bio, contact, social",
      "src/data/projects.json   — all projects (featured + additional)",
      "src/data/timeline.json   — career timeline",
      "src/data/skills.json     — technical skills by category",
      "src/data/services.json   — all services, rates, process, guarantees",
      "src/lib/siteContent.ts   — personal info, AI capabilities, clients, influencers",
    ],
  });
}
