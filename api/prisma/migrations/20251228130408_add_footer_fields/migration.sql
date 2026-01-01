-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "copyrightName" TEXT,
ADD COLUMN     "footerEmail" TEXT,
ADD COLUMN     "footerFacebook" TEXT,
ADD COLUMN     "footerGithub" TEXT,
ADD COLUMN     "footerLinkedin" TEXT,
ADD COLUMN     "footerTitleEn" TEXT,
ADD COLUMN     "footerTitleVi" TEXT,
ADD COLUMN     "footerTwitter" TEXT,
ADD COLUMN     "footerUseProfileContact" BOOLEAN NOT NULL DEFAULT true;
