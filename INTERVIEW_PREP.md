# InvestIQ: Senior AI Engineer Interview Prep Guide

This document contains 20 core technical questions, system architecture stress-tests, and design answers to help you explain this project in interviews.

---

### Q1: Why did you choose LangGraph instead of a simple sequential LLM prompt pipeline?
**Answer**:
A simple sequential chain is rigid, stateless, and struggles with complex workflows. Investment research is non-linear: we must execute domain research (financials, sentiment, moat, risk) in parallel to optimize latency, run adversarial debates, and implement self-critique loops. LangGraph models the system as a stateful StateGraph. It allows parallel execution (fan-out/fan-in), checkpointing, and conditional routing loops (CRO critiques), which are impossible in simple sequential chains.

---

### Q2: Walk me through the complete data flow when a user submits a company query.
**Answer**:
1. User submits name (e.g. "Tesla") via UI.
2. Next.js API router `/api/research` triggers the `researchGraph`.
3. **Entity Resolver Node** uses structured output (Zod schema) to resolve name to ticker ("TSLA", "NASDAQ").
4. Graph fans out to run four specialists in parallel: Fundamentals (ratios), News (Tavily search), Competitors (moats), Risks (litigations).
5. State merges at the **Bull Agent** and **Bear Agent** nodes, which compile long and short cases.
6. The **Debate Agent** moderates the cases, stress-testing assertions against financials.
7. The **Investment Committee Agent** issues the recommendation (INVEST/WATCH/PASS), confidence, and markdown memo.
8. The **Critique Node (CRO)** validates logic. If rejected (and loop count is 0), it routes back to Committee. If approved, it routes to **DB Saver Node**.
9. Database writes record via Prisma, and the API returns the ID to the UI.

---

### Q3: How do you prevent the LLM from executing incorrect financial calculations?
**Answer**:
Large language models are text engines, not calculator engines; they frequently hallucinate arithmetic values (like operating margins or debt ratios). To prevent this, we decoupled calculation from qualitative analysis. In our `financial-api.ts` module, we fetch raw statement columns (total assets, liabilities, revenues) and calculate ratios programmatically in TypeScript. The LLM only receives verified tables and pre-computed ratios, restricting its role to qualitative scoring and reasoning.

---

### Q4: Explain the self-critique loop. How do you prevent it from running infinitely?
**Answer**:
The Critique Node acts as the Chief Risk Officer. It audits the committee's decision against the risk factors and metrics (e.g. rejecting an "INVEST" choice if overall risk is high). If it rejects the report, it writes feedback to the state and routes execution back. To prevent infinite loops, we initialized a `critiqueCount` counter in our state. If the graph loops back, the counter increments to 1. On the second run, the Critique Node checks this counter, automatically bypasses the audit, and forces database saving, ensuring a bounded execution cost.

---

### Q5: What is the benefit of splitting Bull and Bear arguments into separate agents?
**Answer**:
If you ask a single LLM to outline both the upside and downside of a stock, it triggers a "neutrality bias" where the model compromises and writes lukewarm, balanced summaries that ignore tail risks. By splitting the analysis into separate Bull and Bear agents with distinct prompts, we force each model to assume an extreme role (long analyst vs. short-seller). This adversarial friction yields deeper risk coverage and sharper insights.

---

### Q6: Why did you use Zod schemas inside your agent nodes?
**Answer**:
Asking an LLM to output raw JSON strings via system prompt instructions is brittle; minor punctuation issues cause JSON parser failures. We used LangChain's `.withStructuredOutput` bound to strict Zod schemas. This forces the underlying OpenAI API to utilize tool-calling structures, guaranteeing JSON schemas are validated at the API level. If validation fails, Zod throws a catchable exception, allowing our catch-blocks to handle it gracefully.

---

### Q7: How does your system handle API key failures or rate limits?
**Answer**:
In production, external APIs (like Alpha Vantage free tier) are prone to rate limits. To maintain 99.9% application uptime, we implemented a Fallback Pattern. Inside our API wrappers, we catch rate-limit payloads (like Alpha Vantage `Note` fields) and network errors. The system logs the failure and falls back to a high-fidelity mock data dictionary (supporting AAPL, TSLA, NVDA, MSFT) that matches the TypeScript interfaces, ensuring the agent graph completes execution successfully.

---

### Q8: What database schema did you choose and why?
**Answer**:
We chose PostgreSQL managed via Prisma. We defined two tables: `User` and `ResearchReport` with a 1-to-many relationship. The key design decision was storing the detailed agent outputs (ratios, news bullet points, competitors lists, node traces) inside a single PostgreSQL `Json` (JSONB) column. This relational-document hybrid schema keeps user accounts transaction-safe while allowing agent log structures to evolve without constant database migrations.

---

### Q9: Why did you implement the Prisma client as a global singleton?
**Answer**:
In Next.js development mode, file changes trigger hot-reloads which clear the module cache and re-run modules. If we instantiate `new PrismaClient()` globally on page requests, each hot-reload creates a new connection pool. Within a few file edits, the local database exhausts its connection limit, throwing "too many client connections" errors. Storing the client on Node's `globalThis` object ensures the instance is reused across hot-reloads.

