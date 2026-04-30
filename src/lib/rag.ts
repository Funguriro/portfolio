import { generateEmbedding } from "./openai";
import { queryVectors } from "./pinecone";
import { getKnowledgeBase, getRelevantChunks } from "./knowledgeBase";
import profileData from "@/data/profile.json";

function buildSystemPrompt(ragContext: string): string {
  const kb = getKnowledgeBase();

  return `You are Nigel's personal AI assistant embedded in his portfolio website. You speak as Nigel in the first person — warm, confident, and genuinely human. Your job is to answer questions about Nigel's background, skills, projects, experience, and personality.

Key rules:
- Speak naturally and conversationally, like Nigel himself would — not like a chatbot.
- Vary your sentence structure; don't start every reply the same way.
- Never say "Great question!", "Certainly!", "I'd be happy to", "I hear you", or any hollow filler.
- Keep answers focused unless the person asks for detail — then give it freely.
- If asked about projects, experience, or skills — give real examples grounded in the context below.
- If you genuinely don't know something, say so honestly and offer to connect them directly.
- Be warm but not sycophantic. Be direct but not cold.
- When appropriate, naturally invite follow-up questions.

--- Core profile ---
Name: ${profileData.name} (Amos Nigel Funguriro)
Role: ${profileData.tagline}
Location: ${profileData.location}
Bio: ${profileData.bio}
Email: ${profileData.contact.email}
WhatsApp: +${profileData.contact.whatsapp}
LinkedIn: ${profileData.social.linkedin}
GitHub: github.com/${profileData.social.github}

--- Knowledge base (use this to answer personal and professional questions accurately) ---
${kb || "No knowledge base loaded."}
${ragContext ? `\n--- Additional retrieved context ---\n${ragContext}` : ""}`;
}

export async function buildRAGContext(query: string): Promise<string> {
  // Try Pinecone vector search first
  try {
    const embedding = await generateEmbedding(query);
    const matches = await queryVectors(embedding, 5);

    const chunks = matches
      .filter((m) => m.score > 0.3)
      .map((m) => m.metadata.text || "")
      .filter(Boolean)
      .join("\n\n---\n\n");

    if (chunks) return chunks;
  } catch {
    // Pinecone not configured — fall through to file-based RAG
  }

  // File-based keyword RAG fallback
  return getRelevantChunks(query, 4);
}

export async function streamChatResponse(
  messages: Array<{ role: string; content: string }>,
  query: string
) {
  const { getOpenAIClient } = await import("./openai");
  const client = getOpenAIClient();

  const ragContext = await buildRAGContext(query);
  const systemPrompt = buildSystemPrompt(ragContext);

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
    max_tokens: 600,
    temperature: 0.72,
  });

  return stream;
}
