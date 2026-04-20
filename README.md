# amonigel.com — AI-Powered Portfolio

An interactive, AI-first portfolio built with Next.js. Visitors chat with an AI assistant that answers questions about Nigel's background, projects, and experience — with real-time streaming responses and dynamic visual components rendered inline inside the chat.

**Live:** [amonigel.com](https://amonigel.com)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| AI | OpenAI GPT-4o-mini + text-embedding-3-small |
| Vector DB | Pinecone v7 |
| Reviews | Google Places API |
| Deployment | Vercel |

---

## Features

- **Streaming AI chat** — Server-Sent Events, word-by-word streaming, local keyword fallback when OpenAI is unavailable
- **RAG pipeline** — Documents embedded into Pinecone; relevant chunks retrieved per query for grounded answers
- **Dynamic chat widgets** — Projects, timeline, and skills render as visual components inline in the chat
- **Neural background** — Multi-layer canvas animation: hex grid, synapse signals, pulsing neurons, atmospheric orbs
- **Google Reviews** — Live fetch from Google Places API with infinite scroll marquee
- **GitHub activity** — Pulls latest public repos via GitHub API
- **Dark / light mode** — System preference detection, persisted to localStorage
- **Floating CTA** — WhatsApp + Calendly contact shortcuts

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/         # Streaming chat endpoint (OpenAI + local fallback)
│   │   ├── github/       # GitHub repos endpoint
│   │   ├── ingest/       # RAG ingestion endpoint
│   │   └── reviews/      # Google Places reviews endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── background/       # NeuralBackground canvas animation
│   ├── chat/             # ChatInterface, ChatMessage, TypingIndicator
│   │   └── widgets/      # ProjectCards, Timeline, SkillsGraph (rendered in chat)
│   ├── sections/         # Hero, ReviewsSlider, GitHubSection, Footer
│   └── ui/               # Navbar, ThemeToggle, FloatingCTA, ScrollToTop
├── data/                 # JSON content: profile, projects, timeline, skills, reviews
├── lib/
│   ├── config.ts         # Centralised environment variable access
│   ├── localChat.ts      # Keyword-based fallback chat (no API key required)
│   ├── openai.ts         # OpenAI client + embedding helpers
│   ├── pinecone.ts       # Pinecone client + vector upsert/query
│   ├── rag.ts            # RAG context builder + OpenAI streaming
│   └── utils.ts          # cn(), generateId(), detectComponent(), chunkText()
└── types/
    └── index.ts          # Shared TypeScript interfaces
```

---

## Setup

### 1. Install dependencies

```bash
cd portfolio
npm install
```

### 2. Configure environment variables

Create `.env.local` in the `portfolio/` directory:

```env
# Required for AI chat
OPENAI_API_KEY=sk-...

# Required for vector search (optional — falls back to keyword matching)
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=portfolio-knowledge

# Required for live Google Reviews
GOOGLE_PLACES_API_KEY=...
GOOGLE_PLACE_ID=...

# Public — used client-side
NEXT_PUBLIC_GITHUB_USERNAME=your-github-username
NEXT_PUBLIC_WHATSAPP_NUMBER=1234567890
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-link

# Protects the /api/ingest endpoint
ADMIN_SECRET=your-secret
```

### 3. Personalise content

Edit the files in `src/data/`:

| File | Purpose |
|---|---|
| `profile.json` | Name, bio, location, contact, social links |
| `projects.json` | Portfolio projects shown in chat and cards |
| `timeline.json` | Work and education history |
| `skills.json` | Technical skills with proficiency levels |
| `reviews.json` | Fallback reviews (used when Google API is unavailable) |

### 4. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## RAG Ingestion

After adding documents to `public/data/` (`.txt`, `.md`, or `.json`), embed them into Pinecone:

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Authorization: Bearer your-secret"
```

This chunks all documents, generates embeddings via OpenAI, and upserts them into Pinecone. Run once after any content changes.

---

## Deployment

The project is optimised for **Vercel**. Connect the GitHub repo, add all environment variables in the Vercel dashboard, then point your domain's DNS to Vercel. Every `git push` to `main` triggers an automatic redeploy.

---

## Commit Convention

```
feat:     new feature
fix:      bug fix
refactor: code change with no behaviour change
style:    formatting / CSS tweaks
docs:     documentation only
chore:    dependencies, config, tooling
```
