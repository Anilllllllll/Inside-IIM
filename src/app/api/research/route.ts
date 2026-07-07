import { NextResponse } from "next/server";
import { researchGraph } from "@/lib/graph";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company, userId } = body;

    if (!company || company.trim() === "") {
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    }

    console.log(`[API Research] Launching research graph for: "${company}"...`);
    
    // 1. Invoke the compiled LangGraph workflow state machine
    const result = await researchGraph.invoke({
      company: company.trim(),
      userId: userId || "system",
    });

    // 2. Fetch the newly created record.
    // The dbSaverNode writes to the ResearchReport database table upon successful completion.
    const ticker = result.entity?.ticker || company.toUpperCase().slice(0, 5);
    const latestReport = await db.researchReport.findFirst({
      where: {
        ticker: ticker,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!latestReport) {
      return NextResponse.json(
        { error: "AI research graph completed but report failed to write to database." },
        { status: 500 }
      );
    }

    return NextResponse.json(latestReport);
  } catch (error: any) {
    console.error("[API Research Handler] Crash during execution:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during multi-agent graph execution." },
      { status: 500 }
    );
  }
}
