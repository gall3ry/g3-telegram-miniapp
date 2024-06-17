/*
  Warnings:

  - You are about to drop the column `userId` on the `Occ` table. All the data in the column will be lost.
  - Added the required column `providerId` to the `Occ` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Provider` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Occ" DROP CONSTRAINT "Occ_userId_fkey";

-- DropForeignKey
ALTER TABLE "Provider" DROP CONSTRAINT "Provider_userId_fkey";

-- DropIndex
DROP INDEX "Occ_userId_idx";

-- AlterTable
ALTER TABLE "Occ" DROP COLUMN "userId",
ADD COLUMN     "providerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Provider" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Occ" ADD CONSTRAINT "Occ_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
