import { NextRequest, NextResponse } from "next/server";
import { generateEmbeddings } from "@/lib/openai";
import { upsertVectors } from "@/lib/pinecone";
import { chunkText } from "@/lib/utils";
import { readFileSync, readdirSync } from "fs";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const adminSecret = process.env.ADMIN_SECRET || "dev-secret";

    if (authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dataDir = path.join(process.cwd(), "public", "data");
    const files = readdirSync(dataDir).filter(
      (f) => f.endsWith(".txt") || f.endsWith(".md") || f.endsWith(".json")
    );

    const allChunks: Array<{ id: string; text: string; source: string }> = [];

    for (const file of files) {
      const filePath = path.join(dataDir, file);
      let content = readFileSync(filePath, "utf-8");

      if (file.endsWith(".json")) {
        try {
          const parsed = JSON.parse(content);
          content = JSON.stringify(parsed, null, 2);
        } catch {
          // keep raw
        }
      }

      const chunks = chunkText(content, 400, 50);
      chunks.forEach((chunk, i) => {
        allChunks.push({
          id: `${file}-chunk-${i}`,
          text: chunk,
          source: file,
        });
      });
    }

    // Also ingest profile + timeline + skills
    const profileFiles = ["profile.json", "projects.json", "timeline.json", "skills.json"];
    for (const pf of profileFiles) {
      try {
        const pfPath = path.join(process.cwd(), "src", "data", pf);
        const content = readFileSync(pfPath, "utf-8");
        const chunks = chunkText(content, 400, 50);
        chunks.forEach((chunk, i) => {
          allChunks.push({ id: `${pf}-chunk-${i}`, text: chunk, source: pf });
        });
      } catch {
        // skip missing files
      }
    }

    if (!allChunks.length) {
      return NextResponse.json({ message: "No content to ingest", chunks: 0 });
    }

    // Batch embed and upsert
    const batchSize = 50;
    let processed = 0;

    for (let i = 0; i < allChunks.length; i += batchSize) {
      const batch = allChunks.slice(i, i + batchSize);
      const texts = batch.map((c) => c.text);
      const embeddings = await generateEmbeddings(texts);

      const vectors = batch.map((chunk, j) => ({
        id: chunk.id,
        values: embeddings[j],
        metadata: { text: chunk.text, source: chunk.source },
      }));

      await upsertVectors(vectors);
      processed += batch.length;
    }

    return NextResponse.json({
      message: "Ingestion complete",
      chunks: processed,
      files: files.length + profileFiles.length,
    });
  } catch (error) {
    console.error("Ingest error:", error);
    return NextResponse.json({ error: "Ingestion failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "POST to this endpoint with Authorization: Bearer <ADMIN_SECRET> to trigger ingestion",
  });
}
