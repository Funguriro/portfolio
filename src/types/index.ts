export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  component?: ComponentType;
  componentData?: unknown;
}

export type ComponentType =
  | "projects"
  | "timeline"
  | "skills"
  | "reviews"
  | "contact"
  | null;

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
  image?: string;
  featured?: boolean;
}

export interface TimelineItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  type: "work" | "education";
}

export interface Skill {
  name: string;
  category: string;
  level: number; // 1-5
}

export interface Review {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  whatsapp: string;
  calendly: string;
  avatar: string;
}

export interface ChatRequest {
  messages: { role: string; content: string }[];
  sessionId?: string;
}

export interface RAGChunk {
  id: string;
  text: string;
  metadata: Record<string, string>;
  score?: number;
}
