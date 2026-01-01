/*
  Warnings:

  - You are about to drop the column `copyrightName` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "copyrightName",
ADD COLUMN     "copyrightNameEn" TEXT,
ADD COLUMN     "copyrightNameVi" TEXT;
