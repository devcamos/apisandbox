-- CreateTable
CREATE TABLE "UserPhaseProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phaseNumber" INTEGER NOT NULL,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "lastAttemptAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPhaseProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserPhaseProgress_userId_idx" ON "UserPhaseProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPhaseProgress_userId_phaseNumber_key" ON "UserPhaseProgress"("userId", "phaseNumber");

-- AddForeignKey
ALTER TABLE "UserPhaseProgress" ADD CONSTRAINT "UserPhaseProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
