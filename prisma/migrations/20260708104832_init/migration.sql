-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ResearchReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "confidenceScore" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "fullReasoning" TEXT NOT NULL DEFAULT '{}',
    "memoMarkdown" TEXT NOT NULL,
    "agentTrace" TEXT NOT NULL DEFAULT '{}',
    "sources" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ResearchReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "ResearchReport_userId_idx" ON "ResearchReport"("userId");

-- CreateIndex
CREATE INDEX "ResearchReport_ticker_idx" ON "ResearchReport"("ticker");
