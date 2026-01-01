/*
  Warnings:

  - You are about to drop the column `roleEn` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `roleVi` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "roleEn",
DROP COLUMN "roleVi";
