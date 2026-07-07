import { SearchResponse, SearchResult } from "./search-api";

export function getMockSearch(query: string): SearchResponse {
  const lowercaseQuery = query.toLowerCase();
  let results: SearchResult[] = [];

  // 1. Apple-related Queries
  if (lowercaseQuery.includes("apple") || lowercaseQuery.includes("aapl")) {
    if (lowercaseQuery.includes("competit") || lowercaseQuery.includes("moat")) {
      results = [
        {
          title: "Apple Moat Analysis - Hardware Locking & Ecosystem Power",
          url: "https://www.morningstar.com/stocks/aapl/analysis",
          content: "Apple retains a wide economic moat driven by high switching costs associated with iOS ecosystem lock-in. Customers who own multiple Apple devices are highly unlikely to switch to Android. Services revenue continues to expand at a 15% CAGR.",
          score: 0.95,
        },
        {
          title: "Samsung Electronics vs. Apple - Smartphone Market Share 2025",
          url: "https://www.idc.com/tracker/smartphone-market-share",
          content: "IDC report shows Apple and Samsung trading places for top global smartphone unit shipment share. Apple commands over 85% of global smartphone industry profits due to premium pricing strategies.",
          score: 0.88,
        },
        {
          title: "Google Pixel & Android Ecosystem Pressure",
          url: "https://www.androidcentral.com/google-pixel-sales-climbing",
          content: "Google's investments in Pixel hardware and integrated AI features (Gemini) are gaining single-digit market share in North America, acting as a competitive threat to Apple's luxury buyer segment.",
          score: 0.81,
        },
      ];
    } else if (lowercaseQuery.includes("risk") || lowercaseQuery.includes("threat") || lowercaseQuery.includes("regulat")) {
      results = [
        {
          title: "US DOJ vs. Apple Antitrust Lawsuit Developments",
          url: "https://www.justice.gov/opa/pr/justice-department-sues-apple-monopolizing-smartphone-markets",
          content: "The Department of Justice, alongside 16 state attorneys general, sued Apple for violating Section 2 of the Sherman Act, alleging anticompetitive behaviors in App Store policies, messaging restrictions, and hardware access.",
          score: 0.96,
        },
        {
          title: "EU Digital Markets Act Compliance & Sideloading Risks",
          url: "https://ec.europa.eu/commission/presscorner/detail/en/ip_24_1483",
          content: "Under the European Union's DMA, Apple was forced to allow alternative app stores and sideloading on iOS. This poses a threat to Apple's highly profitable Services margins (15-30% App Store fees).",
          score: 0.91,
        },
      ];
    } else {
      results = [
        {
          title: "Apple Reports Q3 2025 Earnings - iPhone Revenue Surpasses Expectations",
          url: "https://www.apple.com/newsroom/earnings",
          content: "Apple Inc. announced financial results for its fiscal 2025 third quarter. The Company posted quarterly revenue of $90.8 billion, driven by iPhone 16 sales and service subscriptions reaching an all-time high of 1 billion active accounts.",
          score: 0.93,
        },
        {
          title: "Apple Intelligence Rollout Drives Supercycle Thesis",
          url: "https://www.bloomberg.com/news/articles/apple-intelligence-supercycle",
          content: "Wall Street analysts raise price targets on AAPL, citing strong upgrade indicators for Apple Intelligence-compatible phones. High demand for Pro models increases average selling prices.",
          score: 0.87,
        },
      ];
    }
  }
  // 2. Tesla-related Queries
  else if (lowercaseQuery.includes("tesla") || lowercaseQuery.includes("tsla")) {
    if (lowercaseQuery.includes("competit") || lowercaseQuery.includes("moat")) {
      results = [
        {
          title: "Tesla vs. BYD Global EV Leadership Race",
          url: "https://www.reuters.com/business/autos-transportation/byd-vs-tesla-ev-crown",
          content: "BYD surpassed Tesla in total battery-electric vehicle production in late 2024. BYD benefits from massive vertical integration, particularly in battery cell manufacturing, allowing it to sell vehicles under $15,000.",
          score: 0.94,
        },
        {
          title: "Legacy Automakers Scale Back EV Targets - Hybrid Resurgence",
          url: "https://www.wsj.com/articles/automakers-trim-ev-plans-hybrids-surge",
          content: "Ford, GM, and Toyota are shifting production resources toward hybrids as battery-electric adoption rates slow in the US. This temporarily cushions Tesla's pure EV market share but limits regulatory credit revenues.",
          score: 0.85,
        },
      ];
    } else if (lowercaseQuery.includes("risk") || lowercaseQuery.includes("threat") || lowercaseQuery.includes("regulat")) {
      results = [
        {
          title: "NHTSA Autopilot & Full Self-Driving Probe Escalate",
          url: "https://www.nhtsa.gov/press-releases/tesla-autopilot-investigation",
          content: "The National Highway Traffic Safety Administration opened a recall query into over 2 million Tesla vehicles over Autopilot driver monitoring systems, threatening Tesla's software monetization thesis.",
          score: 0.95,
        },
        {
          title: "Lithium & Nickel Supply Chain Bottlenecks",
          url: "https://www.mining.com/tesla-battery-metals-supply-vulnerabilities",
          content: "Geopolitical tensions in South America and Southeast Asia present battery raw materials shortages. Price volatility in lithium carbonate and nickel directly impacts Tesla's automotive gross margins.",
          score: 0.83,
        },
      ];
    } else {
      results = [
        {
          title: "Tesla Deliveries for Q2 2025 Exceed Estimates",
          url: "https://www.cnbc.com/tesla-q2-deliveries",
          content: "Tesla delivered 443,956 vehicles in the second quarter of 2025, beating consensus estimates of 438,000. Price cuts in China and low-cost financing options stimulated demand, though margins remained compressed.",
          score: 0.92,
        },
        {
          title: "Tesla Cybercab & Robotaxi Strategy - AI Cluster Scale Up",
          url: "https://www.techcrunch.com/tesla-robotaxi-ai-roadmap",
          content: "Elon Musk highlights Tesla's massive NVIDIA H100 GPU computing cluster at Gigafactory Texas. Autonomous driving (FSD v12) acts as the company's core valuation driver, rather than physical car sales.",
          score: 0.89,
        },
      ];
    }
  }
  // 3. Nvidia-related Queries
  else if (lowercaseQuery.includes("nvidia") || lowercaseQuery.includes("nvda")) {
    if (lowercaseQuery.includes("competit") || lowercaseQuery.includes("moat")) {
      results = [
        {
          title: "NVIDIA Moat Analysis - CUDA Software Lock-in",
          url: "https://www.semianalysis.com/nvidia-cuda-monopoly",
          content: "NVIDIA's real moat is not the silicon, but CUDA. The developer ecosystem is locked into CUDA libraries, which do not run natively on AMD's ROCm or Intel's Gaudi chips, creating significant software transition barriers.",
          score: 0.96,
        },
        {
          title: "AMD Launches Instinct MI325X to Challenge Blackwell",
          url: "https://www.anandtech.com/show/amd-instinct-mi325x-ai-accelerator",
          content: "AMD claims its new Instinct accelerators offer superior HBM3e memory bandwidth compared to NVIDIA's Hopper and early Blackwell releases. However, AMD software compilation times remain a friction point.",
          score: 0.87,
        },
      ];
    } else if (lowercaseQuery.includes("risk") || lowercaseQuery.includes("threat") || lowercaseQuery.includes("regulat")) {
      results = [
        {
          title: "US Export Controls on Advanced Semiconductors to Asia",
          url: "https://www.bis.doc.gov/index.php/documents/about-bis/newsroom",
          content: "The US Bureau of Industry and Security tightened restrictions on high-bandwidth memory chips and compute density exports. NVIDIA lost access to 20%+ of its addressable market in China, forcing lower-performing custom chip designs.",
          score: 0.94,
        },
        {
          title: "AI Infrastructure CapEx Bubble Debates",
          url: "https://www.goldmansachs.com/intelligence/pages/ai-investment-bubble.html",
          content: "Goldman Sachs research questions if the $1 trillion tech company CapEx on AI chips will yield actual commercial SaaS returns. A slowdown in cloud customer hyper-scaler buying would severely impact NVIDIA's backlog.",
          score: 0.90,
        },
      ];
    } else {
      results = [
        {
          title: "NVIDIA Blackwell Production Yield Concerns Solved",
          url: "https://www.trendforce.com/news/nvidia-blackwell-supply-chain-recovery",
          content: "TSMC CoWoS packaging yields for Blackwell chips have recovered to over 90% after a minor design revision. Shipments are accelerating to Microsoft, AWS, and Meta, driving record data center segment revenues.",
          score: 0.91,
        },
        {
          title: "NVIDIA Data Center Growth Continues Double-Digit Pace",
          url: "https://www.fool.com/investing/nvidia-datacenter-earnings",
          content: "NVIDIA reports Q1 2025 earnings showing data center division revenue up 400% year-over-year. Hyper-scaler demand for AI inference clusters remains unsatiated.",
          score: 0.88,
        },
      ];
    }
  }
  // 4. Default / General Queries
  else {
    results = [
      {
        title: `${query} Analyst Research and Market Overview`,
        url: "https://www.marketwatch.com/stocks",
        content: `Comprehensive equity research on ${query}. Analysts assess current valuation metrics, market capitalization trends, and strategic initiatives. Operational growth is positive but macro headwinds persist.`,
        score: 0.85,
      },
      {
        title: `${query} Competitor Landscape and Regulation Overview`,
        url: "https://www.yahoofinance.com",
        content: `Competitive analysis and regulatory findings for ${query}. Market share is contested by regional players. Regulatory hurdles in North America and EU demand strict compliance.`,
        score: 0.78,
      },
    ];
  }

  return {
    results,
    query,
    source: "Simulated Search Feed (API Offline)",
  };
}
