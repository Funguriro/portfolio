import fs from "fs";
import path from "path";

let cachedContent: string | null = null;

export function getKnowledgeBase(): string {
  if (cachedContent !== null) return cachedContent;
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "Knowledge_base",
      "info_knowledge_base.txt"
    );
    cachedContent = fs.readFileSync(filePath, "utf-8");
  } catch {
    cachedContent = "";
  }
  return cachedContent;
}

export function getRelevantChunks(query: string, maxChunks = 4): string {
  const kb = getKnowledgeBase();
  if (!kb) return "";

  const chunks = kb
    .split(/\n{2,}|\r\n{2,}/)
    .map((c) => c.trim())
    .filter((c) => c.length > 20);

  if (!chunks.length) return "";

  const stopWords = new Set(["the", "and", "for", "are", "you", "that", "this", "with", "from", "his", "her", "was"]);
  const queryTokens = new Set(
    query
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w))
  );

  const scored = chunks.map((chunk) => {
    const lower = chunk.toLowerCase().replace(/[^\w\s]/g, "");
    const words = lower.split(/\s+/);
    const overlap = words.filter((w) => queryTokens.has(w)).length;
    return { chunk, score: overlap };
  });

  const maxScore = Math.max(...scored.map((s) => s.score));

  // If nothing specific matched, return first few chunks (general profile info)
  if (maxScore === 0) {
    return chunks.slice(0, 2).join("\n\n");
  }

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks)
    .map((s) => s.chunk)
    .join("\n\n");
}
