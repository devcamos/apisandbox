CREATE TABLE "LearningUnitAssessmentProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "bestCorrectAnswers" INTEGER NOT NULL DEFAULT 0,
    "totalQuestions" INTEGER NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "lastAttemptAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningUnitAssessmentProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LearningUnitAssessmentProgress_userId_courseId_unitId_key"
ON "LearningUnitAssessmentProgress"("userId", "courseId", "unitId");

CREATE INDEX "LearningUnitAssessmentProgress_userId_idx"
ON "LearningUnitAssessmentProgress"("userId");

CREATE INDEX "LearningUnitAssessmentProgress_courseId_idx"
ON "LearningUnitAssessmentProgress"("courseId");

ALTER TABLE "LearningUnitAssessmentProgress"
ADD CONSTRAINT "LearningUnitAssessmentProgress_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
