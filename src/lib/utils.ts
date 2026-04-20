import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ComponentType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function detectComponent(content: string): ComponentType {
  const lower = content.toLowerCase();

  if (
    lower.includes("project") ||
    lower.includes("built") ||
    lower.includes("portfolio") ||
    lower.includes("work i've done") ||
    lower.includes("show me what")
  ) {
    return "projects";
  }

  if (
    lower.includes("experience") ||
    lower.includes("career") ||
    lower.includes("worked at") ||
    lower.includes("timeline") ||
    lower.includes("job") ||
    lower.includes("employment") ||
    lower.includes("education") ||
    lower.includes("studied")
  ) {
    return "timeline";
  }

  if (
    lower.includes("skill") ||
    lower.includes("technology") ||
    lower.includes("tech stack") ||
    lower.includes("language") ||
    lower.includes("framework") ||
    lower.includes("tool")
  ) {
    return "skills";
  }

  return null;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const chunks: string[] = [];
  const words = text.split(/\s+/);
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    chunks.push(words.slice(start, end).join(" "));
    start += chunkSize - overlap;
  }

  return chunks;
}
