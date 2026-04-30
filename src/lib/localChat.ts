import profile from "@/data/profile.json";
import projects from "@/data/projects.json";
import timeline from "@/data/timeline.json";
import skills from "@/data/skills.json";
import { getRelevantChunks } from "@/lib/knowledgeBase";

type Message = { role: string; content: string };

function match(text: string, ...keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

function formatProjects(): string {
  const featured = projects.filter((p) => p.featured);
  return featured
    .map((p) => `**${p.title}**\n${p.description}\n*Stack: ${p.tags.join(", ")}*`)
    .join("\n\n");
}

function formatSkills(): string {
  const cats = [...new Set(skills.map((s) => s.category))];
  return cats
    .map((cat) => {
      const items = skills
        .filter((s) => s.category === cat)
        .sort((a, b) => b.level - a.level)
        .map((s) => s.name);
      return `**${cat}:** ${items.join(", ")}`;
    })
    .join("\n");
}

function respond(query: string, history: Message[]): string {
  const q = query.toLowerCase();

  const isGreeting = match(q, "hello", "hi", "hey", "sup", "yo", "good morning", "good evening", "howdy");
  const aboutMe = match(q, "who are you", "about you", "tell me about", "yourself", "introduce", "describe yourself");
  const askProjects = match(q, "project", "built", "portfolio", "show me", "what have you");
  const askExperience = match(q, "experience", "career", "work history", "job", "worked at", "employment", "timeline", "background");
  const askSkills = match(q, "skill", "tech", "stack", "language", "framework", "tool", "know how", "expertise", "capable", "proficient");
  const askContact = match(q, "contact", "reach", "email", "whatsapp", "message", "hire", "available", "book", "meet", "schedule");
  const askLocation = match(q, "where", "location", "based", "country", "city", "live", "from");
  const askEducation = match(q, "education", "degree", "university", "studied", "school", "qualification", "cua", "catholic");
  const askPassion = match(q, "passion", "interest", "hobby", "love", "enjoy", "like to", "outside", "fun", "free time");
  const askFamily = match(q, "married", "wife", "husband", "family", "daughter", "kids", "children", "personal life");
  const askAge = match(q, "age", "old", "born", "birthday", "birth", "dob", "how old");
  const askLinkedIn = match(q, "linkedin", "social", "online profile");
  const askName = match(q, "name", "full name", "called");
  const askAI = match(q, "ai avatar", "ai assistant", "emotion", "multimodal", "cua project", "current project", "what are you working on");
  const askResearch = match(q, "research", "publication", "healthathon", "concordia", "competition");
  const askRate = match(q, "rate", "price", "cost", "charge", "per hour", "fee", "pricing", "how much");

  if (isGreeting) {
    return `Hey! I'm Nigel's AI assistant. Ask me anything about his background, projects, skills, or how to get in touch. What's on your mind?`;
  }

  if (askName) {
    return `Full name is **Amos Nigel Funguriro** — though I go by Nigel most of the time. I'm a ${profile.tagline} based in ${profile.location}.`;
  }

  if (askAge) {
    return `I was born on February 20, 1989. Do the math and you'll know — I'm not shy about it. Life experience tends to make better engineers anyway.`;
  }

  if (askFamily) {
    return `On the personal side — yes, I'm married and have a daughter. Family keeps me grounded. Outside of work you'll usually find me traveling, out with a camera, or exploring somewhere new.`;
  }

  if (askPassion) {
    return `Outside of code? I love travel, photography, and just exploring — whether that's a new city or a new idea. I also spend a lot of time at DC-area AI and tech events, which keeps me wired in to what's actually happening in the field rather than just what's trending on Twitter.`;
  }

  if (askAI) {
    return `Right now I'm deep in an **Emotion-Aware Multimodal AI Avatar** project at CUA — it's a real-time system that reads facial expressions, voice tone, and body language to adapt its responses emotionally. Built with Python, MediaPipe, and a multimodal LLM stack. It's the most technically challenging thing I've built, and honestly one of the most exciting.`;
  }

  if (askResearch) {
    return `I've competed in the **CIMAS Healthathon 2021** — an AI innovation challenge in the health space — and more recently **Cardinal Concordia 2025** at CUA. Both pushed me to apply AI thinking under real constraints. Research-wise, I focus on computer vision and real-time ML systems.`;
  }

  if (aboutMe) {
    return `${profile.bio}\n\nI'm based in **${profile.location}**, working as a **${profile.tagline}**. I specialise in AI, computer vision, and full-stack engineering — building systems that work in real-time and at scale.\n\nAsk me about my projects, experience, or anything specific — I'll give you a straight answer.`;
  }

  if (askProjects) {
    return `Here are some of the projects I'm most proud of:\n\n${formatProjects()}\n\nWant me to go deeper on any of these?`;
  }

  if (askEducation) {
    const edu = timeline.filter((t) => t.type === "education");
    if (!edu.length) {
      return `I'm currently a graduate student in **Data Analytics at The Catholic University of America** in Washington DC. My engineering foundation is built on years of hands-on work rather than just academic theory — I've been doing this professionally since 2016.`;
    }
    return edu
      .map((e) => `**${e.title}** — ${e.company} _(${e.period})_\n${e.description}`)
      .join("\n\n");
  }

  if (askExperience) {
    const work = timeline.filter((t) => t.type === "work");
    if (!work.length) {
      return `I've been building software professionally since 2016 — starting with freelance full-stack work, then moving into enterprise SaaS at Softrite, AI consulting, and now research at CUA. Eight years across multiple industries.`;
    }
    return `Here's a look at my career so far:\n\n${work.map((t) => `**${t.title}** at **${t.company}** _(${t.period})_\n${t.description}`).join("\n\n")}`;
  }

  if (askSkills) {
    return `Here's a breakdown of my technical skills:\n\n${formatSkills()}\n\nMy strongest areas are AI/ML systems, computer vision, and full-stack engineering.`;
  }

  if (askRate) {
    return `My base rate is **$80/hr** for core engineering and AI work — computer vision, RAG systems, full-stack development. Smaller tasks and content creation start from $50/hr. Happy to talk through scope if you have something in mind.`;
  }

  if (askContact) {
    return `Best ways to reach me:\n\n- **WhatsApp:** [+1 (227) 249-2922](https://wa.me/${profile.contact.whatsapp})\n- **Calendly:** [Book a call](${profile.contact.calendly})\n- **Email:** ${profile.contact.email}\n\nI respond quickly — usually within a few hours during DC business hours.`;
  }

  if (askLocation) {
    return `I'm based in **${profile.location}** — currently at 620 Michigan Ave., N.E. I work with clients globally though. Location has never been a barrier.`;
  }

  if (askLinkedIn) {
    return `You can find me at [linkedin.com/in/amonigel](${profile.social.linkedin}). I share AI and engineering insights there when I'm not building things.`;
  }

  // Try KB-based fallback for anything the pattern matching didn't catch
  const kbContext = getRelevantChunks(query, 2);
  if (kbContext) {
    return `Based on what I know: ${kbContext.replace(/\*/g, "")}\n\nFeel free to ask anything more specific — about my work, background, or how to reach me.`;
  }

  // Generic fallback
  const topics = ["projects", "experience", "skills", "education", "how to reach me"];
  const rand = topics[Math.floor(Math.random() * topics.length)];
  const lastAssistant = [...history].reverse().find((m) => m.role === "assistant");

  if (lastAssistant) {
    return `I can dig into my **${rand}** if that's useful, or just ask me something specific — I'm pretty open.`;
  }

  return `Good question. I can speak to my **${rand}**, or anything else about my background and work. What's most useful for you?`;
}

export function localChatResponse(messages: Message[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const query = lastUser?.content || "";
  const history = messages.slice(0, -1);
  return respond(query, history);
}
