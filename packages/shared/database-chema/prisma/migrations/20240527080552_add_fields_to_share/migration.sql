/*
  Warnings:

  - Added the required column `messageId` to the `Share` table without a default value. This is not possible if the table is not empty.
  - Added the required column `superGroupUsername` to the `Share` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Share" ADD COLUMN     "messageId" TEXT NOT NULL,
ADD COLUMN     "superGroupUsername" TEXT NOT NULL;
