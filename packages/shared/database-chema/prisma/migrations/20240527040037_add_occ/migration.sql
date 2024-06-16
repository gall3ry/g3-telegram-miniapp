/*
  Warnings:

  - You are about to drop the `SharingMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SharingMessage";

-- CreateTable
CREATE TABLE "Occ" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "occTemplateId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,

    CONSTRAINT "Occ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Share" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "occId" INTEGER NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Occ" ADD CONSTRAINT "Occ_occTemplateId_fkey" FOREIGN KEY ("occTemplateId") REFERENCES "OccTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Occ" ADD CONSTRAINT "Occ_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_occId_fkey" FOREIGN KEY ("occId") REFERENCES "Occ"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
