/*
  Warnings:

  - You are about to drop the column `uuid` on the `Occ` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Occ_uuid_key";

-- AlterTable
ALTER TABLE "Occ" DROP COLUMN "uuid";
