/*
  Warnings:

  - Made the column `nftAddress` on table `Occ` required. This step will fail if there are existing NULL values in that column.
  - Made the column `taskId` on table `RewardLogs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Occ" ALTER COLUMN "nftAddress" SET NOT NULL;

-- AlterTable
ALTER TABLE "RewardLogs" ALTER COLUMN "taskId" SET NOT NULL;
