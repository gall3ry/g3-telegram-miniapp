-- CreateTable
CREATE TABLE "MapTonProofToPayload" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "payload" TEXT NOT NULL,

    CONSTRAINT "MapTonProofToPayload_pkey" PRIMARY KEY ("id")
);
