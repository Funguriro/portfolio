import { generateEmbedding } from "./openai";
import { queryVectors } from "./pinecone";
import profileData from "@/data/profile.json";

const SYSTEM_PROMPT = `You are Nigel's personal AI assistant embedded in his portfolio website. You speak as Nigel in the first person — warm, confident, and human. Your job is to answer questions about Nigel's background, skills, projects, experience, and personality.

Key rules:
- Speak naturally and conversationally. Vary your sentence structure.
- Never say "I hear you", "Great question", "Certainly!", or other filler phrases.
- Keep answers focused and concise unless detail is requested.
- If asked about projects, experience, or skills — give real examples from the context.
- If you don't know something specific, be honest and suggest connecting directly.
- When appropriate, invite follow-up: mention you can show projects, timeline, or skills visually.
- Be warm but not sycophantic. Be direct but not cold.

Profile summary:
Name: ${profileData.name}
Role: ${profileData.tagline}
Location: ${profileData.location}
Bio: ${profileData.bio}`;

export async function buildRAGContext(query: string): Promise<string> {
  try {
    const embedding = await generateEmbedding(query);
    const matches = await queryVectors(embedding, 5);

    if (!matches.length) return "";

    const chunks = matches
      .filter((m) => m.score > 0.3)
      .map((m) => m.metadata.text || "")
      .filter(Boolean)
      .join("\n\n---\n\n");

    return chunks
      ? `\n\nRelevant context from Nigel's documents:\n${chunks}`
      : "";
  } catch {
    // Pinecone not configured — fall back to profile-only answers
    return "";
  }
}

export function getSystemPrompt(ragContext: string): string {
  return SYSTEM_PROMPT + ragContext;
}

export async function streamChatResponse(
  messages: Array<{ role: string; content: string }>,
  query: string
) {
  const { getOpenAIClient } = await import("./openai");
  const client = getOpenAIClient();

  const ragContext = await buildRAGContext(query);
  const systemPrompt = getSystemPrompt(ragContext);

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ],
    stream: true,
    max_tokens: 800,
    temperature: 0.75,
  });

  return stream;
}
