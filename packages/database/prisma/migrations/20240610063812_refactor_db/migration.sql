/*
  Warnings:

  - You are about to drop the column `occTemplateId` on the `Occ` table. All the data in the column will be lost.
  - You are about to drop the column `occId` on the `Share` table. All the data in the column will be lost.
  - You are about to drop the `OccTemplate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `txHash` to the `Occ` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Occ" DROP CONSTRAINT "Occ_occTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "Share" DROP CONSTRAINT "Share_occId_fkey";

-- AlterTable
ALTER TABLE "Occ" DROP COLUMN "occTemplateId",
ADD COLUMN     "txHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Share" DROP COLUMN "occId",
ADD COLUMN     "stickerId" INTEGER;

-- DropTable
DROP TABLE "OccTemplate";

-- CreateTable
CREATE TABLE "GMSymbolOCC" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "occId" INTEGER NOT NULL,

    CONSTRAINT "GMSymbolOCC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sticker" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "gMSymbolOCCId" INTEGER,

    CONSTRAINT "Sticker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GMSymbolOCC_occId_key" ON "GMSymbolOCC"("occId");

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_stickerId_fkey" FOREIGN KEY ("stickerId") REFERENCES "Sticker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GMSymbolOCC" ADD CONSTRAINT "GMSymbolOCC_occId_fkey" FOREIGN KEY ("occId") REFERENCES "Occ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sticker" ADD CONSTRAINT "Sticker_gMSymbolOCCId_fkey" FOREIGN KEY ("gMSymbolOCCId") REFERENCES "GMSymbolOCC"("id") ON DELETE SET NULL ON UPDATE CASCADE;
