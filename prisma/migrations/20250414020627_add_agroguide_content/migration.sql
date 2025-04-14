-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('ARTICLE', 'VIDEO');

-- CreateTable
CREATE TABLE "AgroguideContent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentType" NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "categoryId" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AgroguideContent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AgroguideContent" ADD CONSTRAINT "AgroguideContent_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgroguideContent" ADD CONSTRAINT "AgroguideContent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
