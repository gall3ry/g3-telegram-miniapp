-- AlterTable
ALTER TABLE "User" ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "BotMessage" (
    "id" SERIAL NOT NULL,
    "msg_type" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "hour" INTEGER,
    "message" TEXT,
    "payload" JSONB,

    CONSTRAINT "BotMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BotMessage_user_id_idx" ON "BotMessage"("user_id");
