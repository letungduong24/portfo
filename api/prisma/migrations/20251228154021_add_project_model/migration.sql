-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "titleVi" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionVi" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "tags" TEXT[],
    "roleVi" TEXT NOT NULL,
    "roleEn" TEXT NOT NULL,
    "durationVi" TEXT NOT NULL,
    "durationEn" TEXT NOT NULL,
    "overviewVi" TEXT NOT NULL,
    "overviewEn" TEXT NOT NULL,
    "problemVi" TEXT[],
    "problemEn" TEXT[],
    "solutionVi" TEXT[],
    "solutionEn" TEXT[],
    "featuresVi" TEXT[],
    "featuresEn" TEXT[],
    "learnedVi" TEXT[],
    "learnedEn" TEXT[],
    "techStack" JSONB NOT NULL,
    "challenges" JSONB NOT NULL,
    "links" JSONB NOT NULL,
    "demoCredentials" JSONB,
    "architectureVi" TEXT,
    "architectureEn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