---

### Q10: How would you scale this system to support thousands of parallel user queries?
**Answer**:
Running 10-node LangGraph cycles synchronously inside Next.js serverless functions (like Vercel) fails at scale due to execution timeouts (15s limit) and API blocking. To scale:
1. Move the LangGraph engine into background workers (using Celery or BullMQ) hosted on container networks (AWS ECS or GCP Cloud Run).
2. The Next.js API route immediately returns a `task_id` and writes a pending record to DB.
3. The background worker consumes the task, queries the APIs, runs the graph, and updates the database row.
4. The client UI polls a status route or listens to WebSockets to track live checkmarks.

---

### Q11: Why did you choose CSS Media Print stylesheets for PDF export?
**Answer**:
Programmatic PDF builders (like jsPDF) require manual page-offset coordinates, which are brittle and double the JS bundle. Screen screenshot tools (like html2canvas) output low-resolution image PDFs where text is not selectable. By using CSS Media Print (`@media print`) rules, we leverage the browser's native layout engine. We hide navigation buttons, force page breaks before the memo, and flatten dark-mode colors. This yields sharp vector text PDFs with zero package weight.

---

### Q12: Explain the difference between state annotations and reducers in LangGraph.js.
**Answer**:
* **Annotations**: Define the TypeScript interfaces and validation schemas for state variables.
* **Reducers**: Functions that determine how state updates are merged. The default reducer replaces the old state value. We wrote a custom reducer for the `sources` citation array to append new links and run a `Set` deduplication, ensuring unique citations.

---

### Q13: What model tier strategy did you apply to optimize token costs?
**Answer**:
We applied Tiered LLM Inference. Structured research nodes (like resolving tickers, classifying news sentiments, or listing risks) are narrow tasks. We run these on smaller, fast models (`gpt-4o-mini`). The Investment Committee, however, must synthesize multiple opposing summaries and write a cohesive markdown report. We run this single node on a larger model (`gpt-4o`). This balances token budgets while maintaining reasoning power.

---

### Q14: How does the Debate Agent stress-test the Bull and Bear cases?
**Answer**:
The Debate Agent is instructed to act as a neutral investment committee moderator. It reads the qualitative thesis statements of the Bull and Bear agents and compares them directly to the pre-computed financial ratios. If the Bull agent claims "rapid undervalued growth" but the P/E ratio is 95, the Debate Agent highlights this mismatch, helping the downstream Investment Committee make a balanced choice.

---

### Q15: What is the benefit of caching search results?
**Answer**:
Search APIs (like Tavily) charge per query and add substantial latency. In our search wrapper, we enabled Next.js fetch caching (`next: { revalidate: 3600 }`). If multiple users research the same stock or if an agent runs retry loops, subsequent search queries hit the local cache, cutting latency from seconds to milliseconds and reducing API bills.

---

### Q16: How do you secure database credentials and API keys in Next.js?
**Answer**:
We store sensitive keys in a local `.env` file, which is added to `.gitignore` to prevent leakage to public git hosts. In Next.js, keys without the `NEXT_PUBLIC_` prefix are compiled strictly server-side. Since our LangGraph code and Prisma clients execute exclusively in server components and Route Handlers, these keys are never sent to the client browser.

---

### Q17: What index optimizations did you implement in Prisma?
**Answer**:
We added composite indexes on the `ResearchReport` model:
`@@index([userId])` and `@@index([ticker])`
Indexing `userId` speeds up the dashboard fetch for listing a user's past research history. Indexing `ticker` speeds up lookup queries when a user submits a company that has already been analyzed, allowing rapid retrieval.

---

### Q18: What is a ReAct agent loop, and how does it compare to LangGraph?
**Answer**:
A ReAct (Reasoning and Acting) loop lets the LLM decide step-by-step in a loop which tools to call. While highly dynamic, it is unpredictable, prone to infinite loops, and slow. LangGraph represents workflows as structured state machines. It allows us to enforce a deterministic path (e.g. always resolve ticker first, run research in parallel, run debate next) while letting the LLM handle the reasoning within each node, ensuring reliability.

---

### Q19: How did you implement user password encryption?
**Answer**:
We use `bcrypt` to hash user passwords before writing them to the database:
`const hashedPassword = await bcrypt.hash(password, 10);`
When a user logs in, we compare the entered password with the stored hash using `bcrypt.compare`. We never store plain-text passwords in our PostgreSQL database.

---

### Q20: If you had to add a RAG pipeline to the Risk Analyst, how would you design it?
**Answer**:
Instead of doing general web searches, the Risk Analyst would query an internal vector database (like pgvector). We would ingest SEC 10-K PDFs, split them into chunks, generate embeddings using OpenAI's embedding model, and store them. When researching, the Risk Analyst would convert the ticker query to an embedding, perform a similarity search to fetch the most relevant risk chunks, and feed them into the prompt.
