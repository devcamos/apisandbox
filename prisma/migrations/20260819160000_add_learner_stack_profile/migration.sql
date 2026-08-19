ALTER TABLE "UserProfile"
ADD COLUMN "engineeringRole" TEXT,
ADD COLUMN "experienceLevel" TEXT,
ADD COLUMN "primaryLanguage" TEXT,
ADD COLUMN "primaryFramework" TEXT,
ADD COLUMN "runtimeEnvironment" TEXT,
ADD COLUMN "cloudProvider" TEXT,
ADD COLUMN "learningGoal" TEXT,
ADD COLUMN "onboardingCompletedAt" TIMESTAMP(3);
