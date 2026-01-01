/*
  Warnings:

  - You are about to drop the column `desc1` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `desc2` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `headline` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `subheadline` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `TechStack` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `TechStack` table. All the data in the column will be lost.
  - Added the required column `nameEn` to the `TechStack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameVi` to the `TechStack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "desc1",
DROP COLUMN "desc2",
DROP COLUMN "education",
DROP COLUMN "fullName",
DROP COLUMN "headline",
DROP COLUMN "subheadline",
ADD COLUMN     "desc1En" TEXT,
ADD COLUMN     "desc1Vi" TEXT,
ADD COLUMN     "desc2En" TEXT,
ADD COLUMN     "desc2Vi" TEXT,
ADD COLUMN     "educationEn" TEXT,
ADD COLUMN     "educationVi" TEXT,
ADD COLUMN     "fullNameEn" TEXT,
ADD COLUMN     "fullNameVi" TEXT,
ADD COLUMN     "headlineEn" TEXT,
ADD COLUMN     "headlineVi" TEXT,
ADD COLUMN     "subheadlineEn" TEXT,
ADD COLUMN     "subheadlineVi" TEXT;

-- AlterTable
ALTER TABLE "TechStack" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "descriptionVi" TEXT,
ADD COLUMN     "nameEn" TEXT NOT NULL,
ADD COLUMN     "nameVi" TEXT NOT NULL;
