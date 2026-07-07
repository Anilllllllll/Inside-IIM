import { ChatOpenAI } from "@langchain/openai";

export function getChatModel(temperature = 0, modelName = "gpt-4o-mini") {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey || apiKey === "your_openai_api_key") {
    // Return null to signal nodes to fall back to structured simulation
    return null;
  }

  return new ChatOpenAI({
    model: modelName,
    temperature,
    apiKey,
  });
}
export type InvestIQModel = ReturnType<typeof getChatModel>;
