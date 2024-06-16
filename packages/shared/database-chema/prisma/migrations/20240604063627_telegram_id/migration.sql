/*
  Warnings:

  - You are about to drop the column `rewardType` on the `RewardLogs` table. All the data in the column will be lost.
  - You are about to drop the `Reward` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reward" DROP CONSTRAINT "Reward_occTemplateId_fkey";

-- AlterTable
ALTER TABLE "RewardLogs" DROP COLUMN "rewardType",
ADD COLUMN     "taskId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "telegramId" TEXT;

-- DropTable
DROP TABLE "Reward";

-- DropEnum
DROP TYPE "RewardType";
