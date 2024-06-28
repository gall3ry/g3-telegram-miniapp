-- CreateEnum
CREATE TYPE "DailyQuestType" AS ENUM ('DAILY_LOGIN', 'DAILY_SHARE_LEVEL_1', 'DAILY_SHARE_LEVEL_2', 'DAILY_SHARE_LEVEL_3', 'DAILY_SHARE_LEVEL_4', 'DAILY_SHARE_LEVEL_5');

-- CreateTable
CREATE TABLE "DailyQuestLog" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "DailyQuestType" NOT NULL,
    "point" INTEGER NOT NULL,
    "metadata" JSONB,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "DailyQuestLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailyQuestLog" ADD CONSTRAINT "DailyQuestLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
