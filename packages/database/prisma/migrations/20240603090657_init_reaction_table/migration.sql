/*
  Warnings:

  - You are about to drop the column `reactionMetadata` on the `Share` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Share" DROP CONSTRAINT "Share_occId_fkey";

-- AlterTable
ALTER TABLE "Share" DROP COLUMN "reactionMetadata";

-- CreateTable
CREATE TABLE "Reaction" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reactionType" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "shareId" INTEGER NOT NULL,
    "unifiedCode" TEXT NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_occId_fkey" FOREIGN KEY ("occId") REFERENCES "Occ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "Share"("id") ON DELETE CASCADE ON UPDATE CASCADE;
