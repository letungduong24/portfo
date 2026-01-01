-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "pageDescription" TEXT DEFAULT 'My Portfolio',
ADD COLUMN     "pageIcon" TEXT,
ADD COLUMN     "pageTitle" TEXT DEFAULT 'Portfolio';
