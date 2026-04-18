"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "@/types";
import { formatDate } from "@/lib/utils";
import ProjectCards from "./ProjectCards";
import Timeline from "./Timeline";
import SkillsGraph from "./SkillsGraph";

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} px-4 py-2`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--foreground)] flex items-center justify-center mt-1">
          <span className="text-[var(--background)] text-xs font-medium">N</span>
        </div>
      )}

      <div className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"} max-w-[85%]`}>
        {/* Bubble */}
        <div
          className={`px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-[var(--foreground)] text-[var(--background)] rounded-2xl rounded-tr-sm"
              : "bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] rounded-2xl rounded-tl-sm"
          }`}
        >
          {isUser ? (
            <span>{message.content}</span>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-[var(--muted)] px-1">
          {formatDate(new Date(message.timestamp))}
        </span>

        {/* Dynamic component */}
        {!isUser && message.component && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-full mt-1"
          >
            {message.component === "projects" && <ProjectCards inline />}
            {message.component === "timeline" && <Timeline inline />}
            {message.component === "skills" && <SkillsGraph inline />}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
