-- CreateTable
CREATE TABLE "DailyQuestUserInfo" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "dailyShareCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyQuestUserInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyQuestUserInfo_userId_key" ON "DailyQuestUserInfo"("userId");

-- AddForeignKey
ALTER TABLE "DailyQuestUserInfo" ADD CONSTRAINT "DailyQuestUserInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
