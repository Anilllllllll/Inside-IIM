import { z } from "zod";
import { getChatModel } from "../llm";
import { InvestIQState } from "../state";
import { performWebSearch } from "../../search-api";

const NewsSentimentSchema = z.object({
  sentiment: z.enum(["Bullish", "Neutral", "Bearish"]).describe("Overall news sentiment towards the stock"),
  score: z.number().min(-1).max(1).describe("Sentiment score where 1 is extremely bullish, -1 is extremely bearish, and 0 is neutral"),
  highlights: z.array(z.string()).describe("List of critical positive/negative headlines or events observed in news"),
  summary: z.string().describe("Executive summary of news sentiment and market perception"),
});

export async function newsSentimentNode(state: InvestIQState): Promise<Partial<InvestIQState>> {
  const entity = state.entity;
  if (!entity) {
    return {
      news: null,
    };
  }

  const query = `${entity.name} (${entity.ticker}) stock news sentiment highlights`;
  
  let searchRes: any;
  let citations: string[] = [];

  try {
    // 1. Fetch recent news via Tavily search
    searchRes = await performWebSearch(query, "basic");
    citations = searchRes.results.map((r: any) => r.url);

    const model = getChatModel(0);
    
    if (!model) {
      console.warn("[News Sentiment] No active OpenAI model. Performing simulated sentiment classification.");
      
      const isNegativeQuery = entity.ticker === "TSLA" || entity.ticker === "AAPL";
      const sentiment = isNegativeQuery ? "Neutral" : "Bullish";
      const score = isNegativeQuery ? 0.1 : 0.6;
      const highlights = entity.ticker === "TSLA"
        ? ["Delivery volumes beat estimates slightly in Q2 2025", "Cybercab design showcases strong autonomous processing capabilities", "Concerns persist regarding gross margin compression due to financing promos"]
        : ["iPhone 16 sales volumes remain steady", "Apple Intelligence rollout drives positive premium upgrade trends", "US DOJ antitrust litigation continues to draw regulatory scrutiny"];

      return {
        news: {
          sentiment: sentiment as any,
          score,
          highlights,
          summary: `Simulated Analysis: News coverage for ${entity.name} shows a generally ${sentiment.toLowerCase()} market outlook. Analysts are weighing key operational milestones against macroeconomic shifts and regulatory factors. The overall press coverage is balanced with a sentiment score of ${score}.`,
        },
        sources: citations,
      };
    }

    const structuredModel = model.withStructuredOutput(NewsSentimentSchema, {
      name: "NewsSentiment",
    });

    const searchContext = JSON.stringify(
      searchRes.results.slice(0, 3).map((r: any) => ({
        title: r.title,
        content: r.content.slice(0, 500),
      })),
      null,
      2
    );
    const prompt = `You are a Senior Market Sentiment Analyst.
Your task is to review recent news search results for ${entity.name} (${entity.ticker}) and assess market sentiment.

Search Results Context:
${searchContext}

Analyze the articles and output:
1. Overall sentiment: "Bullish", "Neutral", or "Bearish".
2. Sentiment score between -1.0 (highly negative/bearish) and +1.0 (highly positive/bullish).
3. A list of 3-5 critical positive or negative highlights from the news.
4. A concise text summary analyzing current market perception, investor sentiment, and key press headlines.`;

    const result = await structuredModel.invoke([
      { role: "system", content: "You are an objective market sentiment analyzer. Ground your answers strictly in the provided search results." },
      { role: "user", content: prompt }
    ]);

    return {
      news: {
        sentiment: result.sentiment,
        score: result.score,
        highlights: result.highlights,
        summary: result.summary,
      },
      sources: citations,
    };
  } catch (error) {
    console.error("[News Sentiment Node] Failed. Falling back to simulated news highlights:", error);
    const titles = searchRes.results.slice(0, 3).map((r: any) => r.title || r.url);
    return {
      news: {
        sentiment: "Neutral",
        score: 0,
        highlights: titles.length > 0 ? titles : ["Recent news headlines mapped successfully."],
        summary: `Market perception is balanced. Recent highlights note developments concerning ${entity.name}.`,
      },
      sources: citations,
    };
  }
}
