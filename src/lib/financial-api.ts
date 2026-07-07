import { getMockFinancials } from "./mock-financials";

export interface AnnualReport {
  fiscalDateEnding: string;
  totalRevenue: number;
  netIncome: number;
  operatingIncome: number;
  grossProfit: number;
  operatingMargin: number;
  netMargin: number;
}

export interface FinancialData {
  name: string;
  ticker: string;
  exchange: string;
  sector: string;
  industry: string;
  description: string;
  peRatio: number;
  pegRatio: number;
  marketCap: number;
  eps: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  debtToEquity: number;
  currentRatio: number;
  annualReports: AnnualReport[];
  source: "Alpha Vantage API" | "Simulated Financial Feed (API Offline)";
}

export async function getFinancialMetrics(ticker: string): Promise<FinancialData> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  // Fallback to mock data if API key is not present or is the default placeholder
  if (!apiKey || apiKey === "your_alpha_vantage_api_key") {
    console.warn(`[Financial API] No valid Alpha Vantage API key found. Using simulated feed for ${ticker}.`);
    return getMockFinancials(ticker);
  }

  try {
    const symbol = ticker.toUpperCase();
    
    // 1. Fetch Overview
    const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;
    const overviewRes = await fetch(overviewUrl, { next: { revalidate: 86400 } }); // Cache for 24h
    const overviewData = await overviewRes.json();

    // Handle rate limits or errors from Alpha Vantage
    if (!overviewData || !overviewData.Name || overviewData.Note || overviewData.Information) {
      console.warn(`[Financial API] Alpha Vantage rate limited or error. Falling back to simulated feed for ${symbol}.`);
      return getMockFinancials(symbol);
    }

    // 2. Fetch Income Statement
    const incomeUrl = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${apiKey}`;
    const incomeRes = await fetch(incomeUrl, { next: { revalidate: 86400 } });
    const incomeData = await incomeRes.json();

    // 3. Fetch Balance Sheet
    const balanceUrl = `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol}&apikey=${apiKey}`;
    const balanceRes = await fetch(balanceUrl, { next: { revalidate: 86400 } });
    const balanceData = await balanceRes.json();

    // Map overview variables
    const name = overviewData.Name || symbol;
    const exchange = overviewData.Exchange || "NASDAQ";
    const sector = overviewData.Sector || "Technology";
    const industry = overviewData.Industry || "Software";
    const description = overviewData.Description || "";
    const peRatio = parseFloat(overviewData.PERatio) || 0;
    const pegRatio = parseFloat(overviewData.PEGRatio) || 0;
    const marketCap = parseInt(overviewData.MarketCapitalization) || 0;
    const eps = parseFloat(overviewData.EPS) || 0;
    const fiftyTwoWeekHigh = parseFloat(overviewData.FiftyTwoWeekHigh) || 0;
    const fiftyTwoWeekLow = parseFloat(overviewData.FiftyTwoWeekLow) || 0;

    // Calculate Balance Sheet Metrics (most recent year)
    let debtToEquity = 0;
    let currentRatio = 1.5; // industry default fallback
    
    if (balanceData && balanceData.annualReports && balanceData.annualReports.length > 0) {
      const latestBalance = balanceData.annualReports[0];
      const totalLiabilities = parseFloat(latestBalance.totalLiabilities) || 0;
      const totalEquity = parseFloat(latestBalance.totalShareholderEquity) || 1; // avoid divide by zero
      const totalCurrentAssets = parseFloat(latestBalance.totalCurrentAssets) || 0;
      const totalCurrentLiabilities = parseFloat(latestBalance.totalCurrentLiabilities) || 1;

      debtToEquity = totalLiabilities / totalEquity;
      currentRatio = totalCurrentAssets / totalCurrentLiabilities;
    }

    // Map Income Statement Reports (up to 4 years)
    const annualReports: AnnualReport[] = [];
    if (incomeData && incomeData.annualReports && incomeData.annualReports.length > 0) {
      const reportsToMap = incomeData.annualReports.slice(0, 4);
      for (const rep of reportsToMap) {
        const rev = parseFloat(rep.totalRevenue) || 0;
        const net = parseFloat(rep.netIncome) || 0;
        const oper = parseFloat(rep.operatingIncome) || 0;
        const gross = parseFloat(rep.grossProfit) || 0;

        annualReports.push({
          fiscalDateEnding: rep.fiscalDateEnding,
          totalRevenue: rev,
          netIncome: net,
          operatingIncome: oper,
          grossProfit: gross,
          operatingMargin: rev > 0 ? oper / rev : 0,
          netMargin: rev > 0 ? net / rev : 0,
        });
      }
    }

    return {
      name,
      ticker: symbol,
      exchange,
      sector,
      industry,
      description,
      peRatio,
      pegRatio,
      marketCap,
      eps,
      fiftyTwoWeekHigh,
      fiftyTwoWeekLow,
      debtToEquity,
      currentRatio,
      annualReports,
      source: "Alpha Vantage API",
    };
  } catch (error) {
    console.error(`[Financial API] Error fetching live data for ${ticker}:`, error);
    console.warn(`[Financial API] Falling back to simulated feed for ${ticker}.`);
    return getMockFinancials(ticker);
  }
}
