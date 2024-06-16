-- DropForeignKey
ALTER TABLE "GMNFT" DROP CONSTRAINT "GMNFT_gMSymbolOCCId_fkey";

-- DropForeignKey
ALTER TABLE "Sticker" DROP CONSTRAINT "Sticker_gMSymbolOCCId_fkey";

-- DropForeignKey
ALTER TABLE "Sticker" DROP CONSTRAINT "Sticker_nftAddress_fkey";

-- AddForeignKey
ALTER TABLE "GMNFT" ADD CONSTRAINT "GMNFT_gMSymbolOCCId_fkey" FOREIGN KEY ("gMSymbolOCCId") REFERENCES "GMSymbolOCC"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sticker" ADD CONSTRAINT "Sticker_gMSymbolOCCId_fkey" FOREIGN KEY ("gMSymbolOCCId") REFERENCES "GMSymbolOCC"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sticker" ADD CONSTRAINT "Sticker_nftAddress_fkey" FOREIGN KEY ("nftAddress") REFERENCES "GMNFT"("nftAddress") ON DELETE CASCADE ON UPDATE CASCADE;
