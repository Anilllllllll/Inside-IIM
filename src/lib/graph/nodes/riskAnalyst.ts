import { z } from "zod";
import { getChatModel } from "../llm";
import { InvestIQState } from "../state";
import { performWebSearch } from "../../search-api";

const RiskAnalystSchema = z.object({
  regulatoryRisk: z.string().describe("Legal, compliance, government regulatory threats, or active lawsuits"),
  marketRisk: z.string().describe("Macroeconomic risks, interest rates, customer demand fluctuations, or supply cost changes"),
  businessRisk: z.string().describe("Operational risks, product vulnerabilities, execution risks, or key person dependencies"),
  overallRiskLevel: z.enum(["High", "Medium", "Low"]).describe("Overall qualitative risk assessment rating"),
});

export async function riskAnalystNode(state: InvestIQState): Promise<Partial<InvestIQState>> {
  const entity = state.entity;
  if (!entity) {
    return {
      risk: null,
    };
  }

  const query = `${entity.name} (${entity.ticker}) business regulatory risks litigation 10-K`;
  
  let searchRes: any;
  let citations: string[] = [];

  try {
    // 1. Fetch risk vectors via Tavily search
    searchRes = await performWebSearch(query, "basic");
    citations = searchRes.results.map((r) => r.url);

    const model = getChatModel(0);
    
    if (!model) {
      console.warn("[Risk Analyst] No active OpenAI model. Performing simulated risk evaluation.");
      
      const riskMap: Record<string, { regulatory: string; market: string; business: string; overall: "High" | "Medium" | "Low" }> = {
        TSLA: {
          regulatory: "Autonomous driving (FSD) and Autopilot safety probes by the NHTSA present high recall and litigation threats. Additionally, dependency on EV regulatory credits in various jurisdictions remains a regulatory policy risk.",
          market: "Global slow down in battery-electric vehicle sales and high interest rates pressure consumer buying power. Extreme pricing pressure from lower-cost Chinese EV manufacturers is forcing auto gross margins down.",
          business: "Key person risk associated with CEO Elon Musk. Scaling issues with structural batteries (4680 cells) and Cybertruck manufacturing complexities present high capital execution risks.",
          overall: "High",
        },
        AAPL: {
          regulatory: "Antitrust litigation is the primary threat, specifically the landmark US DOJ antitrust lawsuit targeting smartphone monopolization and the European Union DMA regulations forcing App Store unbundling.",
          market: "Smartphone saturation and longer replacement cycles in major developed markets. Geopolitical tensions in Asia present manufacturing dependency vulnerabilities and market access risks in China.",
          business: "High reliance on hardware revenue cycles (iPhone is ~50% of revenue). Execution risk in introducing new device categories (e.g. Vision Pro) and timing of AI integration compared to rivals.",
          overall: "Medium",
        },
      };

      const match = riskMap[entity.ticker] || {
        regulatory: "Standard regulatory audits and regional taxation policy compliance requirements apply.",
        market: "Exposed to generic cyclical inflation, credit conditions, and raw materials supply chain price hikes.",
        business: "Exposed to operational disruptions, security breaches, and software development timelines.",
        overall: "Medium",
      };

      return {
        risk: {
          regulatoryRisk: match.regulatory,
          marketRisk: match.market,
          businessRisk: match.business,
          overallRiskLevel: match.overall,
        },
        sources: citations,
      };
    }

    const structuredModel = model.withStructuredOutput(RiskAnalystSchema, {
      name: "RiskAnalyst",
    });

    const searchContext = JSON.stringify(
      searchRes.results.slice(0, 3).map((r: any) => ({
        title: r.title,
        content: r.content.slice(0, 500),
      })),
      null,
      2
    );
    const prompt = `You are an expert Investment Risk Manager.
Your role is to identify and catalog the risk factors facing ${entity.name} (${entity.ticker}) based on current news and corporate disclosures.

Search Results Context:
${searchContext}

Analyze the data and output:
1. Regulatory Risks: detail compliance, litigation, geopolitical threats, or antitrust concerns.
2. Market Risks: detail macro headwinds, supply chain price hikes, inflation, or demand slowdowns.
3. Business Risks: detail operational, brand, technology, or management issues.
4. An overall risk level rating: "High", "Medium", or "Low".`;

    const result = await structuredModel.invoke([
      { role: "system", content: "You are a cautious, risk-averse investment manager. Highlight critical issues." },
      { role: "user", content: prompt }
    ]);

    return {
      risk: {
        regulatoryRisk: result.regulatoryRisk,
        marketRisk: result.marketRisk,
        businessRisk: result.businessRisk,
        overallRiskLevel: result.overallRiskLevel,
      },
      sources: citations,
    };
  } catch (error) {
    console.error("[Risk Analyst Node] Failed. Falling back to simulated risk audit:", error);
    return {
      risk: {
        regulatoryRisk: `Litigation hazards for ${entity.name} match industry standards. Close audit required on local legal compliance frameworks.`,
        marketRisk: `Exposed to macroeconomic cycles, interest rate changes, and global consumer spending swings.`,
        businessRisk: `Exposed to pricing headwinds, operational complexity, and supply chain logistics pressures.`,
        overallRiskLevel: "Medium",
      },
      sources: citations,
    };
  }
}
