import { z } from "zod";
import { getChatModel } from "../llm";
import { InvestIQState } from "../state";

const ThesisSchema = z.object({
  thesis: z.string().describe("The core investment thesis statement, explaining why this company is a buy/sell"),
  supportingFacts: z.array(z.string()).describe("A list of 3-5 grounded facts and metrics supporting this case"),
});

export async function bullAgentNode(state: InvestIQState): Promise<Partial<InvestIQState>> {
  const entity = state.entity;
  if (!entity || !state.financial) {
    return { bullCase: null };
  }

  const model = getChatModel(0);
  
  if (!model) {
    console.warn("[Bull Agent] No active OpenAI model. Performing simulated Bull case compilation.");
    return {
      bullCase: {
        thesis: `Simulated Long Case: ${entity.name} represents a high-conviction growth story supported by strong sector tailwinds, technological leadership, and solid underlying profitability margins.`,
        supportingFacts: [
          `P/E ratio of ${state.financial.metrics.peRatio} reflects solid growth pricing.`,
          `Fortress liquidity position with a current ratio of ${state.financial.metrics.currentRatio.toFixed(2)}.`,
          `Competitive advantage backed by a ${state.competition?.moatRating || "Strong"} economic moat.`,
        ],
      },
    };
  }

  try {
    const structuredModel = model.withStructuredOutput(ThesisSchema, {
      name: "BullAgent",
    });

    const context = JSON.stringify({
      entity,
      financial: state.financial,
      news: state.news,
      competition: state.competition,
      risk: state.risk,
    }, null, 2);

    const prompt = `You are a highly optimistic Growth and Value Investment Analyst.
Your goal is to build the strongest possible BULL investment case for ${entity.name} (${entity.ticker}).

Here is the accumulated research from our specialist analysts:
${context}

Construct a compelling, fact-based Bull case. You must focus on:
1. Growth drivers, revenue expansion, and high operating margins.
2. Market leadership, competitive advantages, and moat sustainability.
3. Positive catalysts from the news and valuation discounts.
Do not hallucinate or make up metrics. Rely ONLY on the provided research context.`;

    const result = await structuredModel.invoke([
      { role: "system", content: "You are a professional long-only equity researcher. Ground your thesis in the facts." },
      { role: "user", content: prompt }
    ]);

    return {
      bullCase: {
        thesis: result.thesis,
        supportingFacts: result.supportingFacts,
      },
    };
  } catch (error) {
    console.error("[Bull Agent Node] Failed. Falling back to simulated Bull Case:", error);
    return {
      bullCase: {
        thesis: `Simulated Long Case: ${entity.name} represents a stable sector play supported by standard tailwinds, competitive positioning, and solid underlying profitability margins.`,
        supportingFacts: [
          `P/E ratio of ${state.financial.metrics.peRatio} reflects baseline industry valuations.`,
          `Fortress liquidity position with a current ratio of ${state.financial.metrics.currentRatio.toFixed(2)}.`,
          `Competitive advantage backed by an active product line and ${state.competition?.moatRating || "Average"} economic moat.`,
        ],
      },
    };
  }
}

export async function bearAgentNode(state: InvestIQState): Promise<Partial<InvestIQState>> {
  const entity = state.entity;
  if (!entity || !state.financial) {
    return { bearCase: null };
  }

  const model = getChatModel(0);
  
  if (!model) {
    console.warn("[Bear Agent] No active OpenAI model. Performing simulated Bear case compilation.");
    return {
      bearCase: {
        thesis: `Simulated Short Case: ${entity.name} faces structural growth constraints, valuation premiums, and significant regulatory hurdles that threaten future profit margins.`,
        supportingFacts: [
          `Valuation remains stretched at a P/E multiple of ${state.financial.metrics.peRatio}.`,
          `Risk profile is elevated with an overall rating of ${state.risk?.overallRiskLevel || "High"}.`,
          `Threat of margin erosion due to intense competition from competitors like ${state.competition?.competitors.join(", ") || "market rivals"}.`,
        ],
      },
    };
  }

  try {
    const structuredModel = model.withStructuredOutput(ThesisSchema, {
      name: "BearAgent",
    });

    const context = JSON.stringify({
      entity,
      financial: state.financial,
      news: state.news,
      competition: state.competition,
      risk: state.risk,
    }, null, 2);

    const prompt = `You are a highly skeptical Short-Seller and Risk Arbitrage Investment Analyst.
Your goal is to build the strongest possible BEAR (downside) investment case against ${entity.name} (${entity.ticker}).

Here is the accumulated research from our specialist analysts:
${context}

Construct a compelling, fact-based Bear case. You must focus on:
1. High debt leverage, declining operating margins, or poor liquidity.
2. Market share loss, competitive disruption, or weak barriers to entry.
3. Litigation threat, regulatory crackdowns, macro headwinds, and valuation overstretch (high PE multiples).
Do not make up figures. Rely ONLY on the negative indicators present in the research context.`;

    const result = await structuredModel.invoke([
      { role: "system", content: "You are a professional short-selling equity researcher. Ground your thesis in the facts." },
      { role: "user", content: prompt }
    ]);

    return {
      bearCase: {
        thesis: result.thesis,
        supportingFacts: result.supportingFacts,
      },
    };
  } catch (error) {
    console.error("[Bear Agent Node] Failed. Falling back to simulated Bear Case:", error);
    return {
      bearCase: {
        thesis: `Simulated Short Case: ${entity.name} faces structural growth constraints, valuation premiums, and significant regulatory hurdles that threaten future profit margins.`,
        supportingFacts: [
          `Valuation remains stretched at a P/E multiple of ${state.financial.metrics.peRatio}.`,
          `Risk profile is elevated with an overall rating of ${state.risk?.overallRiskLevel || "Medium"}.`,
          `Threat of margin erosion due to intense competition from competitors like ${state.competition?.competitors.join(", ") || "market rivals"}.`,
        ],
      },
    };
  }
}
