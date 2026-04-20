import profile from "@/data/profile.json";
import projects from "@/data/projects.json";
import timeline from "@/data/timeline.json";
import skills from "@/data/skills.json";

type Message = { role: string; content: string };

function match(text: string, ...keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

function formatProjects(): string {
  const featured = projects.filter((p) => p.featured);
  const list = featured.map((p) =>
    `**${p.title}**\n${p.description}\n*Stack: ${p.tags.join(", ")}*`
  );
  return list.join("\n\n");
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
  const isGreeting = match(q, "hello", "hi", "hey", "sup", "yo", "good morning", "good evening");
  const aboutMe = match(q, "who are you", "about you", "tell me about", "yourself", "introduce");
  const askProjects = match(q, "project", "built", "portfolio", "work i've", "show me", "what have you");
  const askExperience = match(q, "experience", "career", "work history", "job", "worked at", "employment", "timeline", "background");
  const askSkills = match(q, "skill", "tech", "stack", "language", "framework", "tool", "know how", "expertise", "capable");
  const askContact = match(q, "contact", "reach", "email", "whatsapp", "message", "hire", "available", "book", "meet", "schedule");
  const askLocation = match(q, "where", "location", "based", "country", "city", "live");
  const askEducation = match(q, "education", "degree", "university", "studied", "school", "qualification");
  const askPassion = match(q, "passion", "interest", "hobby", "love", "enjoy", "like to", "outside", "fun");
  const askLinkedIn = match(q, "linkedin", "social", "profile", "online");
  const askName = match(q, "name", "full name", "called");

  if (isGreeting) {
    return `Hey there! I'm Nigel's AI assistant. I can tell you all about his projects, experience, skills, and more — just ask. What would you like to know?`;
  }

  if (askName) {
    return `My full name is **${profile.name}** — though most people just call me Nigel. I'm a ${profile.tagline} based in ${profile.location}.`;
  }

  if (aboutMe) {
    return `${profile.bio}\n\nI'm based in **${profile.location}**, working as a **${profile.tagline}**. I've built everything from AI-powered SaaS products to complex microservices architectures.\n\nAsk me about my projects, experience, or skills — or just fire away with anything specific.`;
  }

  if (askProjects) {
    return `Here are some of the projects I'm most proud of:\n\n${formatProjects()}\n\nWant me to go deeper on any of these?`;
  }

  if (askEducation) {
    const edu = timeline.filter((t) => t.type === "education");
    if (!edu.length) return `I have a strong foundation in Computer Science, combined with years of hands-on engineering experience. Want to hear more about my career path?`;
    return `Here's my educational background:\n\n${edu.map((e) => `**${e.title}** — ${e.company} _(${e.period})_\n${e.description}`).join("\n\n")}`;
  }

  if (askExperience) {
    const work = timeline.filter((t) => t.type === "work");
    return `Here's a look at my career so far:\n\n${work.map((t) => `**${t.title}** at **${t.company}** _(${t.period})_\n${t.description}`).join("\n\n")}`;
  }

  if (askSkills) {
    return `Here's a breakdown of my technical skills:\n\n${formatSkills()}\n\nMy strongest areas are full-stack development, AI/ML integration, and cloud infrastructure.`;
  }

  if (askContact) {
    return `The best ways to reach me:\n\n- **WhatsApp:** [Send a message](https://wa.me/${profile.contact.whatsapp})\n- **Calendly:** [Book a call](${profile.contact.calendly})\n- **Email:** ${profile.contact.email}\n\nI'm always open to interesting conversations — feel free to reach out.`;
  }

  if (askLocation) {
    return `I'm based in **${profile.location}**. I work with clients and teams globally — location has never been a barrier.`;
  }

  if (askLinkedIn) {
    return `You can find me on LinkedIn at [linkedin.com/in/amonigel](${profile.social.linkedin}). I share insights on AI, engineering, and software development there.`;
  }

  if (askPassion) {
    return `Outside of work, I'm genuinely obsessed with the intersection of AI and human experience — how intelligent systems can augment what we do rather than replace it. I spend a lot of time experimenting with new models and frameworks.\n\nI also enjoy the design side of things — there's something deeply satisfying about building something that works *and* looks exceptional.`;
  }

  // Generic fallback — acknowledge and offer directions
  const topics = ["projects", "experience", "skills", "education", "contact details"];
  const rand = topics[Math.floor(Math.random() * topics.length)];

  // Try to pull something relevant from history context
  const lastAssistant = [...history].reverse().find((m) => m.role === "assistant");
  const hasContext = lastAssistant && lastAssistant.content.length > 0;

  if (hasContext) {
    return `That's an interesting angle. I can tell you more about my **${rand}** if you'd like, or feel free to ask anything specific — experience, stack, projects, how to reach me.`;
  }

  return `Good question. I can speak to my **${rand}**, or really anything else about my background and work. What aspect would be most useful for you?`;
}

export function localChatResponse(
  messages: Message[]
): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const query = lastUser?.content || "";
  const history = messages.slice(0, -1);
  return respond(query, history);
}
