import { ChatOpenAI } from "@langchain/openai";

export function getChatModel(temperature = 0, modelName = "gpt-4o-mini") {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey || apiKey === "your_openai_api_key") {
    // Return null to signal nodes to fall back to structured simulation
    return null;
  }

  // Intercept Groq Keys
  if (apiKey.startsWith("gsk_")) {
    console.log(`[LLM Client] Groq Key detected. Routing to Groq API using llama-3.3-70b-versatile...`);
    const client = new ChatOpenAI({
      model: "llama-3.3-70b-versatile",
      temperature,
      apiKey,
      maxRetries: 2, // Fail fast under rate limits to trigger fallbacks
      configuration: {
        baseURL: "https://api.groq.com/openai/v1",
      },
    });

    // Groq requires structured output to be passed as tools (functionCalling)
    const originalWithStructuredOutput = client.withStructuredOutput.bind(client);
    client.withStructuredOutput = (schema: any, options?: any) => {
      return originalWithStructuredOutput(schema, {
        ...options,
        method: "functionCalling",
      });
    };

    return client;
  }

  return new ChatOpenAI({
    model: modelName,
    temperature,
    apiKey,
    maxRetries: 2,
  });
}
export type InvestIQModel = ReturnType<typeof getChatModel>;
