/*
  Warnings:

  - You are about to drop the column `durationEn` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `durationVi` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "durationEn",
DROP COLUMN "durationVi",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);
