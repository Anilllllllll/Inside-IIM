import { getChatModel } from "../llm";
import { InvestIQState } from "../state";

export async function debateAgentNode(state: InvestIQState): Promise<Partial<InvestIQState>> {
  const entity = state.entity;
  const bullCase = state.bullCase;
  const bearCase = state.bearCase;

  if (!entity || !bullCase || !bearCase) {
    return { debateSummary: null };
  }

  const model = getChatModel(0.2); // minor temperature for comparison flexibility
  
  if (!model) {
    console.warn("[Debate Agent] No active OpenAI model. Performing simulated debate synthesis.");
    return {
      debateSummary: `Simulated Debate Summary: The investment case for ${entity.name} represents a balance between strong operational performance and significant regulatory and competitive concerns. 
- The BULL Case highlights solid liquidity (Current Ratio: ${state.financial?.metrics.currentRatio.toFixed(2)}), a leading market position, and strong services margin growth.
- The BEAR Case stresses valuation headwinds (P/E of ${state.financial?.metrics.peRatio}) and major litigation risks (${state.risk?.regulatoryRisk.slice(0, 100)}...).
Conclusion: Quantitative stability supports the long-term case, but near-term volatility is highly likely due to the active regulatory pressures.`,
    };
  }

  try {
    const prompt = `You are the Moderator of the Investment Debate Committee.
Your job is to reconcile the adversarial Bull and Bear arguments for ${entity.name} (${entity.ticker}) and synthesize a balanced, objective comparative analysis.

Here is the Bull case:
Thesis: ${bullCase.thesis}
Supporting Facts:
${bullCase.supportingFacts.map((f) => `- ${f}`).join("\n")}

Here is the Bear case:
Thesis: ${bearCase.thesis}
Supporting Facts:
${bearCase.supportingFacts.map((f) => `- ${f}`).join("\n")}

Here is the core corporate and financial context:
PE Ratio: ${state.financial?.metrics.peRatio}
PEG Ratio: ${state.financial?.metrics.pegRatio}
Debt to Equity: ${state.financial?.metrics.debtToEquity.toFixed(2)}
Moat Rating: ${state.competition?.moatRating}
Overall Risk Level: ${state.risk?.overallRiskLevel}

Write a detailed, objective Debate Summary (approx. 200-300 words). In your summary:
1. Pave a direct comparison of the key claims of both sides.
2. Stress-test their assumptions against the quantitative data (P/E, Debt-to-Equity, current ratio). Which arguments are mathematically stronger?
3. Provide a balanced, objective final reconciliation detailing under which market conditions the bull or bear case is more likely to play out.`;

    const result = await model.invoke([
      { role: "system", content: "You are an objective, neutral debate arbitrator. Reconcile both sides using quantitative facts." },
      { role: "user", content: prompt }
    ]);

    return {
      debateSummary: typeof result.content === "string" ? result.content : JSON.stringify(result.content),
    };
  } catch (error) {
    console.error("[Debate Agent Node] Failed. Falling back to simulated debate summary:", error);
    return {
      debateSummary: `Simulated Debate Summary: The investment case for ${entity.name} represents a balance between strong operational performance and significant regulatory and competitive concerns. 
- The BULL Case highlights solid liquidity (Current Ratio: ${state.financial?.metrics.currentRatio.toFixed(2)}), a leading market position, and strong services margin growth.
- The BEAR Case stresses valuation headwinds (P/E of ${state.financial?.metrics.peRatio}) and major litigation risks (${state.risk?.regulatoryRisk.slice(0, 100)}...).
Conclusion: Quantitative stability supports the long-term case, but near-term volatility is highly likely due to the active regulatory pressures.`,
    };
  }
}
