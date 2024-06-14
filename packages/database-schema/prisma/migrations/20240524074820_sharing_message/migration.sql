-- CreateTable
CREATE TABLE "SharingMessage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "chat_type" TEXT NOT NULL,

    CONSTRAINT "SharingMessage_pkey" PRIMARY KEY ("id")
);
