#!/usr/bin/env tsx
/**
 * Standalone ingest script — run with: npx tsx scripts/ingest.ts
 *
 * Reads all .txt, .md, .json files from public/data/
 * plus src/data/ profile JSONs, chunks them, embeds with OpenAI,
 * and upserts into Pinecone.
 *
 * Requires OPENAI_API_KEY and PINECONE_API_KEY in .env.local
 */

import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync, readdirSync } from "fs";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

config({ path: resolve(process.cwd(), ".env.local") });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pinecone.index(process.env.PINECONE_INDEX_NAME || "portfolio-knowledge");

function chunkText(text: string, chunkSize = 400, overlap = 50): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    chunks.push(words.slice(start, end).join(" "));
    start += chunkSize - overlap;
  }
  return chunks;
}

async function embedBatch(texts: string[]): Promise<number[][]> {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}

async function ingest() {
  const allChunks: Array<{ id: string; text: string; source: string }> = [];

  // Ingest public/data files (user-dropped PDFs converted to txt etc)
  const publicDataDir = resolve(process.cwd(), "public", "data");
  try {
    const files = readdirSync(publicDataDir).filter(
      (f) => f.endsWith(".txt") || f.endsWith(".md") || f.endsWith(".json")
    );
    for (const file of files) {
      const content = readFileSync(resolve(publicDataDir, file), "utf-8");
      chunkText(content).forEach((chunk, i) => {
        allChunks.push({ id: `${file}-${i}`, text: chunk, source: file });
      });
      console.log(`  Chunked: ${file}`);
    }
  } catch {
    console.log("  No public/data files found — skipping.");
  }

  // Ingest structured profile data
  const profileFiles = ["profile.json", "projects.json", "timeline.json", "skills.json"];
  for (const pf of profileFiles) {
    try {
      const content = readFileSync(resolve(process.cwd(), "src", "data", pf), "utf-8");
      chunkText(content).forEach((chunk, i) => {
        allChunks.push({ id: `${pf}-${i}`, text: chunk, source: pf });
      });
      console.log(`  Chunked: ${pf}`);
    } catch {
      console.warn(`  Skipped: ${pf}`);
    }
  }

  if (!allChunks.length) {
    console.log("Nothing to ingest. Add files to public/data/ first.");
    return;
  }

  console.log(`\nEmbedding ${allChunks.length} chunks...`);

  const batchSize = 50;
  for (let i = 0; i < allChunks.length; i += batchSize) {
    const batch = allChunks.slice(i, i + batchSize);
    const embeddings = await embedBatch(batch.map((c) => c.text));

    await index.upsert({
      records: batch.map((chunk, j) => ({
        id: chunk.id,
        values: embeddings[j],
        metadata: { text: chunk.text, source: chunk.source },
      })),
    });

    console.log(`  Upserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allChunks.length / batchSize)}`);
  }

  console.log(`\n✓ Ingested ${allChunks.length} chunks into Pinecone.`);
}

ingest().catch((err) => {
  console.error("Ingest failed:", err);
  process.exit(1);
});
