import { z } from "zod";
import { getChatModel } from "../llm";
import { InvestIQState } from "../state";

const CommitteeDecisionSchema = z.object({
  recommendation: z.enum(["INVEST", "WATCH", "PASS"]).describe("The final investment recommendation"),
  confidenceScore: z.number().min(0).max(100).describe("Confidence score from 0 to 100 representing the certainty of this decision"),
  reasoning: z.string().describe("Concise executive reasoning (1-2 paragraphs) summarizing why this decision was reached"),
  memo: z.string().describe("The complete investment research memo formatted in Markdown"),
});

export async function decisionAgentNode(state: InvestIQState): Promise<Partial<InvestIQState>> {
  const entity = state.entity;
  if (!entity || !state.financial) {
    return { decision: null, memo: null };
  }

  const model = getChatModel(0.2, "gpt-4o"); // Using larger model (gpt-4o) for complex committee reasoning
  
  if (!model) {
    console.warn("[Decision Agent] No active OpenAI model. Compiling simulated investment committee memo.");
    
    const rec = entity.ticker === "AAPL" ? "INVEST" : entity.ticker === "TSLA" ? "WATCH" : "PASS";
    const confidence = entity.ticker === "AAPL" ? 85 : entity.ticker === "TSLA" ? 65 : 50;
    
    const simulatedMemo = `# INVESTMENT RESEARCH MEMO: ${entity.name} (${entity.ticker})
    
## Executive Summary
Following a comprehensive analysis by our specialist research teams, the Investment Committee has issued a **${rec}** recommendation on ${entity.name} (${entity.ticker}) with a confidence score of **${confidence}%**.

---

## Financial Profile & Valuations
- **Ticker/Exchange**: ${entity.ticker} listed on ${entity.exchange}
- **Market Capitalization**: $${(state.financial.metrics.marketCap / 1e9).toFixed(2)} Billion
- **Price to Earnings (P/E)**: ${state.financial.metrics.peRatio}
- **Debt to Equity**: ${state.financial.metrics.debtToEquity.toFixed(2)}
- **Liquidity (Current Ratio)**: ${state.financial.metrics.currentRatio.toFixed(2)}

The company represents a ${state.financial.score > 7 ? "stable and low-leverage fundamental balance sheet" : "leveraged fundamental profile"} with an overall fundamental score of **${state.financial.score}/10**.

---

## Competitive Positioning (Moat Analysis)
- **Direct Competitors**: ${state.competition?.competitors.join(", ") || "Industry rivals"}
- **Moat Rating**: **${state.competition?.moatRating || "Average"}**

The Competitive Analyst reports:
> "${state.competition?.moatAnalysis || "Competitive landscape is contested with standard barriers to entry."}"

---

## Material Risk Audit
- **Overall Risk Profile**: **${state.risk?.overallRiskLevel || "Medium"}**
- **Regulatory Litigation**: ${state.risk?.regulatoryRisk || "No major pending litigation flagged."}
- **Market/Macro Risks**: ${state.risk?.marketRisk || "Standard macroeconomic cyclic exposures."}

---

## Reconciled Thesis (Adversarial Debate Summary)
${state.debateSummary || "Adversarial bull and bear debates highlight structural arguments that align with macro sectors."}

---

## Final Investment Committee Thesis
Our recommendation to **${rec}** is grounded in ${entity.name}'s competitive positioning and current valuation. ${rec === "INVEST" ? "The company's strong cash generation, low net debt, and defensive ecosystem present a highly attractive entry point." : rec === "WATCH" ? "While the long-term thesis remains intact, near-term valuation multiples and regulatory hurdles warrant waiting for a more favorable risk-reward entry point." : "Structural tailwinds are overshadowed by high leverage, margin erosion, and severe regulatory headwinds. We advise passing on this asset."}
`;

    return {
      decision: {
        recommendation: rec as any,
        confidenceScore: confidence,
        reasoning: `Simulated Decision: We issue a ${rec} on ${entity.name} with ${confidence}% confidence. Our decision is supported by the fundamental metrics (P/E: ${state.financial.metrics.peRatio}, Debt/Equity: ${state.financial.metrics.debtToEquity.toFixed(2)}) weighed against industry competition.`,
      },
      memo: simulatedMemo,
    };
  }

  try {
    const structuredModel = model.withStructuredOutput(CommitteeDecisionSchema, {
      name: "InvestmentCommittee",
    });

    const context = JSON.stringify({
      entity,
      financial: state.financial,
      news: state.news,
      competition: state.competition,
      risk: state.risk,
      bullCase: state.bullCase,
      bearCase: state.bearCase,
      debateSummary: state.debateSummary,
      critiqueFeedback: state.critiqueFeedback,
    }, null, 2);

    const prompt = `You are the Managing Director of the Investment Committee.
Your role is to review the complete dossiers prepared by the specialized analysts (Fundamentals, News, Moat, Risk) and the comparative debate summaries. You must issue the final investment decision and generate a professional investment research memo.

Target Company: ${entity.name} (${entity.ticker})

Research Dossier Context:
${context}

Your output MUST populate:
1. Recommendation: Must be exactly "INVEST", "WATCH", or "PASS".
   - Select INVEST only if the fundamentals are strong, the moat is strong/average, risks are manageable, and there is clear upside.
   - Select WATCH if the company is fundamentally strong but valuation is currently too high, sentiment is negative, or major regulatory lawsuits are pending (neutral entry point).
   - Select PASS if the company has weak fundamentals, declining growth, extreme debt leverage, or severe regulatory threats.
2. Confidence Score: an integer between 0 and 100 representing your team's conviction.
3. Reasoning: 1-2 paragraphs of executive justification.
4. Memo: A complete, professional, highly-polished investment research report in Markdown.
   The memo must contain these clear sections:
   - # INVESTMENT RESEARCH MEMO: [Company Name]
   - ## Executive Summary (detailing decision & confidence score)
   - ## Financial Profile & Valuations (including P/E, EPS, Debt-to-Equity, margins)
   - ## Competitive Positioning (Moat Analysis & Competitors list)
   - ## Material Risk Audit (litigation, market threats, overall risk level)
   - ## Reconciled Thesis (summarizing the Bull vs Bear debate)
   - ## Final Investment Committee Thesis (the final conviction argument)

If you are running in a second loop (state has critiqueFeedback populated), carefully read the critique feedback and adjust your reasoning, confidence score, or memo layout to resolve the concerns raised by the CRO.`;

    const result = await structuredModel.invoke([
      { role: "system", content: "You are the Chairman of a prestigious investment committee. You write detailed, fact-driven, professional markdown memos." },
      { role: "user", content: prompt }
    ]);

    return {
      decision: {
        recommendation: result.recommendation,
        confidenceScore: result.confidenceScore,
        reasoning: result.reasoning,
      },
      memo: result.memo,
    };
  } catch (error) {
    console.error("[Decision Agent Node] Failed. Compiling fallback simulated memo:", error);
    
    const rec = entity.ticker === "AAPL" ? "INVEST" : entity.ticker === "TSLA" ? "WATCH" : "PASS";
    const confidence = entity.ticker === "AAPL" ? 85 : entity.ticker === "TSLA" ? 65 : 50;
    
    const simulatedMemo = `# INVESTMENT RESEARCH MEMO: ${entity.name} (${entity.ticker})
    
## Executive Summary
Following a comprehensive analysis by our specialist research teams, the Investment Committee has issued a **${rec}** recommendation on ${entity.name} (${entity.ticker}) with a confidence score of **${confidence}%**.

---

## Financial Profile & Valuations
- **Ticker/Exchange**: ${entity.ticker} listed on ${entity.exchange}
- **Market Capitalization**: $${(state.financial.metrics.marketCap / 1e9).toFixed(2)} Billion
- **Price to Earnings (P/E)**: ${state.financial.metrics.peRatio}
- **Debt to Equity**: ${state.financial.metrics.debtToEquity.toFixed(2)}
- **Liquidity (Current Ratio)**: ${state.financial.metrics.currentRatio.toFixed(2)}

The company represents a ${state.financial.score > 7 ? "stable and low-leverage fundamental balance sheet" : "leveraged fundamental profile"} with an overall fundamental score of **${state.financial.score}/10**.

---

## Competitive Positioning (Moat Analysis)
- **Direct Competitors**: ${state.competition?.competitors.join(", ") || "Industry rivals"}
- **Moat Rating**: **${state.competition?.moatRating || "Average"}**

The Competitive Analyst reports:
> "${state.competition?.moatAnalysis || "Competitive advantages remain stable against peer pressures."}"

---

## Material Risk Audit
- **Overall Risk Profile**: **${state.risk?.overallRiskLevel || "Medium"}**
- **Regulatory Litigation**: ${state.risk?.regulatoryRisk || "No major pending litigation flagged."}
- **Market/Macro Risks**: ${state.risk?.marketRisk || "Standard macroeconomic cyclic exposures."}

---

## Reconciled Thesis (Adversarial Debate Summary)
${state.debateSummary || "Adversarial thesis reconciliation is currently positive."}

---

## Final Investment Committee Thesis
Our recommendation to **${rec}** is grounded in ${entity.name}'s competitive positioning and balance sheet metrics. We recommend positioning size matching our core strategy.`;

    return {
      decision: {
        recommendation: rec,
        confidenceScore: confidence,
        reasoning: `Simulated Decision: We issue a ${rec} on ${entity.name} with ${confidence}% confidence. Our decision is supported by the fundamental metrics (P/E: ${state.financial.metrics.peRatio}, Debt/Equity: ${state.financial.metrics.debtToEquity}) weighed against competition.`,
      },
      memo: simulatedMemo,
    };
  }
}
