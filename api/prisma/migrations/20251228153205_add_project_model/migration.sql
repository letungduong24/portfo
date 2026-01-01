-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "titleVi" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionVi" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "roleVi" TEXT,
    "roleEn" TEXT,
    "durationVi" TEXT,
    "durationEn" TEXT,
    "overviewVi" TEXT,
    "overviewEn" TEXT,
    "problemVi" TEXT[],
    "problemEn" TEXT[],
    "solutionVi" TEXT[],
    "solutionEn" TEXT[],
    "featuresVi" TEXT[],
    "featuresEn" TEXT[],
    "learnedVi" TEXT[],
    "learnedEn" TEXT[],
    "techStackVi" JSONB,
    "techStackEn" JSONB,
    "challengesVi" JSONB,
    "challengesEn" JSONB,
    "architectureVi" TEXT,
    "architectureEn" TEXT,
    "demoUrl" TEXT,
    "repoUrl" TEXT,
    "apiUrl" TEXT,
    "imageUrl" TEXT,
    "tags" TEXT[],
    "demoCredentials" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
