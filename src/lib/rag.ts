import { generateEmbedding } from "./openai";
import { queryVectors } from "./pinecone";
import { logGap } from "./gapLogger";
import profileData from "@/data/profile.json";
import servicesData from "@/data/services.json";

const CONFIDENCE_THRESHOLD = 0.45;
const GREET_PATTERNS = /^(hi|hello|hey|sup|yo|howdy|good (morning|evening|afternoon))[\s!.?]*$/i;

const SYSTEM_PROMPT = `You are Nigel's personal AI assistant embedded in his portfolio website. You speak as Nigel in the first person — warm, confident, and genuinely human. Your job is to answer questions about Nigel's background, skills, projects, experience, services, rates, and personality using the context provided below.

Rules:
- Speak naturally and conversationally, the way Nigel himself would. Vary your sentence structure.
- Never say "Great question!", "Certainly!", "I'd be happy to", "I hear you", or any hollow filler.
- Keep answers focused and concise unless detail is explicitly requested.
- Ground every answer in the context chunks provided — never invent facts.
- If you genuinely don't know something, say so honestly and suggest the person reach out directly.
- Be warm but not sycophantic. Be direct but not cold.
- When appropriate, naturally invite follow-up or offer to connect them via WhatsApp or email.

Key facts always available:
- Full name: Amos Nigel Funguriro (goes by Nigel)
- Role: ${profileData.tagline}
- Location: ${profileData.location} (620 Michigan Ave., N.E., Washington, DC 20064)
- Email: ${profileData.contact.email}
- WhatsApp: +${profileData.contact.whatsapp}
- Calendly: ${profileData.contact.calendly}
- Rate: ${servicesData.rateCore} core engineering/AI, ${servicesData.rateAdditional} additional services`;

export async function queryPinecone(query: string): Promise<{
  chunks: string[];
  maxScore: number;
}> {
  try {
    const embedding = await generateEmbedding(query);
    const matches = await queryVectors(embedding, 6);

    const relevant = matches.filter((m) => m.score > 0.25);
    const maxScore = relevant.length ? Math.max(...relevant.map((m) => m.score)) : 0;

    const chunks = relevant
      .map((m) => m.metadata.text || "")
      .filter(Boolean);

    return { chunks, maxScore };
  } catch {
    return { chunks: [], maxScore: 0 };
  }
}

export async function buildSystemPrompt(query: string): Promise<{
  prompt: string;
  hadGap: boolean;
}> {
  const isGreeting = GREET_PATTERNS.test(query.trim());

  if (isGreeting) {
    return { prompt: SYSTEM_PROMPT, hadGap: false };
  }

  const { chunks, maxScore } = await queryPinecone(query);

  const hadGap = maxScore < CONFIDENCE_THRESHOLD;

  if (hadGap) {
    logGap(query, maxScore);
  }

  const contextBlock = chunks.length
    ? `\n\n--- Relevant context from Nigel's portfolio ---\n${chunks.join("\n\n---\n\n")}`
    : "";

  const gapNote = hadGap && chunks.length === 0
    ? "\n\nNote for this response: No specific context was found for this question. Be honest that you may not have full details on this topic and suggest the person reach out directly."
    : "";

  return {
    prompt: SYSTEM_PROMPT + contextBlock + gapNote,
    hadGap,
  };
}

export async function streamChatResponse(
  messages: Array<{ role: string; content: string }>,
  query: string
) {
  const { getOpenAIClient } = await import("./openai");
  const client = getOpenAIClient();

  const { prompt } = await buildSystemPrompt(query);

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: prompt },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ],
    stream: true,
    max_tokens: 600,
    temperature: 0.7,
  });

  return stream;
}
