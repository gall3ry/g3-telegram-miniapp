/*
  Warnings:

  - Added the required column `exp` to the `DailyQuestLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyQuestLog" ADD COLUMN     "exp" INTEGER NOT NULL;
