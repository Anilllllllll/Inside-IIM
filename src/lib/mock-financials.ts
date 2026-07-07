import { FinancialData, AnnualReport } from "./financial-api";

export function getMockFinancials(ticker: string): FinancialData {
  const symbol = ticker.toUpperCase();

  // 1. Establish detailed profiles for common stocks
  const profiles: Record<string, Partial<FinancialData>> = {
    TSLA: {
      name: "Tesla, Inc.",
      exchange: "NASDAQ",
      sector: "Consumer Cyclical",
      industry: "Auto Manufacturers",
      description: "Tesla, Inc. designs, develops, manufactures, sells, and leases fully electric vehicles, energy generation and storage systems, and offers services related to its products. It operates in two segments, Automotive and Energy Generation and Storage.",
      peRatio: 54.2,
      pegRatio: 1.45,
      marketCap: 780000000000,
      eps: 3.42,
      fiftyTwoWeekHigh: 271.0,
      fiftyTwoWeekLow: 138.8,
      debtToEquity: 0.12,
      currentRatio: 1.73,
    },
    AAPL: {
      name: "Apple Inc.",
      exchange: "NASDAQ",
      sector: "Technology",
      industry: "Consumer Electronics",
      description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company also sells various related services, including Apple Music, Apple TV+, and iCloud.",
      peRatio: 30.5,
      pegRatio: 2.1,
      marketCap: 3200000000000,
      eps: 6.43,
      fiftyTwoWeekHigh: 237.2,
      fiftyTwoWeekLow: 165.0,
      debtToEquity: 1.45,
      currentRatio: 1.04,
    },
    NVDA: {
      name: "NVIDIA Corporation",
      exchange: "NASDAQ",
      sector: "Technology",
      industry: "Semiconductors",
      description: "NVIDIA Corporation focuses on personal computer graphics, graphics processing units, and also on artificial intelligence solutions. It operates through two segments, Graphics and Compute & Networking.",
      peRatio: 68.3,
      pegRatio: 1.15,
      marketCap: 3000000000000,
      eps: 2.45,
      fiftyTwoWeekHigh: 140.7,
      fiftyTwoWeekLow: 45.2,
      debtToEquity: 0.22,
      currentRatio: 3.53,
    },
    MSFT: {
      name: "Microsoft Corporation",
      exchange: "NASDAQ",
      sector: "Technology",
      industry: "Software - Infrastructure",
      description: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates in three segments: Productivity and Business Processes, Intelligent Cloud, and More Personal Computing.",
      peRatio: 35.1,
      pegRatio: 1.85,
      marketCap: 3150000000000,
      eps: 11.8,
      fiftyTwoWeekHigh: 468.3,
      fiftyTwoWeekLow: 315.1,
      debtToEquity: 0.41,
      currentRatio: 1.29,
    },
  };

  const baseProfile = profiles[symbol] || {
    name: `${symbol} Corp`,
    exchange: "NYSE",
    sector: "Technology",
    industry: "Enterprise Software",
    description: `${symbol} Corp is a global business operating in the industry, focusing on research, development, and scalable market solutions.`,
    peRatio: 22.4,
    pegRatio: 1.2,
    marketCap: 25000000000,
    eps: 2.15,
    fiftyTwoWeekHigh: 120.0,
    fiftyTwoWeekLow: 75.0,
    debtToEquity: 0.5,
    currentRatio: 1.5,
  };

  // 2. Generate simulated financial statements (past 3 years)
  const annualReports: AnnualReport[] = [];
  const years = [2025, 2024, 2023];
  
  // Base numbers depending on size (Market Cap)
  let revenueBase = baseProfile.marketCap! / (baseProfile.peRatio! * 0.4);
  let netMarginBase = 0.15; // 15% net margin default

  if (symbol === "TSLA") {
    revenueBase = 96000000000;
    netMarginBase = 0.13;
  } else if (symbol === "AAPL") {
    revenueBase = 385000000000;
    netMarginBase = 0.25;
  } else if (symbol === "NVDA") {
    revenueBase = 60000000000;
    netMarginBase = 0.45;
  } else if (symbol === "MSFT") {
    revenueBase = 227000000000;
    netMarginBase = 0.35;
  }

  years.forEach((year, index) => {
    // Apply compound decline/growth back in time
    const growthFactor = symbol === "NVDA" ? 0.45 : 0.08; // NVDA grew fast
    const factor = Math.pow(1 - growthFactor, index);
    
    const totalRevenue = Math.round(revenueBase * factor);
    const netIncome = Math.round(totalRevenue * netMarginBase * (1 - index * 0.01)); // margin drops slightly in history
    const operatingIncome = Math.round(totalRevenue * (netMarginBase * 1.3) * (1 - index * 0.015));
    const grossProfit = Math.round(totalRevenue * 0.45); // 45% gross margin

    annualReports.push({
      fiscalDateEnding: `${year}-12-31`,
      totalRevenue,
      netIncome,
      operatingIncome,
      grossProfit,
      operatingMargin: operatingIncome / totalRevenue,
      netMargin: netIncome / totalRevenue,
    });
  });

  return {
    name: baseProfile.name!,
    ticker: symbol,
    exchange: baseProfile.exchange!,
    sector: baseProfile.sector!,
    industry: baseProfile.industry!,
    description: baseProfile.description!,
    peRatio: baseProfile.peRatio!,
    pegRatio: baseProfile.pegRatio!,
    marketCap: baseProfile.marketCap!,
    eps: baseProfile.eps!,
    fiftyTwoWeekHigh: baseProfile.fiftyTwoWeekHigh!,
    fiftyTwoWeekLow: baseProfile.fiftyTwoWeekLow!,
    debtToEquity: baseProfile.debtToEquity!,
    currentRatio: baseProfile.currentRatio!,
    annualReports,
    source: "Simulated Financial Feed (API Offline)",
  };
}
