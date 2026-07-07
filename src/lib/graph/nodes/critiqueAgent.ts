import { z } from "zod";
import { getChatModel } from "../llm";
import { InvestIQState } from "../state";

const CritiqueSchema = z.object({
  isApproved: z.boolean().describe("True if the investment report is logically sound, factually grounded, and has appropriate confidence alignment"),
  feedback: z.string().describe("Constructive criticism detailing missing data, logic gaps, or confidence alignment issues if isApproved is false"),
});

export async function critiqueAgentNode(state: InvestIQState): Promise<Partial<InvestIQState>> {
  const entity = state.entity;
  const decision = state.decision;
  const memo = state.memo;

  if (!entity || !decision || !memo) {
    return { critiqueFeedback: null };
  }

  // CRITICAL GUARDRAIL: If we have already executed a critique loop once, bypass and approve.
  // This prevents infinite cycles and controls token expenses.
  if (state.critiqueCount >= 1) {
    console.warn(`[Self Critique] Maximum critique loop (1) reached. Bypassing and forcing final approval for ${entity.ticker}.`);
    return {
      critiqueFeedback: null,
    };
  }

  const model = getChatModel(0); // temperature = 0 for strict audit analysis
  
  if (!model) {
    console.warn("[Self Critique] No active OpenAI model. Automated bypass approval.");
    return {
      critiqueFeedback: null,
    };
  }

  try {
    const structuredModel = model.withStructuredOutput(CritiqueSchema, {
      name: "CritiqueAgent",
    });

    const context = JSON.stringify({
      entity,
      financial: state.financial,
      news: state.news,
      competition: state.competition,
      risk: state.risk,
      debateSummary: state.debateSummary,
      decision,
      memo: memo.slice(0, 1000) + "... [Truncated for prompt efficiency]",
    }, null, 2);

    const prompt = `You are the Chief Risk Officer (CRO) of our investment firm.
Your job is to audit the final Investment Committee recommendation and Research Memo. You must check for logical inconsistencies, overconfidence bias, and missing details.

Context Dossier and Decision:
${context}

Check list criteria:
1. Logical consistency: Recommending "INVEST" but the Fundamentals analyst score was 3/10 or overall risk is "High" is a major logic gap that must be rejected.
2. Overconfidence: A confidence score above 90% is only justified if there is a Strong Moat, Low/Medium Risk, and positive news sentiment. A confidence above 95% should almost always be rejected as overconfident.
3. Missing details: Ensure the decision reasoning doesn't contradict the risk analyst details.

Evaluate the report:
- If it passes all checks, set isApproved = true and feedback = "".
- If it fails any check, set isApproved = false and provide detailed constructive feedback explaining what the committee must revise. Keep it professional.`;

    const result = await structuredModel.invoke([
      { role: "system", content: "You are a conservative, strict Chief Risk Officer. You reject reports with logical flaws or overconfident ratings." },
      { role: "user", content: prompt }
    ]);

    if (result.isApproved) {
      console.log(`[Self Critique] Investment report for ${entity.ticker} APPROVED by CRO.`);
      return {
        critiqueFeedback: null,
      };
    } else {
      console.warn(`[Self Critique] Investment report for ${entity.ticker} REJECTED by CRO. Feedback: "${result.feedback}"`);
      return {
        critiqueFeedback: result.feedback,
        critiqueCount: state.critiqueCount + 1, // increment to trigger route and prevent future loops
      };
    }
  } catch (error) {
    console.error("[Critique Agent Node] Failed:", error);
    return {
      critiqueFeedback: null,
    };
  }
}
