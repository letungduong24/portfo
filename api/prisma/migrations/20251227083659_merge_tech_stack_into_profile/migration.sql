-- AlterTable
ALTER TABLE "TechStack" ADD COLUMN     "profileId" INTEGER;

-- AddForeignKey
ALTER TABLE "TechStack" ADD CONSTRAINT "TechStack_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
