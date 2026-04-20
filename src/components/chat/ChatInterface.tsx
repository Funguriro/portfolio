"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronRight } from "lucide-react";
import { Message, ComponentType } from "@/types";
import { generateId, detectComponent } from "@/lib/utils";
import ChatMessage from "@/components/chat/ChatMessage";
import TypingIndicator from "@/components/chat/TypingIndicator";

const GREETING_CONTENT =
  "Hello, my name is Nigel. What would you like to know about me? I can tell you about my projects, experience, skills, or anything else you're curious about. 🙂";

const SUGGESTIONS = [
  "Show me your projects",
  "What's your tech stack?",
  "Walk me through your career",
  "What are you passionate about?",
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(() => [
    { id: "greeting", role: "assistant", content: GREETING_CONTENT, timestamp: new Date(), component: null },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [typing, setTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    const el = chatContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  async function sendMessage(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText || streaming) return;

    setInput("");

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);
    setStreaming(true);

    const historyForAPI = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const assistantId = generateId();
    const detectedComponent = detectComponent(userText) as ComponentType;

    try {
      abortRef.current = new AbortController();

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyForAPI }),
        signal: abortRef.current.signal,
      });

      // Handle non-streaming error responses
      if (!res.ok) {
        const errorMessages: Record<string, string> = {
          missing_key: "The OpenAI API key hasn't been added yet. Add `OPENAI_API_KEY` to your `.env.local` file and restart the dev server.",
          invalid_key: "The OpenAI API key looks invalid. Double-check it in `.env.local` — it should start with `sk-`.",
          server_error: "Something went wrong on the server. Check your terminal for details.",
        };
        let errorCode = "server_error";
        try {
          const body = await res.json();
          errorCode = body.error || errorCode;
        } catch { /* non-JSON body */ }
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: generateId(), role: "assistant", content: errorMessages[errorCode] ?? errorMessages.server_error, timestamp: new Date() },
        ]);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let accumulated = "";
      setTyping(false);

      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", timestamp: new Date(), component: null },
      ]);

      outer: while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value, { stream: true }).split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break outer;
          try {
            const parsed = JSON.parse(data);
            accumulated += parsed.content || "";
            setMessages((prev) =>
              prev.map((m) => m.id === assistantId ? { ...m, content: accumulated } : m)
            );
          } catch { /* malformed chunk */ }
        }
      }

      if (detectedComponent) {
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, component: detectedComponent } : m)
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: generateId(), role: "assistant", content: "Connection failed. Check your internet and try again.", timestamp: new Date() },
      ]);
    } finally {
      setTyping(false);
      setStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  }

  return (
    <section id="chat" className="py-24 border-t border-[var(--border)]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-2">
            AI Assistant
          </p>
          <h2 className="text-2xl font-light text-[var(--foreground)]">
            Ask me anything
          </h2>
        </motion.div>

        {/* Chat window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="border border-[var(--border)] bg-[var(--background)]"
        >
          {/* Messages */}
          <div ref={chatContainerRef} className="h-[520px] overflow-y-auto chat-scroll py-4 space-y-1">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {typing && <TypingIndicator key="typing" />}
            </AnimatePresence>

            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="px-4 py-3 border-t border-[var(--border)] flex flex-wrap gap-2"
            >
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)] transition-all"
                >
                  <ChevronRight size={10} />
                  {s}
                </button>
              ))}
            </motion.div>
          )}

          {/* Input area */}
          <div className="border-t border-[var(--border)] p-4 flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask about my work, skills, or anything else..."
              rows={1}
              disabled={streaming}
              className="flex-1 resize-none bg-transparent text-sm text-[var(--foreground)] placeholder-[var(--muted)] outline-none leading-relaxed max-h-[120px] disabled:opacity-50 font-[inherit]"
              style={{ height: "24px" }}
            />
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => sendMessage()}
                disabled={!input.trim() || streaming}
                className="w-8 h-8 flex items-center justify-center bg-[var(--foreground)] text-[var(--background)] disabled:opacity-30 transition-opacity hover:opacity-80"
                aria-label="Send message"
              >
                <Send size={14} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-[var(--muted)] mt-4"
        >
          Powered by Nigel's personal knowledge base
        </motion.p>
      </div>
    </section>
  );
}
