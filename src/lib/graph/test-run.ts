import { researchGraph } from "./index";

async function runTest() {
  console.log("==================================================");
  console.log("InvestIQ Agent - Standalone Graph Test Runner");
  console.log("==================================================");
  
  // Use env keys if present, otherwise set dummy keys to trigger simulation flows
  if (!process.env.OPENAI_API_KEY) process.env.OPENAI_API_KEY = "your_openai_api_key";
  if (!process.env.ALPHA_VANTAGE_API_KEY) process.env.ALPHA_VANTAGE_API_KEY = "your_alpha_vantage_api_key";
  if (!process.env.TAVILY_API_KEY) process.env.TAVILY_API_KEY = "your_tavily_api_key";
  
  const query = "Tesla";
  console.log(`Executing multi-agent research workflow for query: "${query}"...`);

  try {
    const start = Date.now();
    
    // Invoke the state machine graph
    const finalState = await researchGraph.invoke({
      company: query,
      userId: "system",
    });

    const duration = ((Date.now() - start) / 1000).toFixed(2);

    console.log("\n==================================================");
    console.log("Graph Execution SUCCESSFUL");
    console.log(`Total Duration: ${duration} seconds`);
    console.log("==================================================");

    if (finalState.entity) {
      console.log(`Resolved Company : ${finalState.entity.name}`);
      console.log(`Ticker/Exchange  : ${finalState.entity.ticker} (${finalState.entity.exchange})`);
    } else {
      console.log("❌ Failed to resolve company.");
    }

    if (finalState.financial) {
      console.log(`Fundamentals Score: ${finalState.financial.score}/10`);
      console.log(`P/E Ratio        : ${finalState.financial.metrics.peRatio}`);
      console.log(`Debt to Equity   : ${finalState.financial.metrics.debtToEquity.toFixed(2)}`);
    }

    if (finalState.decision) {
      console.log(`Final Decision   : ${finalState.decision.recommendation}`);
      console.log(`Confidence Score : ${finalState.decision.confidenceScore}%`);
      console.log(`Reasoning Summary: ${finalState.decision.reasoning}`);
    } else {
      console.log("❌ Failed to reach final investment decision.");
    }

    console.log("\nSource Citations Collected:");
    finalState.sources.forEach((src) => console.log(`- ${src}`));
    console.log("==================================================");
  } catch (error) {
    console.error("❌ Graph execution failed with error:", error);
  }
}

runTest();
