import { NextRequest } from "next/server";
import { streamChatResponse } from "@/lib/rag";
import { localChatResponse } from "@/lib/localChat";

export const runtime = "nodejs";
export const maxDuration = 30;

const hasOpenAI =
  !!process.env.OPENAI_API_KEY &&
  !process.env.OPENAI_API_KEY.startsWith("sk-YOUR") &&
  process.env.OPENAI_API_KEY !== "your_openai_api_key_here";

function sseStream(text: string): Response {
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
      // Simulate streaming — send in small word-chunks for natural feel
      const words = text.split(" ");
      let i = 0;
      function push() {
        if (i >= words.length) {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          return;
        }
        const chunk = (i === 0 ? "" : " ") + words[i++];
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
        );
        // tiny delay for streaming effect
        setTimeout(push, 18);
      }
      push();
    },
  });
  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  if (!messages || !Array.isArray(messages)) {
    return new Response("Invalid request", { status: 400 });
  }

  // ── Local fallback (no OpenAI key) ───────────────────────────
  if (!hasOpenAI) {
    const reply = localChatResponse(messages);
    return sseStream(reply);
  }

  // ── OpenAI streaming path ────────────────────────────────────
  try {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const query = lastUserMessage?.content || "";
    const stream = await streamChatResponse(messages, query);
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content || "";
            if (delta) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    // OpenAI failed — fall back to local rather than showing an error
    console.error("OpenAI error, falling back to local:", error);
    const reply = localChatResponse(messages);
    return sseStream(reply);
  }
}
