import { Annotation } from "@langchain/langgraph";

export interface ResolvedEntity {
  ticker: string;
  name: string;
  exchange: string;
}

export interface FinancialAnalysis {
  score: number;
  metrics: {
    peRatio: number;
    pegRatio: number;
    marketCap: number;
    eps: number;
    debtToEquity: number;
    currentRatio: number;
  };
  summary: string;
  sources: string[];
}

export interface NewsAnalysis {
  sentiment: "Bullish" | "Neutral" | "Bearish";
  score: number; // -1 to 1
  highlights: string[];
  summary: string;
}

export interface CompetitiveAnalysis {
  competitors: string[];
  moatRating: "Strong" | "Average" | "Weak";
  moatAnalysis: string;
  marketShareInfo: string;
}

export interface RiskAnalysis {
  regulatoryRisk: string;
  marketRisk: string;
  businessRisk: string;
  overallRiskLevel: "High" | "Medium" | "Low";
}

export interface ThesisCase {
  thesis: string;
  supportingFacts: string[];
}

export interface DecisionDetails {
  recommendation: "INVEST" | "WATCH" | "PASS";
  confidenceScore: number; // 0 to 100
  reasoning: string;
}

// LangGraph.js Annotation configuration representing the state machine's schema
export const InvestIQAnnotation = Annotation.Root({
  userId: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "system",
  }),
  company: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  entity: Annotation<ResolvedEntity | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  financial: Annotation<FinancialAnalysis | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  news: Annotation<NewsAnalysis | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  competition: Annotation<CompetitiveAnalysis | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  risk: Annotation<RiskAnalysis | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  bullCase: Annotation<ThesisCase | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  bearCase: Annotation<ThesisCase | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  debateSummary: Annotation<string | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  decision: Annotation<DecisionDetails | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  critiqueCount: Annotation<number>({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => 0,
  }),
  critiqueFeedback: Annotation<string | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  memo: Annotation<string | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  sources: Annotation<string[]>({
    reducer: (x, y) => {
      // Append unique sources
      const combined = [...x, ...(y || [])];
      return Array.from(new Set(combined));
    },
    default: () => [],
  }),
});

export type InvestIQState = typeof InvestIQAnnotation.State;
export type InvestIQUpdate = typeof InvestIQAnnotation.Update;
