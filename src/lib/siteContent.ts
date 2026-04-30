/**
 * siteContent.ts
 *
 * Single source of truth for all RAG-indexable content on the portfolio.
 * Every field on this site that a visitor might ask about must appear here.
 * Add new content → re-run /api/ingest → Pinecone updates automatically.
 *
 * Each chunk is self-contained (readable in isolation), labelled with a
 * category, and sized for good embedding quality (~150-350 words).
 */

import profileData from "@/data/profile.json";
import projectsData from "@/data/projects.json";
import timelineData from "@/data/timeline.json";
import skillsData from "@/data/skills.json";
import servicesData from "@/data/services.json";

export interface ContentChunk {
  id: string;
  category: string;
  text: string;
  metadata: Record<string, string>;
}

// ─── Personal & Contact ────────────────────────────────────────────

function profileChunks(): ContentChunk[] {
  const p = profileData;
  return [
    {
      id: "profile-bio",
      category: "Profile",
      text: `ABOUT NIGEL
Full name: Amos Nigel Funguriro, commonly known as Nigel or Amos.
Role: ${p.tagline}
Bio: ${p.bio}
Location: ${p.location} — specifically at 620 Michigan Ave., N.E., Washington, DC 20064.
Website: amonigel.com`,
      metadata: { topic: "profile", subtopic: "bio" },
    },
    {
      id: "profile-personal",
      category: "Personal",
      text: `PERSONAL DETAILS — NIGEL FUNGURIRO
Date of birth: February 20, 1989.
Nigel is married and has a daughter.
Outside of work he enjoys traveling, photography, and exploring new places.
He is active in AI and technology networking, regularly attending local DC-area events.
He is a person of faith and believes his talent is God-given — to build things that leave a lasting impression.
Personal philosophy: "I believe God gave me the talent to do my work in a way that leaves a lasting feel — so that people will always remember my name when they want to work on similar projects. I value customer experience over customer service."`,
      metadata: { topic: "personal", subtopic: "life" },
    },
    {
      id: "profile-contact",
      category: "Contact",
      text: `HOW TO CONTACT NIGEL
Email: ${p.contact.email}
WhatsApp: +${p.contact.whatsapp} (preferred for quick conversations)
Calendly (book a call): ${p.contact.calendly}
LinkedIn: ${p.social.linkedin}
GitHub: github.com/${p.social.github}
Instagram: instagram.com/nigel_amo
Address: 620 Michigan Ave., N.E., Washington, DC 20064
Response time: typically within a few hours during DC business hours.
Available for remote work globally and on-site in the DC/Maryland/Virginia area.`,
      metadata: { topic: "contact" },
    },
    {
      id: "profile-achievements",
      category: "Achievements",
      text: `ACHIEVEMENTS & RECOGNITION — NIGEL FUNGURIRO
Nigel has been recognised in AI innovation competitions:
- CIMAS Healthathon 2021: AI innovation challenge in the health space, pushing AI thinking under real constraints.
- Cardinal Concordia 2025: Competition at The Catholic University of America.
He maintains a 100% referral-based growth record — over 100 clients, the majority found through word-of-mouth referrals from past clients.
Stats: 8+ years of software development, 100+ clients served, 50+ projects delivered, 5 years in enterprise SaaS, 0 abandoned projects.`,
      metadata: { topic: "achievements" },
    },
  ];
}

// ─── Education ─────────────────────────────────────────────────────

function educationChunks(): ContentChunk[] {
  return [
    {
      id: "education-cua",
      category: "Education",
      text: `EDUCATION — NIGEL FUNGURIRO
Nigel is currently a graduate student in Data Analytics at The Catholic University of America (CUA), Washington, DC (2023 — Present).
His focus is on artificial intelligence, computer vision, and real-time machine learning systems.
He is an AI researcher at CUA, working at the intersection of computer vision, LLMs, and multimodal AI systems.
Prior to CUA, he built his engineering foundation through years of hands-on professional work starting in 2016, complementing formal academic study with real-world engineering experience across Zimbabwe.`,
      metadata: { topic: "education" },
    },
  ];
}

// ─── Career Timeline ───────────────────────────────────────────────

function timelineChunks(): ContentChunk[] {
  return (timelineData as typeof timelineData).map((entry) => ({
    id: `timeline-${entry.id}`,
    category: "Experience",
    text: `CAREER: ${entry.role.toUpperCase()}
Company / Org: ${entry.company}
Period: ${entry.period}
Location: ${entry.location}
Type: ${entry.type}

${entry.summary}

${entry.detail}

Key achievement: ${entry.highlight}
Skills used: ${entry.tags.join(", ")}`,
    metadata: {
      topic: "experience",
      company: entry.company,
      period: entry.period,
      role: entry.role,
    },
  }));
}

// ─── Projects ──────────────────────────────────────────────────────

