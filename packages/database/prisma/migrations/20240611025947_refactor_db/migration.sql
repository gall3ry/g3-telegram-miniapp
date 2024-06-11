/*
  Warnings:

  - Added the required column `stickerType` to the `Sticker` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StickerType" AS ENUM ('Sample1');

-- AlterTable
ALTER TABLE "Sticker" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "stickerType" "StickerType" NOT NULL;
