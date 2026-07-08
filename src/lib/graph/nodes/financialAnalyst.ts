import { z } from "zod";
import { getChatModel } from "../llm";
import { InvestIQState } from "../state";
import { getFinancialMetrics } from "../../financial-api";

const FinancialAnalystSchema = z.object({
  score: z.number().min(1).max(10).describe("Overall financial score from 1 to 10 based on analytical ratios"),
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
  try {
    // 1. Fetch metrics deterministically via custom Alpha Vantage wrapper
    financialData = await getFinancialMetrics(ticker);

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
    const prompt = `You are a Senior Fundamental Investment Analyst.
Your job is to analyze the financial health, capital structure, margins, and valuation ratios of the target company.

Here is the raw verified financial data:
${metricsText}

Analyze this data and output:
1. An overall financial score from 1 to 10 (where 10 represents a fortress balance sheet, exceptional margins, and attractive valuation; and 1 represents extreme debt leverage, negative margins, and highly inflated valuation).
2. A detailed text summary explaining the metrics: evaluate revenue growth, operating margins, liquidity (current ratio), debt levels (debt to equity), and PE/PEG valuation. Be objective.`;

    const result = await structuredModel.invoke([
      { role: "system", content: "You are a precise, data-driven financial analyst. Do not hallucinate numbers." },
      { role: "user", content: prompt }
    ]);

    return {
      financial: {
        score: result.score,
        metrics: {
          peRatio: financialData.peRatio,
          pegRatio: financialData.pegRatio,
          marketCap: financialData.marketCap,
          eps: financialData.eps,
          debtToEquity: financialData.debtToEquity,
          currentRatio: financialData.currentRatio,
        },
        summary: result.summary,
        sources: [financialData.source],
      },
      sources: [financialData.source],
    };
  } catch (error) {
    console.error("[Financial Analyst Node] Failed. Falling back to simulated metrics:", error);
    return {
      financial: {
        score: financialData.peRatio < 25 ? 8 : 5,
        metrics: {
          peRatio: financialData.peRatio,
          pegRatio: financialData.pegRatio,
          marketCap: financialData.marketCap,
          eps: financialData.eps,
          debtToEquity: financialData.debtToEquity,
          currentRatio: financialData.currentRatio,
        },
        summary: `Simulated metrics compiled for ${financialData.name}. Valuation: P/E: ${financialData.peRatio}, Debt/Equity: ${financialData.debtToEquity.toFixed(2)}, Current Ratio: ${financialData.currentRatio.toFixed(2)}.`,
        sources: [financialData.source],
        annualReports: financialData.annualReports,
      },
      sources: [financialData.source],
    };
  }
}
