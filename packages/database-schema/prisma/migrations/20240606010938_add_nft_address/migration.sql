-- AlterTable
ALTER TABLE "Occ" ADD COLUMN     "nftAddress" TEXT;

-- CreateIndex
CREATE INDEX "Occ_userId_idx" ON "Occ"("userId");

-- CreateIndex
CREATE INDEX "RewardLogs_userId_idx" ON "RewardLogs"("userId");