function projectChunks(): ContentChunk[] {
  return (projectsData as typeof projectsData).map((project) => {
    const lines = [
      `PROJECT: ${project.title.toUpperCase()}`,
      `Client: ${project.client}`,
      `Period: ${project.period}`,
      `Category: ${project.category}`,
      project.status ? `Status: ${project.status}` : "",
      "",
      project.summary,
    ];

    if ("detail" in project && project.detail) {
      lines.push("", project.detail);
    }
    if ("impact" in project && project.impact) {
      lines.push("", `Impact: ${project.impact}`);
    }

    lines.push("", `Technology stack: ${project.tags.join(", ")}`);

    return {
      id: `project-${project.id}`,
      category: "Projects",
      text: lines.filter(Boolean).join("\n"),
      metadata: {
        topic: "project",
        project: project.title,
        client: project.client,
        period: project.period,
        featured: String(project.featured ?? false),
      },
    };
  });
}

// ─── Services ──────────────────────────────────────────────────────

function serviceChunks(): ContentChunk[] {
  const s = servicesData;
  const chunks: ContentChunk[] = [];

  s.core.forEach((svc, i) => {
    chunks.push({
      id: `service-core-${i}`,
      category: "Services",
      text: `SERVICE: ${svc.title.toUpperCase()}
Tagline: ${svc.tagline}
Rate: ${s.rateCore}

${svc.description}

${svc.detail}

Tech stack: ${svc.stack.join(", ")}`,
      metadata: { topic: "service", serviceType: "core", title: svc.title },
    });
  });

  const additionalList = s.additional.map((a) => `- ${a.title}: ${a.description}`).join("\n");
  chunks.push({
    id: "service-additional",
    category: "Services",
    text: `ADDITIONAL SERVICES (Rate: ${s.rateAdditional})
${additionalList}`,
    metadata: { topic: "service", serviceType: "additional" },
  });

  const guaranteeList = s.guarantees.map((g) => `- ${g}`).join("\n");
  const processList = s.process.map((p) => `${p.step}. ${p.title}: ${p.description}`).join("\n");
  chunks.push({
    id: "service-process",
    category: "Services",
    text: `ENGAGEMENT PROCESS & GUARANTEES
Working process:
${processList}

Every engagement includes:
${guaranteeList}`,
    metadata: { topic: "service", serviceType: "process" },
  });

  return chunks;
}

// ─── Skills ────────────────────────────────────────────────────────

function skillChunks(): ContentChunk[] {
  const byCategory = (skillsData as typeof skillsData).reduce<Record<string, typeof skillsData>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const lines = Object.entries(byCategory).map(([cat, skills]) => {
    const sorted = [...skills].sort((a, b) => b.level - a.level);
    return `${cat}: ${sorted.map((s) => `${s.name} (${s.level}/5)`).join(", ")}`;
  });

  return [
    {
      id: "skills-overview",
      category: "Skills",
      text: `TECHNICAL SKILLS — NIGEL FUNGURIRO
${lines.join("\n")}

Summary: Strongest areas are AI/ML systems (LLMs, RAG, Computer Vision), full-stack engineering (Next.js, React, Node.js, TypeScript), and cloud/DevOps (AWS, Docker). Active in cutting-edge AI research at CUA.`,
      metadata: { topic: "skills" },
    },
  ];
}

// ─── AI Capabilities ───────────────────────────────────────────────

function aiCapabilitiesChunk(): ContentChunk {
  return {
    id: "ai-capabilities",
    category: "AI Expertise",
    text: `AI CAPABILITIES & EXPERTISE — NIGEL FUNGURIRO
Large Language Models (LLMs): GPT-4, Claude, Gemini — prompt engineering, fine-tuning, and production deployment of LLM-powered features.
RAG & Vector Search: Retrieval-Augmented Generation pipelines with Pinecone, pgvector, and semantic embeddings for intelligent, grounded responses.
Computer Vision: Real-time object detection, image classification, and video analysis using YOLO, PyTorch, and OpenCV at inference speed.
AI Agents & Automation: Agentic systems with tool use, multi-step reasoning, and autonomous execution built on LangChain and LangGraph.
MLOps & Deployment: End-to-end ML pipelines, model versioning, monitoring, and scalable cloud deployment on AWS and GCP.
Generative AI Integration: Embedding generative capabilities — text, image, code — into production products via APIs and custom fine-tuned models.

Active technologies: Large Language Models (LLMs), Retrieval-Augmented Generation, AI Agents, Computer Vision, Multimodal AI, Transformer Architecture, Vector Embeddings, Real-time Inference, Fine-Tuning, Prompt Engineering, MLOps, Agentic Workflows, Semantic Search, Generative AI, Edge AI, LangChain / LangGraph, PyTorch, OpenAI API.`,
    metadata: { topic: "ai", subtopic: "capabilities" },
  };
}

// ─── Differentiators & Philosophy ─────────────────────────────────

