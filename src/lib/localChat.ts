/**
 * localChat.ts — keyword-based fallback when OpenAI is not configured.
 * Sources all facts from the canonical data files in src/data/.
 */

import profile from "@/data/profile.json";
import projectsData from "@/data/projects.json";
import timelineData from "@/data/timeline.json";
import skillsData from "@/data/skills.json";
import servicesData from "@/data/services.json";

type Message = { role: string; content: string };

function match(text: string, ...keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

function formatProjects(): string {
  return projectsData
    .filter((p) => p.featured)
    .map((p) => `**${p.title}** — ${p.client} (${p.period})\n${p.summary}\nStack: ${p.tags.join(", ")}`)
    .join("\n\n");
}

function formatTimeline(): string {
  return timelineData
    .map((t) => `**${t.role}** at **${t.company}** _(${t.period})_\n${t.summary}`)
    .join("\n\n");
}

function formatSkills(): string {
  const cats = [...new Set(skillsData.map((s) => s.category))];
  return cats
    .map((cat) => {
      const items = skillsData
        .filter((s) => s.category === cat)
        .sort((a, b) => b.level - a.level)
        .map((s) => s.name);
      return `**${cat}:** ${items.join(", ")}`;
    })
    .join("\n");
}

function formatCoreServices(): string {
  return servicesData.core
    .map((s) => `**${s.title}** (${servicesData.rateCore})\n${s.description}`)
    .join("\n\n");
}

function respond(query: string, history: Message[]): string {
  const q = query.toLowerCase();

  if (match(q, "hello", "hi", "hey", "sup", "yo", "good morning", "good evening", "howdy")) {
    return `Hey! I'm Nigel's AI assistant. Ask me anything about his background, projects, skills, services, or how to get in touch. What's on your mind?`;
  }

  if (match(q, "name", "full name", "called", "who are you")) {
    return `Full name is **Amos Nigel Funguriro** — most people call me Nigel. I'm a ${profile.tagline} based in ${profile.location}.`;
  }

  if (match(q, "age", "old", "born", "birthday", "birth date", "dob")) {
    return `I was born on **February 20, 1989**. Experience is a feature, not a bug.`;
  }

  if (match(q, "married", "wife", "family", "daughter", "kids", "children", "personal life")) {
    return `On the personal side — yes, I'm married and have a daughter. Family keeps me grounded. Outside of work I enjoy traveling, photography, and exploring new places.`;
  }

  if (match(q, "passion", "interest", "hobby", "enjoy", "fun", "free time", "outside work")) {
    return `Outside of code? Travel, photography, and just exploring — whether that's a new city or a new idea. I also attend DC-area AI and tech events regularly, which keeps me wired in to what's actually happening in the field.`;
  }

  if (match(q, "ai avatar", "emotion", "multimodal", "current project", "working on")) {
    const avatar = projectsData.find((p) => p.id === "avatar");
    if (avatar) {
      return `Right now I'm deep in the **${avatar.title}** project at CUA.\n\n${avatar.summary}\n\nStack: ${avatar.tags.join(", ")}`;
    }
  }

  if (match(q, "award", "achievement", "recognition", "healthathon", "concordia", "competition")) {
    return `I've competed in the **CIMAS Healthathon 2021** — an AI innovation challenge in the health space — and **Cardinal Concordia 2025** at CUA. Both pushed me to apply AI thinking under real constraints.\n\nI also maintain a 100% referral growth record — over 100 clients, most of whom found me through someone I'd already built for.`;
  }

  if (match(q, "project", "built", "portfolio", "show me", "what have you", "case study")) {
    return `Here are some of the projects I'm most proud of:\n\n${formatProjects()}\n\nWant me to go deeper on any of these?`;
  }

  if (match(q, "experience", "career", "work history", "job", "worked at", "employment", "timeline", "background")) {
    return `Here's my career so far:\n\n${formatTimeline()}`;
  }

  if (match(q, "education", "degree", "university", "studied", "school", "cua", "catholic", "qualification")) {
    return `I'm currently a **graduate student in Data Analytics at The Catholic University of America** in Washington DC (2023 — Present), focusing on AI, computer vision, and real-time ML systems.\n\nBefore that I built my engineering foundation through 8 years of hands-on professional work — starting with freelance web development in Zimbabwe in 2016.`;
  }

  if (match(q, "skill", "tech", "stack", "language", "framework", "tool", "know how", "expertise", "proficient")) {
    return `Here's a breakdown of my technical skills:\n\n${formatSkills()}\n\nStrongest areas are AI/ML systems, full-stack engineering, and cloud infrastructure.`;
  }

  if (match(q, "service", "offer", "what do you do", "help with", "provide", "what can you")) {
    return `Here's what I offer:\n\n${formatCoreServices()}\n\n**Additional services** (${servicesData.rateAdditional}): Social Media Management, Artist Management, Tech Support for Social Platforms.\n\nEvery engagement includes clean code, regular updates, production deployment, and full IP ownership.`;
  }

  if (match(q, "rate", "price", "cost", "charge", "per hour", "fee", "pricing", "how much")) {
    return `My base rate is **${servicesData.rateCore}** for core engineering and AI work — full-stack development, AI systems, computer vision, data analytics.\n\n**${servicesData.rateAdditional}** for additional services like social media management, artist management, and platform tech support.\n\nHappy to discuss project scope and estimates — reach me on WhatsApp or via Calendly.`;
  }

  if (match(q, "contact", "reach", "email", "whatsapp", "message", "hire", "available", "book", "meet", "schedule")) {
    return `Best ways to reach me:\n\n- **WhatsApp:** [+1 (227) 249-2922](https://wa.me/${profile.contact.whatsapp})\n- **Calendly:** [Book a call](${profile.contact.calendly})\n- **Email:** ${profile.contact.email}\n\nI respond quickly — usually within a few hours during DC business hours.`;
  }

  if (match(q, "where", "location", "based", "country", "city", "live", "from", "address")) {
    return `Based in **${profile.location}** — 620 Michigan Ave., N.E., Washington, DC 20064. I work with clients globally; location has never been a barrier.`;
  }

  if (match(q, "client", "corporate", "company", "who have you", "worked with", "customer")) {
    return `I've worked with notable organisations including Softrite Private Limited, FBC Bank Limited, the Government of Zimbabwe (Ministry of Defence and other agencies), African Sun Hotels, Mahindra Zimbabwe, Royal Harare Golf Club, Quest Financial Services, Nzira Travel, Rotary Zimbabwe, The Catholic University of America, and 9+ Zimbabwean content creators.\n\nOver 100 clients served, spanning fintech, government, hospitality, banking, automotive, non-profit, and AI research.`;
  }

  if (match(q, "influencer", "creator", "comic elder", "gamu", "frets", "artist", "social media manager")) {
    return `I manage 9+ Zimbabwean content creators: Comic Elder, Gamu, Frets Donzvo, Mbuya Va Piyasoni, Stunt Master Flex, Rutendo, Sarah Takawira, Stimy Stimela, and Tunga.\n\nServices include platform management, monetisation strategy, account security, audience growth, and brand partnerships across Facebook, YouTube, Instagram, and TikTok.`;
  }

  if (match(q, "linkedin", "github", "instagram", "social", "online profile", "find you")) {
    return `- **LinkedIn:** [linkedin.com/in/amonigel](${profile.social.linkedin})\n- **GitHub:** [github.com/${profile.social.github}](https://github.com/${profile.social.github})\n- **Instagram:** [instagram.com/nigel_amo](https://www.instagram.com/nigel_amo)`;
  }

  if (match(q, "philosophy", "believe", "approach", "values", "quote")) {
    return `I believe God gave me the talent to do my work in a way that leaves a lasting feel — so that people will always remember my name when they want to work on similar projects.\n\nI've been at the intersection of software engineering and client success for 8+ years. I value **customer experience over customer service** — service is transactional, experience is transformational.`;
  }

  // Generic fallback
  const topics = ["projects", "career experience", "technical skills", "services and rates", "how to reach me"];
  const rand = topics[Math.floor(Math.random() * topics.length)];
  const lastAssistant = [...history].reverse().find((m) => m.role === "assistant");

  if (lastAssistant) {
    return `I can tell you more about my **${rand}** if that's useful — or just ask something specific.`;
  }

  return `Good question. I can speak to my **${rand}**, or anything else about my background and work. What's most useful for you?`;
}

export function localChatResponse(messages: Message[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const query = lastUser?.content || "";
  const history = messages.slice(0, -1);
  return respond(query, history);
}
