export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  component?: ComponentType;
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
  client: string;
  period: string;
  category: string;
  summary: string;
  detail?: string;
  impact?: string;
  tags: string[];
  status?: string;
  featured?: boolean;
  github?: string;
  live?: string;
}

export interface TimelineItem {
  id: string;
  year: string;
  period: string;
  role: string;
  company: string;
  location: string;
  type: "work" | "education";
  tags: string[];
  summary: string;
  detail: string;
  highlight: string;
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
  avatar: string;
  contact: {
    email: string;
    whatsapp: string;
    calendly: string;
  };
  social: {
    linkedin: string;
    github: string;
  };
}

