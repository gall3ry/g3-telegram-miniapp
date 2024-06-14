/*
  Warnings:

  - A unique constraint covering the columns `[stickerType,nftAddress]` on the table `Sticker` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nftAddress` to the `Sticker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sticker" ADD COLUMN     "nftAddress" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GMNFT" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gMSymbolOCCId" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "metadata" JSONB,
    "nftAddress" TEXT NOT NULL,

    CONSTRAINT "GMNFT_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GMNFT_nftAddress_key" ON "GMNFT"("nftAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Sticker_stickerType_nftAddress_key" ON "Sticker"("stickerType", "nftAddress");

-- AddForeignKey
ALTER TABLE "GMNFT" ADD CONSTRAINT "GMNFT_gMSymbolOCCId_fkey" FOREIGN KEY ("gMSymbolOCCId") REFERENCES "GMSymbolOCC"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sticker" ADD CONSTRAINT "Sticker_nftAddress_fkey" FOREIGN KEY ("nftAddress") REFERENCES "GMNFT"("nftAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
