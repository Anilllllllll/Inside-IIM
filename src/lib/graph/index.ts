import { StateGraph, START, END } from "@langchain/langgraph";
import { InvestIQAnnotation } from "./state";
import { entityResolverNode } from "./nodes/entityResolver";
import { financialAnalystNode } from "./nodes/financialAnalyst";
import { newsSentimentNode } from "./nodes/newsSentiment";
import { competitiveAnalystNode } from "./nodes/competitiveAnalyst";
import { riskAnalystNode } from "./nodes/riskAnalyst";
import { bullAgentNode, bearAgentNode } from "./nodes/bullBearAgents";
import { debateAgentNode } from "./nodes/debateAgent";
import { decisionAgentNode } from "./nodes/decisionAgent";
import { critiqueAgentNode } from "./nodes/critiqueAgent";
import { dbSaverNode } from "./nodes/dbSaver";

// 1. Build and wire the StateGraph workflow
const workflow = new StateGraph(InvestIQAnnotation)
  .addNode("resolver", entityResolverNode)
  .addNode("fundamentals", financialAnalystNode)
  .addNode("newsAgent", newsSentimentNode)
  .addNode("competitionAgent", competitiveAnalystNode)
  .addNode("riskAgent", riskAnalystNode)
  .addNode("bull", bullAgentNode)
  .addNode("bear", bearAgentNode)
  .addNode("debate", debateAgentNode)
  .addNode("committee", decisionAgentNode)
  .addNode("critique", critiqueAgentNode)
  .addNode("saver", dbSaverNode);

// 2. Define operational static edges
workflow.addEdge(START, "resolver");

// Parallel Fan-out from Entity Resolver to the 4 Domain Specialists
workflow.addEdge("resolver", "fundamentals");
workflow.addEdge("resolver", "newsAgent");
workflow.addEdge("resolver", "competitionAgent");
workflow.addEdge("resolver", "riskAgent");

// Parallel Fan-in (Merge Barrier) from Specialists to Bull & Bear Adversaries
workflow.addEdge("fundamentals", "bull");
workflow.addEdge("newsAgent", "bull");
workflow.addEdge("competitionAgent", "bull");
workflow.addEdge("riskAgent", "bull");

workflow.addEdge("fundamentals", "bear");
workflow.addEdge("newsAgent", "bear");
workflow.addEdge("competitionAgent", "bear");
workflow.addEdge("riskAgent", "bear");

// Merge adversarial outputs into the Debate arbitration agent
workflow.addEdge("bull", "debate");
workflow.addEdge("bear", "debate");

// Debate to Investment Committee Decision Node
workflow.addEdge("debate", "committee");

// Committee to Chief Risk Officer Critique Node
workflow.addEdge("committee", "critique");

// 3. Define Conditional Routing Edge based on CRO audit results
workflow.addConditionalEdges(
  "critique",
  (state) => {
    if (state.critiqueFeedback !== null) {
      // Loop back to committee for revision
      console.log("[Graph Routing] CRO flagged issues. Routing back to Committee Node.");
      return "committee";
    }
    // CRO Approved. Proceed to archive report
    console.log("[Graph Routing] CRO approved report. Routing to Database Saver Node.");
    return "saver";
  },
  {
    committee: "committee",
    saver: "saver",
  }
);

// Database saving to Terminal Endpoint
workflow.addEdge("saver", END);

// 4. Compile the state machine graph
export const researchGraph = workflow.compile();
