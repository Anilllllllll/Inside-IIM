import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId") || undefined;

    // Fetch a single detailed report if id query is provided
    if (id) {
      const report = await db.researchReport.findUnique({
        where: { id },
        include: { user: { select: { name: true, email: true } } },
      });
      
      if (!report) {
        return NextResponse.json({ error: "Report not found" }, { status: 404 });
      }
      
      return NextResponse.json(report);
    }

    // Fetch reports from the database.
    // If a userId is supplied, filter for that user. Otherwise return all reports.
    const reports = await db.researchReport.findMany({
      where: userId ? { userId } : {},
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        companyName: true,
        ticker: true,
        exchange: true,
        decision: true,
        confidenceScore: true,
        summary: true,
        createdAt: true,
      },
    });

    return NextResponse.json(reports);
  } catch (error: any) {
    console.error("[API Reports GET] Failed to fetch archives:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch research report history." },
      { status: 500 }
    );
  }
}
