-- CreateTable
CREATE TABLE "LearningEnrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningCheckpointProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "checkpointId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "answer" TEXT NOT NULL DEFAULT '',
    "evidence" TEXT NOT NULL DEFAULT '',
    "serviceName" TEXT NOT NULL DEFAULT '',
    "endpointName" TEXT NOT NULL DEFAULT '',
    "criticalPathStep" TEXT NOT NULL DEFAULT '',
    "auditEvidence" TEXT NOT NULL DEFAULT '',
    "retrievalStep" INTEGER NOT NULL DEFAULT 0,
    "retrievalDueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningCheckpointProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningEnrollment_userId_courseId_key" ON "LearningEnrollment"("userId", "courseId");

-- CreateIndex
CREATE INDEX "LearningEnrollment_userId_idx" ON "LearningEnrollment"("userId");

-- CreateIndex
CREATE INDEX "LearningEnrollment_courseId_idx" ON "LearningEnrollment"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningCheckpointProgress_userId_courseId_moduleId_checkpointId_key" ON "LearningCheckpointProgress"("userId", "courseId", "moduleId", "checkpointId");

-- CreateIndex
CREATE INDEX "LearningCheckpointProgress_userId_idx" ON "LearningCheckpointProgress"("userId");

-- CreateIndex
CREATE INDEX "LearningCheckpointProgress_courseId_idx" ON "LearningCheckpointProgress"("courseId");

-- CreateIndex
CREATE INDEX "LearningCheckpointProgress_moduleId_idx" ON "LearningCheckpointProgress"("moduleId");

-- AddForeignKey
ALTER TABLE "LearningEnrollment" ADD CONSTRAINT "LearningEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningCheckpointProgress" ADD CONSTRAINT "LearningCheckpointProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
