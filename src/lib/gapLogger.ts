/**
 * gapLogger.ts
 *
 * Logs questions the AI couldn't answer confidently (low Pinecone match score)
 * to public/chat-gaps.json so Nigel can review and add missing information.
 *
 * In production (Vercel serverless), writes to /tmp — persists within the
 * function lifecycle only. For persistent logging, replace with a database or
 * external service. In local development this writes directly to public/.
 */

import fs from "fs";
import path from "path";

export interface GapEntry {
  timestamp: string;
  question: string;
  bestMatchScore: number;
  suggestion: string;
}

const IS_DEV = process.env.NODE_ENV === "development";
const GAP_FILE = IS_DEV
  ? path.join(process.cwd(), "public", "chat-gaps.json")
  : path.join("/tmp", "chat-gaps.json");

function readGaps(): GapEntry[] {
  try {
    const raw = fs.readFileSync(GAP_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function logGap(question: string, bestMatchScore: number): void {
  try {
    const gaps = readGaps();

    // Avoid duplicate entries for the same question (within the last 50 entries)
    const recent = gaps.slice(-50);
    const alreadyLogged = recent.some(
      (g) => g.question.toLowerCase().trim() === question.toLowerCase().trim()
    );
    if (alreadyLogged) return;

    const entry: GapEntry = {
      timestamp: new Date().toISOString(),
      question: question.trim(),
      bestMatchScore: Math.round(bestMatchScore * 1000) / 1000,
      suggestion: `Consider adding information about: "${question.trim()}" to your website or data files, then re-run /api/ingest to update the knowledge base.`,
    };

    gaps.push(entry);

    // Keep last 200 entries to prevent unbounded growth
    const trimmed = gaps.slice(-200);
    fs.writeFileSync(GAP_FILE, JSON.stringify(trimmed, null, 2), "utf-8");
  } catch {
    // Fail silently — logging gaps should never break the chat
    console.warn("[gapLogger] Could not write gap log:", question);
  }
}

export function readAllGaps(): GapEntry[] {
  return readGaps();
}
