-- AlterTable
ALTER TABLE "Share" ADD COLUMN     "reactionCount" INTEGER,
ADD COLUMN     "reactionMetadata" JSONB,
ADD COLUMN     "reactionUpdatedAt" TIMESTAMP(3);