function differentiatorChunk(): ContentChunk {
  return {
    id: "differentiators",
    category: "Why Nigel",
    text: `WHY CLIENTS CHOOSE NIGEL FUNGURIRO
Reference-First Reputation: Over 100 clients — the majority found through someone he had already impressed. Work speaks for itself long after delivery.
Customer Experience, Not Just Service: A deliberate distinction — service is transactional, experience is transformational. Every client interaction is designed to leave a lasting impression.
Full Stack AI Engineer: Bridges the gap between research-grade AI and production-ready engineering. Not just prototyping — architecting, building, and shipping systems that work in the real world.
Multi-Industry Depth: From government payroll to hospitality to influencer tech — cross-domain pattern recognition that pure specialists often miss.

Philosophy (direct quote from Nigel): "I believe God gave me the talent to do my work in a way that leaves a lasting feel — so that people will always remember my name when they want to work on similar projects. I have been at the intersection of software engineering and client success. I value customer experience over customer service."`,
    metadata: { topic: "differentiators" },
  };
}

// ─── Clients & Corporate Partners ─────────────────────────────────

function clientsChunk(): ContentChunk {
  return {
    id: "clients",
    category: "Clients",
    text: `CLIENTS & CORPORATE PARTNERS — NIGEL FUNGURIRO
Nigel has worked with notable organisations across Zimbabwe and the United States, including:
- Softrite Private Limited (enterprise payroll systems)
- FBC Bank Limited (biometric attendance POC, digital consulting)
- Government of Zimbabwe — Ministry of Defence (classified defence systems)
- Government of Zimbabwe (digital infrastructure)
- African Sun Hotels (digital platform and web development)
- Mahindra Zimbabwe (web platform)
- Royal Harare Golf Club (website design and development)
- Quest Financial Services (digital consulting and web platform)
- Nzira Travel (web platform)
- Rotary Zimbabwe (web platform)
- The Catholic University of America (AI research)
- 9+ Zimbabwean content creators including Comic Elder, Gamu, Frets Donzvo, Mbuya Va Piyasoni, Stunt Master Flex, Rutendo, Sarah Takawira, Stimy Stimela, and Tunga (social media and influencer management)
Total clients served: 100+. Work spans fintech, government, hospitality, automotive, non-profit, sports, banking, creator economy, and AI research.`,
    metadata: { topic: "clients" },
  };
}

// ─── Influencer Management ─────────────────────────────────────────

function influencerChunk(): ContentChunk {
  return {
    id: "influencer-management",
    category: "Influencer Management",
    text: `INFLUENCER & ARTIST MANAGEMENT — NIGEL FUNGURIRO
Nigel manages 9+ prominent Zimbabwean content creators and social media influencers:
- Comic Elder (Facebook, Instagram, YouTube)
- Gamu (social media influencer)
- Frets Donzvo (content creator)
- Mbuya Va Piyasoni (content creator)
- Stunt Master Flex (content creator)
- Rutendo (content creator)
- Sarah Takawira (content creator)
- Stimy Stimela (content creator)
- Tunga (content creator)
Services provided: platform management, monetisation strategy, account security, audience growth systems, brand partnerships, content scheduling, and analytics. Platforms managed: Facebook, YouTube, Instagram, TikTok.
Artist management services include digital presence setup, release planning, playlist pitching, booking support, and online brand development for musicians and performers.`,
    metadata: { topic: "influencers" },
  };
}

// ─── Summary / Overview ────────────────────────────────────────────

function summaryChunk(): ContentChunk {
  return {
    id: "summary",
    category: "Overview",
    text: `OVERVIEW — AMOS NIGEL FUNGURIRO (NIGEL)
Nigel is a Full Stack Engineer and AI Researcher based in Washington, DC. He is a graduate student in Data Analytics at The Catholic University of America, specialising in artificial intelligence, computer vision, and real-time machine learning systems.
Career span: 8+ years (2016 — Present), starting as a freelance web developer in Zimbabwe, progressing through enterprise SaaS engineering (Softrite payroll systems), independent digital consulting, and now AI research at CUA.
Key strengths: AI/ML systems, RAG pipelines, computer vision, full-stack web and mobile development, enterprise software engineering, and digital strategy.
Current focus: Graduate AI research (Emotion-Aware Multimodal AI Avatar at CUA) and consulting on AI-powered products.
Rate: $80/hr for core engineering and AI work; $50/hr for additional services (social media, artist management, tech support).
Available for: AI product development, full-stack engineering, data analytics, computer vision, AI agents, automation pipelines, app development, and digital consulting.`,
    metadata: { topic: "overview" },
  };
}

// ─── Main export ───────────────────────────────────────────────────

export function getAllContentChunks(): ContentChunk[] {
  return [
    summaryChunk(),
    ...profileChunks(),
    ...educationChunks(),
    ...timelineChunks(),
    ...projectChunks(),
    ...serviceChunks(),
    ...skillChunks(),
    aiCapabilitiesChunk(),
    differentiatorChunk(),
    clientsChunk(),
    influencerChunk(),
  ];
}
