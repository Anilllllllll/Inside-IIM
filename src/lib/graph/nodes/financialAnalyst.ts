import { z } from "zod";
import { getChatModel } from "../llm";
import { InvestIQState } from "../state";
import { getFinancialMetrics } from "../../financial-api";
import { performWebSearch } from "../../search-api";

const FinancialAnalystSchema = z.object({
  score: z.number().min(1).max(10).describe("Overall financial score from 1 to 10 based on analytical ratios"),
  peRatio: z.number().describe("The Price-to-Earnings (P/E) ratio extracted from the data/search, or 0 if negative/not found"),
  pegRatio: z.number().describe("The PEG ratio, or 0 if not found"),
  debtToEquity: z.number().describe("The debt-to-equity ratio (e.g. 0.45), or 0 if not found"),
  currentRatio: z.number().describe("The current ratio (liquidity), or 1.5 if not found"),
  summary: z.string().describe("Detailed financial analysis summary covering growth, leverage, liquidity, margins, and valuation ratios"),
});

export async function financialAnalystNode(state: InvestIQState): Promise<Partial<InvestIQState>> {
  const ticker = state.entity?.ticker;
  if (!ticker) {
    return {
      financial: null,
    };
  }

  let financialData: any;
  let searchRes: any = null;
  let searchCitations: string[] = [];

  try {
    // 1. Fetch metrics deterministically via custom Alpha Vantage wrapper
    financialData = await getFinancialMetrics(ticker);
    const entityName = state.entity?.name || ticker;

    // 2. If Alpha Vantage key is rate-limited/offline, run a live Tavily search to fetch real statistics
    if (financialData.source === "Simulated Financial Feed (API Offline)") {
      console.log(`[Financial Analyst] Alpha Vantage offline. Fetching live statistics for ${ticker} via Tavily...`);
      const query = `${entityName} (${ticker}) stock key statistics PE ratio PEG ratio debt to equity current ratio`;
      searchRes = await performWebSearch(query, "basic");
      if (searchRes && searchRes.results) {
        searchCitations = searchRes.results.map((r: any) => r.url);
      }
    }

    const model = getChatModel(0);
    
    if (!model) {
      console.warn("[Financial Analyst] No active OpenAI model. Performing simulated fundamental reasoning.");
      
      const estimatedScore = financialData.debtToEquity > 1.5 ? 5 : financialData.peRatio > 40 ? 7 : 8;
      
      return {
        financial: {
          score: estimatedScore,
          metrics: {
            peRatio: financialData.peRatio,
            pegRatio: financialData.pegRatio,
            marketCap: financialData.marketCap,
            eps: financialData.eps,
            debtToEquity: financialData.debtToEquity,
            currentRatio: financialData.currentRatio,
          },
          summary: `Simulated Analysis: ${financialData.name} (${financialData.ticker}) listed on ${financialData.exchange} displays a valuation trading at a P/E of ${financialData.peRatio} and a PEG ratio of ${financialData.pegRatio}. Capital structure displays a debt-to-equity ratio of ${financialData.debtToEquity.toFixed(2)}, which indicates a ${financialData.debtToEquity > 1 ? "moderate-to-high leverage model" : "conservative balance sheet leverage"}. Liquidity is stable with a current ratio of ${financialData.currentRatio.toFixed(2)}. Profit margins across historical reports show solid operational efficiency with gross profits supported by stable sector demand.`,
          sources: [financialData.source],
        },
        sources: [financialData.source],
      };
    }

    const structuredModel = model.withStructuredOutput(FinancialAnalystSchema, {
      name: "FinancialAnalyst",
    });

    const metricsText = JSON.stringify(financialData, null, 2);
    const searchContext = searchRes 
      ? `\nWeb Search Live Statistics Context:\n${JSON.stringify(
          searchRes.results.slice(0, 3).map((r: any) => ({
            title: r.title,
            content: r.content.slice(0, 500),
          })),
          null,
          2
        )}`
      : "";

    const prompt = `You are a Senior Fundamental Investment Analyst.
Your job is to analyze the financial health, capital structure, margins, and valuation ratios of the target company.

Here is the raw financial data:
${metricsText}
${searchContext}

Analyze this data and extract:
1. The actual Price-to-Earnings (P/E) ratio.
2. The actual PEG ratio.
3. The actual debt-to-equity ratio (e.g. 0.35).
4. The actual current ratio (e.g. 1.8).

CRITICAL: If the raw financial data contains fallback metrics (P/E 22.4, PEG 1.2, Debt/Equity 0.50, Current Ratio 1.50) AND you have live Web Search statistics available, you MUST extract the actual real-world metrics from the Web Search results and return them in your response. Do not use the fallback metrics if real-world metrics are present in the search context!`;

    const result = await structuredModel.invoke([
      { role: "system", content: "You are a precise, data-driven financial analyst. Extract correct real-world metrics from the search text." },
      { role: "user", content: prompt }
    ]);

    return {
      financial: {
        score: result.score,
        metrics: {
          peRatio: result.peRatio || financialData.peRatio,
          pegRatio: result.pegRatio || financialData.pegRatio,
          marketCap: financialData.marketCap,
          eps: financialData.eps,
          debtToEquity: result.debtToEquity !== undefined ? result.debtToEquity : financialData.debtToEquity,
          currentRatio: result.currentRatio !== undefined ? result.currentRatio : financialData.currentRatio,
        },
        summary: result.summary,
        sources: Array.from(new Set([financialData.source, ...searchCitations])),
      },
      sources: searchCitations,
    };
  } catch (error) {
    console.error("[Financial Analyst Node] Failed. Falling back to simulated metrics:", error);
    return {
      financial: {
        score: financialData?.peRatio < 25 ? 8 : 5,
        metrics: {
          peRatio: financialData?.peRatio || 22.4,
          pegRatio: financialData?.pegRatio || 1.2,
          marketCap: financialData?.marketCap || 25000000000,
          eps: financialData?.eps || 2.15,
          debtToEquity: financialData?.debtToEquity || 0.5,
          currentRatio: financialData?.currentRatio || 1.5,
        },
        summary: `Simulated metrics compiled for ${financialData?.name || ticker}. Valuation: P/E: ${financialData?.peRatio || 22.4}, Debt/Equity: ${financialData?.debtToEquity?.toFixed(2) || '0.50'}, Current Ratio: ${financialData?.currentRatio?.toFixed(2) || '1.50'}.`,
        sources: [financialData?.source || "Fallback System"],
      },
      sources: [financialData?.source || "Fallback System"],
    };
  }
}
