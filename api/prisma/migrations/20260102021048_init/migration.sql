-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'DEMO');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "headlineVi" TEXT,
    "headlineEn" TEXT,
    "subheadlineVi" TEXT,
    "subheadlineEn" TEXT,
    "desc1Vi" TEXT,
    "desc1En" TEXT,
    "desc2Vi" TEXT,
    "desc2En" TEXT,
    "fullNameVi" TEXT,
    "fullNameEn" TEXT,
    "birthDate" TIMESTAMP(3),
    "educationVi" TEXT,
    "educationEn" TEXT,
    "github" TEXT,
    "facebook" TEXT,
    "linkedin" TEXT,
    "email" TEXT,
    "footerTitleVi" TEXT,
    "footerTitleEn" TEXT,
    "copyrightNameVi" TEXT,
    "copyrightNameEn" TEXT,
    "footerUseProfileContact" BOOLEAN NOT NULL DEFAULT true,
    "footerEmail" TEXT,
    "footerGithub" TEXT,
    "footerFacebook" TEXT,
    "footerLinkedin" TEXT,
    "navbarNameVi" TEXT DEFAULT 'Dương',
    "navbarNameEn" TEXT DEFAULT 'Duong',
    "navHireMeVi" TEXT,
    "navHireMeEn" TEXT,
    "showHireMe" BOOLEAN NOT NULL DEFAULT true,
    "hireMeEmail" TEXT,
    "pageTitle" TEXT DEFAULT 'Portfolio',
    "pageDescription" TEXT DEFAULT 'My Portfolio',
    "pageIcon" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillGroup" (
    "id" SERIAL NOT NULL,
    "nameVi" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "profileId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "nameVi" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descriptionVi" TEXT,
    "descriptionEn" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "skillGroupId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "titleVi" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionVi" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "overviewVi" TEXT NOT NULL,
    "overviewEn" TEXT NOT NULL,
    "problemVi" TEXT[],
    "problemEn" TEXT[],
    "solutionVi" TEXT[],
    "solutionEn" TEXT[],
    "featuresVi" TEXT[],
    "featuresEn" TEXT[],
    "learnedVi" TEXT[],
    "learnedEn" TEXT[],
    "techStack" JSONB NOT NULL,
    "challenges" JSONB NOT NULL,
    "links" JSONB NOT NULL,
    "demoCredentials" JSONB,
    "architectureVi" TEXT,
    "architectureEn" TEXT,
    "thumbnailUrl" TEXT,
    "tags" TEXT[],
    "roleVi" TEXT NOT NULL,
    "roleEn" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" SERIAL NOT NULL,
    "titleVi" TEXT NOT NULL,
    "titleEn" TEXT,
    "slug" TEXT NOT NULL,
    "contentVi" TEXT NOT NULL,
    "contentEn" TEXT,
    "thumbnail" TEXT,
    "tags" TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HireMeMessage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HireMeMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- AddForeignKey
ALTER TABLE "SkillGroup" ADD CONSTRAINT "SkillGroup_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_skillGroupId_fkey" FOREIGN KEY ("skillGroupId") REFERENCES "SkillGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
