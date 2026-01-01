/*
  Warnings:

  - Added the required column `roleEn` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleVi` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "roleEn" TEXT NOT NULL DEFAULT 'Full-stack Developer',
ADD COLUMN     "roleVi" TEXT NOT NULL DEFAULT 'Lập trình viên Full-stack';
