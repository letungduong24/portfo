-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "hireMeAction" TEXT NOT NULL DEFAULT 'NAVIGATE',
ADD COLUMN     "navBlogsEn" TEXT,
ADD COLUMN     "navBlogsVi" TEXT,
ADD COLUMN     "navContactEn" TEXT,
ADD COLUMN     "navContactVi" TEXT,
ADD COLUMN     "navHireMeEn" TEXT,
ADD COLUMN     "navHireMeVi" TEXT,
ADD COLUMN     "navHomeEn" TEXT,
ADD COLUMN     "navHomeVi" TEXT,
ADD COLUMN     "navProjectsEn" TEXT,
ADD COLUMN     "navProjectsVi" TEXT,
ADD COLUMN     "showHireMe" BOOLEAN NOT NULL DEFAULT true;
