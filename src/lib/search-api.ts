import { getMockSearch } from "./mock-search";

export interface SearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  source: "Tavily Search API" | "Simulated Search Feed (API Offline)";
}

export async function performWebSearch(
  query: string,
  searchDepth: "basic" | "advanced" = "basic"
): Promise<SearchResponse> {
  const apiKey = process.env.TAVILY_API_KEY;

  // Fallback to mock search if Tavily API key is not present
  if (!apiKey || apiKey === "your_tavily_api_key") {
    console.warn(`[Search API] No valid Tavily API key found. Using simulated search feed for: "${query}".`);
    return getMockSearch(query);
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: searchDepth,
        include_answer: false,
        include_images: false,
        max_results: 5,
      }),
      next: { revalidate: 3600 }, // Cache search queries for 1 hour
    });

    if (!response.ok) {
      console.warn(`[Search API] Tavily search failed with status ${response.status}. Using simulated search.`);
      return getMockSearch(query);
    }

    const data = await response.json();
    
    if (!data || !data.results) {
      console.warn("[Search API] Tavily search returned empty results. Using simulated search.");
      return getMockSearch(query);
    }

    const results = data.results.map((res: any) => ({
      title: res.title || "Web Result",
      url: res.url || "#",
      content: res.content || "",
      score: res.score || 0.8,
    }));

    return {
      results,
      query,
      source: "Tavily Search API",
    };
  } catch (error) {
    console.error(`[Search API] Error executing Tavily search for "${query}":`, error);
    console.warn("[Search API] Falling back to simulated search feed.");
    return getMockSearch(query);
  }
}
