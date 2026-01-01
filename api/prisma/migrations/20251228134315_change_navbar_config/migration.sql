/*
  Warnings:

  - You are about to drop the column `navBlogsEn` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `navBlogsVi` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `navContactEn` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `navContactVi` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `navHomeEn` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `navHomeVi` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `navProjectsEn` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `navProjectsVi` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "navBlogsEn",
DROP COLUMN "navBlogsVi",
DROP COLUMN "navContactEn",
DROP COLUMN "navContactVi",
DROP COLUMN "navHomeEn",
DROP COLUMN "navHomeVi",
DROP COLUMN "navProjectsEn",
DROP COLUMN "navProjectsVi",
ADD COLUMN     "navbarNameEn" TEXT DEFAULT 'Duong',
ADD COLUMN     "navbarNameVi" TEXT DEFAULT 'Dương';
