-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "headline" TEXT,
    "subheadline" TEXT,
    "desc1" TEXT,
    "desc2" TEXT,
    "fullName" TEXT,
    "birthDate" TIMESTAMP(3),
    "education" TEXT,
    "github" TEXT,
    "facebook" TEXT,
    "linkedin" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);
