# InvestIQ: Stateful Multi-Agent AI Investment Research Platform

InvestIQ is a production-level, multi-agent AI investment research terminal that automates fundamental and qualitative analysis of public companies. Built using **Next.js 15, LangGraph.js, Prisma ORM, and PostgreSQL**, it replicates the rigorous workflow of a professional investment committee.

## System Architecture

```
                       [ USER / BROWSER ]
                              │
                              ▼
                      [ Next.js 15 UI ]
                              │
                              ▼
                     [ API Route Handler ]
                              │
                              ▼
                 [ LangGraph StateGraph Controller ]
                              │
                              ▼
                    [ Entity Resolution Node ]
                              │
                              ▼
                    [ Parallel Specialists ]
         ┌────────────────────┬────────────────────┐
         ▼                    ▼                    ▼
[ Financial Analyst ]  [ News Sentiment ]  [ Competitive/Moat ]
         │                    │                    │
         └────────────────────┼────────────────────┘
                              ▼
                    [ Adversarial Analysis ]
                        ┌───────────┐
                        ▼           ▼
                   [ Bull Agent ] [ Bear Agent ]
                        │           │
                        └─────┬─────┘
                              ▼
                        [ Debate Agent ]
                              │
                              ▼
                 [ Investment Committee Agent ]
                              │
                              ▼
                     [ Self-Critique CRO ] ◄── (Loop back once if rejected)
                              │
                              ▼
                     [ Database Save Node ]
                              │
                              ▼
                         [ END / UI ]
```

---

## Tech Stack
* **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide icons.
* **AI Core**: LangChain.js, LangGraph.js (StateGraph & Annotations).
* **Database & ORM**: PostgreSQL, Prisma ORM.
* **Data Sources**: Alpha Vantage (Financials), Tavily Search (Google News and regulatory logs).
* **Security & Auth**: NextAuth.js, bcrypt hashes.

---

## Key Design Decisions & Guardrails
1. **Deterministic Calculations**: Standard LLMs fail at basic math. Our `Financial Analyst` fetches reports and computes balance sheet ratios (e.g. current ratio, margins, debt-to-equity) deterministically in TypeScript *before* presenting them to the LLM.
2. **Adversarial Debating**: Asking a single LLM to list pros/cons yields moderate, lukewarm summaries. By splitting the Bull and Bear cases into parallel isolated prompts, we force extreme, deep arguments. The Debate moderator then stress-tests these claims against raw financials.
3. **CRO Audit Loop**: A Self-Critique Agent acts as the Chief Risk Officer, rejecting logical gaps or overconfident scores. It can loop back to the committee once, with a hard counter limit to prevent infinite runaways in production.
4. **Resilient Offline Simulation Fallbacks**: If external API keys are rate-limited or missing, the system gracefully falls back to structured simulations for AAPL, TSLA, NVDA, and MSFT.

---

## Getting Started

### 1. Prerequisites
* Node.js v18.0+
* PostgreSQL instance running locally or hosted (Supabase/Neon).

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
# PostgreSQL DB URL
DATABASE_URL="postgresql://username:password@localhost:5432/investiq?schema=public"

# NextAuth Secret
NEXTAUTH_SECRET="use_a_minimum_32_characters_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# AI & Search API Keys
OPENAI_API_KEY="your_openai_key"
ALPHA_VANTAGE_API_KEY="your_alpha_vantage_key"
TAVILY_API_KEY="your_tavily_search_key"
```

### 3. Install & Generate Client
```bash
npm install
npx prisma generate
```

### 4. Setup Database
```bash
npx prisma migrate dev --name init
```

### 5. Running the Application
To run the web UI:
```bash
npm run dev
```

To run a standalone CLI graph verification test:
```bash
npx tsx src/lib/graph/test-run.ts
```

---

## Future Improvements
* **Vector DB RAG integration**: Ingest SEC 10-K PDFs directly into pgvector to perform deep search on litigations rather than generic searches.
* **WebSocket Streams**: Stream agent states using Server-Sent Events to update the visual workflow in real-time.
