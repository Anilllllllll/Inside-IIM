import { z } from "zod";
import { getChatModel } from "../llm";
import { InvestIQState } from "../state";

const EntityResolverSchema = z.object({
  ticker: z.string().describe("Standard stock symbol, e.g. TSLA, AAPL, NVDA"),
  name: z.string().describe("Official corporate name, e.g. Tesla, Inc., Apple Inc."),
  exchange: z.string().describe("The primary listing exchange, e.g. NASDAQ, NYSE, LSE"),
});

export async function entityResolverNode(state: InvestIQState): Promise<Partial<InvestIQState>> {
  const query = state.company;

  if (!query) {
    return {
      entity: null,
    };
  }

  // Pre-configured mappings for quick resolution and offline/simulated mode fallback
  const mockEntityMapping: Record<string, { ticker: string; name: string; exchange: string }> = {
    tesla: { ticker: "TSLA", name: "Tesla, Inc.", exchange: "NASDAQ" },
    tsla: { ticker: "TSLA", name: "Tesla, Inc.", exchange: "NASDAQ" },
    apple: { ticker: "AAPL", name: "Apple Inc.", exchange: "NASDAQ" },
    aapl: { ticker: "AAPL", name: "Apple Inc.", exchange: "NASDAQ" },
    nvidia: { ticker: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ" },
    nvda: { ticker: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ" },
    microsoft: { ticker: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ" },
    msft: { ticker: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ" },
  };

  const cleanQuery = query.toLowerCase().trim();
  const matchedMock = mockEntityMapping[cleanQuery];

  const model = getChatModel(0);
  
  if (!model) {
    console.warn("[Entity Resolver] No active OpenAI model. Resolving via offline database mapping.");
    if (matchedMock) {
      return { entity: matchedMock };
    }
    // Generic fallback if not matched
    const ticker = query.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5) || "UNKNOWN";
    return {
      entity: {
        ticker,
        name: `${query} Corporation`,
        exchange: "NASDAQ",
      },
    };
  }

  try {
    const structuredModel = model.withStructuredOutput(EntityResolverSchema, {
      name: "EntityResolver",
    });

    const prompt = `You are an expert equity research matching assistant.
Your goal is to parse the user's search query representing a company and resolve it into its primary stock ticker, official corporate name, and listing exchange.

User query: "${query}"

Return the correct stock details. If the query refers to a private company or is unrecognized, make your best logical guess of what the ticker would be if listed, or use the query string itself to represent the ticker.`;

    const result = await structuredModel.invoke([
      { role: "system", content: "You are a precise corporate entities parser." },
      { role: "user", content: prompt }
    ]);

    return {
      entity: {
        ticker: result.ticker.toUpperCase(),
        name: result.name,
        exchange: result.exchange.toUpperCase(),
      },
    };
  } catch (error) {
    console.error("[Entity Resolver] LLM resolution failed, falling back:", error);
    if (matchedMock) {
      return { entity: matchedMock };
    }
    const ticker = query.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5) || "UNKNOWN";
    return {
      entity: {
        ticker,
        name: `${query} Corporation`,
        exchange: "NASDAQ",
      },
    };
  }
}
